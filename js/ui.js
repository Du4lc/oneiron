import { apiFetchTags, apiSearchProfiles, apiGetProfile, apiGetProjects, apiAddProject, apiCreateAccount, apiUpsertProfile } from './api.js';
import { COUNTRIES, ES_PROVINCES } from './config.js';
import { qs, qsa, html, openModal, closeModal } from './utils.js';

/* ====== HOME ====== */
export async function renderHome(){
  const app = qs('#app');
  app.innerHTML = html`
    <section class="card mb-6 watermark">
      <h1 class="text-2xl font-semibold mb-2">Explora <span style="color:var(--oneiron-accent)">empresas</span></h1>
      <p class="text-slate-600 mb-4">Búsqueda por <b>prefijo</b>, sectores y sede (país → provincia).</p>

      <div class="grid md:grid-cols-4 gap-3">
        <div class="md:col-span-2"><input id="q" class="input" placeholder="Empieza a escribir el nombre… (prefijo)" /></div>
        <div><select id="country" class="select"></select></div>
        <div><select id="region" class="select" disabled></select></div>
      </div>

      <div class="mt-4">
        <div class="mb-2 text-sm text-slate-600">Sectores</div>
        <div id="sectors" class="flex flex-wrap"></div>
      </div>
    </section>

    <section id="results" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4"></section>
  `;

  const tags = await apiFetchTags();

  // Países y provincias
  const countrySel = qs('#country'), regionSel = qs('#region');
  countrySel.innerHTML = `<option value="">País (todos)</option>` + COUNTRIES.map(c=>`<option>${c}</option>`).join('');
  regionSel.innerHTML = `<option value="">Provincia / región (todas)</option>`;
  regionSel.disabled = true;

  countrySel.addEventListener('change', ()=>{
    const val = countrySel.value;
    if (!val){
      regionSel.innerHTML = `<option value="">Provincia / región (todas)</option>`;
      regionSel.disabled = true;
    } else {
      const provinces = (val==='España') ? ES_PROVINCES : [];
      regionSel.innerHTML = `<option value="">Provincia / región (todas)</option>` + provinces.map(r=>`<option>${r}</option>`).join('');
      regionSel.disabled = false;
    }
    runSearch();
  });
  regionSel.addEventListener('change', runSearch);

  // Sectores
  qs('#sectors').innerHTML = tags.map(t=> `
    <label class="tag cursor-pointer">
      <input type="checkbox" value="${t.slug}" class="mr-2"/>
      <span>${t.name}</span>
    </label>
  `).join('');
  qs('#sectors').addEventListener('change', e=>{
    if (e.target?.type==='checkbox'){
      e.target.closest('label').classList.toggle('tag-checked', e.target.checked);
      runSearch();
    }
  });

  async function runSearch(){
    const q = qs('#q').value.trim();
    const country = countrySel.value;
    const region = regionSel.disabled ? '' : regionSel.value;
    const sectors = qsa('#sectors input:checked').map(ch=>ch.value);
    const results = await apiSearchProfiles({ q, sectors, country, region });
    renderResults(results);
  }

  function renderResults(items){
    const container=qs('#results');
    if(!items.length){ container.innerHTML='<div class="text-slate-600">Sin resultados</div>'; return; }
    container.innerHTML = items.map(p=> `
      <a href="#/u/${p.username}" class="card hover:shadow-md transition">
        <div class="h-24 rounded-xl banner mb-3" style="${p.banner_url?`background:url('${p.banner_url}') center/cover`:""}"></div>
        <h3 class="font-semibold">${p.name}</h3>
        <p class="text-sm text-slate-600 line-clamp-2">${p.description||''}</p>
        <div class="mt-2 text-xs text-slate-600">
          ${p.country ? `País: ${p.country}` : ''}${p.region ? ` · Provincia: ${p.region}` : ''}
        </div>
        <div class="mt-2 flex flex-wrap">
          ${(p.sectors||[]).map(s=>`<span class='tag text-xs'>${s}</span>`).join('')}
        </div>
      </a>
    `).join('');
  }

  qs('#q').addEventListener('input', runSearch);
  runSearch();
}

/* ====== PERFIL ====== */
export async function renderProfile(username){
  const app = qs('#app');
  const p = await apiGetProfile(username);
  if (!p){ app.innerHTML = `<div class='card'>No existe la empresa <b>${username}</b>.</div>`; return; }
  const projects = await apiGetProjects(p.id);

  app.innerHTML = html`
    <section class="card mb-6 p-0 overflow-hidden">
      <div class="h-40 banner" style="${p.banner_url?`background:url('${p.banner_url}') center/cover`:""}"></div>
      <div class="p-4 md:p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl font-semibold" style="color:var(--oneiron-accent)">${p.name}</h1>
            <p class="text-slate-600">
              ${p.country ? `País: ${p.country}` : ''}${p.region ? ` · Provincia: ${p.region}` : ''}
            </p>
            <div class="mt-2 flex flex-wrap">${(p.sectors||[]).map(s=>`<span class='tag text-xs'>${s}</span>`).join('')}</div>
          </div>
          <a href="#/account" class="btn btn-ghost">Editar</a>
        </div>
        <p class="mt-4">${p.description||''}</p>
      </div>
    </section>

    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-3">Proyectos</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${projects.length ? projects.map(pr=> `
          <button class="card text-left hover:shadow-md transition project-item" data-id="${pr.id}">
            <div class="h-32 rounded-xl mb-3" style="${(pr.photos&&pr.photos[0])?`background:url('${pr.photos[0]}') center/cover`:"background:#eef"}"></div>
            <h3 class="font-semibold">${pr.title}</h3>
            <p class="text-sm text-slate-600">${pr.place||''}${pr.year?` · ${pr.year}`:''}</p>
          </button>
        `).join('') : '<div class="text-slate-600">Sin proyectos todavía.</div>'}
      </div>
    </section>
  `;

  qsa('.project-item', app).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      const pr = projects.find(x=>String(x.id)===String(id));
      openProjectModal(pr);
    });
  });
}

function openProjectModal(pr){
  const el = qs('#projectModal');
  if (!pr) return;
  el.innerHTML = html`
    <form method="dialog" class="card">
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-xl font-semibold">${pr.title}</h3>
        <button class="btn btn-ghost">Cerrar</button>
      </div>
      <div class="text-sm text-slate-600 mb-2">${pr.place||''}${pr.year?` · ${pr.year}`:''}</div>
      <div class="grid sm:grid-cols-2 gap-3 mb-4">
        ${(pr.photos||[]).map(src=>`<img src="${src}" alt="" class="w-full h-48 object-cover rounded-xl border" />`).join('')}
      </div>
      <p>${pr.description||''}</p>
    </form>
  `;
  openModal(el);
}

/* ====== Alta / Wizard (con input de archivo para banner) ====== */
export async function openSignupWizard(){
  const dlg = qs('#signupModal');
  const tags = await apiFetchTags();

  dlg.innerHTML = html`
    <form method="dialog" class="card">
      <h2 class="text-xl font-semibold mb-4">Crear cuenta / empresa</h2>

      <div class="space-y-5">
        <!-- 1. Email + contraseña -->
        <section class="grid md:grid-cols-2 gap-3">
          <div><label class="block text-sm mb-1">Email</label>
            <input id="su_email" type="email" class="input" required />
          </div>
          <div><label class="block text-sm mb-1">Contraseña</label>
            <input id="su_password" type="password" class="input" required />
          </div>
        </section>

        <!-- 2. Nombre -->
        <section>
          <label class="block text-sm mb-1">Nombre de la empresa</label>
          <input id="su_name" class="input" placeholder="Oneiron S.A." required />
        </section>

        <!-- 3. Sectores (multi) -->
        <section>
          <div class="mb-2 text-sm">Sectores</div>
          <div id="su_sectors" class="flex flex-wrap">
            ${tags.map(t=> `
              <label class="tag cursor-pointer">
                <input type="checkbox" value="${t.slug}" class="mr-2" /> ${t.name}
              </label>
            `).join('')}
          </div>
        </section>

        <!-- 4. País -> Provincia -->
        <section class="grid md:grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1">País</label>
            <select id="su_country" class="select">
              ${COUNTRIES.map(c=>`<option>${c}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">Provincia</label>
            <select id="su_region" class="select">
              ${ES_PROVINCES.map(r=>`<option>${r}</option>`).join('')}
            </select>
          </div>
        </section>

        <!-- 5-7. Opcionales -->
        <details class="rounded-xl border p-3 bg-gray-50">
          <summary class="cursor-pointer select-none font-medium">Opcionales (puedes hacerlo más tarde)</summary>
          <div class="mt-3 space-y-3">
            <div>
              <label class="block text-sm mb-1">Breve descripción</label>
              <textarea id="su_desc" class="input h-28" placeholder="Qué hacéis, especialidades..."></textarea>
            </div>
            <div>
              <label class="block text-sm mb-1">Imagen de banner</label>
              <div class="grid md:grid-cols-2 gap-2">
                <input id="su_banner_url" class="input" placeholder="URL (opcional si subes archivo)" />
                <input id="su_banner_file" type="file" accept="image/*" class="input" />
              </div>
              <div class="mt-2 text-xs text-slate-600">Puedes pegar una URL pública o seleccionar un archivo de tu ordenador.</div>
              <img id="su_banner_preview" class="mt-3 hidden w-full h-40 object-cover rounded-xl border" alt="Vista previa banner" />
            </div>
          </div>
        </details>
      </div>

      <div class="mt-6 flex justify-between gap-2">
        <button class="btn btn-ghost">Cancelar</button>
        <button id="su_finish" class="btn btn-primary" type="button">Crear y terminar</button>
      </div>
    </form>
  `;
  openModal(dlg);

  // Vista previa del banner (si se elige archivo)
  const fileInput = qs('#su_banner_file', dlg);
  const preview = qs('#su_banner_preview', dlg);
  fileInput.addEventListener('change', ()=>{
    const f = fileInput.files?.[0];
    if (f){ preview.src = URL.createObjectURL(f); preview.classList.remove('hidden'); }
    else { preview.src = ''; preview.classList.add('hidden'); }
  });

  qs('#su_finish', dlg).addEventListener('click', async ()=>{
    const email = qs('#su_email', dlg).value.trim();
    const password = qs('#su_password', dlg).value;
    const name = qs('#su_name', dlg).value.trim();
    const sectors = qsa('#su_sectors input:checked', dlg).map(ch=>ch.value);
    const country = qs('#su_country', dlg).value;
    const region = qs('#su_region', dlg).value;
    const description = qs('#su_desc', dlg).value.trim();
    const banner_url = qs('#su_banner_url', dlg).value.trim();
    const bannerFile = fileInput.files?.[0] || null;

    if (!email || !password || !name || !country || !region){
      alert('Completa email, contraseña, nombre, país y provincia.');
      return;
    }
    try{
      await apiCreateAccount({ email, password, name, sectors, country, region, description, banner_url, bannerFile });
      closeModal(dlg);
      location.hash = '#/';
      alert('Cuenta creada. Ya puedes iniciar sesión.');
    }catch(e){
      alert('No se pudo crear la cuenta: ' + e.message);
    }
  });
}
