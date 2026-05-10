// src/firebase/export.js
export {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';

export { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';

export {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';

export {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';