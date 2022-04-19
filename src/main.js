// EVENTOS DOM - ROTAS
import './firebase/firebase.js';

import { home } from './home/home.js';
import { login } from './login/login.js';
import { register } from './register/register.js';
import { timeline } from './timeline/timeline.js';
import { reset } from './reset-password/reset.js';
import { checkLoggedUser } from './firebase/auth-firebase.js';

const content = document.querySelector('#root');

const contentChange = () => {
  const loggedIn = checkLoggedUser();
  if (loggedIn) {
    switch (window.location.hash) {
      case '#register':
        content.appendChild(register());
        break;
      case '#login':
        content.appendChild(login());
        break;
      case '#timeline':
        loggedIn((logged) => {
          if (logged) {
            content.appendChild(timeline());
          } else window.location.hash = '#login';
        });
        break;
      case '#reset':
        content.appendChild(reset());
        break;
      case '#home':
        content.appendChild(home());
        break;
      default:
        content.appendChild(home());
    }
  } else {
    content.innerHTML = '';
    contentChange();
  }
};

window.addEventListener('hashchange', () => {
  content.innerHTML = '';
  contentChange();
});

window.addEventListener('load', () => {
  contentChange();
});
