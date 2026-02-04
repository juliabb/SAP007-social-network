import '../firebase/initialize-firebase.js';
import { userCreate, googleLogin } from '../firebase/auth-firebase.js';
import { errors } from '../error/error.js';

export const register = () => {
  const registerContainer = document.createElement('main');
  registerContainer.classList.add('auth-container');

  registerContainer.innerHTML = `
    <section class="auth-card">
      <form id="form-register" class="auth-form">
        <h2 class="subtitle">Cadastrar</h2>

        <input
          class="input-names"
          type="text"
          placeholder="Digite seu nome"
          required
        />

        <input
          class="register-email input-names"
          type="email"
          id="register-email"
          placeholder="Digite seu e-mail"
          required
        />

        <input
          class="register-password input-names"
          type="password"
          id="register-password"
          minlength="6"
          placeholder="Crie uma senha"
          required
        />

        <button
          id="register-enter"
          class="button login-enter"
          type="submit"
        >
          Cadastrar
        </button>

        <span class="feedback"></span>

        <div class="divider">ou</div>

        <button class="button-google" type="button" id="button-google">
          <img
            class="google-img"
            src="img/icone-google.png"
            alt="Logo do Google"
          />
          Cadastrar com Google
        </button>

        <p class="text-register">
          Já tem conta?
          <a href="#login" class="links">Entrar</a>
        </p>
      </form>

      <a href="#home" class="back-home">← Voltar para a tela inicial</a>
    </section>
  `;

  const email = registerContainer.querySelector('.register-email');
  const password = registerContainer.querySelector('.register-password');
  const googleButton = registerContainer.querySelector('#button-google');
  const feedback = registerContainer.querySelector('.feedback');

  registerContainer.addEventListener('submit', (e) => {
    e.preventDefault();

    userCreate(email.value, password.value)
      .then(() => {
        window.location.hash = '#timeline';
      })
      .catch((error) => {
        feedback.classList.add('error');
        feedback.innerHTML = errors(error.code);
      });
  });

  googleButton.addEventListener('click', (e) => {
    e.preventDefault();

    googleLogin()
      .then(() => {
        window.location.hash = '#timeline';
      })
      .catch(() => {});
  });

  return registerContainer;
};
