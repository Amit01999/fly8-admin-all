# Fly8 - International Student Support Platform

## Overview
Fly8 is a production-ready SaaS platform for managing international student applications, counselor assignments, agent commissions, and payment processing.

## Features

### Core Functionality
- **Multi-role Authentication** (Student, Agent, Counselor, Super Admin)
- **Student Onboarding** (3-step process)
- **Journey Timeline** (8-step visual progress tracker)
- **Real-time Notifications** (Socket.io)
- **Commission Management** (Agent earnings tracking)
- **Payment Processing** (Integrated payment system)
- **Audit Logging** (Complete activity tracking)
- **Document Management** (File uploads and notes)

### User Roles

#### Student
- Complete onboarding process
- Apply for 8 different services
- Track application progress via horizontal timeline
- View assigned counselor/agent
- Make payments
- Receive real-time updates

#### Agent
- View assigned students
- Track commission earnings
- Request payouts
- Real-time commission notifications
- Access detailed earning reports

#### Counselor
- Manage assigned students
- Update application statuses
- Add notes and documents
- Track service progress

#### Super Admin
- Full system control
- Assign counselors and agents
- Approve commissions
- Process payouts
- View analytics and metrics
- Access audit logs
- Manage all users

## Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose
- **Socket.io** (Real-time notifications)
- **JWT** (Authentication)
- **bcrypt** (Password hashing)

### Frontend
- **React 19**
- **React Router v7**
- **Tailwind CSS**
- **Framer Motion** (Animations)
- **Socket.io Client**
- **Axios** (API calls)
- **Shadcn/UI** (Component library)
- **Lucide React** (Icons)

## Project Structure

```
fly8/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Service.js
│   │   ├── ServiceApplication.js
│   │   ├── Commission.js
│   │   ├── Payment.js
│   │   ├── Notification.js
│   │   ├── AuditLog.js
│   │   └── University.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── services.js
│   │   ├── counselors.js
│   │   ├── agents.js
│   │   ├── admin.js
│   │   ├── notifications.js
│   │   ├── payments.js
│   │   ├── audit.js
│   │   └── universities.js
│   ├── middleware/       # Auth & validation
│   │   └── auth.js
│   ├── socket/          # Socket.io setup
│   │   └── socketManager.js
│   ├── utils/           # Helper functions
│   │   └── auditLogger.js
│   ├── server_express.js # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # Login, Signup
│   │   │   ├── onboarding/    # 3-step onboarding
│   │   │   ├── dashboard/     # Student dashboard
│   │   │   ├── admin/         # Super admin dashboard
│   │   │   ├── counselor/     # Counselor dashboard
│   │   │   ├── agent/         # Agent dashboard
│   │   │   ├── layout/        # Shared layouts
│   │   │   └── ui/            # Shadcn components
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── utils/
│   │   │   └── api.js         # Axios instance
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
└── README.md
```

## Environment Variables

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=fly8_database
CORS_ORIGINS=*
JWT_SECRET=your-secret-key-here
RESEND_API_KEY=your-resend-key
SENDER_EMAIL=onboarding@resend.dev
PORT=8001
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB 6+
- Yarn package manager

### Backend Setup
```bash
cd backend
yarn install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start server
node server_express.js
```

### Frontend Setup
```bash
cd frontend
yarn install

# Create .env file
cp .env.example .env
# Edit .env with your backend URL

# Start development server
yarn start
```

### Initialize Services
```bash
curl -X POST http://localhost:8001/api/services/init
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Students
- `POST /api/students/onboarding` - Complete onboarding
- `GET /api/students/profile` - Get student profile
- `POST /api/students/apply-services` - Apply for services
- `GET /api/students/my-applications` - Get applications

### Services
- `GET /api/services` - List all services
- `POST /api/services/init` - Initialize 8 services

### Admin
- `GET /api/admin/metrics` - Dashboard metrics
- `GET /api/admin/students` - All students
- `GET /api/admin/counselors` - All counselors
- `GET /api/admin/agents` - All agents
- `PUT /api/admin/students/:id/assign-counselor` - Assign counselor
- `PUT /api/admin/students/:id/assign-agent` - Assign agent
- `GET /api/admin/commissions` - All commissions
- `PUT /api/admin/commissions/:id/approve` - Approve commission
- `POST /api/admin/commissions/:id/payout` - Process payout

### Counselors
- `GET /api/counselors/my-students` - Assigned students
- `PUT /api/counselors/applications/:id` - Update application status

### Agents
- `GET /api/agents/my-students` - Assigned students
- `GET /api/agents/commissions` - Commission data
- `POST /api/agents/commissions/:id/request-payout` - Request payout

### Payments
- `POST /api/payments/create` - Create payment
- `GET /api/payments/my-payments` - Student payments
- `POST /api/payments/:id/complete` - Complete payment
- `GET /api/payments/all` - All payments (admin)

### Audit Logs
- `GET /api/audit` - All audit logs (admin)
- `GET /api/audit/user/:userId` - User activity
- `GET /api/audit/stats` - Audit statistics

### Notifications
- `GET /api/notifications` - User notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

## Real-time Events (Socket.io)

### Client Events
- `connect` - Socket connected
- `disconnect` - Socket disconnected
- `new_notification` - New notification received
- `service_application` - New service application
- `commission_paid` - Commission payment received

### Server Emits
- `emitToUser(userId, event, data)` - Send to specific user
- `emitToRole(role, event, data)` - Send to all users with role
- `emitToAdmins(event, data)` - Send to all admins

## Testing

### Create Test Users
```bash
# Student
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@student.com","password":"password123","role":"student"}'

# Super Admin
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Admin","lastName":"User","email":"admin@fly8.com","password":"admin123","role":"super_admin"}'

# Counselor
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Sarah","lastName":"Counselor","email":"counselor@fly8.com","password":"counselor123","role":"counselor"}'

# Agent
curl -X POST http://localhost:8001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Mike","lastName":"Agent","email":"agent@fly8.com","password":"agent123","role":"agent"}'
```

## Production Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Add environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variable `REACT_APP_BACKEND_URL`
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URL` in backend .env

## Key Features Implemented

✅ Multi-role authentication system
✅ Student onboarding (3 steps)
✅ Horizontal journey timeline (8 services)
✅ Real-time notifications (Socket.io)
✅ Commission tracking and approval
✅ Payment processing
✅ Audit logging for all actions
✅ Role-based access control
✅ Document and note management
✅ Counselor/Agent assignment system
✅ Admin analytics dashboard
✅ Responsive design
✅ Production-ready error handling

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- CORS configuration
- Input validation
- Audit logging
- Secure Socket.io connections

## Future Enhancements

- Stripe Connect integration for payouts
- Email notifications (Resend)
- Document upload to S3
- Advanced analytics
- Mobile app
- Multi-language support
- Video call integration
- Calendar scheduling

## Support

For issues or questions:
- Email: support@fly8.global
- Documentation: https://docs.fly8.global

## License

MIT License - See LICENSE file for details