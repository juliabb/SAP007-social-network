// src\timeline\template-posts.js
import { auth } from '../firebase/initialize-firebase.js';
import { like, dislike } from '../firebase/firestore.js';
import { modalDeletePost, modalEditPost } from '../modal/modal.js';

export function templatePostFeed(item) {
  const isPostOwner = item.userEmail === auth.currentUser.email;
  const container = document.createElement('article');
  container.classList.add('post-card');

  container.innerHTML = `
    <header class="post-header">
      <div class="user-info">
        <img class="user-img" src="./img/perfil.png" />
        <div>
          <p class="user-email">${item.userEmail}</p>
          <span class="post-date">${item.date}</span>
        </div>
      </div>

      ${isPostOwner ? `
        <div class="post-actions">
          <button class="icon-button" id="modal-btn-edit" title="Editar">
            <img src="./img/icon-lapis.png" />
          </button>
          <button class="icon-button" id="modal-btn-delete" title="Excluir">
            <img src="./img/icon-lixo.png" />
          </button>
        </div>
      ` : ''}
    </header>

    <p class="message-feed">${item.message}</p>

    <footer class="post-footer">
      <button id="button-like" class="button-like">
        <img class="like-icon" src="./img/icon-pipoca-like.svg"/>
        <span id="num-likes">${item.likes.length}</span>
      </button>
    </footer>
  `;

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
        const index = postLike.indexOf(auth.currentUser.email);
        postLike.splice(index, 1);

        const addLikeNum = Number(countLikes.innerHTML) - 1;
        countLikes.innerHTML = addLikeNum;
      });
    }
  });
  return container;
}
