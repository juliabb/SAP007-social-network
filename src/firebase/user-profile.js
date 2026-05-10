// src/firebase/user-profile.js
import { doc, getDoc, setDoc, updateDoc } from './export.js';
import { db } from './initialize-firebase.js';
import { updateUserPostsPhoto } from './firestore.js';

/**
 * Retorna o documento de perfil do usuário.
 * Se não existir, cria um padrão.
 */
export const getUserProfile = async (email) => {
  const ref = doc(db, 'users', email);
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data();

  const defaultProfile = {
    email,
    displayName: email.split('@')[0],
    bio: '',
    photoURL: './img/perfil.png',
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, defaultProfile);
  return defaultProfile;
};

/**
 * Atualiza campos do perfil.
 * newData deve ser um objeto parcial, ex: { displayName, bio, photoURL }
 */
export const updateUserProfile = async (email, newData) => {
  const ref = doc(db, 'users', email);
  await updateDoc(ref, newData);

  if (newData.photoURL) {
    await updateUserPostsPhoto(email, newData.photoURL);
  }
};