import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  TrendingUp, 
  Bell,
  Plane,
  LogOut,
  Search,
  Filter
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [students, setStudents] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, studentsRes, counselorsRes, agentsRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/students'),
        api.get('/admin/counselors'),
        api.get('/admin/agents')
      ]);
      
      setMetrics(metricsRes.data.metrics);
      setStudents(studentsRes.data.students);
      setCounselors(counselorsRes.data.counselors);
      setAgents(agentsRes.data.agents);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const assignCounselor = async (studentId, counselorId) => {
    try {
      await api.put(`/admin/students/${studentId}/assign-counselor`, { counselorId });
      toast.success('Counselor assigned successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign counselor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="super-admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold">Fly8</h1>
              <p className="text-xs text-red-600 font-semibold">Super Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white w-full">
            <Users className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-red-600">Super Admin</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" className="w-full justify-start" size="sm" data-testid="admin-logout-button">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-outfit font-bold text-gray-900">Super Admin Dashboard</h2>
              <p className="text-gray-600">Manage students, counselors, and agents</p>
            </div>
            <Button variant="outline" size="icon" className="relative" data-testid="admin-notifications-button">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6" data-testid="metric-students">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{metrics?.totalStudents || 0}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="metric-counselors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{metrics?.totalCounselors || 0}</p>
                  <p className="text-sm text-gray-600">Counselors</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="metric-agents">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{metrics?.totalAgents || 0}</p>
                  <p className="text-sm text-gray-600">Agents</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="metric-applications">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{metrics?.activeApplications || 0}</p>
                  <p className="text-sm text-gray-600">Active Applications</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Students Table */}
          <Card className="p-6" data-testid="students-table">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-outfit font-bold">All Students</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Search students..." className="pl-10" data-testid="search-students-input" />
                </div>
                <Button variant="outline" size="icon" data-testid="filter-button">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold text-gray-700">Student</th>
                    <th className="pb-3 font-semibold text-gray-700">Email</th>
                    <th className="pb-3 font-semibold text-gray-700">Services</th>
                    <th className="pb-3 font-semibold text-gray-700">Counselor</th>
                    <th className="pb-3 font-semibold text-gray-700">Agent</th>
                    <th className="pb-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.studentId} className="border-b last:border-0" data-testid={`student-row-${student.studentId}`}>
                      <td className="py-4">
                        <div className="font-medium">{student.user?.firstName} {student.user?.lastName}</div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{student.user?.email}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {student.applications?.length || 0} services
                        </span>
                      </td>
                      <td className="py-4 text-sm">
                        {student.assignedCounselor ? (
                          <span className="text-green-600">Assigned</span>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4 text-sm">
                        {student.assignedAgent ? (
                          <span className="text-green-600">Assigned</span>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="py-4">
                        <Button size="sm" variant="outline" data-testid={`assign-button-${student.studentId}`}>
                          Assign
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}