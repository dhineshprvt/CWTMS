import axiosClient from '../api/axiosClient';

const notificationService = {
  getAll: (unreadOnly = false) => axiosClient.get('/notifications', { params: { unreadOnly } }),
  markRead: (id) => axiosClient.put(`/notifications/${id}/read`),
  markAllRead: () => axiosClient.put('/notifications/read-all'),
};

export default notificationService;
