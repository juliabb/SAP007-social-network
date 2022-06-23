import '../firebase/initialize-firebase.js';
import { userCreate, googleLogin } from '../firebase/auth-firebase.js';
import { errors } from '../error/error.js';

export const register = () => {
  const registerContainer = document.createElement('div');
  const templateRegister = `
  <section class='header-home'>
      <h2 class='subtitle'>Cadastrar</h2>
      <form id='form-register'>
        <input
          class='input-names'
          type='text'
          placeholder='Digite seu nome Ex:Laura '
          autocomplet
          required
        />
        <input
          class='register-email input-names'
          type='text'
          id='register-email'
          type='email'
          placeholder='Digite seu e-mail'
          autocomplet
          required
        />
        <input
          class='register-password input-names'
          type='password'
          id='register-password'
          minlength='6'
          type='password'
          placeholder='Crie uma senha'
          required
        />

        <div class='home-container login-container'>
          <button
            id='register-enter'
            class='button register-enter login-enter'
            type='submit'
          >
            Cadastrar
          </button>
        </div>
        <span class='feedback'></span>
        <div class='social-media register-enter'>
          <button class='button-google' type='button' id='button-google'>
          <p class='text-google'> Ou entrar com o Google </p>
            <img
              class='google-img'
              src='img/icone-google.png'
              alt='Imagen logo de Google'
            />
          </button>
        </div>
      </form>
      <div class='social-media'></div>
      <div class='back-container'>
        <a href='#home' class='back-home'>Voltar a tela inicial</a>
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
        feedback.classList.add('error');
        const messageError = errors(error.code);
        feedback.innerHTML = (messageError);
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
