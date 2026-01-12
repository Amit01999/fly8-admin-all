import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Auth Pages
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

// Onboarding
import Onboarding from "./components/onboarding/Onboarding";

// Student Dashboard & Pages
import StudentDashboard from "./components/dashboard/StudentDashboard";
import ExploreServices from "./pages/student/ExploreServices";
import TrackServices from "./pages/student/TrackServices";
import MyProfile from "./pages/student/MyProfile";
import AccountSettings from "./pages/student/AccountSettings";

// Super Admin Dashboard & Pages
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageCounselors from "./pages/admin/ManageCounselors";
import ManageAgents from "./pages/admin/ManageAgents";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminSettings from "./pages/admin/AdminSettings";

// Counselor Dashboard & Pages
import CounselorDashboardMain from "./pages/counselor/CounselorDashboardMain";
import CounselorMyStudents from "./pages/counselor/CounselorMyStudents";
import CounselorApplications from "./pages/counselor/CounselorApplications";
import CounselorExploreProducts from "./pages/counselor/CounselorExploreProducts";
import CounselorLeads from "./pages/counselor/CounselorLeads";
import CounselorEarnings from "./pages/counselor/CounselorEarnings";
import CounselorVASServices from "./pages/counselor/CounselorVASServices";
import CounselorAdmissions from "./pages/counselor/CounselorAdmissions";
import CounselorCourseFinder from "./pages/counselor/CounselorCourseFinder";
import CounselorTeam from "./pages/counselor/CounselorTeam";

// Agent Dashboard & Pages
import AgentDashboardMain from "./pages/agent/AgentDashboardMain";
import AgentMyStudents from "./pages/agent/AgentMyStudents";
import AgentApplications from "./pages/agent/AgentApplications";
import AgentExploreProducts from "./pages/agent/AgentExploreProducts";
import AgentLeads from "./pages/agent/AgentLeads";
import AgentEarnings from "./pages/agent/AgentEarnings";
import AgentVASServices from "./pages/agent/AgentVASServices";
import AgentAdmissions from "./pages/agent/AgentAdmissions";
import AgentCourseFinder from "./pages/agent/AgentCourseFinder";
import AgentCommission from "./pages/agent/AgentCommission";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Onboarding */}
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            
            {/* ==================== STUDENT ROUTES ==================== */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/services" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ExploreServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/track" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <TrackServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/profile" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <MyProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <AccountSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* ==================== SUPER ADMIN ROUTES ==================== */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/students" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/counselors" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageCounselors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/agents" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <ManageAgents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/notifications" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminNotifications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/assignments" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminAssignments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <AdminSettings />
                </ProtectedRoute>
              } 
            />
            
            {/* ==================== COUNSELOR ROUTES ==================== */}
            <Route 
              path="/counselor" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorDashboardMain />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/explore" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorExploreProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/students" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorMyStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/leads" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorLeads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/vas" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorVASServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/admissions" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorAdmissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/applications" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/courses" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorCourseFinder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/team" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorTeam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/counselor/earnings" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorEarnings />
                </ProtectedRoute>
              } 
            />
            
            {/* ==================== AGENT ROUTES ==================== */}
            <Route 
              path="/agent" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboardMain />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/explore" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentExploreProducts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/students" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentMyStudents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/leads" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentLeads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/vas" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentVASServices />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/admissions" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentAdmissions />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/applications" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/courses" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentCourseFinder />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/commission" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentCommission />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agent/earnings" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentEarnings />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
