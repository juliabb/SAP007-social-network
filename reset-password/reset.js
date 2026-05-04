import { resetPassword } from '../firebase/auth-firebase.js';
import { errors } from '../error/error.js';

export const reset = () => {
  const resetContainer = document.createElement('main');
  resetContainer.classList.add('auth-container');

  resetContainer.innerHTML = `
    <section class="auth-card">
      <h2 class="subtitle">Esqueci a senha</h2>
      <p class="text-reset">Uma nova senha será enviada ao seu email de cadastro.</p>

      <form id="form-reset" class="auth-form">
        <input
          type="email"
          id="email"
          class="input-names"
          placeholder="Digite seu e-mail"
          autocomplete="email"
          required
        />

        <button id="reset" class="button login-enter" type="submit">Enviar</button>

        <span class="feedback"></span>
      </form>

      <a href="#login" class="back-home">← Voltar para o login</a>
    </section>
  `;

  const inputEmail = resetContainer.querySelector('#email');
  const feedback = resetContainer.querySelector('.feedback');
  const form = resetContainer.querySelector('#form-reset');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = inputEmail.value;
    resetPassword(email)
      .then(() => {
        feedback.classList.remove('error');
        feedback.classList.add('send');
        feedback.innerHTML = 'E-mail de redefinição enviado! Verifique sua caixa de entrada.';
      })
      .catch((error) => {
        feedback.classList.remove('send');
        feedback.classList.add('error');
        feedback.innerHTML = errors(error.code);
      });
  });

  return resetContainer;
};
