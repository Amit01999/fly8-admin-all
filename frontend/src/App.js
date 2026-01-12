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

// Dashboards
import StudentDashboard from "./components/dashboard/StudentDashboard";
import SuperAdminDashboard from "./components/admin/SuperAdminDashboard";
import CounselorDashboard from "./components/counselor/CounselorDashboard";
import AgentDashboard from "./components/agent/AgentDashboard";

// Student Pages
import ExploreServices from "./pages/student/ExploreServices";
import TrackServices from "./pages/student/TrackServices";
import MyProfile from "./pages/student/MyProfile";
import AccountSettings from "./pages/student/AccountSettings";

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
            
            {/* Student Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Student Pages */}
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
            
            {/* Super Admin Dashboard */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Counselor Dashboard */}
            <Route 
              path="/counselor" 
              element={
                <ProtectedRoute allowedRoles={['counselor']}>
                  <CounselorDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Agent Dashboard */}
            <Route 
              path="/agent" 
              element={
                <ProtectedRoute allowedRoles={['agent']}>
                  <AgentDashboard />
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
