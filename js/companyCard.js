// js/companyCard.js
const DEFAULT_LOGO = './assets/oneiron.png';

export function createCompanyCard(data = {}) {
  const {
    name = 'Empresa sin nombre',
    logo = DEFAULT_LOGO,
    country = '',
    region = '',
    tags = []
  } = data;

  const card = document.createElement('article');
  card.className = 'company-card';

  const location = [country, region].filter(Boolean).join(' • ');

  card.innerHTML = `
    <div class="cc-left">
      <div class="cc-name" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
      <div class="cc-logo-wrap" aria-label="Logo">
        <img class="cc-logo" src="${escapeAttr(logo || DEFAULT_LOGO)}"
             alt="Logo de ${escapeAttr(name)}"
             onerror="this.src='${DEFAULT_LOGO}'"/>
      </div>
    </div>
    <div class="cc-right">
      <div class="cc-loc">${escapeHtml(location)}</div>
      <div class="cc-tags">
        ${
          (tags && tags.length)
            ? tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')
            : `<span class="tag muted">sin etiquetas</span>`
        }
      </div>
    </div>
  `;
  return card;
}

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[m]));
}
function escapeAttr(s = '') { return s.replace(/"/g, '&quot;'); }
