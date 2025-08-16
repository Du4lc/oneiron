import { getSupabaseClient } from './config.js';
import { DEMO } from './demo.js';
import { slugify, genId } from './utils.js';

/* === Etiquetas / sectores === */
export async function apiFetchTags(){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('tags').select('*').order('name');
    if (error) throw error; return data;
  }
  return DEMO.tags;
}

/* === Búsqueda ===
   - Prefijo de nombre (q%)
   - Sectores (AND)
   - Filtros de sede: primero país, luego provincia
   - Provincia también puede venir marcada como tag libre
*/
export async function apiSearchProfiles({ q='', sectors=[], country='', region='' }){
  const sb = getSupabaseClient();
  let list = [];
  if (sb){
    let query = sb.from('profiles').select('*');
    if (q) query = query.ilike('name', q + '%');
    if (country) query = query.eq('country', country);
    if (region && country) query = query.eq('region', region);
    if (sectors?.length) query = query.contains('sectors', sectors);
    const { data, error } = await query.order('name');
    if (error) throw error; list = data;
  } else {
    list = DEMO.profiles;
  }
  return list.filter(p=>{
    const okQ = q ? (p.name||'').toLowerCase().startsWith(q.toLowerCase()) : true;
    const okCountry = country ? p.country===country : true;
    const okRegion  = (region && country) ? (p.region===region || (p.tags||[]).includes(region)) : true;
    const okSectors = sectors.length ? sectors.every(s => (p.sectors||[]).includes(s)) : true;
    return okQ && okCountry && okRegion && okSectors;
  });
}

/* === Perfiles y Proyectos === */
export async function apiGetProfile(username){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('profiles').select('*').eq('username', username).single();
    if (error) throw error; return data;
  }
  return DEMO.profiles.find(p=>p.username===username)||null;
}

export async function apiGetProjects(profile_id){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('projects').select('*').eq('profile_id', profile_id).order('year',{ascending:false});
    if (error) throw error; return data;
  }
  return DEMO.projects.filter(pr=>pr.profile_id===profile_id);
}

export async function apiAddProject(project){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('projects').insert(project).select().single();
    if (error) throw error; return data;
  }
  project.id = genId();
  DEMO.projects.push(project);
  return project;
}

/* === Subida de banner === */
async function uploadBannerToStorage(file, user_id){
  const sb = getSupabaseClient();
  if (!sb || !file || !user_id) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${user_id}/banner.${ext}`;
  const { error } = await sb.storage.from('banners').upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = sb.storage.from('banners').getPublicUrl(path);
  return data?.publicUrl || null;
}

/* === Alta de cuenta (email + password + perfil) ===
   Reglas: no duplicar email ni nombre
   banner: acepta bannerFile (File del input) o banner_url (string)
*/
export async function apiCreateAccount({ email, password, name, sectors=[], country, region, description='', bannerFile=null, banner_url='' }){
  const sb = getSupabaseClient();
  if (sb){
    // Duplicados
    const { data: byEmail } = await sb.from('profiles').select('id').eq('email', email).maybeSingle();
    if (byEmail) throw new Error('Ya existe una cuenta con ese email.');
    const { data: byName } = await sb.from('profiles').select('id').ilike('name', name);
    if (byName && byName.length) throw new Error('Ya existe una empresa con ese nombre.');

    // Auth
    const { data: authData, error: eAuth } = await sb.auth.signUp({ email, password });
    if (eAuth) throw eAuth;
    const user_id = authData.user?.id;
    const username = slugify(name);

    // Banner
    let bannerPublicUrl = banner_url?.trim() || '';
    if (bannerFile) bannerPublicUrl = await uploadBannerToStorage(bannerFile, user_id) || bannerPublicUrl;

    // Perfil
    const { data: profile, error: e3 } = await sb.from('profiles').insert({
      user_id, email, username, name, sectors, country, region, description, banner_url: bannerPublicUrl, tags:[]
    }).select().single();
    if (e3) throw e3;
    return profile;
  }

  // Demo
  if (DEMO.users.find(u=>u.email.toLowerCase()===email.toLowerCase())) throw new Error('Ya existe una cuenta con ese email.');
  if (DEMO.profiles.find(p=>p.name.toLowerCase()===name.toLowerCase())) throw new Error('Ya existe una empresa con ese nombre.');

  const user = { id: crypto?.randomUUID?.() || String(genId()), email, password };
  DEMO.users.push(user);

  let bannerPublicUrl = banner_url?.trim() || '';
  if (bannerFile) {
    // Demo: URL temporal (se pierde al recargar)
    bannerPublicUrl = URL.createObjectURL(bannerFile);
  }

  const profile = {
    id: genId(),
    user_id: user.id,
    email,
    username: slugify(name),
    name,
    sectors,
    country, region,
    description,
    banner_url: bannerPublicUrl,
    tags:[]
  };
  DEMO.profiles.push(profile);
  return profile;
}

/* === Actualizar perfil === */
export async function apiUpsertProfile(profile){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('profiles').upsert(profile).select().single();
    if (error) throw error; return data;
  }
  const i = DEMO.profiles.findIndex(p=>p.id===profile.id);
  if (i>=0) DEMO.profiles[i]=profile; else DEMO.profiles.push(profile);
  return profile;
}

/* === Auth === */
export async function apiLogin({ email, password }){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }
  const user = DEMO.users.find(u=>u.email.toLowerCase()===email.toLowerCase());
  if (!user || user.password !== password) throw new Error('Credenciales incorrectas.');
  return { user };
}
export async function apiLogout(){
  const sb = getSupabaseClient();
  if (sb){ await sb.auth.signOut(); return true; }
  return true;
}
