import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../layout/AdminLayout';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp,
  ArrowRight,
  MoreVertical,
  Plus,
  Building
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, studentsRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/students')
      ]);
      
      setMetrics(metricsRes.data.metrics);
      setStudents(studentsRes.data.students.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="super-admin-dashboard">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+12%</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics?.totalStudents || 0}</p>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-xs text-green-600 mt-2">From last month</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics?.totalCounselors || 0}</p>
              <p className="text-sm text-gray-600">Active Counselors</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">350</p>
              <p className="text-sm text-gray-600">Universities Listed</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <Badge className="bg-green-100 text-green-700">+8%</Badge>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics?.activeApplications || 0}</p>
              <p className="text-sm text-gray-600">Services Applied</p>
              <p className="text-xs text-green-600 mt-2">From last month</p>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* New Applications */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-outfit font-bold">New Applications</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/students')}>
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {students.slice(0, 5).map((student, index) => (
                  <div key={student.studentId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{student.user?.firstName} {student.user?.lastName}</p>
                        <p className="text-xs text-gray-500">{student.applications?.length || 0} services applied</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={student.assignedCounselor ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {student.assignedCounselor ? 'Assigned' : 'Pending'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Students */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-outfit font-bold">Recent Students</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/students')}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {students.slice(0, 5).map((student) => (
                  <div key={student.studentId} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {student.user?.firstName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{student.user?.firstName} {student.user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{student.user?.email}</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">Active</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-outfit font-bold">Manage Counselors</h3>
                <UserCheck className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics?.totalCounselors || 0}</p>
              <p className="text-sm text-gray-600 mb-4">Active counselors</p>
              <Button className="w-full" size="sm" onClick={() => navigate('/admin/counselors')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Counselor
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-outfit font-bold">Manage Agents</h3>
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metrics?.totalAgents || 0}</p>
              <p className="text-sm text-gray-600 mb-4">Active agents</p>
              <Button className="w-full" size="sm" onClick={() => navigate('/admin/agents')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-outfit font-bold">Universities</h3>
                <Building className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">350</p>
              <p className="text-sm text-gray-600 mb-4">Listed universities</p>
              <Button className="w-full" variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add University
              </Button>
            </Card>
          </motion.div>
        </div>

      </div>
    </AdminLayout>
  );
}
