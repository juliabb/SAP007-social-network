// eslint-disable-next-line
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from './export.js'; // eslint-disable-line

export const auth = getAuth();
const provider = new GoogleAuthProvider();

export function userCreate(email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      return user;
    },
  );
}

export function userLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      return user;
    },
  );
}

export const googleLogin = () => signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    return credential;
  });

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
