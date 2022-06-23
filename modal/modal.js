import { editPosts, deletePosts } from '../firebase/firestore.js';

export function modalEditPost(item, postContainer) {
  const modalContainer = document.createElement('div');
  const ModalEdit = `
  <div id='modal-container' class='modal-container'>
    <div id='modal-content' class='modal-content'>
    <p class='text-reset edit'>Edição de postagem</p>
      <div>
        <textarea name='textarea' maxlength='300' id='message' class='message text-writing writing-modal'
          placeholder='Compartilhe sua experiência aqui'>${item.message}</textarea>
      </div>

      <span class='feedback'></span>

      <div class='save-container'>
        <button id='save-message' class='button'>Salvar</button>
        <button id='button-cancel' class='button-cancel button'>Cancelar</button>

      </div>
    </div>
  </div>
    `;

  modalContainer.innerHTML = ModalEdit;

  const modal = modalContainer.querySelector('#modal-container');
  const saveEdit = modalContainer.querySelector('#save-message');
  const message = modalContainer.querySelector('#message');
  const buttonCancel = modalContainer.querySelector('#button-cancel');
  const feedback = modalContainer.querySelector('.feedback');

  saveEdit.addEventListener('click', () => {
    if (message.value === '') {
      feedback.classList.add('error');
      feedback.innerHTML = 'Opsss! ocorreu um erro Tente novamente.';
    } else {
      editPosts(item.id, message.value).then(() => {
        const messageEdited = postContainer.querySelector('#message');
        messageEdited.innerHTML = message.value;

        modalContainer.remove();
      });
    }
  });

  buttonCancel.addEventListener('click', () => {
    modalContainer.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modalContainer.remove();
    }
  });
  return modalContainer;
}

export function modalDeletePost(post, postContainer) {
  const modalContainer = document.createElement('div');

  const ModalDelete = `
  <div id='modal-container' class='modal-container'>
  <div class='modal-content'>
    <div class='delete-container'>
      <h2 class='delete-text'>Apagar postagem?</h2>
      <p class='delete-text'>
        Você tem certeza que deseja excluir a postagem? Essa ação não poderá
        ser desfeita.
      </p>
      <div>
        <button id='button-yes' class='button'>Sim</button>
        <button id='button-no' class='button-cancel button'>Não</button>
      </div>
    </div>
  </div>
</div>
  `;

  modalContainer.innerHTML = ModalDelete;

  const modal = modalContainer.querySelector('#modal-container');
  const buttonYes = modalContainer.querySelector('#button-yes');
  const buttonNo = modalContainer.querySelector('#button-no');

  buttonYes.addEventListener('click', () => {
    deletePosts(post.id);
    postContainer.remove();
  });

  buttonNo.addEventListener('click', () => {
    modalContainer.remove();
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modalContainer.remove();
    }
  });

  return modalContainer;
}
