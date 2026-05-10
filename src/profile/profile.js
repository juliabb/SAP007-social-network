// src/profile/profile.js
import { auth } from '../firebase/initialize-firebase.js';
import { getUserProfile, updateUserProfile } from '../firebase/user-profile.js';
import { getPostsByUser } from '../firebase/posts-by-user.js';
import { templatePostFeed } from '../timeline/template-posts.js';
import { uploadProfilePhoto } from '../firebase/storage.js';

export const profile = () => {
  const container = document.createElement('div');

  const userEmail = auth.currentUser.email;
  const userHandle = userEmail.split('@')[0];

  container.innerHTML = `
    <div class="profile-page">
    <div class="profile-header">
  <button class="back-button" id="back-button">
    ← Voltar
  </button>
</div>

      <!-- Cover -->
      <div class="profile-cover"></div>

      <!-- Info: avatar + nome + editar -->
      <div class="profile-info">
        <img class="profile-avatar" id="profile-avatar" src="./img/perfil.png" alt="avatar" />

        <div class="profile-details">
          <h1 class="profile-name" id="profile-name">${userHandle}</h1>
          <p class="profile-handle">@${userHandle}</p>
          <p class="profile-bio" id="profile-bio"></p>
          <div class="profile-stats">
            <span><strong id="post-count">–</strong> posts</span>
          </div>
        </div>

        <button class="button-profile-edit" id="edit-profile-btn">Editar perfil</button>
      </div>

      <!-- Tab bar -->
      <div class="profile-tabs">
        <div class="profile-tab active">Posts</div>
      </div>

      <!-- Feed -->
      <div class="profile-feed">
        <section id="user-posts" class="all-post"></section>
        <p id="no-posts-msg" class="no-posts" style="display:none;">
          Você ainda não publicou nada. Que tal compartilhar algo? 🎬
        </p>
      </div>
    </div>

   <!-- Modal de edição -->
<div class="modal-overlay" id="edit-profile-modal" style="display:none;">
  <div class="modal-content profile-modal">
    <h2>Editar perfil</h2>
    <form id="edit-profile-form">

      <div>
        <label for="edit-display-name">Nome de exibição</label>
        <input type="text" id="edit-display-name" maxlength="30" placeholder="${userHandle}" />
      </div>

      <div>
        <label for="edit-bio">Bio</label>
        <textarea id="edit-bio" maxlength="160" rows="3" placeholder="Conte um pouco sobre você…"></textarea>
      </div>

      <!-- UPLOAD DE AVATAR -->
      <div class="avatar-upload-area">
        <label>Foto de perfil</label>
        <div class="avatar-upload-preview">
          <img id="avatar-preview" src="./img/perfil.png" alt="Preview" />
          <div class="avatar-upload-controls">
            <input type="file" id="avatar-file-input" accept="image/png, image/jpeg, image/webp" hidden />
            <button type="button" class="button button-upload" id="choose-avatar-btn">Escolher foto</button>
            <button type="button" class="button button-cancel" id="remove-avatar-btn">Remover</button>
          </div>
        </div>
        <small class="avatar-help">Formatos: PNG, JPEG ou WebP. Máx. 2 MB.</small>
      </div>

      <div class="modal-buttons-row">
        <button type="button" class="button button-cancel" id="cancel-edit">Cancelar</button>
        <button type="submit" class="button">Salvar</button>
      </div>
    </form>
  </div>
</div>
  `;

  // ── Referências ──────────────────────────────────────
  const avatarImg      = container.querySelector('#profile-avatar');
  const nameEl         = container.querySelector('#profile-name');
  const bioEl          = container.querySelector('#profile-bio');
  const postCountEl    = container.querySelector('#post-count');
  const userPostsEl    = container.querySelector('#user-posts');
  const noPostsMsg     = container.querySelector('#no-posts-msg');
  const editBtn        = container.querySelector('#edit-profile-btn');
  const modal          = container.querySelector('#edit-profile-modal');
  const cancelBtn      = container.querySelector('#cancel-edit');
  const form           = container.querySelector('#edit-profile-form');
  const editDisplayName = container.querySelector('#edit-display-name');
  const editBio        = container.querySelector('#edit-bio');
  const editAvatarUrl  = container.querySelector('#edit-avatar-url');
  const backButton = container.querySelector('#back-button');
  const avatarFileInput = container.querySelector('#avatar-file-input');
const avatarPreview   = container.querySelector('#avatar-preview');
const chooseAvatarBtn = container.querySelector('#choose-avatar-btn');
const removeAvatarBtn = container.querySelector('#remove-avatar-btn');

let selectedFile = null;        // guarda o arquivo escolhido (ou null)
let currentPhotoURL = '';       // a URL atual da foto, carregada do perfil

  // ── Carrega perfil ───────────────────────────────────
const loadProfile = async () => {
  const data = await getUserProfile(userEmail);
  nameEl.textContent  = data.displayName || userHandle;
  bioEl.textContent   = data.bio || '';
  currentPhotoURL     = data.photoURL || './img/perfil.png'; // guarda
  avatarImg.src        = currentPhotoURL;

  editDisplayName.value = data.displayName || '';
  editBio.value         = data.bio || '';
  avatarPreview.src     = currentPhotoURL; // também no modal
};

  // ── Carrega posts do usuário ─────────────────────────
  const loadUserPosts = async () => {
    const posts = await getPostsByUser(userEmail);
    userPostsEl.innerHTML = '';

    postCountEl.textContent = posts.length;

    if (posts.length === 0) {
      noPostsMsg.style.display = 'block';
    } else {
      noPostsMsg.style.display = 'none';
      posts.forEach((post) => userPostsEl.appendChild(templatePostFeed(post)));
    }
  };

  backButton.addEventListener('click', () => {
  window.history.back();
});

// ── Lógica de upload / remoção ─────────────────────────
chooseAvatarBtn.addEventListener('click', () => avatarFileInput.click());

avatarFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validação de tipo e tamanho
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('Formato inválido. Use PNG, JPEG ou WebP.');
    avatarFileInput.value = '';
    return;
  }
  if (file.size > 2 * 1024 * 1024) { // 2 MB
    alert('A imagem deve ter no máximo 2 MB.');
    avatarFileInput.value = '';
    return;
  }

  selectedFile = file;

  // Pré‑visualização
  const reader = new FileReader();
  reader.onload = (ev) => { avatarPreview.src = ev.target.result; };
  reader.readAsDataURL(file);
});

removeAvatarBtn.addEventListener('click', () => {
  selectedFile = null;
  avatarFileInput.value = '';
  avatarPreview.src = './img/perfil.png'; // foto padrão
  // Opcional: marque que a foto atual será removida (usaremos isso no submit)
});

// ── Ao abrir o modal, carregar a foto atual ───────────
const openModal = () => {
  modal.style.display = 'flex';
  editDisplayName.focus();

  // Carrega a URL atual no preview (a do perfil carregado)
  avatarPreview.src = currentPhotoURL || './img/perfil.png';
  selectedFile = null;          // reseta a seleção de arquivo
  avatarFileInput.value = '';
};

  // ── Modal ────────────────────────────────────────────
  const closeModal = () => { modal.style.display = 'none'; };

  editBtn.addEventListener('click', openModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newName = editDisplayName.value.trim();
  const newBio  = editBio.value.trim();

  let newPhotoURL = currentPhotoURL; // mantém a atual por padrão

  // Se o usuário escolheu um arquivo, faz upload
  if (selectedFile) {
    try {
      // Mostre um feedback "Enviando foto…" se quiser
      newPhotoURL = await uploadProfilePhoto(selectedFile, userEmail);
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Falha ao enviar a foto. Tente novamente.');
      return;
    }
  } else if (avatarPreview.src.endsWith('/perfil.png')) {
    // Se removeu (clicou "Remover") e voltou para a padrão, podemos forçar a URL padrão
    // Mas como a padrão pode ser local, defina a string que representa "sem foto"
    newPhotoURL = './img/perfil.png'; // ou um valor padrão que você queira guardar
  }

  await updateUserProfile(userEmail, {
    displayName: newName,
    bio: newBio,
    photoURL: newPhotoURL,
  });

  // Atualiza a UI da página de perfil
  nameEl.textContent = newName || userHandle;
  bioEl.textContent  = newBio;
  avatarImg.src      = newPhotoURL;
  currentPhotoURL    = newPhotoURL; // atualiza a referência

  closeModal();
});

  // ── Inicializa ───────────────────────────────────────
  loadProfile();
  loadUserPosts();

  return container;
};
