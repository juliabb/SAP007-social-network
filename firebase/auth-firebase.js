// FUNÇÕES DE AUTENTICAÇÃO FIREBASE
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

// FUNÇÃO DE CRIAR NOVO USUÁRIO
export function userCreate(email, password) {
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      return user;
    },
  );
}

// FUNÇÃO DE LOGIN
export function userLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      return user;
    },
  );
}

// FUNÇÃO DE LOGIN COM GOOGLE
export const googleLogin = () => signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    // const user = result.user;
    return credential;
  });

// FUNÇÃO DE RESETAR SENHA (VIA EMAIL)
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// FUNÇÃO DE VERIFICAR SE ESTÁ LOGADO
export function loggedIn(cb) {
  onAuthStateChanged(auth, (user) => {
    cb(user != null);
  });
}

// FUNÇÃO DE SAIR DA CONTA
export function userLogout() {
  return signOut(auth)
    .then(() => 'Saiu')
    .catch((error) => error);
}
