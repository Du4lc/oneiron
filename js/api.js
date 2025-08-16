// === Categorías & Tags (agrupados) ===
import { getSupabaseClient } from './config.js';

export async function apiListCategories(){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('categories').select('*').order('sort_order', {ascending:true}).order('name', {ascending:true});
    if (error) throw error;
    return data;
  }
  // DEMO fallback
  return (DEMO.categories || []).slice().sort((a,b)=> (a.sort_order-b.sort_order) || a.name.localeCompare(b.name));
}

export async function apiListTagsByCategory(){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('tags').select('*').order('name', {ascending:true});
    if (error) throw error;
    const grouped = {};
    for (const t of data){
      if (!grouped[t.category_slug || 'otros']) grouped[t.category_slug || 'otros'] = [];
      grouped[t.category_slug || 'otros'].push(t);
    }
    return grouped;
  }
  // DEMO fallback
  const grouped = {};
  for (const t of (DEMO.tags||[])){
    const k = t.category_slug || 'otros';
    grouped[k] = grouped[k] || [];
    grouped[k].push(t);
  }
  return grouped;
}
