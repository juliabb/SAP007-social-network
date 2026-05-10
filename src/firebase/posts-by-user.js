// src\firebase\posts-by-user.js
import { db } from './initialize-firebase.js';
import { collection, query, where, orderBy, getDocs } from './export.js';

export const getPostsByUser = async (userEmail) => {
  const q = query(
    collection(db, 'posts'),
    where('userEmail', '==', userEmail),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  const posts = [];
  snapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() }); // ← corrigido
  });
  return posts;
};