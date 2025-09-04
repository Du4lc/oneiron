from __future__ import annotations
import os, json, time
from datetime import datetime, timezone
from typing import Dict, Any

from flask import Flask, request, jsonify, session, abort
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import bleach

from supabase import create_client, Client

# ---- Config ----
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SESSION_SECRET = os.getenv("SESSION_SECRET", os.urandom(32).hex())
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY")

app = Flask(__name__, static_folder="static", static_url_path="")
app.secret_key = SESSION_SECRET
if os.getenv("CORS_ALLOW_ALL", "false").lower() == "true":
    CORS(app, resources={r"/api/*": {"origins": "*"}})  # solo dev

limiter = Limiter(get_remote_address, app=app, default_limits=["200 per hour"])
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# ---- Helpers ----
ALLOWED_TAGS = ["b","i","strong","em","u","ul","ol","li","a","p","br","span","h1","h2","h3","h4","h5","h6","blockquote","code","pre"]
ALLOWED_ATTRS = {"a": ["href","title","target","rel"], "span": ["style"]}
ALLOWED_PROTOCOLS = ["http","https","mailto"]

def sanitize_html(html: str) -> str:
    return bleach.clean(html or "", tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, protocols=ALLOWED_PROTOCOLS, strip=True)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def require_json(keys: list[str]) -> dict:
    if not request.is_json:
        abort(400, "Expected application/json")
    data = request.get_json(force=True, silent=True) or {}
    for k in keys:
        if k not in data:
            abort(400, f"Missing field: {k}")
    return data

def current_user_email() -> str | None:
    return session.get("email")

# ---- Static root ----
@app.get("/")
def root():
    return app.send_static_file("templates/index.html")

# ---- Health ----
@app.get("/api/health")
def health():
    return jsonify(ok=True, ts=int(time.time()))

# ---- Auth (sencilla en servidor) ----
@app.post("/api/auth/signup")
@limiter.limit("10/hour")
def signup():
    data = require_json(["email","password"])
    email = (data["email"] or "").strip().lower()
    password = data["password"] or ""
    if not email or not password:
        abort(400, "Invalid email/password")
    try:
        if supabase.table("users").select("email").eq("email", email).limit(1).execute().data:
            abort(409, "Email already registered")
        supabase.table("users").insert({
            "email": email,
            "password_hash": generate_password_hash(password),
            "created_at": now_iso()
        }).execute()
    except Exception as e:
        abort(500, f"DB error: {e}")
    session["email"] = email
    return jsonify(ok=True, email=email)

@app.post("/api/auth/login")
@limiter.limit("20/hour")
def login():
    data = require_json(["email","password"])
    email = (data["email"] or "").strip().lower()
    password = data["password"] or ""
    try:
        res = supabase.table("users").select("email,password_hash").eq("email", email).limit(1).execute()
        row = res.data[0] if res.data else None
        if not row or not check_password_hash(row["password_hash"], password):
            abort(401, "Invalid credentials")
    except Exception as e:
        abort(500, f"DB error: {e}")
    session["email"] = email
    return jsonify(ok=True, email=email)

@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify(ok=True)

@app.get("/api/me")
def me():
    return jsonify(email=current_user_email())

@app.get("/api/check-email")
def check_email():
    email = request.args.get("email","").strip().lower()
    if not email:
        return jsonify(exists=False)
    try:
        res = supabase.table("users").select("email").eq("email", email).limit(1).execute()
        return jsonify(exists=bool(res.data))
    except Exception:
        return jsonify(exists=False)

# ---- Profiles API ----
def shape_profiles(rows: list[dict]) -> Dict[str, Any]:
    return {r["email"]: (r.get("data") or {}) for r in (rows or [])}

@app.get("/api/profiles")
def list_profiles():
    try:
        res = supabase.table("profiles_kv").select("email,data,updated_at").order("updated_at", desc=True).limit(100000).execute()
        return jsonify(profiles=shape_profiles(res.data))
    except Exception as e:
        abort(500, f"DB error: {e}")

@app.get("/api/profiles/<email>")
def get_profile(email: str):
    try:
        res = supabase.table("profiles_kv").select("email,data,updated_at").eq("email", email).limit(1).execute()
        row = res.data[0] if res.data else None
        if not row:
            abort(404, "Not found")
        return jsonify(email=row["email"], data=row.get("data") or {}, updated_at=row.get("updated_at"))
    except Exception as e:
        abort(500, f"DB error: {e}")

@app.put("/api/profiles/<email>")
@limiter.limit("60/hour")
def put_profile(email: str):
    user = current_user_email()
    if not user:
        abort(401, "Login required")
    if user != email.lower():
        abort(403, "You can only modify your own profile")

    payload = require_json(["data"])["data"]

    # Sanitiza campos HTML
    def clean_profile(d: dict) -> dict:
        d = dict(d or {})
        if "descHtml" in d:
            d["descHtml"] = sanitize_html(d.get("descHtml",""))
        for key in ("proyectos","productos"):
            arr = d.get(key) or []
            out = []
            for item in arr:
                item = dict(item or {})
                if "descripcion" in item:
                    item["descripcion"] = sanitize_html(item.get("descripcion",""))
                if "descripcionHtml" in item:
                    item["descripcionHtml"] = sanitize_html(item.get("descripcionHtml",""))
                out.append(item)
            d[key] = out
        return d

    clean = clean_profile(payload)
    try:
        supabase.table("profiles_kv").upsert({"email": email.lower(), "data": clean, "updated_at": now_iso()}).execute()
    except Exception as e:
        abort(500, f"DB error: {e}")
    return jsonify(ok=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
