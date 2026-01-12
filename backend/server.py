from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'fly8_super_secret_jwt_key_2024')
JWT_ALGORITHM = 'HS256'

# Create the main app
app = FastAPI(title="Fly8 API", version="1.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
admin_router = APIRouter(prefix="/admin", tags=["Admin"])
student_router = APIRouter(prefix="/students", tags=["Students"])
service_router = APIRouter(prefix="/services", tags=["Services"])

security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============== MODELS ==============

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    userId: str
    email: str
    firstName: str
    lastName: str
    role: str
    phone: Optional[str] = None
    country: Optional[str] = None

class TokenResponse(BaseModel):
    message: str
    token: str
    user: UserResponse

class OnboardingData(BaseModel):
    interestedCountries: List[str] = []
    selectedServices: List[str] = []
    intake: Optional[str] = None
    preferredDestination: Optional[str] = None

class ServiceCreate(BaseModel):
    name: str
    description: str
    category: str
    estimatedDuration: Optional[str] = None
    price: Optional[float] = None

class ServiceApplicationCreate(BaseModel):
    serviceId: str

# ============== UTILITY FUNCTIONS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, role: str) -> str:
    payload = {
        'userId': user_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({'userId': payload['userId']}, {'_id': 0, 'password': 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(allowed_roles: List[str]):
    async def role_checker(user: dict = Depends(get_current_user)):
        if user['role'] not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return role_checker

# ============== AUTH ROUTES ==============

@auth_router.post("/signup", response_model=TokenResponse)
async def signup(data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({'email': data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        'userId': user_id,
        'email': data.email.lower(),
        'password': hash_password(data.password),
        'firstName': data.firstName,
        'lastName': data.lastName,
        'role': data.role,
        'isActive': True,
        'createdAt': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create student record if role is student
    if data.role == 'student':
        student_doc = {
            'studentId': str(uuid.uuid4()),
            'userId': user_id,
            'interestedCountries': [],
            'selectedServices': [],
            'onboardingCompleted': False,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.students.insert_one(student_doc)
    
    token = create_token(user_id, data.role)
    
    return {
        'message': 'User created successfully',
        'token': token,
        'user': {
            'userId': user_id,
            'email': data.email.lower(),
            'firstName': data.firstName,
            'lastName': data.lastName,
            'role': data.role
        }
    }

@auth_router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    user = await db.users.find_one({'email': data.email.lower()})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(data.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.users.update_one(
        {'userId': user['userId']},
        {'$set': {'lastLogin': datetime.now(timezone.utc).isoformat()}}
    )
    
    token = create_token(user['userId'], user['role'])
    
    return {
        'message': 'Login successful',
        'token': token,
        'user': {
            'userId': user['userId'],
            'email': user['email'],
            'firstName': user['firstName'],
            'lastName': user['lastName'],
            'role': user['role'],
            'phone': user.get('phone'),
            'country': user.get('country')
        }
    }

@auth_router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    # If student, check onboarding status
    onboarding_completed = True
    if user['role'] == 'student':
        student = await db.students.find_one({'userId': user['userId']}, {'_id': 0})
        if student:
            onboarding_completed = student.get('onboardingCompleted', False)
    
    return {
        'user': {
            **user,
            'onboardingCompleted': onboarding_completed
        }
    }

# ============== ADMIN ROUTES ==============

@admin_router.get("/metrics")
async def get_admin_metrics(user: dict = Depends(require_role(['super_admin']))):
    total_students = await db.students.count_documents({})
    total_counselors = await db.users.count_documents({'role': 'counselor'})
    total_agents = await db.users.count_documents({'role': 'agent'})
    active_applications = await db.service_applications.count_documents({
        'status': {'$in': ['not_started', 'in_progress']}
    })
    completed_applications = await db.service_applications.count_documents({'status': 'completed'})
    
    return {
        'metrics': {
            'totalStudents': total_students,
            'totalCounselors': total_counselors,
            'totalAgents': total_agents,
            'activeApplications': active_applications,
            'completedApplications': completed_applications
        }
    }

@admin_router.get("/students")
async def get_all_students(user: dict = Depends(require_role(['super_admin']))):
    students = await db.students.find({}, {'_id': 0}).to_list(1000)
    
    students_with_details = []
    for student in students:
        user_data = await db.users.find_one(
            {'userId': student['userId']}, 
            {'_id': 0, 'password': 0}
        )
        applications = await db.service_applications.find(
            {'studentId': student['studentId']},
            {'_id': 0}
        ).to_list(100)
        
        students_with_details.append({
            **student,
            'user': user_data,
            'applications': applications
        })
    
    return {'students': students_with_details}

@admin_router.get("/counselors")
async def get_all_counselors(user: dict = Depends(require_role(['super_admin']))):
    counselors = await db.users.find(
        {'role': 'counselor'}, 
        {'_id': 0, 'password': 0}
    ).to_list(100)
    
    # Add assigned students count
    for counselor in counselors:
        count = await db.students.count_documents({'assignedCounselor': counselor['userId']})
        counselor['assignedStudents'] = count
    
    return {'counselors': counselors}

@admin_router.get("/agents")
async def get_all_agents(user: dict = Depends(require_role(['super_admin']))):
    agents = await db.users.find(
        {'role': 'agent'}, 
        {'_id': 0, 'password': 0}
    ).to_list(100)
    
    # Add referred students count and commission info
    for agent in agents:
        count = await db.students.count_documents({'assignedAgent': agent['userId']})
        agent['referredStudents'] = count
        
        # Calculate total commission
        commissions = await db.commissions.find({'agentId': agent['userId'], 'status': 'paid'}).to_list(1000)
        agent['totalCommission'] = sum(c.get('amount', 0) for c in commissions)
        agent['commissionRate'] = 10  # Default rate
    
    return {'agents': agents}

@admin_router.post("/users")
async def create_user(data: UserCreate, user: dict = Depends(require_role(['super_admin']))):
    existing = await db.users.find_one({'email': data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        'userId': user_id,
        'email': data.email.lower(),
        'password': hash_password(data.password),
        'firstName': data.firstName,
        'lastName': data.lastName,
        'role': data.role,
        'isActive': True,
        'createdAt': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    return {
        'message': 'User created',
        'user': {
            'userId': user_id,
            'email': data.email.lower(),
            'firstName': data.firstName,
            'lastName': data.lastName,
            'role': data.role
        }
    }

# ============== STUDENT ROUTES ==============

@student_router.get("/profile")
async def get_student_profile(user: dict = Depends(require_role(['student']))):
    student = await db.students.find_one({'userId': user['userId']}, {'_id': 0})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    applications = await db.service_applications.find(
        {'studentId': student['studentId']},
        {'_id': 0}
    ).to_list(100)
    
    # Get service details for each application
    for app in applications:
        service = await db.services.find_one({'serviceId': app['serviceId']}, {'_id': 0})
        app['service'] = service
    
    return {
        'student': student,
        'user': user,
        'applications': applications
    }

@student_router.post("/onboarding")
async def complete_onboarding(data: OnboardingData, user: dict = Depends(require_role(['student']))):
    student = await db.students.find_one({'userId': user['userId']})
    if not student:
        # Create student record if it doesn't exist
        student_doc = {
            'studentId': str(uuid.uuid4()),
            'userId': user['userId'],
            'interestedCountries': data.interestedCountries,
            'selectedServices': data.selectedServices,
            'intake': data.intake,
            'preferredDestination': data.preferredDestination,
            'onboardingCompleted': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.students.insert_one(student_doc)
        student = student_doc
    else:
        await db.students.update_one(
            {'userId': user['userId']},
            {'$set': {
                'interestedCountries': data.interestedCountries,
                'selectedServices': data.selectedServices,
                'intake': data.intake,
                'preferredDestination': data.preferredDestination,
                'onboardingCompleted': True
            }}
        )
    
    # Create service applications for selected services
    student_id = student.get('studentId', str(uuid.uuid4()))
    for service_id in data.selectedServices:
        existing_app = await db.service_applications.find_one({
            'studentId': student_id,
            'serviceId': service_id
        })
        if not existing_app:
            app_doc = {
                'applicationId': str(uuid.uuid4()),
                'studentId': student_id,
                'serviceId': service_id,
                'status': 'not_started',
                'progress': 0,
                'createdAt': datetime.now(timezone.utc).isoformat()
            }
            await db.service_applications.insert_one(app_doc)
    
    return {'message': 'Onboarding completed', 'onboardingCompleted': True}

@student_router.get("/applications")
async def get_student_applications(user: dict = Depends(require_role(['student']))):
    student = await db.students.find_one({'userId': user['userId']}, {'_id': 0})
    if not student:
        return {'applications': []}
    
    applications = await db.service_applications.find(
        {'studentId': student['studentId']},
        {'_id': 0}
    ).to_list(100)
    
    # Add service details
    for app in applications:
        service = await db.services.find_one({'serviceId': app['serviceId']}, {'_id': 0})
        app['service'] = service
    
    return {'applications': applications}

# ============== SERVICE ROUTES ==============

@service_router.get("/")
async def get_services():
    services = await db.services.find({}, {'_id': 0}).to_list(100)
    
    # If no services, create default ones
    if not services:
        default_services = [
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'University Application',
                'description': 'Complete assistance with university applications',
                'category': 'education',
                'estimatedDuration': '2-4 weeks',
                'icon': 'GraduationCap'
            },
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'Student Visa',
                'description': 'Visa application support and guidance',
                'category': 'visa',
                'estimatedDuration': '4-8 weeks',
                'icon': 'FileText'
            },
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'Accommodation',
                'description': 'Help finding suitable student accommodation',
                'category': 'housing',
                'estimatedDuration': '1-2 weeks',
                'icon': 'Home'
            },
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'Education Loan',
                'description': 'Assistance with education loan applications',
                'category': 'finance',
                'estimatedDuration': '2-3 weeks',
                'icon': 'DollarSign'
            },
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'Travel Booking',
                'description': 'Flight and travel arrangement assistance',
                'category': 'travel',
                'estimatedDuration': '1 week',
                'icon': 'Plane'
            },
            {
                'serviceId': str(uuid.uuid4()),
                'name': 'Insurance',
                'description': 'Health and travel insurance guidance',
                'category': 'insurance',
                'estimatedDuration': '1 week',
                'icon': 'Shield'
            }
        ]
        for service in default_services:
            await db.services.insert_one(service)
        services = default_services
    
    return {'services': services}

@service_router.post("/apply")
async def apply_for_service(data: ServiceApplicationCreate, user: dict = Depends(require_role(['student']))):
    student = await db.students.find_one({'userId': user['userId']})
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Check if already applied
    existing = await db.service_applications.find_one({
        'studentId': student['studentId'],
        'serviceId': data.serviceId
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already applied for this service")
    
    app_doc = {
        'applicationId': str(uuid.uuid4()),
        'studentId': student['studentId'],
        'serviceId': data.serviceId,
        'status': 'not_started',
        'progress': 0,
        'createdAt': datetime.now(timezone.utc).isoformat()
    }
    await db.service_applications.insert_one(app_doc)
    
    return {'message': 'Application submitted', 'application': {k: v for k, v in app_doc.items() if k != '_id'}}

# ============== ROOT ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "service": "Fly8 API"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(student_router)
api_router.include_router(service_router)

# Include the main router
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event - seed data
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Fly8 API Server...")
    
    # Create super admin if not exists
    admin = await db.users.find_one({'email': 'superadmin@fly8.com'})
    if not admin:
        admin_doc = {
            'userId': str(uuid.uuid4()),
            'email': 'superadmin@fly8.com',
            'password': hash_password('password123'),
            'firstName': 'Super',
            'lastName': 'Admin',
            'role': 'super_admin',
            'isActive': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(admin_doc)
        logger.info("Created default super admin user")
    
    # Create sample counselor
    counselor = await db.users.find_one({'email': 'counselor@fly8.com'})
    if not counselor:
        counselor_doc = {
            'userId': str(uuid.uuid4()),
            'email': 'counselor@fly8.com',
            'password': hash_password('password123'),
            'firstName': 'Sarah',
            'lastName': 'Johnson',
            'role': 'counselor',
            'isActive': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(counselor_doc)
        logger.info("Created default counselor user")
    
    # Create sample agent
    agent = await db.users.find_one({'email': 'agent@fly8.com'})
    if not agent:
        agent_doc = {
            'userId': str(uuid.uuid4()),
            'email': 'agent@fly8.com',
            'password': hash_password('password123'),
            'firstName': 'Mike',
            'lastName': 'Wilson',
            'role': 'agent',
            'isActive': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(agent_doc)
        logger.info("Created default agent user")
    
    # Create sample student
    student_user = await db.users.find_one({'email': 'john@student.com'})
    if not student_user:
        student_user_id = str(uuid.uuid4())
        student_user_doc = {
            'userId': student_user_id,
            'email': 'john@student.com',
            'password': hash_password('password123'),
            'firstName': 'John',
            'lastName': 'Smith',
            'role': 'student',
            'isActive': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(student_user_doc)
        
        # Create student profile
        student_doc = {
            'studentId': str(uuid.uuid4()),
            'userId': student_user_id,
            'interestedCountries': ['USA', 'UK'],
            'selectedServices': [],
            'onboardingCompleted': True,
            'createdAt': datetime.now(timezone.utc).isoformat()
        }
        await db.students.insert_one(student_doc)
        logger.info("Created default student user")
    
    logger.info("Fly8 API Server started successfully!")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
