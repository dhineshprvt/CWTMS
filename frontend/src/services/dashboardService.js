import axiosClient from '../api/axiosClient';

const dashboardService = {
  adminStats: () => axiosClient.get('/dashboard/admin-stats'),
  supervisorStats: () => axiosClient.get('/dashboard/supervisor-stats'),
  workerStats: () => axiosClient.get('/dashboard/worker-stats'),
};

export default dashboardService;
