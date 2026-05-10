import { home } from './home/home.js';
import { login } from './login/login.js';
import { register } from './register/register.js';
import { timeline } from './timeline/timeline.js';
import { reset } from './reset-password/reset.js';
import { loggedIn } from './firebase/auth-firebase.js';
import { profile } from './profile/profile.js';
import { notificationsPage } from './notifications/notifications.js';

const content = document.querySelector('#root');

const contentChange = () => {
  content.innerHTML = '';
  const hash = window.location.hash;

  // Rota de post individual: #post/ID
  if (hash.startsWith('#post/')) {
    const postId = hash.split('#post/')[1];
    loggedIn((logged) => {
      if (logged) {
        content.appendChild(timeline({ highlightPostId: postId }));
      } else {
        window.location.hash = '#login';
      }
    });
    return;
  }

  switch (hash) {
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
    case '#profile':
      loggedIn((logged) => {
        if (logged) content.appendChild(profile());
        else window.location.hash = '#login';
      });
      break;
    case '#notifications':
      loggedIn((logged) => {
        if (logged) {
          content.appendChild(notificationsPage());
        } else {
          window.location.hash = '#login';
        }
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
