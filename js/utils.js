export const qs = (s,e=document)=>e.querySelector(s);
export const qsa = (s,e=document)=>[...e.querySelectorAll(s)];
export const html = (s,...v)=>s.reduce((a,b,i)=>a+b+(v[i]??''),'');
export const openModal = d=>{ if(!d.open) d.showModal(); };
export const closeModal = d=>{ if(d.open) d.close(); };
export const slugify = s => (s||'').toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

/* Demo-only helpers */
export const genId = () => Math.floor(Math.random()*1e12);
