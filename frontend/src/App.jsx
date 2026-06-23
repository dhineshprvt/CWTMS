import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LoginPage from './pages/LoginPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';

import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import ManageTasksPage from './pages/supervisor/ManageTasksPage';
import ReportsPage from './pages/supervisor/ReportsPage';

import WorkerDashboard from './pages/worker/WorkerDashboard';
import MyTasksPage from './pages/worker/MyTasksPage';
import TaskUploadPage from './pages/worker/TaskUploadPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsersPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['SUPERVISOR']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/supervisor" element={<SupervisorDashboard />} />
              <Route path="/supervisor/tasks" element={<ManageTasksPage />} />
              <Route path="/supervisor/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/worker" element={<WorkerDashboard />} />
              <Route path="/worker/tasks" element={<MyTasksPage />} />
              <Route path="/worker/tasks/:id/upload" element={<TaskUploadPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
