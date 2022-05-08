import '../firebase/firebase.js';
import { auth, userLogout } from '../firebase/auth-firebase.js';
import { addPosts, orderPosts } from '../firebase/firestore.js';
import { templatePostFeed } from './template-all-posts.js';

export const timeline = () => {
  const feedCreate = document.createElement('div');
  const templateFeed = `
      <main class='header-home'>

      <div class='getout-container'>
      <button id='button-getout' class='button btn-getout'>Sair</button>
      </div>

      <span class='feedback'></span>

      <div class='text-container'>
      <textarea id='message' class='text-writing' maxlength='300' placeholder='Compartilhe sua experiência com filmes e séries aqui'></textarea>
      </div>

      <div class='post-container getout-container'>
      <button id='buttonPost' class='button-submit-feed button'>Publicar</button>
      </div>
    
      <div class='posts-container'>
        <section id='new-post-user' class='all-post'></section>
      <section id='all-post' class='all-post'></section>
    </div>

      </main>
    `;

  feedCreate.innerHTML = templateFeed;

  const logout = feedCreate.querySelector('#button-getout');
  const message = feedCreate.querySelector('#message');
  const buttonPost = feedCreate.querySelector('#buttonPost');
  const feed = feedCreate.querySelector('#new-post-user');
  const feedback = feedCreate.querySelector('.feedback');
  const sectionPost = feedCreate.querySelector('#all-post');

  buttonPost.addEventListener('click', (e) => {
    e.preventDefault();
    const valueMessage = message.value;
    const messageErro = 'Ops! Não é possivel postar mensagem sem conteudo.';
    if (valueMessage === '' || !valueMessage) {
      feedback.classList.add('error');
      feedback.innerHTML = messageErro;
    } else {
      addPosts(valueMessage, auth.currentUser.email).then((id) => {
        const date = new Date().toLocaleString('pt-br');
        const item = {
          userEmail: auth.currentUser.email,
          message: message.value,
          date,
          id,
          likes: [],
        };
        feed.prepend(templatePostFeed(item));
        message.value = '';
        feedback.innerHTML = '';
      });
    }
  });

  const showAllPosts = async () => {
    const allPosts = await orderPosts();
    allPosts.forEach((item) => {
      const postElement = templatePostFeed(item);
      sectionPost.prepend(postElement);
    });
  };

  logout.addEventListener('click', (e) => {
    e.preventDefault();
    userLogout().then(() => {
      window.location.hash = '';
    });
  });

  showAllPosts();
  return feedCreate;
};
