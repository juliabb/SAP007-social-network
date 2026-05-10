// src/timeline/timeline.js
import { auth } from "../firebase/initialize-firebase.js";
import { db } from "../firebase/initialize-firebase.js";
import { userLogout } from "../firebase/auth-firebase.js";
import { addPosts } from "../firebase/firestore.js";
import { templatePostFeed } from "./template-posts.js";
import { getDoc, doc } from "../firebase/export.js";
import { getUnreadNotificationCount } from "../notifications/notifications.js";

// Firebase Firestore imports
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "../firebase/export.js";

export const timeline = (options = {}) => {
  const highlightPostId = options.highlightPostId || null;
  const feedCreate = document.createElement("div");

  const userEmail = auth.currentUser?.email ?? "";
  const userHandle = userEmail.split("@")[0];

  feedCreate.innerHTML = `
    <div class="timeline-wrapper">

      <!-- SIDEBAR ESQUERDA -->
      <aside class="sidebar-left">
        <div class="sidebar-user">
          <img class="sidebar-avatar" src="./img/perfil.png" alt="avatar" />
          <div class="sidebar-user-info">
            <p class="sidebar-username">${userEmail}</p>
            <p class="sidebar-handle">@${userHandle}</p>
          </div>
        </div>

        <button class="nav-item active">
          <span class="nav-icon">🏠</span>
          Início
        </button>

      <button class="nav-item" id="nav-notifications">
  <span class="nav-icon">🔔</span>
  Notificações
  <span id="notif-badge" class="badge" style="display:none;">0</span>
</button>

      <button class="nav-item" id="nav-profile">
  <span class="nav-icon">👤</span> Perfil
</button>

        <div class="sidebar-divider"></div>

        <button id="button-getout" class="btn-getout button">
          <span class="nav-icon">🚪</span>
          Sair
        </button>
      </aside>

      <!-- FEED CENTRAL -->
      <main class="feed-center">
        <div class="feed-header">
          <h1>Para você</h1>
        </div>

        <!-- compose -->
        <div class="compose-area">
          <img class="compose-avatar" src="./img/perfil.png" alt="avatar" />
          <div class="compose-right">
            <textarea
              id="message"
              class="text-writing"
              maxlength="300"
              placeholder="O que você está assistindo?"
            ></textarea>
            <div class="compose-footer">
              <div style="display:flex;align-items:center;gap:0.75rem;">
                <span class="char-count" id="char-count">0/300</span>
                <button id="buttonPost" class="button button-submit-feed">Publicar</button>
              </div>
            </div>
          </div>
        </div>

        <span class="feedback"></span>

        <!-- posts -->
        <div class="posts-container">
          <section id="new-post-user" class="all-post"></section>
          <section id="all-post" class="all-post"></section>
        </div>
      </main>

      <!-- SIDEBAR DIREITA -->
      <aside class="sidebar-right">
        <div class="sidebar-widget">
          <p class="widget-title">🎬 Em alta agora</p>

          <div class="trend-item">
            <p class="trend-label">Cinema · Tendência</p>
            <p class="trend-name">#Parasite</p>
            <p class="trend-count">2.4 mil posts</p>
          </div>
          <div class="trend-item">
            <p class="trend-label">Séries · Tendência</p>
            <p class="trend-name">#TheBear</p>
            <p class="trend-count">1.8 mil posts</p>
          </div>
          <div class="trend-item">
            <p class="trend-label">Streaming · Tendência</p>
            <p class="trend-name">#Oppenheimer</p>
            <p class="trend-count">980 posts</p>
          </div>
          <div class="trend-item">
            <p class="trend-label">Animação · Tendência</p>
            <p class="trend-name">#StudioGhibli</p>
            <p class="trend-count">765 posts</p>
          </div>
        </div>

        <div class="sidebar-widget">
          <p class="widget-title">🍿 Sobre o Mirame</p>
          <p style="font-size:0.82rem;color:var(--muted);line-height:1.6;">
            Compartilhe filmes e séries que você amou, odiou ou não consegue parar de recomendar.
          </p>
        </div>
      </aside>

    </div>
  `;

  // ── refs ──────────────────────────────────────────────
  const logout = feedCreate.querySelector("#button-getout");
  const message = feedCreate.querySelector("#message");
  const buttonPost = feedCreate.querySelector("#buttonPost");
  const feed = feedCreate.querySelector("#new-post-user"); // posts do próprio usuário
  const feedback = feedCreate.querySelector(".feedback");
  const sectionPost = feedCreate.querySelector("#all-post"); // onde os posts paginados entram
  const charCount = feedCreate.querySelector("#char-count");

  let currentUserPhotoURL = "./img/perfil.png";

  // ── Paginação ─────────────────────────────────────────
  const POSTS_PER_PAGE = 20;
  let lastVisible = null; // último documento do lote atual
  let hasMorePosts = true;
  let loadingMore = false; // evita cliques duplos

  // Cria o botão "Carregar mais"
  const loadMoreBtn = document.createElement("button");
  loadMoreBtn.id = "load-more-btn";
  loadMoreBtn.className = "button load-more-button";
  loadMoreBtn.textContent = "Carregar mais";
  loadMoreBtn.style.display = "none"; // só aparece se houver mais posts

  // Cria o botão "Voltar ao topo"
  const backToTopBtn = document.createElement("button");
  backToTopBtn.id = "back-to-top-btn";
  backToTopBtn.className = "icon-button back-to-top-button";
  backToTopBtn.innerHTML =  `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 19V5"></path>
    <path d="M5 12l7-7 7 7"></path>
  </svg>
`;
  backToTopBtn.title = "Voltar ao topo";
  backToTopBtn.style.display = "none";

  // ── Função para carregar posts iniciais ───────────────
  const loadInitialPosts = async () => {
    sectionPost.innerHTML = ""; // limpa estado anterior
    lastVisible = null;
    hasMorePosts = true;
    loadMoreBtn.style.display = "none";

    const postsCol = collection(db, "posts");
    const q = query(postsCol, orderBy("date", "desc"), limit(POSTS_PER_PAGE));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      sectionPost.innerHTML =
        '<p class="no-posts">Nenhum post ainda. Seja o primeiro! 🍿</p>';
      hasMorePosts = false;
      return;
    }

    // Renderiza os posts (mais novo primeiro)
    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = { id: doc.id, ...data };
      const postEl = templatePostFeed(item);
      postEl.setAttribute("data-post-id", item.id);
      sectionPost.append(postEl);
    });

    const notifBadge = feedCreate.querySelector("#notif-badge");

    const updateBadge = async () => {
      if (!userEmail) return;
      try {
        const count = await getUnreadNotificationCount(userEmail);
        if (count > 0) {
          notifBadge.textContent = count;
          notifBadge.style.display = "inline-block";
        } else {
          notifBadge.style.display = "none";
        }
      } catch (e) {
        console.error("Erro ao atualizar badge:", e);
      }
    };

    // Chame quando a timeline for montada
    updateBadge();

    // Guarda o último documento visível para paginação
    lastVisible = snapshot.docs[snapshot.docs.length - 1];

    // Se o lote veio completo, pode haver mais
    hasMorePosts = snapshot.docs.length === POSTS_PER_PAGE;
    loadMoreBtn.style.display = hasMorePosts ? "block" : "none";

    (async () => {
      try {
        const { getUserProfile } = await import("../firebase/user-profile.js");
        const profile = await getUserProfile(userEmail);
        currentUserPhotoURL = profile.photoURL || currentUserPhotoURL;
        // Atualiza sidebar e compose
        const sidebarAvatar = feedCreate.querySelector(".sidebar-avatar");
        if (sidebarAvatar) sidebarAvatar.src = currentUserPhotoURL;
        const composeAvatar = feedCreate.querySelector(".compose-avatar");
        if (composeAvatar) composeAvatar.src = currentUserPhotoURL;
      } catch (e) {
        /* silencioso */
      }
    })();
    if (highlightPostId) {
      highlightAndScrollToPost(highlightPostId);
    }
  };

  // ── Função para carregar próximo lote ─────────────────
  const loadMorePosts = async () => {
    if (!hasMorePosts || loadingMore || !lastVisible) return;
    loadingMore = true;
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = "Carregando…";

    const postsCol = collection(db, "posts");
    const q = query(
      postsCol,
      orderBy("date", "desc"),
      startAfter(lastVisible),
      limit(POSTS_PER_PAGE),
    );

    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        hasMorePosts = false;
        loadMoreBtn.style.display = "none";
        return;
      }

      // Adiciona os posts ao final (são mais antigos)
      snapshot.forEach((doc) => {
        const data = doc.data();
        const item = { id: doc.id, ...data };
        const postEl = templatePostFeed(item);
        postEl.setAttribute("data-post-id", item.id);
        sectionPost.append(templatePostFeed(item));
      });

      lastVisible = snapshot.docs[snapshot.docs.length - 1];
      hasMorePosts = snapshot.docs.length === POSTS_PER_PAGE;
      loadMoreBtn.style.display = hasMorePosts ? "block" : "none";
    } catch (error) {
      console.error("Erro ao carregar mais posts:", error);
    } finally {
      loadingMore = false;
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = "Carregar mais";
    }
  };

  // ── Eventos dos botões ────────────────────────────────
  loadMoreBtn.addEventListener("click", loadMorePosts);

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  feedCreate
    .querySelector("#nav-notifications")
    ?.addEventListener("click", () => {
      window.location.hash = "#notifications";
    });

  // Mostra/oculta o botão de voltar ao topo ao rolar
  const handleScroll = () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  };
  window.addEventListener("scroll", handleScroll);

  // Insere os botões no DOM, após a seção de posts
  const postsContainer = feedCreate.querySelector(".posts-container");
  postsContainer.appendChild(loadMoreBtn);
  document.body.appendChild(backToTopBtn); // botão flutuante no body

  // ── char counter ──────────────────────────────────────
  message.addEventListener("input", () => {
    const len = message.value.length;
    charCount.textContent = `${len}/300`;
    charCount.className = "char-count";
    if (len >= 270) charCount.classList.add("danger");
    else if (len >= 240) charCount.classList.add("warn");
  });

  // ── publicar ──────────────────────────────────────────
  buttonPost.addEventListener("click", (e) => {
    e.preventDefault();
    const valueMessage = message.value.trim();
    if (!valueMessage) {
      feedback.classList.add("error");
      feedback.innerHTML =
        "Ops! Não é possível postar uma mensagem sem conteúdo.";
      return;
    }
    addPosts(valueMessage, auth.currentUser.email).then((id) => {
      const date = new Date().toLocaleString("pt-br");
      const item = {
        userEmail: auth.currentUser.email,
        message: valueMessage,
        date,
        id,
        likes: [],
        photoURL: currentUserPhotoURL,
      };
      feed.prepend(templatePostFeed(item)); // novo post aparece no topo
      message.value = "";
      charCount.textContent = "0/300";
      charCount.className = "char-count";
      feedback.innerHTML = "";
      feedback.classList.remove("error");
    });
  });

  // ── logout ────────────────────────────────────────────
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    userLogout().then(() => {
      window.location.hash = "";
    });
  });

  // ── Perfil navegação ──────────────────────────────────
  feedCreate.querySelector("#nav-profile")?.addEventListener("click", () => {
    window.location.hash = "#profile";
  });

  // Ajusta --nav-h dinamicamente
  const navEl = document.querySelector("header");
  if (navEl) {
    const h = navEl.offsetHeight;
    document.documentElement.style.setProperty("--nav-h", `${h}px`);
  }

  const highlightAndScrollToPost = async (postId) => {
    let postElement = sectionPost.querySelector(`[data-post-id="${postId}"]`);

    if (!postElement) {
      try {
        const docSnap = await getDoc(doc(db, "posts", postId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const item = { id: docSnap.id, ...data };
          const tempElement = templatePostFeed(item);
          // Garante que o elemento tenha o atributo data-post-id
          tempElement.setAttribute("data-post-id", postId);
          sectionPost.prepend(tempElement);
          postElement = tempElement;
        } else {
          console.warn("Post não encontrado");
          return;
        }
      } catch (error) {
        console.error("Erro ao buscar post em destaque:", error);
        return;
      }
    }

    postElement.scrollIntoView({ behavior: "smooth", block: "center" });
    postElement.classList.add("post-highlight");
    setTimeout(() => postElement.classList.remove("post-highlight"), 3000);
  };

  // ── Inicializa o feed ─────────────────────────────────
  loadInitialPosts();

  return feedCreate;
};
