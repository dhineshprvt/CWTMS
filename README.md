# Campus Workforce Task Management System (CWTMS)

A complete, working full-stack project: Spring Boot + MySQL backend, React frontend, JWT
auth, role-based access for Admin / Supervisor / Worker, local file storage for proof
images/videos. 100% free and open-source — no cloud, no paid APIs.

```
campus-workforce-system/
├── backend/        Spring Boot (Maven) — runnable Java source, ready to build
├── frontend/        React (Vite) — runnable source, ready to npm install
├── database/        schema.sql + sample_data.sql
└── docs/             deep-dive design docs (entities, full API table, wireframes, viva prep)
```

## Prerequisites

- Java 17 (JDK)
- Maven 3.8+ (or use your IDE's bundled Maven)
- Node.js 18+ and npm
- MySQL Community Edition 8.x, running locally
- Git

## 1. Set up the database

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

This creates the `cwtms_db` database with all 5 tables and seeds demo accounts. Every demo
account uses the password **`Password@123`**:

| Username | Role |
|---|---|
| admin | ADMIN |
| supervisor1, supervisor2 | SUPERVISOR |
| worker1, worker2, worker3, worker4 | WORKER |

## 2. Run the backend

```bash
cd backend
# Edit src/main/resources/application.properties:
#   - spring.datasource.password -> your MySQL root password
#   - app.jwt.secret -> any long random string (a default is already filled in for local dev)

mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. Test it immediately:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password@123"}'
```

You should get back a JSON object containing a `token`. If you get a connection error,
double check MySQL is running and the credentials in `application.properties` match.

## 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on **http://localhost:5173**. Log in with any of the demo accounts above.

## What's already implemented in this codebase

- **Backend**: all 5 entities (`User`, `Task`, `TaskHistory`, `TaskAttachment`,
  `Notification`), full repository/service/controller layers, JWT authentication +
  Spring Security role-based authorization (`@PreAuthorize`), global exception handling,
  local file upload/serving (no cloud SDK), and the complete task lifecycle (create → assign
  → start → upload proof → submit → approve/reject/rework) with an audit trail written to
  `task_history` on every transition.
- **Frontend**: React Router with role-protected routes, Axios with a JWT interceptor,
  separate dashboards for Admin/Supervisor/Worker, sidebar navigation, stat cards, task
  create/edit/assign/search/filter, a review modal with photo/video gallery + status
  timeline, a multi-image + single-video upload page for Workers, and a reports page with a
  recharts bar chart plus a worker-performance table.

## What you should still do before your demo

1. **Read `docs/implementation_plan.md`** — it has the realistic build/verify order and a
   viva Q&A cheat sheet.
2. **Smoke-test the full workflow** end-to-end through the UI: log in as `supervisor1`,
   create and assign a task, log in as the assigned worker, start it, upload a photo, submit,
   then log back in as `supervisor1` to approve it.
3. **Check `backend/uploads/`** after an upload — your files should appear there on disk.
4. Consider polishing styling, adding pagination if your demo data grows, and recording a
   short screen capture for your portfolio (see `docs/implementation_plan.md` for tips).

## Reference documents (in `docs/`)

- `backend_design.md` — entity/DTO/service/controller code reference and security config
  explanation (matches the code in `backend/`)
- `frontend_design.md` — folder structure, routing, wireframes (matches `frontend/`)
- `api_reference.md` — every REST endpoint, required role, and sample JSON
- `implementation_plan.md` — build schedule + viva prep + portfolio tips
