export const CONFIG = {
  SUPABASE_URL: "",          // p.ej. https://xxxx.supabase.co
  SUPABASE_ANON_KEY: "",     // API Key anon
};

let supabaseClient = null;
let session = null;

export async function initSupabase(){
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY || !window.supabase) return null;
  supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
  const { data: { session: s } } = await supabaseClient.auth.getSession();
  session = s;
  supabaseClient.auth.onAuthStateChange((_evt, sess)=>{
    session = sess;
    window.dispatchEvent(new CustomEvent('auth-changed'));
  });
  return supabaseClient;
}
export function getSupabaseClient(){ return supabaseClient; }
export function getSession(){ return session; }

/* Países / Provincias (solo España por ahora) */
export const COUNTRIES = ["España"];
export const ES_PROVINCES = [
  "Álava","Albacete","Alicante","Almería","Asturias","Ávila","Badajoz","Barcelona","Burgos",
  "Cáceres","Cádiz","Cantabria","Castellón","Ciudad Real","Córdoba","A Coruña","Cuenca","Girona",
  "Granada","Guadalajara","Guipúzcoa","Huelva","Huesca","Islas Baleares","Jaén","León","Lleida",
  "Lugo","Madrid","Málaga","Murcia","Navarra","Ourense","Palencia","Las Palmas","Pontevedra",
  "La Rioja","Salamanca","Santa Cruz de Tenerife","Segovia","Sevilla","Soria","Tarragona","Teruel",
  "Toledo","Valencia","Valladolid","Vizcaya","Zamora","Zaragoza","Ceuta","Melilla"
];
