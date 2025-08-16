import { initSupabase } from './config.js';
import { setupAuthUI, renderAccount } from './auth.js';
import { renderHome, renderProfile } from './ui.js';
import { qs } from './utils.js';

function route(){
  const h = location.hash.slice(1) || '/';
  const [p, ...rest] = h.split('/').filter(Boolean);
  return { path: '/' + (p || ''), parts: rest };
}

async function render(){
  const r = route();
  if (r.path === '/')        return renderHome();
  if (r.path === '/u')       return renderProfile(r.parts[0]);
  if (r.path === '/account') return renderAccount();
  qs('#app').innerHTML = '<div class="card">Página no encontrada.</div>';
}

window.addEventListener('hashchange', render);
window.addEventListener('auth-changed', render);

(async function boot(){
  await initSupabase();
  setupAuthUI();
  render();
})();
