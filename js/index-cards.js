// js/index-cards.js (v7)
import { createCompanyCard } from './companyCard.js';
import { listCompaniesForCards } from './data-local.js';

const $ = id => document.getElementById(id);

let cache = null;
let prevKey = '';

function normalize(s){
  return (s || '').toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function debounce(fn, ms = 140){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function getActiveTags(){
  const host = $('#active-tags');
  if (!host) return [];
  return Array.from(host.querySelectorAll('.chip'))
    .map(ch => ch.textContent.replace(/\s*✕\s*$/,'').trim())
    .filter(Boolean);
}

function ensureCache(){
  if (!cache) cache = listCompaniesForCards();
  return cache;
}

function filterAll(){
  const q = normalize(($('#search') || {}).value || '');
  const c = (($('#country') || {}).value) || '';
  const r = (($('#region')  || {}).value) || '';
  const tagSet = new Set(getActiveTags());

  return ensureCache().filter(it => {
    const byText    = !q || normalize(it.name).includes(q);
    const byCountry = !c || it.country === c;
    const byRegion  = !r || it.region  === r;
    const byTags    = !tagSet.size || Array.from(tagSet).every(t => (it.tags || []).includes(t));
    return byText && byCountry && byRegion && byTags;
  });
}

function keyOf(list){
  return list.map(x => `${x.id}|${x.name}|${x.country}|${x.region}|${(x.tags||[]).join(',')}`).join('§');
}

function render(){
  try{
    const host = $('#results');
    if (!host){
      console.log('[index-cards] render(): #results NO existe aún');
      return;
    }
    const rows = filterAll();

    console.log('[index-cards] render() | cache total:', ensureCache().length, '→ filtrados:', rows.length);

    const k = keyOf(rows);
    if (k === prevKey) return;
    prevKey = k;

    host.innerHTML = '';
    if (!rows.length){
      host.innerHTML = '<div style="padding:16px;color:#6b7280">Sin resultados.</div>';
      return;
    }

    const wrap = document.createElement('div');
    wrap.style.cssText = 'padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;';
    const frag = document.createDocumentFragment();
    rows.forEach(d => frag.appendChild(createCompanyCard(d)));
    wrap.appendChild(frag);
    host.appendChild(wrap);
  }catch(err){
    console.error('[index-cards] render ERROR:', err);
  }
}

const run = debounce(render, 120);

// Espera a que #results exista y entonces pinta (con MutationObserver + fallbacks)
function renderWhenReady(){
  if ($('#results')){
    console.log('[index-cards] renderWhenReady(): encontrado #results, pinto');
    render();
    return;
  }
  console.log('[index-cards] renderWhenReady(): esperando #results con MutationObserver');
  const obs = new MutationObserver(() => {
    if ($('#results')){
      obs.disconnect();
      console.log('[index-cards] MutationObserver: #results listo → render()');
      render();
    }
  });
  obs.observe(document.body || document.documentElement, { childList: true, subtree: true });

  // Fallbacks de seguridad
  setTimeout(() => { if (!$('#results')) console.log('[index-cards] timeout 0.2s: aún no #results'); render(); }, 200);
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete'){
      console.log('[index-cards] readystatechange: complete → render()');
      render();
    }
  }, { once:true });
}

function wire(){
  console.log('[index-cards] wire() | readyState=', document.readyState);
  try{
    ['input','change'].forEach(ev=>{
      const s=$('#search');  if (s) s.addEventListener(ev, run);
      const c=$('#country'); if (c) c.addEventListener(ev, run);
      const r=$('#region');  if (r) r.addEventListener(ev, run);
    });
    const at=$('#active-tags'); if (at) at.addEventListener('click', ()=> run());
    const ac=$('#add-chip');    if (ac) ac.addEventListener('click', ()=> run());
    const dc=$('#drawer-clear');if (dc) dc.addEventListener('click', ()=> run());

    window.addEventListener('storage', (e)=>{ if (e.key === 'oneiron_profiles'){ cache = null; run(); }});

    // Arranque robusto
    renderWhenReady();          // espera #results y pinta
    setTimeout(render, 0);      // por si ya está todo OK
  }catch(err){
    console.error('[index-cards] wire ERROR:', err);
  }
}

// Arranca siempre, aunque DOMContentLoaded ya haya pasado
console.log('[index-cards] loaded | readyState=', document.readyState);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wire);
} else {
  wire();
}

// Helpers expuestos para depuración desde consola
window.__oneironCards = { render, filterAll, ensureCache };
