// supabase.js — REEMPLAZO: puente localStorage ⇄ API Flask
(function () {
  const KEY = 'oneiron_profiles';
  let cache = Object.create(null);
  let patched = false;

  async function fetchAll() {
    const res = await fetch('/api/profiles', { credentials: 'include' });
    if (!res.ok) throw new Error('GET /api/profiles failed');
    const payload = await res.json();
    cache = payload.profiles || {};
  }

  async function putOne(email, data) {
    const res = await fetch('/api/profiles/' + encodeURIComponent(email), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ data })
    });
    if (!res.ok) console.error('PUT profile failed', await res.text());
  }

  function same(a,b){ try{ return JSON.stringify(a)===JSON.stringify(b);}catch{ return false; } }

  function patchLocalStorage() {
    if (patched) return; patched = true;
    const orig = {
      getItem: localStorage.getItem.bind(localStorage),
      setItem: localStorage.setItem.bind(localStorage),
      removeItem: localStorage.removeItem.bind(localStorage),
    };
    localStorage.getItem = (k) => k===KEY ? JSON.stringify(cache) : orig.getItem(k);
    localStorage.setItem = (k, v) => {
      if (k !== KEY) return orig.setItem(k, v);
      let obj; try { obj = JSON.parse(v || '{}') || {}; } catch { obj = {}; }
      const changed = [];
      for (const [email, data] of Object.entries(obj)) if (!same(data, cache[email])) changed.push([email, data]);
      cache = obj;
      // online-estricto: no persistimos nada en localStorage
      (async () => { for (const [email, data] of changed) { try { await putOne(email, data); } catch(e){ console.error(e);} } })();
    };
    localStorage.removeItem = (k) => {
      if (k !== KEY) return orig.removeItem(k);
      cache = Object.create(null);
      try { orig.removeItem(KEY); } catch {}
      console.warn('removeItem(oneiron_profiles) ignorado en modo online.');
    };
  }

  window.initSupabaseStorage = async function initSupabaseStorage() {
    await fetchAll();
    patchLocalStorage();
    // online-estricto: no persistimos cache en localStorage
  };
})();
