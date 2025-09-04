// ONEIRON: START cards.js
(function () {
  const LS_KEY = 'oneiron_profiles';
  const DEFAULT_LOGO = './assets/oneiron.png'; // fallback si no hay logo

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getStore() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
    catch { return {}; }
  }

  function renderCards() {
    const container = document.getElementById('results');
    if (!container) return;
    container.innerHTML = '';

    const store = getStore();

    // Recorremos perfiles conservando la clave (user id) para enlazar a la vista
    Object.entries(store).forEach(([userKey, profile]) => {
      const name    = (profile?.name || '').trim() || 'Empresa sin nombre';
      const logo    = profile?.logo || DEFAULT_LOGO;
      const country = (profile?.country || '').trim();
      const region  = (profile?.region || '').trim();
      const tagsArr = Array.isArray(profile?.tags) ? profile.tags : [];
      const safeTags = tagsArr.filter(t => typeof t === 'string' && t.trim() !== '');

      const card = document.createElement('article');
      card.className = 'card';
      card.style.cursor = 'pointer';

      // === CLAVE PARA FILTROS: dataset y atributos ===
      card.dataset.name = name;
      card.dataset.country = country;
      card.dataset.region = region;
      // para compatibilidad con el extractor: también como atributo crudo
      card.setAttribute('data-tags', JSON.stringify(safeTags));

      // Partes de la UI con data-field y data-tag (fallbacks del extractor)
      const countryHTML = country ? `<span data-field="country">${escapeHtml(country)}</span>` : '';
      const sepHTML = (country && region) ? ' · ' : '';
      const regionHTML = region ? `<span data-field="region">${escapeHtml(region)}</span>` : '';

      card.innerHTML = `
        <!-- Columna izquierda: nombre arriba, logo debajo -->
        <div class="name" data-field="name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
        <div class="logoBox">
          <img src="${escapeHtml(logo)}" alt="logo ${escapeHtml(name)}" loading="lazy">
        </div>

        <!-- Columna derecha: ubicación y etiquetas -->
        <div class="right">
          <div class="place" title="${escapeHtml((country||'') + (country && region ? ' · ' : '') + (region||''))}">
            ${countryHTML}${sepHTML}${regionHTML}
          </div>
          <div class="tags">
            ${safeTags.map(t => `<span class="tag" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;

      // Al clicar, ir al perfil en la MISMA pestaña
      card.addEventListener('click', () => {
        window.location.href = `/templates/perfil-empresa.html?user=${encodeURIComponent(userKey)}`;
      });

      container.appendChild(card);
    });
  }

  // Inicializa aunque el DOM ya esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCards, { once: true });
  } else {
    renderCards();
  }

  // Por si quieres refrescar manualmente desde consola o desde otros scripts
  window.renderOneironCards = renderCards;

})();
// ONEIRON: END cards.js
