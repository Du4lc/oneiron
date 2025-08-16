import { getSession } from './config.js';
import { apiLogin, apiLogout } from './api.js';
import { openSignupWizard } from './ui.js';
import { qs, openModal, closeModal } from './utils.js';

export function setupAuthUI(){
  const loginBtn = qs('#loginBtn');
  const signupBtn = qs('#signupBtn');
  const myAccountBtn = qs('#myAccountBtn');
  const loginModal = qs('#loginModal');

  function refreshButtons(){
    const sess = getSession();
    if (sess){
      loginBtn.classList.add('hidden');
      signupBtn.classList.add('hidden');
      myAccountBtn.classList.remove('hidden');
    } else {
      loginBtn.classList.remove('hidden');
      signupBtn.classList.remove('hidden');
      myAccountBtn.classList.add('hidden');
    }
  }
  refreshButtons();

  loginBtn.addEventListener('click', ()=> openModal(loginModal));
  qs('#loginSubmit').addEventListener('click', async ()=>{
    const email = qs('#loginEmail').value.trim();
    const password = qs('#loginPassword').value;
    if (!email || !password) return;
    try{
      await apiLogin({ email, password });
      closeModal(loginModal);
      window.dispatchEvent(new CustomEvent('auth-changed'));
    }catch(e){
      alert('Error: ' + e.message);
    }
  });

  signupBtn.addEventListener('click', ()=> openSignupWizard());
  window.addEventListener('auth-changed', refreshButtons);
}

export function renderAccount(){
  const app = qs('#app');
  app.innerHTML = `
    <section class="card">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold">Mi cuenta</h1>
        <button id="logoutBtn" class="btn btn-primary">Cerrar sesión</button>
      </div>
      <p class="mt-4 text-slate-600">Gestiona tu perfil y proyectos.</p>
      <div class="mt-4">
        <a href="#/" class="btn btn-ghost">Volver al inicio</a>
      </div>
    </section>
  `;
  qs('#logoutBtn').addEventListener('click', async ()=>{
    try{ await apiLogout(); }catch(_e){}
    window.dispatchEvent(new CustomEvent('auth-changed'));
    location.hash = '#/';
  });
}
