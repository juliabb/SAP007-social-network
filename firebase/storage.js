// src/firebase/storage.js
import { ref, uploadBytes, getDownloadURL, deleteObject  } from './export.js';
import { storage } from './initialize-firebase.js';

/**
 * Faz upload de um arquivo de imagem para o Storage e retorna a URL pública.
 * @param {File} file - O arquivo de imagem selecionado.
 * @param {string} userEmail - Email do usuário (usado como parte do caminho).
 * @returns {Promise<string>} - URL da imagem.
 */
export async function uploadProfilePhoto(file, userEmail) {
  // Caminho: avatars/{email}/profile.{ext}
  const extension = file.name.split('.').pop();
  const path = `avatars/${userEmail}/profile.${extension}`;
  const storageRef = ref(storage, path);

  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function deleteProfilePhoto(userEmail) {
  // Tenta deletar qualquer extensão comum – uma abordagem simples é não se preocupar com o arquivo antigo,
  // ou você pode armazenar o caminho no perfil. Aqui vamos simplificar.
  // Se precisar, pode ser implementado futuramente.
}