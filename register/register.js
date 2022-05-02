import '../firebase/firebase.js';
import { userCreate, googleLogin } from '../firebase/auth-firebase.js';

export const register = () => {
  const registerContainer = document.createElement('div');
  const templateRegister = `
  <section class="header-home">
      <h2 class="subtitle">Cadastrar</h2>
      <form>
        <input
          class="input-names"
          type="text"
          placeholder="Digite seu nome Ex:Laura "
          autocomplet
          required
        />
        <input
          class="register-email input-names"
          type="text"
          id="register-email"
          type="email"
          placeholder="Digite seu e-mail"
          autocomplet
          required
        />
        <input
          class="register-password input-names"
          type="password"
          id="register-password"
          minlength="6"
          type="password"
          placeholder="Crie uma senha"
          required
        />

        <div class="home-container login-container">
          <button
            id="register-enter"
            class="button register-enter login-enter"
            type="submit"
          >
            Cadastrar
          </button>
        </div>
        <span class="feedback"></span>
        <div class="social-media register-enter">
          <p>Ou cadastre-se com o Google</p>
          <button class="button-google" type="button" id="button-google">
            <img
              class="google-img"
              src="img/icone-google.png"
              alt="Imagen logo de Google"
            />
          </button>
        </div>
      </form>
      <div class="social-media"></div>
      <div class="back-container">
        <a href="#home" class="back-home">Voltar a tela inicial</a>
      </div>
    </section>
    `;

  registerContainer.innerHTML = templateRegister;

  const email = registerContainer.querySelector('.register-email');
  const password = registerContainer.querySelector('.register-password');
  const googleButton = registerContainer.querySelector('.button-google');
  const feedback = registerContainer.querySelector('.feedback');

  registerContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    userCreate(email.value, password.value)
      .then(() => {
        window.location.hash = '#timeline';
      })
      .catch((error) => {
        const errorCode = error.code;
        feedback.classList.add('error');
        switch (errorCode) {
          case 'auth/invalid-email':
            feedback.innerHTML = 'Email inválido';
            break;
          case 'auth/email-already-exists':
            feedback.innerHTML = 'Este email já esta em uso';
            break;
          default:
            feedback.innerHTML = 'Não foi possível realizar seu cadastro';
        }
        const errorMessage = error.message;
        return errorMessage;
      });
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
  return registerContainer;
};
