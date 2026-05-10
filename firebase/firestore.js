// src/firebase/firestore.js
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  getDoc,
  where,
  writeBatch,
  limit
} from './export.js';

import { db } from './initialize-firebase.js';

// ── POSTS ────────────────────────────────────────────
export async function addPosts(message, userEmail) {
  // Busca a photoURL atual do perfil do usuário
  let photoURL = './img/perfil.png';
  try {
    const userDoc = await getDoc(doc(db, 'users', userEmail));
    if (userDoc.exists()) {
      photoURL = userDoc.data().photoURL || photoURL;
    }
  } catch (e) {
    // se falhar, usa a padrão
  }

  const docRef = await addDoc(collection(db, 'posts'), {
    message,
    userEmail,
    date: new Date().toLocaleString('pt-br'),
    timestamp: serverTimestamp(),
    likes: [],
    photoURL 
  });

  return docRef.id;
}


export const orderPosts = async () => {
  const arrPosts = [];
  const orderFirestore = query(collection(db, 'posts'), orderBy('date'));
  const querySnapshot = await getDocs(orderFirestore);
  querySnapshot.forEach((item) => {
    const timeline = item.data();
    timeline.id = item.id;
    arrPosts.push(timeline);
  });
  return arrPosts;
};

export function editPosts(itemId, message) {
  return updateDoc(doc(db, 'posts', itemId), { message });
}

export function deletePosts(itemId) {
  return deleteDoc(doc(db, 'posts', itemId));
}

// Atualiza a photoURL em todos os posts de um determinado usuário
export async function updateUserPostsPhoto(userEmail, newPhotoURL) {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, where('userEmail', '==', userEmail));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(db);
  snapshot.docs.forEach(docSnap => {
    batch.update(docSnap.ref, { photoURL: newPhotoURL });
  });
  await batch.commit();
}

export async function like(itemId, userEmail) {
  if (!userEmail || userEmail === '') return null;
  try {
    // 1. Executa o like
    await updateDoc(doc(db, 'posts', itemId), {
      likes: arrayUnion(userEmail),
    });

    // 2. Cria notificação (se não for o dono)
    const postSnap = await getDoc(doc(db, 'posts', itemId));
    if (postSnap.exists()) {
      const postOwner = postSnap.data().userEmail;
      await createNotification(postOwner, userEmail, 'like', itemId);
    }
    return true;
  } catch (e) {
    console.error('Erro ao curtir:', e);
    return null;
  }
}

export async function dislike(itemId, userEmail) {
  try {
    return await updateDoc(doc(db, 'posts', itemId), {
      likes: arrayRemove(userEmail),
    });
  } catch (e) {
    return null;
  }
}

// ── COMENTÁRIOS ──────────────────────────────────────
// Subcoleção: posts/{postId}/comments

export async function addComment(postId, text, userEmail) {
  try {
    const ref = collection(db, 'posts', postId, 'comments');
    const docRef = await addDoc(ref, {
      text,
      userEmail,
      date: new Date().toLocaleString('pt-br'),
    });

    // Cria notificação
    const postSnap = await getDoc(doc(db, 'posts', postId));
    if (postSnap.exists()) {
      const postOwner = postSnap.data().userEmail;
      await createNotification(postOwner, userEmail, 'comment', postId);
    }

    return docRef.id;
  } catch (e) {
    console.error('Erro ao comentar:', e);
    return null;
  }
}

export async function getComments(postId) {
  try {
    console.log('🔥 getComments chamado com postId:', postId);
    const ref = collection(db, 'posts', postId, 'comments');
    const snap = await getDocs(ref);
    console.log(`📦 Documentos encontrados: ${snap.size}`);
    const comments = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    console.log('Comentários:', comments);
    return comments;
  } catch (e) {
    console.error('Erro ao carregar comentários:', e);
    return [];
  }
}

// Obter notificações do usuário logado (mais recentes primeiro)
export async function getNotifications(userEmail, maxResults = 20) {
  const q = query(
    collection(db, 'notifications'),
    where('recipient', '==', userEmail),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Marcar uma notificação como lida
export async function markNotificationRead(notificationId) {
  return updateDoc(doc(db, 'notifications', notificationId), { read: true });
}

// Marcar todas como lidas
export async function markAllNotificationsRead(userEmail) {
  const snapshot = await getDocs(
    query(collection(db, 'notifications'), where('recipient', '==', userEmail), where('read', '==', false))
  );
  const batch = writeBatch(db);
  snapshot.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
}

// ── NOTIFICAÇÕES ───────────────────────────────────

async function createNotification(recipient, sender, type, postId) {
  if (recipient === sender) return;

  try {
    const notifRef = collection(db, 'notifications');
    await addDoc(notifRef, {
      recipient,
      sender,
      type,
      postId,
      timestamp: serverTimestamp(),
      read: false,
    });
  } catch (e) {
    console.error('Erro ao criar notificação:', e);
    console.error('Detalhes:', {
      recipient,
      sender,
      type,
      postId
    });
    throw e; // para ver o erro na chamada original
  }
}
