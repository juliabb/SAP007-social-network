import { resetPassword } from '../firebase/auth-firebase.js';

export const reset = () => {
  const resetContainer = document.createElement('div');
  const templateReset = `
  <section class='header-home'>
    <h2 class='subtitle'>Esqueci a senha</h2>
    <section class='text-content'>
      <p class='text-reset'>Uma nova senha será enviada
        ao seu email de cadastro</p>
      </div>
      <form id='form-reset'>
        <div class='reset-input'>
          <input type='email' id='email' class='input-names' placeholder='Digite  o seu email' autocomplet required>
        </div>
        <div id='botao-recuperar'>
          <div class='container-btn'>
            <button id='reset' class='reset button' type='submit'>Enviar</button>
          </div>
      </form>
      <span class='feedback'></span>
    </section>

    <div class='back-container'>
    <a href='#login' class='back-home'>Voltar a tela de Login</a>
  </div>

  </section>
    `;

  resetContainer.innerHTML = templateReset;
  const inputEmail = resetContainer.querySelector('#email');
  const feedback = resetContainer.querySelector('.feedback');
  const btnLinkRecover = resetContainer.querySelector('#reset');

  btnLinkRecover.addEventListener('click', (e) => {
    e.preventDefault();
    const email = inputEmail.value;
    resetPassword(email)
      .then(() => {
        feedback.classList.remove('error');
        feedback.classList.add('send');
        feedback.innerHTML = 'E-mail para redefinição de senha enviado! Verifique seu e-mail';
      }).catch((error) => {
        const errorCode = error.code;
        feedback.classList.remove('send');
        feedback.classList.add('error');
        switch (errorCode) {
          case 'auth/invalid-email':
            feedback.innerHTML = 'Email inválido';
            break;
          case 'auth/user-not-found':
            feedback.innerHTML = 'Usuário não encontrado';
            break;
          default:
            feedback.innerHTML = 'Não será possível recuperar sua senha';
        }
      });
  });
  return resetContainer;
};
