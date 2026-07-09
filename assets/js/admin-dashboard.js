document.addEventListener('DOMContentLoaded', async () => {
  const notificationList = document.getElementById('notificationList');
  const notificationBadge = document.getElementById('notificationBadge');

  async function loadNotifications() {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (!data.success) throw new Error('Failed to load notifications');
      const notifications = data.notifications || [];
      const unreadCount = notifications.filter((item) => !item.read).length;
      notificationBadge.textContent = unreadCount;
      notificationList.innerHTML = notifications.length ? notifications.map((item) => `
        <li class="notification-item ${item.read ? '' : 'unread'}">
          <div>
            <strong>${item.title}</strong>
            <div>${item.message}</div>
            <div class="muted">${new Date(item.createdAt).toLocaleString()}</div>
          </div>
          ${item.read ? '' : `<button data-id="${item._id}">Mark as read</button>`}
        </li>
      `).join('') : '<li class="notification-item">No notifications yet.</li>';

      notificationList.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
          loadNotifications();
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadNotifications();
});
