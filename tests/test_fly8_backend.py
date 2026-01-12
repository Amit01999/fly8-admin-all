"""
Fly8 Backend API Tests
Tests for authentication, admin endpoints, student endpoints, and services
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthAndRoot:
    """Health check and root endpoint tests"""
    
    def test_root_endpoint(self):
        """Test root API endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["message"] == "Hello World"
        print("✓ Root endpoint working")
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        print("✓ Health endpoint working")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_login_super_admin_success(self):
        """Test super admin login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@fly8.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == "superadmin@fly8.com"
        assert data["user"]["role"] == "super_admin"
        assert data["message"] == "Login successful"
        print("✓ Super admin login successful")
    
    def test_login_student_success(self):
        """Test student login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "john@student.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "student"
        print("✓ Student login successful")
    
    def test_login_counselor_success(self):
        """Test counselor login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "counselor@fly8.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "counselor"
        print("✓ Counselor login successful")
    
    def test_login_agent_success(self):
        """Test agent login with valid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "agent@fly8.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "agent"
        print("✓ Agent login successful")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✓ Invalid credentials rejected correctly")
    
    def test_get_me_with_valid_token(self):
        """Test /auth/me endpoint with valid token"""
        # First login to get token
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@fly8.com",
            "password": "password123"
        })
        token = login_response.json()["token"]
        
        # Then call /auth/me
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert data["user"]["email"] == "superadmin@fly8.com"
        print("✓ Get current user endpoint working")
    
    def test_get_me_without_token(self):
        """Test /auth/me endpoint without token"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code in [401, 403]
        print("✓ Unauthorized access rejected correctly")


class TestAdminEndpoints:
    """Admin endpoint tests - requires super_admin role"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get admin token before each test"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "superadmin@fly8.com",
            "password": "password123"
        })
        self.token = login_response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_admin_metrics(self):
        """Test admin metrics endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/metrics",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "metrics" in data
        metrics = data["metrics"]
        assert "totalStudents" in metrics
        assert "totalCounselors" in metrics
        assert "totalAgents" in metrics
        assert "activeApplications" in metrics
        print(f"✓ Admin metrics: {metrics}")
    
    def test_get_all_students(self):
        """Test get all students endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/students",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "students" in data
        assert isinstance(data["students"], list)
        print(f"✓ Get all students: {len(data['students'])} students found")
    
    def test_get_all_counselors(self):
        """Test get all counselors endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/counselors",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "counselors" in data
        assert isinstance(data["counselors"], list)
        print(f"✓ Get all counselors: {len(data['counselors'])} counselors found")
    
    def test_get_all_agents(self):
        """Test get all agents endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/admin/agents",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "agents" in data
        assert isinstance(data["agents"], list)
        print(f"✓ Get all agents: {len(data['agents'])} agents found")
    
    def test_admin_endpoints_require_auth(self):
        """Test that admin endpoints require authentication"""
        endpoints = ["/api/admin/metrics", "/api/admin/students", "/api/admin/counselors", "/api/admin/agents"]
        for endpoint in endpoints:
            response = requests.get(f"{BASE_URL}{endpoint}")
            assert response.status_code in [401, 403], f"Endpoint {endpoint} should require auth"
        print("✓ All admin endpoints require authentication")
    
    def test_admin_endpoints_require_super_admin_role(self):
        """Test that admin endpoints require super_admin role"""
        # Login as student
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "john@student.com",
            "password": "password123"
        })
        student_token = login_response.json()["token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}
        
        response = requests.get(
            f"{BASE_URL}/api/admin/metrics",
            headers=student_headers
        )
        assert response.status_code == 403
        print("✓ Admin endpoints require super_admin role")


class TestServiceEndpoints:
    """Service endpoint tests"""
    
    def test_get_services(self):
        """Test get all services endpoint"""
        response = requests.get(f"{BASE_URL}/api/services/")
        assert response.status_code == 200
        data = response.json()
        assert "services" in data
        assert isinstance(data["services"], list)
        assert len(data["services"]) > 0
        
        # Verify service structure
        service = data["services"][0]
        assert "serviceId" in service
        assert "name" in service
        assert "description" in service
        print(f"✓ Get services: {len(data['services'])} services found")


class TestStudentEndpoints:
    """Student endpoint tests - requires student role"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get student token before each test"""
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "john@student.com",
            "password": "password123"
        })
        self.token = login_response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_get_student_profile(self):
        """Test get student profile endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/students/profile",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "student" in data
        assert "user" in data
        print("✓ Get student profile working")
    
    def test_get_student_applications(self):
        """Test get student applications endpoint"""
        response = requests.get(
            f"{BASE_URL}/api/students/applications",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "applications" in data
        print(f"✓ Get student applications: {len(data['applications'])} applications found")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
