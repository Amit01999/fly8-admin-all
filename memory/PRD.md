# Fly8 - International Student Support Platform

## Product Requirements Document (PRD)

### Original Problem Statement
Build a full-stack SaaS platform named "Fly8" for international student support. The platform requires a role-based architecture with four distinct dashboards: Student, Super Admin, Counselor, and Agent.

### Core Requirements
1. **Four Dashboards:**
   - **Student:** View application progress on horizontal journey timeline, manage profile
   - **Super Admin:** Full control - manage users, assign roles, set commissions, view global metrics
   - **Counselor:** Manage assigned students, update service progress, assign agents
   - **Agent:** Source students, track assigned students/services, monitor commission earnings

2. **Authentication:** Secure JWT-based login and signup with role-based access control
3. **Student Onboarding:** Multi-step process (Country & Service selection, Personal Info)
4. **Tech Stack:** React frontend + FastAPI backend + MongoDB (Note: User originally requested Express.js but platform supports FastAPI)

---

## What's Been Implemented

### Completed Features (as of January 12, 2026)

#### ✅ Authentication System
- JWT-based authentication with role-based access control (RBAC)
- Login/Signup functionality for all user roles
- Protected routes for each dashboard
- Token-based session management (7-day expiry)

#### ✅ Student Dashboard (Complete)
- Horizontal journey timeline showing application progress
- Profile management page
- Service exploration page
- Track services page
- Account settings page
- Multi-step onboarding flow

#### ✅ Super Admin Dashboard (Complete)
- **Dashboard Overview:** Metrics cards (Total Students, Counselors, Agents, Applications)
- **Manage Students:** Table view with search, filter, status badges
- **Manage Counselors:** Grid view of counselors with stats
- **Manage Agents:** Grid view with commission tracking
- **Notifications:** Notification center with read/unread states
- **Assignments:** Student-counselor assignment management
- **Settings:** Platform configuration (commission rates, alerts)
- **Sidebar Navigation:** All links working correctly

#### ✅ Backend API (FastAPI)
- `/api/auth/signup` - User registration
- `/api/auth/login` - User authentication
- `/api/auth/me` - Get current user
- `/api/admin/metrics` - Dashboard metrics
- `/api/admin/students` - List all students
- `/api/admin/counselors` - List all counselors
- `/api/admin/agents` - List all agents
- `/api/admin/users` - Create new users (counselor/agent)
- `/api/students/profile` - Get student profile
- `/api/students/onboarding` - Complete onboarding
- `/api/students/applications` - Get student applications
- `/api/services/` - List available services
- `/api/services/apply` - Apply for a service

#### ✅ Database Schema (MongoDB)
- Users collection (all roles)
- Students collection (student profiles)
- Services collection (available services)
- Service Applications collection
- Notifications collection

---

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@fly8.com | password123 |
| Student | john@student.com | password123 |
| Counselor | counselor@fly8.com | password123 |
| Agent | agent@fly8.com | password123 |

---

## Prioritized Backlog

### P0 - Critical (Next Priority)
- [ ] Counselor Dashboard implementation (currently placeholder)
- [ ] Agent Dashboard implementation (currently placeholder)

### P1 - High Priority
- [ ] Full Socket.io real-time notifications integration
- [ ] Commission calculation and tracking system
- [ ] Student-Counselor assignment workflow

### P2 - Medium Priority
- [ ] Stripe integration for commission payouts
- [ ] Document upload functionality
- [ ] University database and search

### P3 - Low Priority / Future
- [ ] Two-factor authentication
- [ ] Email notifications (SendGrid/Resend)
- [ ] Audit logging UI
- [ ] Mobile responsive optimization

---

## Technical Architecture

```
/app
├── backend/
│   ├── server.py          # FastAPI main server with all routes
│   ├── .env               # Environment variables (MONGO_URL, DB_NAME, JWT_SECRET)
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/     # SuperAdminDashboard.jsx
    │   │   ├── auth/      # Login.jsx, Signup.jsx
    │   │   ├── dashboard/ # StudentDashboard.jsx
    │   │   ├── layout/    # DashboardLayout.jsx, AdminLayout.jsx
    │   │   └── ui/        # Shadcn components
    │   ├── pages/
    │   │   ├── admin/     # ManageStudents, ManageCounselors, ManageAgents, etc.
    │   │   └── student/   # ExploreServices, TrackServices, MyProfile, etc.
    │   ├── context/       # AuthContext.jsx, SocketContext.jsx
    │   └── App.js         # Main routing
    ├── .env               # REACT_APP_BACKEND_URL
    └── package.json
```

---

## Known Limitations / Mocked Features
1. **Notifications:** Using mock data on admin notifications page (Socket.io not fully integrated)
2. **Settings:** Admin settings page simulates save (no backend endpoint)
3. **Universities:** Hardcoded count of 350 (no universities collection)
4. **Commission payouts:** No Stripe integration yet

---

## Notes for Next Session
- The platform runs FastAPI (uvicorn) for backend, not Express.js
- Supervisor configuration is read-only - always use server.py for backend
- All API routes must be prefixed with `/api`
- MongoDB collections: users, students, services, service_applications, notifications
