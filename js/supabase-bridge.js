/* ==========================================================
   Supabase Bridge — mínimo funcional
   ========================================================== */

// 1) Credenciales
const SUPABASE_URL  = 'https://xhoibhwzxenggyefkhdk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2liaHd6eGVuZ2d5ZWZraGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODI4MjEsImV4cCI6MjA3MTg1ODgyMX0.Ljmzb3zsH9uXSQza28QqRwzGTrM0bz7SVzFB-xio-g4';

// 2) Cliente
const sb = (typeof supabase !== 'undefined')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

// 3) Clave local
const LS_KEY = 'oneiron_profiles';

// ---- helpers localStorage ----
function readStore() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}
function writeStore(storeObj) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(storeObj)); }
  catch {}
}

// ---- Bootstrap desde Supabase -> localStorage ----
// Si pasas un email, trae solo ese; si no, trae todos.
async function bootstrapProfiles(email = null) {
  if (!sb) return;

  let q = sb.from('profiles').select('email,data,updated_at').order('updated_at', { ascending: false });
  if (email) q = q.eq('email', email);

  const { data, error } = await q;

  if (error) {
    console.error('[bootstrapProfiles] select error:', error);
    // Importante: NO borrar el local si falla (p.ej., por RLS)
    return;
  }

  const local = readStore();
  for (const row of (data || [])) {
    local[row.email] = row.data;
  }
  writeStore(local);
}

// ---- Upsert local -> Supabase ----
// Guarda primero en local (UX optimista) y luego upsertea.
// value = email (PK), payload = objeto de perfil.
async function mirrorUpsert(value, payload) {
  // 1) Local primero
  const local = readStore();
  local[value] = payload;
  writeStore(local);

  // 2) Supabase
  if (!sb) return { ok: true, localOnly: true };

  const row = { email: value, data: payload };
  const { data, error } = await sb
    .from('profiles')
    .upsert(row, { onConflict: 'email' })  // <- clave para tu PK email
    .select()
    .single();

  if (error) {
    console.error('[mirrorUpsert] upsert error (¿RLS sin política?):', error);
    return { ok: false, error };
  }
  return { ok: true, data };
}

window.__oneironBridge__ = {
  sb, LS_KEY,
  readStore, writeStore,
  bootstrapProfiles,
  mirrorUpsert
};
