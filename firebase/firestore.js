import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from './export.js';

const db = getFirestore();

export async function addPosts(message, userEmail) {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      message,
      userEmail,
      date: new Date().toLocaleString('pt-br'),
      likes: [],
    });
    return docRef.id;
  } catch (e) {
    return null;
  }
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
  const editPost = doc(db, 'posts', itemId);
  return updateDoc(editPost, {
    message,
  });
}

export function deletePosts(itemId) {
  return deleteDoc(doc(db, 'posts', itemId));
}

export async function like(itemId, userEmail) {
  try {
    const postId = doc(db, 'posts', itemId);
    return await updateDoc(postId, {
      likes: arrayUnion(userEmail),
    });
  } catch (e) {
    return null;
  }
}

export async function dislike(itemId, userEmail) {
  try {
    const postId = doc(db, 'posts', itemId);
    return await updateDoc(postId, {
      likes: arrayRemove(userEmail),
    });
  } catch (e) {
    return null;
  }
}
