// supabase-bridge.js
// Puente minimalista que "simula" localStorage pero persiste en Supabase.
// Objetivo: no tocar tu código existente. Se sobreescribe window.localStorage,
// se mantiene un caché en memoria y se sincroniza con Supabase en background.

// ======= CONFIGURA AQUÍ TUS CREDENCIALES DE SUPABASE =======
const SUPABASE_URL = 'https://xhoibhwzxenggyefkhdk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhob2liaHd6eGVuZ2d5ZWZraGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODI4MjEsImV4cCI6MjA3MTg1ODgyMX0.Ljmzb3zsH9uXSQza28QqRwzGTrM0bz7SVzFB-xio-g4';

// Tabla muy simple tipo KV:
//   create table if not exists kv (
//     key text primary key,
//     value text,
//     updated_at timestamptz default now()
//   );
// -- Para pruebas sencillas (inseguro, abre todo):
//   alter table kv enable row level security;
//   create policy "public read"   on kv for select using (true);
//   create policy "public insert" on kv for insert with check (true);
//   create policy "public update" on kv for update using (true);
//   create policy "public delete" on kv for delete using (true);

// ======= FIN CONFIG =======

(function () {
  if (!window.supabase) {
    console.error('[supabase-bridge] Falta @supabase/supabase-js. Añade el <script> del CDN antes de este archivo.');
    return;
  }

  // Guarda referencia al localStorage nativo por si existe (navegador)
  const nativeLS = window.localStorage;
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Caché en memoria para responder de forma síncrona
  const cache = new Map();

  // Rellenamos el caché con lo que ya haya en el localStorage nativo
  try {
    if (nativeLS) {
      for (let i = 0; i < nativeLS.length; i++) {
        const k = nativeLS.key(i);
        cache.set(k, nativeLS.getItem(k));
      }
    }
  } catch (e) {
    console.warn('[supabase-bridge] No se pudo leer localStorage nativo', e);
  }

  // Sincronización inicial desde Supabase para las claves que nos interesan.
  // Como tu app usa principalmente "oneiron_profiles", empezamos por esa.
  const PRIORITY_KEYS = ['oneiron_profiles'];

  (async function initialSync() {
    try {
      // Leemos todas las filas de 'profiles' y montamos el objeto oneiron_profiles
      const { data, error } = await client
        .from('profiles')
        .select('user, data');

      if (error) throw error;

      const store = {};
      (data || []).forEach(row => {
        store[row.user] = (row.data && typeof row.data === 'object') ? row.data : {};
      });

      const str = JSON.stringify(store);

      // Remoto prevalece en el arranque
      cache.set('oneiron_profiles', str);
      try { nativeLS && nativeLS.setItem('oneiron_profiles', str); } catch {}
    } catch (e) {
      console.warn('[supabase-bridge] Error en sincronización inicial (profiles):', e.message || e);
    }
  })();

  async function upsertKey(key, value) {
    // Solo sincronizamos la clave usada por tu app
    if (String(key) !== 'oneiron_profiles') return;

    let obj = {};
    try { obj = JSON.parse(value || '{}'); } catch {}

    const rows = Object.entries(obj).map(([user, data]) => ({
      user: String(user),
      data: (data && typeof data === 'object') ? data : {}
    }));

    if (rows.length === 0) return;

    try {
      const { error } = await client
        .from('profiles')
        .upsert(rows, { onConflict: 'user' });
      if (error) throw error;
    } catch (e) {
      console.warn('[supabase-bridge] No se pudo upsert en profiles:', e.message || e);
    }
  }

  async function deleteKey(key) { return; }
  async function clearAllRemote() { return; }

  // Implementación compatible con la API estándar de localStorage
  const storageShim = {
    get length() {
      return cache.size;
    },
    key(n) {
      const keys = Array.from(cache.keys());
      return keys[n] ?? null;
    },
    getItem(key) {
      const v = cache.get(String(key));
      return v === undefined ? null : v;
    },
    setItem(key, value) {
      const k = String(key);
      const v = String(value);
      cache.set(k, v);
      try { nativeLS && nativeLS.setItem(k, v); } catch {}
      // Sincroniza con Supabase sin bloquear la UI
      void upsertKey(k, v);
    },
    removeItem(key) {
      const k = String(key);
      cache.delete(k);
      try { nativeLS && nativeLS.removeItem(k); } catch {}
      void deleteKey(k);
    },
    clear() {
      cache.clear();
      try { nativeLS && nativeLS.clear(); } catch {}
      void clearAllRemote();
    }
  };

  // Sobrescribimos window.localStorage con el shim
  try {
    Object.defineProperty(window, 'localStorage', {
      value: storageShim,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (e) {
    // Si el defineProperty falla (algún navegador raro), hacemos asignación directa
    try { window.localStorage = storageShim; } catch {}
  }

  // Exponemos utilidades por si te sirven para debug
  window.__supabaseBridge = {
    client,
    cache,
    upsertKey,
    deleteKey
  };
})();
