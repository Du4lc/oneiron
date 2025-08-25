// profile-preview.js
import { createCompanyCard } from './companyCard.js';

const $ = id => document.getElementById(id);
const previewHost = $('#company-preview');

function getTagsFromChips(){
  return Array.from($('#active-tags')?.querySelectorAll('.chip') || [])
    .map(ch => ch.textContent.replace(/\s*✕\s*$/,'').trim())
    .filter(Boolean);
}

function gather(){
  return {
    name: ($('#company-name')?.value || '').trim(),
    logo: $('#logo')?.src || './assets/oneiron.png', // el logo que ya usas en el banner
    country: $('#country')?.value || '',
    region: $('#region')?.value || '',
    tags: getTagsFromChips()
  };
}

export function renderProfilePreview(){
  if (!previewHost) return;
  previewHost.innerHTML = '';
  previewHost.appendChild(createCompanyCard(gather()));
}

function wire(){
  const run = () => renderProfilePreview();

  ['input','change'].forEach(ev=>{
    $('#company-name')?.addEventListener(ev, run);
    $('#country')?.addEventListener(ev, run);
    $('#region')?.addEventListener(ev, run);
  });
  // etiquetas
  $('#active-tags')?.addEventListener('click', ()=> setTimeout(run, 0));
  $('#add-chip')?.addEventListener('click', ()=> setTimeout(run, 0));
  $('#drawer-clear')?.addEventListener('click', ()=> setTimeout(run, 0));

  // logo
  $('#logo-input')?.addEventListener('change', ()=> setTimeout(run, 50));
  $('#reset-media')?.addEventListener('click', ()=> setTimeout(run, 50));

  // arranque
  window.addEventListener('load', run);
}

document.addEventListener('DOMContentLoaded', wire);
