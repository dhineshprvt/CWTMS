# Frontend Design — React

## 1. Project Setup

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios bootstrap react-icons recharts
```

All free/open-source (MIT-licensed). `recharts` is for the small bar/pie charts on the
reports page; `react-icons` for sidebar icons; Bootstrap 5 (or Tailwind, your preference) for
layout/styling without writing every utility class by hand.

## 2. Folder Structure

```
frontend/src/
├── main.jsx
├── App.jsx                       # router setup
├── api/
│   └── axiosClient.js             # axios instance + JWT interceptor
├── context/
│   └── AuthContext.jsx            # holds token, role, user; login()/logout()
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   └── DashboardLayout.jsx    # sidebar + topbar + <Outlet/>
│   ├── common/
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── SearchFilterBar.jsx
│   │   ├── Pagination.jsx
│   │   └── ProtectedRoute.jsx     # role-gated route wrapper
│   ├── tasks/
│   │   ├── TaskCard.jsx
│   │   ├── TaskTable.jsx
│   │   ├── TaskForm.jsx           # create/edit
│   │   ├── TaskDetailPanel.jsx
│   │   ├── TaskHistoryTimeline.jsx
│   │   └── FileUploadBox.jsx
│   └── users/
│       ├── UserTable.jsx
│       └── UserForm.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageUsersPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── supervisor/
│   │   ├── SupervisorDashboard.jsx
│   │   ├── CreateTaskPage.jsx
│   │   ├── ManageTasksPage.jsx
│   │   ├── ReviewTaskPage.jsx
│   │   └── ReportsPage.jsx
│   └── worker/
│       ├── WorkerDashboard.jsx
│       ├── MyTasksPage.jsx
│       ├── TaskUploadPage.jsx
│       └── NotificationsPage.jsx
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── taskService.js
│   ├── notificationService.js
│   └── reportService.js
├── utils/
│   ├── statusColors.js
│   └── dateFormat.js
└── styles/
    └── global.css
```

## 3. Axios Client with JWT Interceptor

```javascript
// api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({ baseURL: 'http://localhost:8080/api' });

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cwtms_token'); // see note below
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cwtms_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
```

> Note: storing the JWT in `localStorage` is the standard, simplest approach for an academic
> project like this and is fine to present in a viva. If you want to mention the more
> production-grade alternative, say so verbally (httpOnly cookie + refresh token) — but don't
> over-engineer it for a 1–2 day build.

## 4. Routing (`App.jsx`)

```jsx
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

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

```jsx
// components/common/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return <Outlet />;
}
```

## 5. Pages Per Role — what each one does

**Admin**
- `AdminDashboard` — stat cards (total users, supervisors, workers, active accounts)
- `ManageUsersPage` — table of all users with create/edit/delete/reset-password actions and a
  role filter; create/edit opens a modal `UserForm`

**Supervisor**
- `SupervisorDashboard` — stat cards (tasks created, pending review, approved, rejected) +
  a small bar chart of tasks by category (recharts)
- `CreateTaskPage` / `ManageTasksPage` — create task form, table with search/filter
  (status, category, keyword), assign-to-worker dropdown, edit/delete
- `ReviewTaskPage` (or a panel inside ManageTasksPage) — shows uploaded photos/videos, worker
  remarks, task history timeline, and Approve / Reject / Request Rework buttons
- `ReportsPage` — worker performance table (assigned/completed/approved/rejected/avg time) and
  a task-summary chart

**Worker**
- `WorkerDashboard` — stat cards (assigned, in progress, submitted, approved, rejected)
- `MyTasksPage` — list/cards of assigned tasks with a "Start" button (→ IN_PROGRESS) and an
  "Upload & Submit" button
- `TaskUploadPage` — multi-image picker + single optional video picker + remarks textarea +
  Submit for Review button

## 6. Wireframes (text layout — translate directly into JSX/CSS grid)

**Shared shell (`DashboardLayout`)**
```
┌───────────────────────────────────────────────────────────┐
│ Topbar:  CWTMS logo        [🔔 3]   Ramesh Kumar ▾  Logout  │
├───────────┬───────────────────────────────────────────────┤
│ Sidebar   │  <page content / Outlet>                       │
│ • Dashboard│                                                │
│ • Tasks    │                                                │
│ • Reports  │                                                │
│ • Logout   │                                                │
└───────────┴───────────────────────────────────────────────┘
```

**Supervisor Dashboard**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Created  │ Pending  │ Approved │ Rejected │   <- stat cards
│   24     │ Review:5 │   16     │    3     │
└──────────┴──────────┴──────────┴──────────┘
┌─────────────────────────────────────────────┐
│  Tasks by Category (bar chart)               │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│  Recent submissions awaiting review (table)  │
│  Title | Worker | Category | Submitted At    │ [Review]
└─────────────────────────────────────────────┘
```

**Manage Tasks (Supervisor)**
```
[Search box] [Status ▾] [Category ▾]                [+ New Task]
┌─────────────────────────────────────────────────────────────┐
│ Title          | Worker     | Category   | Status   | Action │
│ Clean Room 204 | Arjun Singh| Lab Clean. | APPROVED | View   │
│ Restroom B     | Lakshmi    | Restroom   | SUBMITTED| Review │
└─────────────────────────────────────────────────────────────┘
```

**Review Task panel (opened from "Review")**
```
┌───────────────────────────────┬───────────────────────────┐
│ Task: Restroom deep clean - B  │  Status history (timeline) │
│ Worker: Lakshmi Devi           │  • Assigned  10 Jun        │
│ Remarks: "Cleaning completed." │  • In Progress 10 Jun      │
│                                 │  • Submitted   18 Jun      │
│  [img1] [img2] [img3]          │                             │
│                                 │                             │
│  Remarks (for worker): [____]  │                             │
│  [Approve] [Reject] [Rework]   │                             │
└───────────────────────────────┴───────────────────────────┘
```

**Worker — My Tasks**
```
┌─────────────────────────────────────────────┐
│ Clean Room 301              [ASSIGNED]       │
│ Classroom Cleaning · Due 20 Jun              │
│ [Start Task]                                 │
├─────────────────────────────────────────────┤
│ Fix flickering light         [IN_PROGRESS]   │
│ Electrical Maintenance · Due 19 Jun          │
│ [Upload Proof & Submit]                      │
└─────────────────────────────────────────────┘
```

**Worker — Upload page**
```
Task: Fix flickering tube light
┌─────────────────────────────────────────────┐
│  📷 Drag photos here or click to browse       │
│  [thumb][thumb][thumb]              (multi)   │
│                                                │
│  🎥 Drag a video here or click to browse       │
│  [video thumb]                       (single) │
│                                                │
│  Remarks: [______________________________]    │
│                                                │
│              [ Submit for Review ]            │
└─────────────────────────────────────────────┘
```

**Admin — Manage Users**
```
[Search] [Role ▾]                              [+ New User]
┌──────────────────────────────────────────────────────────┐
│ Name        | Username   | Role        | Status | Action  │
│ Arjun Singh | worker1    | WORKER      | ACTIVE | Edit/Del│
│ Ramesh Kumar| supervisor1| SUPERVISOR  | ACTIVE | Edit/Del│
└──────────────────────────────────────────────────────────┘
                                          [Reset Password] per row
```

## 7. Status Badge Colors (consistent across the app)

```javascript
// utils/statusColors.js
export const STATUS_COLORS = {
  ASSIGNED: '#6c757d',             // gray
  IN_PROGRESS: '#0d6efd',          // blue
  SUBMITTED_FOR_REVIEW: '#fd7e14', // orange
  APPROVED: '#198754',             // green
  REJECTED: '#dc3545',             // red
  REWORK_REQUIRED: '#ffc107',      // amber
};
```
