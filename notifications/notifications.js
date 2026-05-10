// src/notifications/notifications.js
import { auth, db } from "../firebase/initialize-firebase.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../firebase/firestore.js";
import { collection, query, where, getDocs } from "../firebase/export.js";

export async function getUnreadNotificationCount(userEmail) {
  const q = query(
    collection(db, "notifications"),
    where("recipient", "==", userEmail),
    where("read", "==", false),
  );
  const snapshot = await getDocs(q);
  return snapshot.size;
}

export const notificationsPage = () => {
  const container = document.createElement("div");
  container.className = "notifications-page";
  container.innerHTML = `
  <div class="notifications-container">
    <div class="notifications-header">
     <button id="back-button" class="back-button" title="Voltar">← Voltar</button>
      <div>
        <h1>Notificações</h1>
        <p>Acompanhe curtidas e comentários nos seus posts</p>
      </div>

      <button id="mark-all-read" class="button-notification-read">
        Marcar todas como lidas
      </button>
    </div>

    <div id="notifications-list" class="notifications-list">
      <div class="notifications-loading">
        <span></span>
        <p>Carregando notificações…</p>
      </div>
    </div>

  </div>
`;

  const listEl = container.querySelector("#notifications-list");
  const userEmail = auth.currentUser?.email;

  // Carregar notificações
  const load = async () => {
    if (!userEmail) return;
    const notifs = await getNotifications(userEmail);
    listEl.innerHTML = "";
    if (notifs.length === 0) {
      listEl.innerHTML = '<p class="empty">Nenhuma notificação.</p>';
      return;
    }

    notifs.forEach((n) => {
      const item = document.createElement("div");
      item.className = `notification-item ${n.read ? "read" : "unread"}`;
      item.innerHTML = `
        <div class="notif-text">
          <strong>@${n.sender.split("@")[0]}</strong>
          ${n.type === "like" ? "curtiu seu post." : "comentou em seu post."}
          <span class="notif-time">${n.timestamp ? n.timestamp.toDate().toLocaleString("pt-br") : ""}</span>
        </div>
        <button class="notif-goto" data-postid="${n.postId}">Ver post</button>
      `;

      // Clique no botão "Ver post" redireciona e marca como lida
      item.querySelector(".notif-goto").addEventListener("click", async (e) => {
        e.stopPropagation();
        const postId = e.target.dataset.postid;
        await markNotificationRead(n.id);
        // Você pode guardar o postId na URL hash ou abrir um modal
        window.location.hash = `#post/${postId}`;
      });

      // Clique no item todo também marca como lida
      item.addEventListener("click", async () => {
        if (!n.read) {
          await markNotificationRead(n.id);
          n.read = true;
          item.classList.remove("unread");
          item.classList.add("read");
        }
      });

      listEl.appendChild(item);
    });
  };

  container.querySelector("#back-button").addEventListener("click", () => {
    window.location.hash = "#timeline"; // ou '#'
  });

  // Marcar todas como lidas
  container
    .querySelector("#mark-all-read")
    .addEventListener("click", async () => {
      await markAllNotificationsRead(userEmail);
      load(); // recarrega a lista
    });

  load();

  return container;
};
