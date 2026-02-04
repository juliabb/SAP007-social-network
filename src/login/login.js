// src\login\login.js
import '../firebase/initialize-firebase.js';
import { userLogin, googleLogin } from '../firebase/auth-firebase.js';
import { errors } from '../error/error.js';

export const login = () => {
  const loginContainer = document.createElement('main');
  loginContainer.classList.add('auth-container');

  loginContainer.innerHTML = `
    <section class="auth-card">
      <form id="form-login" class="auth-form">
        <h2 class="subtitle">Login</h2>

        <input
          class="login-email input-names"
          type="email"
          id="login-email"
          placeholder="Digite seu e-mail"
          required
        />

        <input
          class="login-password input-names"
          type="password"
          id="login-password"
          placeholder="Digite sua senha"
          minlength="6"
          required
        />

        <button
          id="login-enter"
          class="button login-enter"
          type="submit"
        >
          Entrar
        </button>

        <span class="feedback"></span>

        <p class="text-forgot">
          Esqueci a <a class="links" href="#reset">senha</a>
        </p>

        <div class="divider">ou</div>

        <button class="button-google" type="button" id="button-google">
          <img
            class="google-img"
            src="img/icone-google.png"
            alt="Logo do Google"
          />
          Entrar com o Google
        </button>

        <p class="text-register">
          Ainda não tem conta?
          <a href="#register" class="links">Cadastre-se</a>
        </p>
      </form>

      <a href="#home" class="back-home">← Voltar para a tela inicial</a>
    </section>
  `;

  const email = loginContainer.querySelector('.login-email');
  const password = loginContainer.querySelector('.login-password');
  const googleButton = loginContainer.querySelector('.button-google');
  const feedback = loginContainer.querySelector('.feedback');

  loginContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    if (email.value && password.value) {
      userLogin(email.value, password.value)
        .then(() => {
          window.location.hash = '#timeline';
        })
        .catch((error) => {
          feedback.classList.add('error');
          const messageError = errors(error.code);
          feedback.innerHTML = (messageError);
          const errorMessage = error.message;
          return errorMessage;
        });
    }
  });

  googleButton.addEventListener('click', (e) => {
    e.preventDefault();
    googleLogin()
      .then(() => {
        window.location.hash = '#timeline';
      })
      .catch((error) => {
        const errorMessage = error.message;
        return errorMessage;
      });
  });

  return loginContainer;
};
