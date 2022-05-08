import { auth } from '../firebase/auth-firebase.js';
import { like, dislike } from '../firebase/firestore.js';
import { modalDeletePost, modalEditPost } from './modal.js';

export function templatePostFeed(item) {
  const isPostOwner = item.userEmail === auth.currentUser.email;
  const container = document.createElement('section');

  const postCreate = `
    <div class='post-div'>
      ${isPostOwner ? `
      <div class='icons-container'>
      <button class='modal-buttons' id='modal-btn-edit'><img class='icon-img' src='./img/icon-lapis.png'>Editar</button>
      <button class='modal-buttons'  id='modal-btn-delete'><img class='icon-img' src='./img/icon-lixo.png'>Excluir</button>
      </div>` : ''}
      <div class='user-info'>
        <img class='user-img icon-img' src='./img/perfil.png'/>
          <p class='user-email'>${item.userEmail}</p>
          </div>
        <div class='items-organization'>
          <p>${item.date}</p>
        </div>
          <p id='message' class='message-feed'>${item.message}</p>
            <div class='like-container'>
              <button id='button-like' class='button-like'>
                <img class='like-icon like' src='./img/icon-pipoca-like.svg'/>
            <p id='num-likes' class='num-likes'>${item.likes.length}</p>
            </button>
            </div>
    </div>`;

  container.innerHTML = postCreate;

  if (isPostOwner) {
    const deletePost = container.querySelector('#modal-btn-delete');
    deletePost.addEventListener('click', (e) => {
      e.preventDefault();
      container.appendChild(modalDeletePost(item, container));
    });

    const btnEditPost = container.querySelector('#modal-btn-edit');

    btnEditPost.addEventListener('click', (e) => {
      e.preventDefault();
      container.appendChild(modalEditPost(item, container));
    });
  }

  const buttonLike = container.querySelector('#button-like');
  const countLikes = container.querySelector('#num-likes');

  buttonLike.addEventListener('click', () => {
    const postLike = item.likes;
    if (!postLike.includes(auth.currentUser.email)) {
      like(item.id, auth.currentUser.email).then(() => {
        postLike.push(auth.currentUser.email);
        const addLikeNum = Number(countLikes.innerHTML) + 1;
        countLikes.innerHTML = addLikeNum;
      });
    } else {
      dislike(item.id, auth.currentUser.email).then(() => {
        postLike.splice(auth.currentUser.email);
        const addLikeNum = Number(countLikes.innerHTML) - 1;
        countLikes.innerHTML = addLikeNum;
      });
    }
  });
  return container;
}
