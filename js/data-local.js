// data-local.js
const LS_KEY = 'oneiron_profiles';

export function readAllCompanies() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}

export function listCompaniesForCards() {
  const store = readAllCompanies();
  return Object.entries(store).map(([user, p]) => ({
    id: user,
    name: p?.name || user,
    logo: p?.logo || './assets/oneiron.png',
    country: p?.country || '',
    region: p?.region || '',
    tags: Array.isArray(p?.tags) ? p.tags : []
  }));
}
