import '../firebase/initialize-firebase.js';
import { userLogin, googleLogin } from '../firebase/auth-firebase.js';
import { errors } from '../error/error.js';

export const login = () => {
  const loginContainer = document.createElement('div');
  const templateLogin = `
  <section class='header-home'>
  <form id='form-login'>
    <h2 class='subtitle'>Login</h2>
    <input
      class='login-email input-names'
      type='email'
      id='login-email'
      placeholder='Digite seu e-mail'
      autocomplet
      required
    />
    <input
      class='login-password input-names'
      type='password'
      id='login-password'
      placeholder='Digite uma senha'
      minlength='6'
      required
    />
    <div class='home-container'>
      <button
        id='login-enter'
        class='button login-enter'
        type='submit'
        role='link'
      >
        Entrar
      </button>
</div>
    <span class='feedback'></span>
    <div class='text-content'>
      <p class='text-forgot'>
        Esqueci a <a class='links' href='#reset'>Senha</a>
      </p>
      <div class='social-media google-container'>
        <button class='button-google' type='button' id='button-google'>
       <p class='text-google'> Ou entrar com o Google </p>
          <img
            class='google-img'
            src='img/icone-google.png'
            alt='Logo de Google'
          />
        </button>
      </div>
    </div>
  </form>
  <div class='social-media'>
    <p class='text-register'>
      Ainda não tem conta?
      <a href='#register' class='links'>Cadastre-se</a>
    </p>
  </div>
  <div class='back-container'>
    <a href='#home' class='back-home'>Voltar a tela inicial</a>
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
