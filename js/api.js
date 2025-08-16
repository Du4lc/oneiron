// API helpers para categorías y tags
import { getSupabaseClient } from './config.js';

export async function apiListCategories(){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('categories')
      .select('*')
      .order('sort_order', {ascending:true})
      .order('name', {ascending:true});
    if (error) throw error;
    return data || [];
  }
  // Fallback vacío si no hay cliente
  return [];
}

export async function apiListTagsByCategory(){
  const sb = getSupabaseClient();
  if (sb){
    const { data, error } = await sb.from('tags')
      .select('*')
      .order('name', {ascending:true});
    if (error) throw error;
    const grouped = {};
    for (const t of (data||[])){
      const k = t.category_slug || 'otros';
      if (!grouped[k]) grouped[k] = [];
      grouped[k].push(t);
    }
    return grouped;
  }
  return {};
}
