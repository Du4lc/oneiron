// index-cards.js
import { createCompanyCard } from './companyCard.js';
import { listCompaniesForCards } from './data-local.js';

const $ = id => document.getElementById(id);

let cache = null;            // perfiles simplificados
let prevKey = '';            // para evitar repintados iguales

function normalize(s){ return (s||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase(); }
function debounce(fn, ms=140){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; }

function getActiveTags(){
  return Array.from($('#active-tags')?.querySelectorAll('.chip') || [])
    .map(ch => ch.textContent.replace(/\s*✕\s*$/,'').trim())
    .filter(Boolean);
}

function ensureCache(){ if(!cache) cache = listCompaniesForCards(); return cache; }

function filterAll(){
  const q = normalize($('#search')?.value || '');
  const c = $('#country')?.value || '';
  const r = $('#region')?.value || '';
  const tagSet = new Set(getActiveTags());

  return ensureCache().filter(it=>{
    const byText = !q || normalize(it.name).includes(q);
    const byCountry = !c || it.country === c;
    const byRegion  = !r || it.region === r;
    const byTags = !tagSet.size || [...tagSet].every(t => (it.tags||[]).includes(t));
    return byText && byCountry && byRegion && byTags;
  });
}

function keyOf(list){
  return list.map(x => `${x.id}|${x.name}|${x.country}|${x.region}|${(x.tags||[]).join(',')}`).join('§');
}

function render(){
  const host = $('#results');
  if (!host) return;

  const rows = filterAll();
  const k = keyOf(rows);
  if (k === prevKey) return; // nada cambió
  prevKey = k;

  host.innerHTML = '';
  if (!rows.length){
    host.innerHTML = '<div style="padding:16px;color:var(--muted)">Sin resultados.</div>';
    return;
  }

  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:14px;display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px;';
  const frag = document.createDocumentFragment();
  rows.forEach(d => frag.appendChild(createCompanyCard(d)));
  wrap.appendChild(frag);
  host.appendChild(wrap);
}

const run = debounce(render, 120);

function wire(){
  // eventos de filtros
  ['input','change'].forEach(ev=>{
    $('#search')?.addEventListener(ev, run);
    $('#country')?.addEventListener(ev, run);
    $('#region')?.addEventListener(ev, run);
  });
  // etiquetas
  $('#active-tags')?.addEventListener('click', ()=> run());
  $('#add-chip')?.addEventListener('click', ()=> run());
  $('#drawer-clear')?.addEventListener('click', ()=> run());

  // refresco si cambia localStorage (otra pestaña)
  window.addEventListener('storage', (e)=>{
    if (e.key === 'oneiron_profiles'){ cache = null; run(); }
  });

  // primer render (muestra todo por defecto)
  run();
}

document.addEventListener('DOMContentLoaded', wire);
