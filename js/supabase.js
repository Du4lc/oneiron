// supabase.js  — archivo JS puro (sin <script>)
// Proxy Supabase ⇄ localStorage para la clave 'oneiron_profiles'

(function () {
  const KEY = 'oneiron_profiles';
  let cache = Object.create(null);
  let patched = false;

  // Importa supabase-js v2 (ESM) desde jsDelivr
  async function loadSupabase() {
    // URL ESM estable
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/index.js');
    // export nombrado
    if (!mod.createClient) throw new Error('No se pudo cargar createClient de supabase-js');
    return mod.createClient;
  }

  async function fetchAll(client) {
    const { data, error } = await client
      .from('profiles_kv')
      .select('email, data')
      .order('updated_at', { ascending: false })
      .limit(100000);
    if (error) throw error;
    const obj = Object.create(null);
    for (const row of data || []) obj[row.email] = row.data || {};
    cache = obj;
  }

  async function syncFull(client, obj) {
    // upsert de todas las entradas presentes
    const rows = Object.entries(obj).map(([email, data]) => ({
      email, data, updated_at: new Date().toISOString(),
    }));
    if (rows.length) {
      const { error } = await client.from('profiles_kv').upsert(rows, { onConflict: 'email' });
      if (error) throw error;
    }
    // borrar las que ya no están
    const missing = Object.keys(cache).filter((email) => !(email in obj));
    if (missing.length) {
      const { error } = await client.from('profiles_kv').delete().in('email', missing);
      if (error) throw error;
    }
    cache = obj;
  }

  function patchLocalStorage(client) {
    if (patched) return;
    patched = true;

    const orig = {
      getItem: localStorage.getItem.bind(localStorage),
      setItem: localStorage.setItem.bind(localStorage),
      removeItem: localStorage.removeItem.bind(localStorage),
    };

    // GET
    localStorage.getItem = (k) => {
      if (k !== KEY) return orig.getItem(k);
      try { return JSON.stringify(cache); } catch { return orig.getItem(k); }
    };

    // SET (objeto completo serializado)
    localStorage.setItem = (k, v) => {
      if (k !== KEY) return orig.setItem(k, v);
      let obj; try { obj = JSON.parse(v || '{}') || {}; } catch { obj = {}; }
      cache = obj;
      try { orig.setItem(KEY, JSON.stringify(obj)); } catch {}
      (async () => {
        try { await syncFull(client, obj); } catch (e) { console.error('[supabase sync set]', e); }
      })();
    };

    // REMOVE (vacía la tabla)
    localStorage.removeItem = (k) => {
      if (k !== KEY) return orig.removeItem(k);
      cache = Object.create(null);
      try { orig.removeItem(KEY); } catch {}
      (async () => {
        try { await client.from('profiles_kv').delete().neq('email', '__never__'); }
        catch (e) { console.error('[supabase clear]', e); }
      })();
    };
  }

  // API pública
  window.initSupabaseStorage = async function initSupabaseStorage({ url, anonKey }) {
    if (!url || !anonKey) throw new Error('initSupabaseStorage requiere { url, anonKey }');
    const createClient = await loadSupabase();
    const client = createClient(url, anonKey, { auth: { persistSession: false } });

    await fetchAll(client);       // 1) precarga
    patchLocalStorage(client);    // 2) parchea solo la clave objetivo
    try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch {}
  };
})();
