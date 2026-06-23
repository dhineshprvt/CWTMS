import axiosClient from '../api/axiosClient';

const reportService = {
  workerPerformance: () => axiosClient.get('/reports/worker-performance'),
  taskSummary: () => axiosClient.get('/reports/task-summary'),
};

export default reportService;
