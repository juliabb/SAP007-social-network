/* eslint-disable max-len */
// src/firebase/auth-firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from './export.js';

import { auth } from './initialize-firebase.js';

const provider = new GoogleAuthProvider();

export function userCreate(email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => userCredential.user,
  );
}

export function userLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => userCredential.user,
  );
}

export const googleLogin = () => signInWithPopup(auth, provider).then((result) => GoogleAuthProvider.credentialFromResult(result));

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

export function loggedIn(cb) {
  onAuthStateChanged(auth, (user) => {
    cb(user != null);
  });
}

export function userLogout() {
  return signOut(auth)
    .then(() => 'Saiu')
    .catch((error) => error);
}
