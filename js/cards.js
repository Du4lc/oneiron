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
      card.innerHTML = `
        <!-- Columna izquierda: nombre arriba, logo debajo -->
        <div class="name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
        <div class="logoBox">
          <img src="${escapeHtml(logo)}" alt="logo ${escapeHtml(name)}" loading="lazy">
        </div>

        <!-- Columna derecha: ubicación y etiquetas -->
        <div class="right">
          <div class="place" title="${escapeHtml(country + (country && region ? ' · ' : '') + region)}">
            ${escapeHtml(country)}${country && region ? ' · ' : ''}${escapeHtml(region)}
          </div>
          <div class="tags">
            ${safeTags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
          </div>
        </div>
      `;

      // Al clicar, ir al perfil en la MISMA pestaña
      card.addEventListener('click', () => {
        window.location.href = `./perfil-empresa.html?user=${encodeURIComponent(userKey)}`;
      });

      container.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', renderCards);
  // Por si quieres refrescar manualmente desde consola
  window.renderOneironCards = renderCards;
})();
// ONEIRON: END cards.js
