// js/index-cards.js
import { createCompanyCard } from './companyCard.js';
import { listCompaniesForCards } from './data-local.js';

const $ = id => document.getElementById(id);

let cache = null;
let prevKey = '';

// Normaliza sin Unicode property escapes
function normalize(s){
  return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function debounce(fn, ms=140){
  let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); };
}
function getActiveTags(){
  const host = $('#active-tags'); if (!host) return [];
  return Array.from(host.querySelectorAll('.chip'))
    .map(ch => ch.textContent.replace(/\s*✕\s*$/,'').trim())
    .filter(Boolean);
}
function ensureCache(){ if(!cache) cache = listCompaniesForCards(); return cache; }

function filterAll(){
  const q = normalize(($('#search')||{}).value || '');
  const c = (($('#country')||{}).value) || '';
  const r = (($('#region') ||{}).value) || '';
  const tagSet = new Set(getActiveTags());

  return ensureCache().filter(it=>{
    const byText    = !q || normalize(it.name).includes(q);
    const byCountry = !c || it.country === c;
    const byRegion  = !r || it.region  === r;
    const byTags    = !tagSet.size || Array.from(tagSet).every(t => Array.isArray(it.tags) && it.tags.includes(t));
    return byText && byCountry && byRegion && byTags;
  });
}
function keyOf(list){
  return list.map(x => `${x.id}|${x.name}|${x.country}|${x.region}|${(x.tags||[]).join(',')}`).join('§');
}

function render(){
  const host = $('#results'); if (!host) return;
  const rows = filterAll();

  console.debug('[index-cards] cache total:', ensureCache().length, '→ filtrados:', rows.length);

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
}

const run = debounce(render, 120);

function wire(){
  console.debug('[index-cards] wire()');
  // filtros
  ['input','change'].forEach(ev=>{
    const s=$('#search');  if (s) s.addEventListener(ev, run);
    const c=$('#country'); if (c) c.addEventListener(ev, run);
    const r=$('#region');  if (r) r.addEventListener(ev, run);
  });
  // etiquetas
  const at=$('#active-tags'); if (at) at.addEventListener('click', ()=> run());
  const ac=$('#add-chip');    if (ac) ac.addEventListener('click', ()=> run());
  const dc=$('#drawer-clear');if (dc) dc.addEventListener('click', ()=> run());

  // cambios de localStorage (perfil guardado en otra pestaña)
  window.addEventListener('storage', (e)=>{
    if (e.key === 'oneiron_profiles'){ cache = null; run(); }
  });

  run(); // primer render
}

// 🔧 Inicializa incluso si DOMContentLoaded ya pasó
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wire);
} else {
  // DOM ya listo
  wire();
}
