// src\firebase\initialize-firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAGrWsT7kTZ2_UtPKCFzMleOBr3TCZ3dA8',
  authDomain: 'mirama-social-network.firebaseapp.com',
  projectId: 'mirama-social-network',
  storageBucket: 'mirama-social-network.appspot.com',
  messagingSenderId: '887687261584',
  appId: '1:887687261584:web:654afba21039e35c469715',
  measurementId: 'G-JMPMFK4GSR',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
