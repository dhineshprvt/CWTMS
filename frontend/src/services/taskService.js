import axiosClient from '../api/axiosClient';

const taskService = {
  search: (params) => axiosClient.get('/tasks', { params }),
  myTasks: () => axiosClient.get('/tasks/my'),
  getWorkers: () => axiosClient.get('/tasks/workers'),
  getById: (id) => axiosClient.get(`/tasks/${id}`),
  create: (payload) => axiosClient.post('/tasks', payload),
  update: (id, payload) => axiosClient.put(`/tasks/${id}`, payload),
  remove: (id) => axiosClient.delete(`/tasks/${id}`),
  assign: (id, workerId) => axiosClient.put(`/tasks/${id}/assign`, { workerId }),
  review: (id, decision, remarks) => axiosClient.put(`/tasks/${id}/review`, { decision, remarks }),
  updateStatus: (id, status, remarks) => axiosClient.put(`/tasks/${id}/status`, { status, remarks }),
  submit: (id, remarks) => axiosClient.post(`/tasks/${id}/submit`, { remarks }),
  history: (id) => axiosClient.get(`/tasks/${id}/history`),
  attachments: (id) => axiosClient.get(`/tasks/${id}/attachments`),
  uploadAttachments: (id, formData) =>
    axiosClient.post(`/tasks/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default taskService;
