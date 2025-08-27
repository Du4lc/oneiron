/* ==========================================================
   Supabase Bridge — mínimo para espejar localStorage <-> Supabase
   ========================================================== */

// 1) Configura tus credenciales
const SUPABASE_URL  = 'https://xhoibhwzxenggyefkhdk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2liaHd6eGVuZ2d5ZWZraGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODI4MjEsImV4cCI6MjA3MTg1ODgyMX0.Ljmzb3zsH9uXSQza28QqRwzGTrM0bz7SVzFB-xio-g4';

// 2) Crea el cliente (requiere que cargues el script CDN en cada página; ver paso 2)
const sb = (typeof supabase !== 'undefined')
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

// 3) Clave que ya usa tu app en localStorage
const LS_KEY = 'oneiron_profiles';

// 4) Bootstrap: descarga perfiles y guarda el mapa completo en localStorage
async function bootstrapProfiles() {
  if (!sb) return;
  try {
    const { data, error } = await sb.from('profiles').select('email, data');
    if (error) throw error;
    const map = Object.fromEntries((data || []).map(r => [r.email, r.data]));
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch (e) {
    console.warn('[bridge] No se pudo sincronizar con Supabase. Continuo con localStorage.', e);
  }
}

// 5) Espejo de escritura: sube/actualiza un perfil (no bloquea UI)
function mirrorUpsert(email, profile) {
  if (!sb) return;
  sb.from('profiles').upsert({ email, data: profile })
    .then(({ error }) => { if (error) console.warn('[bridge] Upsert falló', error); });
}

// 6) Helpers opcionales (por si te resultan útiles en varias páginas)
function readStore() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}

function writeStore(storeObj) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(storeObj)); }
  catch {}
}

window.__oneironBridge__ = {
  sb, LS_KEY,
  bootstrapProfiles,
  mirrorUpsert,
  readStore,
  writeStore
};
