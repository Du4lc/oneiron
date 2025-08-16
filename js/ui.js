// UI: Select de Categoría + Multiselect de Tags
import { apiListCategories, apiListTagsByCategory } from './api.js';

export async function initSectorFilters(){
  const catSelect = document.querySelector('[data-filter="category"]');
  const tagContainer = document.querySelector('[data-filter="tags"]');
  if (!catSelect || !tagContainer) return;

  try {
    const [cats, tagsByCat] = await Promise.all([apiListCategories(), apiListTagsByCategory()]);
    catSelect.innerHTML = '<option value="">Todas las categorías</option>'
      + cats.map(c=>`<option value="${c.slug}">${c.name}</option>`).join('');

    const renderTags = (catSlug) => {
      const list = catSlug ? (tagsByCat[catSlug] || []) : Object.values(tagsByCat).flat();
      tagContainer.innerHTML = list.map(t=>`
        <label class="chip">
          <input type="checkbox" name="tags" value="${t.slug}">
          <span>${t.name}</span>
        </label>
      `).join('');
    };

    catSelect.addEventListener('change', e => renderTags(e.target.value || ''));
    renderTags('');
  } catch (err){
    console.error('Error cargando categorías/tags', err);
    catSelect.innerHTML = '<option value="">(sin datos)</option>';
    tagContainer.textContent = 'No hay etiquetas disponibles.';
  }
}
