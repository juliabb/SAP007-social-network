import '../firebase/firebase.js';
import { userLogin, googleLogin } from '../firebase/auth-firebase.js';

export const login = () => {
  const loginContainer = document.createElement('div');
  const templateLogin = `
  <section class="header-home">
  <form>
    <h2 class="subtitle">Login</h2>
    <input
      class="login-email input-names"
      type="email"
      id="login-email"
      placeholder="Digite seu e-mail"
      autocomplet
      required
    />
    <input
      class="login-password input-names"
      type="password"
      id="login-password"
      placeholder="Digite uma senha"
      minlength="6"
      required
    />
    <div class="home-container login-container">
      <button
        id="login-enter"
        class="button login-enter"
        type="submit"
        role="link"
      >
        Entrar
      </button>
    </div>
    <span class="feedback"></span>
    <div class="text-content">
      <p class="text-forgot">
        Esqueci a <a class="links" href="#reset">Senha</a>
      </p>
      <div class="social-media google-container">
        <p>Ou entrar com o Google</p>
        <button class="button-google" type="button" id="button-google">
          <img
            class="google-img"
            src="img/icone-google.png"
            alt="Logo de Google"
          />
        </button>
      </div>
    </div>
  </form>
  <div class="social-media">
    <p class="text-register">
      Ainda não tem conta?
      <a href="#register" class="links">Cadastre-se</a>
    </p>
  </div>
  <div class="back-container">
    <a href="#home" class="back-home">Voltar a tela inicial</a>
  </div>
</section>
  `;

  loginContainer.innerHTML = templateLogin;

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
          if (error.code === 'auth/wrong-password') {
            feedback.classList.add('error');
            feedback.innerHTML = 'Senha incorreta';
          } else if (error.code === 'auth/invalid-email') {
            feedback.classList.add('error');
            feedback.innerHTML = 'E-mail inválido';
          } else if (error.code === 'auth/user-not-found') {
            feedback.classList.add('error');
            feedback.innerHTML = 'Usuário não encontrado';
          } else {
            feedback.classList.add('error');
            feedback.innerHTML = 'Opsss!ocorreu um erro Tente novamente.';
          }
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
