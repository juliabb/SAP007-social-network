// src\firebase\initialize-firebase.js
/* eslint-disable import/no-unresolved */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.9/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDJjWL2e8l_0r54ReH9eZc6PWxcqaIHpxQ',
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
