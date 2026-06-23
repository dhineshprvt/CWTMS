# Implementation Plan — 2 Days, Hour by Hour

This assumes you already have: Java 17, Maven, Node.js, MySQL Community Edition, and Git
installed locally, and an IDE (IntelliJ IDEA Community / VS Code) ready.

## Day 1 — Database + Backend (≈8 hours)

| Time | Task |
|---|---|
| 0:00–0:30 | `git init`, create repo on GitHub, push an empty README. Install MySQL Workbench (free) if you want a GUI. |
| 0:30–1:00 | Run `database/schema.sql` in MySQL. Run `database/sample_data.sql`. Verify with `SELECT * FROM users;` |
| 1:00–1:30 | Generate Spring Boot project via `start.spring.io` (free, no account needed) with the dependencies listed in `backend_design.md`. Set up `application.properties`. |
| 1:30–2:30 | Create all enums and entity classes. Run the app — confirm Hibernate validates against your schema with no errors (`ddl-auto=validate`). |
| 2:30–3:30 | Repositories + DTOs (requests/responses) for User and Task. |
| 3:30–5:00 | Security: `JwtUtil`, `JwtAuthenticationFilter`, `CustomUserDetailsService`, `SecurityConfig`, `AuthController` with `/auth/login`. Test login with Postman against `admin` / `Password@123`. |
| 5:00–6:30 | `UserService` + `UserController` (Admin CRUD, reset password). Test every endpoint in Postman. |
| 6:30–8:00 | `TaskService` + `TaskController` (create, assign, status update, submit, review, search). Test the full workflow end-to-end via Postman: create → assign → start → submit → approve. |

**End-of-day-1 checkpoint:** you can log in as each of the 3 roles via Postman and drive a task
through its entire lifecycle using only REST calls.

## Day 2 — File Upload, Frontend, Polish (≈8–10 hours)

| Time | Task |
|---|---|
| 0:00–1:00 | `FileStorageService` + `WebConfig` static resource handler + the `/tasks/{id}/attachments` upload endpoint. Test uploading an image and a video in Postman; confirm the file lands in `backend/uploads/tasks/{id}/`. |
| 1:00–1:30 | `NotificationService` + `NotificationController`. Confirm notifications get created on assign/submit/review (check the `notifications` table). |
| 1:30–2:00 | `ReportService` + `ReportController` (worker performance, task summary) + dashboard stat endpoints. |
| 2:00–2:30 | `GlobalExceptionHandler`. Deliberately trigger a 403/404/400 in Postman to confirm clean JSON errors. |
| 2:30–3:00 | Scaffold React app (`npm create vite@latest`), install dependencies, set up `axiosClient.js` and `AuthContext`. |
| 3:00–3:30 | `LoginPage` + routing skeleton + `ProtectedRoute`. Confirm role-based redirect works for all 3 demo logins. |
| 3:30–4:30 | `DashboardLayout` (Sidebar + Topbar) + Admin pages (`AdminDashboard`, `ManageUsersPage`). |
| 4:30–6:00 | Supervisor pages: dashboard, `ManageTasksPage` (create/edit/assign/search/filter), review panel with the attachment gallery and history timeline. |
| 6:00–7:30 | Worker pages: dashboard, `MyTasksPage`, `TaskUploadPage` (multi-image + single video + remarks + submit). |
| 7:30–8:30 | `ReportsPage` with recharts. Wire up notifications bell + list. |
| 8:30–9:30 | Cross-role smoke test: full lifecycle through the UI only (no Postman) — Supervisor creates & assigns → Worker starts, uploads, submits → Supervisor reviews and approves/rejects → Admin creates a new worker account and resets a password. |
| 9:30–10:00 | Styling polish, README screenshots, `.gitignore` (exclude `uploads/`, `node_modules/`, `target/`), final commit & push. |

## Quick Setup Commands

```bash
# Database
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql

# Backend
cd backend
mvn clean install
mvn spring-boot:run        # http://localhost:8080

# Frontend
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## What to Demo in Your Viva (suggested order)

1. **Architecture slide** — show the README diagram, explain the 3-tier flow (React → Spring
   Boot → MySQL) and why JWT is stateless (no server-side session storage needed).
2. **Login as each role** — show the JWT in the browser's Network tab / localStorage; explain
   the `@PreAuthorize` annotations and how the same backend rejects a Worker calling an
   Admin-only endpoint (show a live 403).
3. **Full task lifecycle live**: Supervisor creates and assigns a task → Worker starts it,
   uploads a photo, adds remarks, submits → Supervisor opens the review panel, sees the photo
   and the status history timeline, approves it.
4. **Task history table** — query `SELECT * FROM task_history WHERE task_id = X` live in MySQL
   Workbench to show the audit trail behind the timeline UI.
5. **Notifications** — show a new row appearing in the `notifications` table the moment a task
   is assigned/submitted/reviewed.
6. **Reports page** — worker performance numbers, explain the JPQL/aggregation behind it.
7. **Code walkthrough** — open one entity, one repository, one service method, one controller
   method, and the `GlobalExceptionHandler` to show the layered architecture end-to-end.

## Likely Viva Questions (and where the answer lives)

| Question | Answer location |
|---|---|
| "Why JWT instead of sessions?" | Stateless, scales without server-side session storage; backend_design.md §9 |
| "How do you stop a worker from approving their own task?" | `@PreAuthorize` + ownership check in `TaskService.reviewTask` |
| "How do you prevent a worker accessing someone else's task?" | Service-layer check: `task.getAssignedTo().getId().equals(worker.getId())` |
| "Where are uploaded files stored?" | Local filesystem under `backend/uploads/`, served via `WebConfig`'s static resource handler — no cloud cost |
| "How do you track task history?" | `task_history` table, one row per status transition, written inside the same `@Transactional` service method that changes the task |
| "How would you scale this beyond a demo?" | Add pagination (`Pageable` in repositories), move file storage to a CDN/object store, add Redis-based rate limiting, add refresh tokens — explain you scoped this version intentionally for a free, local, academic build |

## Portfolio Presentation Tips

- Push the repo to GitHub with a clear top-level README (you already have one) and screenshots
  of each dashboard in a `/docs/screenshots` folder.
- Record a 2–3 minute screen capture of the full task lifecycle (free tools: OBS Studio,
  or Windows/Mac built-in screen recorder) and link it from the README.
- Mention the specific technical depth recruiters look for: layered architecture, JWT +
  role-based method security, normalized relational schema with FKs, audit trail via a history
  table, and a working file-upload pipeline — all of which this project demonstrates.
