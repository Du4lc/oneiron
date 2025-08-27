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
      for (const key of PRIORITY_KEYS) {
        const { data, error } = await client
          .from('kv')
          .select('value')
          .eq('key', key)
          .maybeSingle();

        if (error) throw error;

        if (data && typeof data.value === 'string') {
          // Remoto prevalece: actualizamos caché y localStorage nativo
          cache.set(key, data.value);
          try { nativeLS && nativeLS.setItem(key, data.value); } catch {}
        } else {
          // No existe en remoto: si hay valor local, lo subimos
          const localVal = cache.get(key);
          if (typeof localVal === 'string') {
            await upsertKey(key, localVal);
          }
        }
      }
    } catch (e) {
      console.warn('[supabase-bridge] Error en sincronización inicial:', e.message || e);
    }
  })();

  // Upsert sencillo en Supabase
  async function upsertKey(key, value) {
    try {
      const { error } = await client
        .from('kv')
        .upsert({ key, value })
        .select(); // fuerza upsert
      if (error) throw error;
    } catch (e) {
      console.warn(`[supabase-bridge] No se pudo guardar "${key}" en Supabase:`, e.message || e);
    }
  }

  // Borrar clave en Supabase
  async function deleteKey(key) {
    try {
      const { error } = await client
        .from('kv')
        .delete()
        .eq('key', key);
      if (error) throw error;
    } catch (e) {
      console.warn(`[supabase-bridge] No se pudo borrar "${key}" en Supabase:`, e.message || e);
    }
  }

  // Borrar todo en Supabase (para esta demo; tu app realmente usa 1 clave)
  async function clearAllRemote() {
    try {
      const { error } = await client.from('kv').delete().neq('key', ''); // borra todo
      if (error) throw error;
    } catch (e) {
      console.warn('[supabase-bridge] No se pudo limpiar Supabase:', e.message || e);
    }
  }

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
