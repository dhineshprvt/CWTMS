# API Reference — REST Endpoints

Base URL: `http://localhost:8080/api`
Every endpoint except `/auth/login` requires header: `Authorization: Bearer <jwt>`

## 1. Auth

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| POST | `/auth/login` | Public | `{username, password}` | `{token, userId, fullName, role}` |
| GET | `/auth/me` | Any | — | current user's profile |

## 2. User Management (Admin only)

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| GET | `/admin/users` | ADMIN | query: `role`, `status` (optional filters) | `List<UserResponse>` |
| GET | `/admin/users/{id}` | ADMIN | — | `UserResponse` |
| POST | `/admin/users` | ADMIN | `CreateUserRequest` | `UserResponse` (201) |
| PUT | `/admin/users/{id}` | ADMIN | `UpdateUserRequest` (name, email, phone, role, status) | `UserResponse` |
| DELETE | `/admin/users/{id}` | ADMIN | — | 204, sets status=INACTIVE (soft delete) |
| PUT | `/admin/users/{id}/reset-password` | ADMIN | `{newPassword}` | 200 OK |

## 3. Task Management

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| POST | `/tasks` | SUPERVISOR | `CreateTaskRequest` | `TaskResponse` (201) |
| PUT | `/tasks/{id}` | SUPERVISOR (owner) | `CreateTaskRequest` (edit fields) | `TaskResponse` |
| DELETE | `/tasks/{id}` | SUPERVISOR (owner) | — | 204 |
| PUT | `/tasks/{id}/assign` | SUPERVISOR (owner) | `{workerId}` | `TaskResponse` |
| GET | `/tasks` | SUPERVISOR, WORKER | query: `status`, `category`, `keyword` | `List<TaskResponse>` (filtered to own tasks for WORKER) |
| GET | `/tasks/my` | WORKER | — | `List<TaskResponse>` assigned to caller |
| GET | `/tasks/{id}` | SUPERVISOR (owner), WORKER (assignee) | — | `TaskResponse` |
| PUT | `/tasks/{id}/status` | WORKER (assignee) | `{status, remarks}` — only `IN_PROGRESS` allowed here | `TaskResponse` |
| POST | `/tasks/{id}/submit` | WORKER (assignee) | `{remarks}` → sets `SUBMITTED_FOR_REVIEW` | `TaskResponse` |
| PUT | `/tasks/{id}/review` | SUPERVISOR (owner) | `{decision, remarks}` — `APPROVED`/`REJECTED`/`REWORK_REQUIRED` | `TaskResponse` |
| GET | `/tasks/{id}/history` | SUPERVISOR (owner), WORKER (assignee) | — | `List<TaskHistoryResponse>` |

## 4. File Upload / Attachments

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| POST | `/tasks/{id}/attachments` | WORKER (assignee) | `multipart/form-data`: `images[]` (multiple), `video` (one, optional) | `List<AttachmentResponse>` |
| GET | `/tasks/{id}/attachments` | SUPERVISOR (owner), WORKER (assignee) | — | `List<AttachmentResponse>` |
| DELETE | `/tasks/{id}/attachments/{attachmentId}` | WORKER (uploader), before submission only | — | 204 |
| GET | `/uploads/tasks/{taskId}/{filename}` | Any authenticated | — | raw file (served as static resource) |

> Frontend tip: build `<img src="http://localhost:8080/{filePath}">` directly from the
> `filePath` stored in the DB (e.g. `uploads/tasks/3/photo.jpg`) since `WebConfig` exposes
> `/uploads/**` as a static resource handler.

## 5. Notifications

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| GET | `/notifications` | Any | query: `unreadOnly` (optional) | `List<NotificationResponse>` |
| PUT | `/notifications/{id}/read` | Any (owner) | — | 200 OK |
| PUT | `/notifications/read-all` | Any | — | 200 OK |

## 6. Reports (Supervisor only)

| Method | Endpoint | Role | Body | Response |
|---|---|---|---|---|
| GET | `/reports/worker-performance` | SUPERVISOR | query: `from`, `to` (optional date range) | `List<WorkerPerformanceResponse>` — assigned/completed/approved/rejected counts, avg turnaround time per worker |
| GET | `/reports/task-summary` | SUPERVISOR | — | counts grouped by `status` and by `category` |

## 7. Dashboard Statistics Cards

| Method | Endpoint | Role | Response |
|---|---|---|---|
| GET | `/dashboard/admin-stats` | ADMIN | `{totalUsers, totalSupervisors, totalWorkers, activeUsers}` |
| GET | `/dashboard/supervisor-stats` | SUPERVISOR | `{totalTasksCreated, pendingReview, approved, rejected, inProgress}` |
| GET | `/dashboard/worker-stats` | WORKER | `{assigned, inProgress, submitted, approved, rejected}` |

---

## Sample request/response

**Login**
```json
POST /api/auth/login
{ "username": "supervisor1", "password": "Password@123" }

200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "userId": 2,
  "fullName": "Ramesh Kumar",
  "role": "SUPERVISOR"
}
```

**Create task**
```json
POST /api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
{
  "title": "Fix flickering tube light",
  "description": "Tube light in Room 105 flickers intermittently.",
  "category": "ELECTRICAL_MAINTENANCE",
  "location": "Block A - Room 105",
  "assignedToId": 6,
  "dueDate": "2026-06-25"
}

201 Created
{
  "id": 9,
  "title": "Fix flickering tube light",
  "status": "ASSIGNED",
  "category": "ELECTRICAL_MAINTENANCE",
  "assignedToName": "Suresh Babu",
  "createdByName": "Priya Sharma",
  "dueDate": "2026-06-25",
  "createdAt": "2026-06-17T10:15:30"
}
```

**Worker submits for review**
```json
POST /api/tasks/9/submit
Authorization: Bearer <worker-token>
{ "remarks": "Replaced the ballast, light is working fine now." }

200 OK
{ "id": 9, "status": "SUBMITTED_FOR_REVIEW", ... }
```

**Supervisor approves**
```json
PUT /api/tasks/9/review
Authorization: Bearer <supervisor-token>
{ "decision": "APPROVED", "remarks": "Verified, good work." }

200 OK
{ "id": 9, "status": "APPROVED", ... }
```

**Error response shape (from GlobalExceptionHandler)**
```json
403 Forbidden
{ "status": 403, "message": "This task is not assigned to you." }
```
