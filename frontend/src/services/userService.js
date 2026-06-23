import axiosClient from '../api/axiosClient';

const userService = {
  getAll: (role) => axiosClient.get('/admin/users', { params: role ? { role } : {} }),
  getById: (id) => axiosClient.get(`/admin/users/${id}`),
  create: (payload) => axiosClient.post('/admin/users', payload),
  update: (id, payload) => axiosClient.put(`/admin/users/${id}`, payload),
  remove: (id) => axiosClient.delete(`/admin/users/${id}`),
  resetPassword: (id, newPassword) =>
    axiosClient.put(`/admin/users/${id}/reset-password`, { newPassword }),
};

export default userService;
