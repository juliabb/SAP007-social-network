// src/timeline/template-posts.js
import { auth } from "../firebase/initialize-firebase.js";
import {
  like,
  dislike,
  addComment,
  getComments,
} from "../firebase/firestore.js";
import { modalDeletePost, modalEditPost } from "../modal/modal.js";

export function templatePostFeed(item) {
  const isPostOwner = item.userEmail === auth.currentUser.email;
  const container = document.createElement("article");
  container.classList.add("post-card");

  const userHandle = item.userEmail.split("@")[0];

  container.innerHTML = `
    <div class="post-left">
      <img class="user-img" src="${item.photoURL || "./img/perfil.png"}" alt="avatar" />
    </div>

    <div class="post-right">
      <header class="post-header">
        <div class="user-info">
          <p class="user-email">@${userHandle}</p>
          <span class="post-date">${item.date}</span>
        </div>
        ${
          isPostOwner
            ? `
          <div class="post-actions">
            <button class="icon-button" id="modal-btn-edit" title="Editar">
              <img src="./img/icon-lapis.png" alt="editar" />
            </button>
            <button class="icon-button" id="modal-btn-delete" title="Excluir">
              <img src="./img/icon-lixo.png" alt="excluir" />
            </button>
          </div>
        `
            : ""
        }
      </header>

      <p class="message-feed" id="message">${item.message}</p>

     <footer class="post-footer">
    <button class="button-like js-like-btn">
      <img class="like-icon" src="./img/icon-pipoca-like.svg" alt="curtir" />
      <span class="js-num-likes">${item.likes.length}</span>
    </button>

   <button class="button-comment js-comment-btn" title="Comentar">
  <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
  <span class="js-num-comments">0</span>
</button>
  </footer>

      <!-- seção de comentários (oculta por padrão) -->
     <div class="comments-section js-comments-section" style="display:none;">
  <div class="comments-list js-comments-list">
    <p class="comments-loading">Carregando comentários…</p>
  </div>
  <div class="comment-compose">
    <img class="comment-avatar" src="./img/perfil.png" alt="avatar" />
    <div class="comment-input-wrap">
      <input type="text" class="comment-input js-comment-input" placeholder="Adicione um comentário…" maxlength="200"/>
      <button class="comment-send js-comment-send" title="Enviar">
          <svg class="comment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // ── edit / delete ─────────────────────────────────────
  if (isPostOwner) {
    container
      .querySelector("#modal-btn-delete")
      .addEventListener("click", (e) => {
        e.preventDefault();
        container.appendChild(modalDeletePost(item, container));
      });
    container
      .querySelector("#modal-btn-edit")
      .addEventListener("click", (e) => {
        e.preventDefault();
        container.appendChild(modalEditPost(item, container));
      });
  }

  // ── like / dislike ────────────────────────────────────
  const buttonLike = container.querySelector(".js-like-btn");
  const countLikes = container.querySelector(".js-num-likes");
  const btnComment = container.querySelector(".js-comment-btn");
  const countComments = container.querySelector(".js-num-comments");

  if (item.likes.includes(auth.currentUser.email)) {
    buttonLike.classList.add("liked");
  }

  buttonLike.addEventListener("click", () => {
    const postLike = item.likes;
    const alreadyLiked = postLike.includes(auth.currentUser.email);

    if (!alreadyLiked) {
      like(item.id, auth.currentUser.email).then(() => {
        postLike.push(auth.currentUser.email);
        countLikes.textContent = Number(countLikes.textContent) + 1;
        buttonLike.classList.add("liked");
      });
    } else {
      dislike(item.id, auth.currentUser.email).then(() => {
        const index = postLike.indexOf(auth.currentUser.email);
        postLike.splice(index, 1);
        countLikes.textContent = Number(countLikes.textContent) - 1;
        buttonLike.classList.remove("liked");
      });
    }
  });

  // ── comentários ───────────────────────────────────────
  const section = container.querySelector(".js-comments-section");
  const list = container.querySelector(".js-comments-list");
  const input = container.querySelector(".js-comment-input");
  const sendBtn = container.querySelector(".js-comment-send");

  let commentsLoaded = false;
  let open = false;

  // renderiza um comentário na lista
  const renderComment = (c) => {
    const handle = c.userEmail.split("@")[0];
    const el = document.createElement("div");
    el.classList.add("comment-item");
    el.innerHTML = `
      <img class="comment-user-avatar" src="./img/perfil.png" alt="avatar" />
      <div class="comment-body">
        <span class="comment-handle">@${handle}</span>
        <span class="comment-date">${c.date}</span>
        <p class="comment-text">${c.text}</p>
      </div>
    `;
    return el;
  };

  // carrega comentários do Firestore (só na primeira abertura)
  const loadComments = async () => {
    if (commentsLoaded) return;
    commentsLoaded = true;
    const comments = await getComments(item.id);
    console.log(
      "💬 Comentários carregados:",
      comments.length,
      "itens",
      comments,
    );
    console.log("🧩 Elemento countComments:", countComments);
    list.innerHTML = "";
    countComments.textContent = comments.length;
    console.log("✏️ Após setar, textContent:", countComments.textContent);
    if (comments.length === 0) {
      list.innerHTML =
        '<p class="comments-empty">Nenhum comentário ainda. Seja o primeiro!</p>';
    } else {
      comments.forEach((c) => list.appendChild(renderComment(c)));
    }
  };

  // toggle abrir/fechar
  btnComment.addEventListener("click", () => {
    open = !open;
    section.style.display = open ? "block" : "none";
    btnComment.classList.toggle("active", open);
    if (open) loadComments();
  });

  // enviar comentário
  const submitComment = () => {
    const text = input.value.trim();
    if (!text) return;

    const tempComment = {
      userEmail: auth.currentUser.email,
      text,
      date: new Date().toLocaleString("pt-br"),
    };

    // renderiza imediatamente (optimistic UI)
    const el = renderComment(tempComment);
    const emptyMsg = list.querySelector(".comments-empty");
    if (emptyMsg) emptyMsg.remove();
    list.appendChild(el);
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const current = Number(countComments.textContent);
    countComments.textContent = current + 1;
    input.value = "";

    // persiste no Firestore
    addComment(item.id, text, auth.currentUser.email);
  };

  sendBtn.addEventListener("click", submitComment);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  });

  // Atualiza contagem de comentários sem exibir a seção
  getComments(item.id)
    .then((comments) => {
      countComments.textContent = comments.length;
    })
    .catch(() => {});

  return container;
}
