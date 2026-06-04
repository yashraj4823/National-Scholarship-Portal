# NSP Backend

Node.js + Express + MongoDB REST API for the National Scholarship Portal.

## Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set your MongoDB URI and JWT secret.

In production, also set `FRONTEND_URL` to your deployed frontend origin and `MONGO_TLS=true` if your MongoDB provider requires TLS/SSL (such as Atlas).

## Seed default data (schemes + admin accounts)

```bash
node seed.js
```

## Run

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

---

## API Overview

### Auth
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Any logged-in user |

### Students
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/students/register` | Public |
| GET | `/api/students/profile` | Student |
| PUT | `/api/students/profile` | Student |

### Institutes
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/institutes/register` | Public |
| GET | `/api/institutes` | Public (approved list) |
| GET | `/api/institutes/profile` | Institute |

### Applications
| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/applications` | Student |
| GET | `/api/applications/my` | Student |
| GET | `/api/applications/institute` | Institute |
| PUT | `/api/applications/:id/institute-action` | Institute |
| GET | `/api/applications/:id` | Any auth |

### Schemes
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/schemes` | Public |
| GET | `/api/schemes/:schemeId` | Public |
| POST | `/api/schemes` | Ministry |
| PUT | `/api/schemes/:schemeId` | Ministry |
| PATCH | `/api/schemes/:schemeId/toggle` | Ministry |

### State Nodal Officer
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/state/applications` | State |
| PUT | `/api/state/applications/:id` | State |
| GET | `/api/state/institutes` | State |
| PUT | `/api/state/institutes/:id` | State |

### Ministry
| Method | Route | Access |
|--------|-------|--------|
| GET | `/api/ministry/stats` | Ministry |
| GET | `/api/ministry/applications` | Ministry |
| PUT | `/api/ministry/applications/:id` | Ministry |
| GET | `/api/ministry/institutes` | Ministry |
| PUT | `/api/ministry/institutes/:id` | Ministry |

---

## Application Status Flow

```
Student submits → pending
  → Institute verifies → institute_verified
    → State forwards → state_forwarded
      → Ministry grants → granted
  (any step can be rejected)
```

## Default Admin Credentials (after seeding)

| Role | Username | Password |
|------|----------|----------|
| State Nodal Officer | state_mah | state@123 |
| Ministry | ministry_admin | ministry@123 |
