import { home } from './home/home.js';
import { login } from './login/login.js';
import { register } from './register/register.js';
import { timeline } from './timeline/timeline.js';
import { reset } from './reset-password/reset.js';
import { loggedIn } from './firebase/auth-firebase.js';

const content = document.querySelector('#root');

const contentChange = () => {
  content.innerHTML = '';
  switch (window.location.hash) {
    case '#login':
      content.appendChild(login());
      break;
    case '#register':
      content.appendChild(register());
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
    default:
      content.appendChild(home());
  }
};

window.addEventListener('hashchange', contentChange);
window.addEventListener('load', contentChange);
