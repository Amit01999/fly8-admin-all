import React, { useEffect, useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Eye,
  GraduationCap,
  Plane,
  Home,
  CreditCard,
  Shield,
  Briefcase,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { id: 1, name: 'Profile Assessment', description: 'Comprehensive evaluation of student profile', color: 'bg-gradient-to-br from-rose-400 to-pink-500', icon: Users, action: 'Apply' },
  { id: 2, name: 'Pre-application Support', description: 'Document preparation and guidance', color: 'bg-gradient-to-br from-teal-400 to-cyan-500', icon: FileText, action: 'Apply' },
  { id: 3, name: 'Apply University', description: 'University application assistance', color: 'bg-gradient-to-br from-violet-400 to-purple-500', icon: GraduationCap, action: 'Apply' },
  { id: 4, name: 'Visa & Interview Support', description: 'Visa processing and interview prep', color: 'bg-gradient-to-br from-blue-400 to-indigo-500', icon: FileText, action: 'Show Interest' },
  { id: 5, name: 'Ticket & Travel Support', description: 'Flight booking and travel arrangements', color: 'bg-gradient-to-br from-orange-400 to-amber-500', icon: Plane, action: 'Apply' },
  { id: 6, name: 'Find Accommodation', description: 'Housing search and setup', color: 'bg-gradient-to-br from-pink-400 to-rose-500', icon: Home, action: 'Search' },
  { id: 7, name: 'Education Loan', description: 'Financial assistance and loan processing', color: 'bg-gradient-to-br from-green-400 to-emerald-500', icon: CreditCard, action: 'Apply' },
  { id: 8, name: 'Find Jobs Abroad', description: 'Career guidance and job placement', color: 'bg-gradient-to-br from-slate-400 to-gray-500', icon: Briefcase, action: 'Search' },
];

export default function CounselorDashboardMain() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledStudents: 0,
    servicesApplied: 0,
    commissionEarned: 0
  });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/counselors/dashboard');
      setStats(response.data.stats || {
        enrolledStudents: 24,
        servicesApplied: 48,
        commissionEarned: 4250
      });
      setStudents(response.data.students || []);
    } catch (error) {
      // Use mock data if API fails
      setStats({
        enrolledStudents: 24,
        servicesApplied: 48,
        commissionEarned: 4250
      });
      setStudents([
        { studentId: '1', user: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com' }, services: ['Completed', 'In Progress', 'Not Started'], currentStep: '2/8', lastActivity: '2 hours ago' },
        { studentId: '2', user: { firstName: 'Mike', lastName: 'Chen', email: 'mike@email.com' }, services: ['In Progress'], currentStep: '4/8', lastActivity: '1 day ago' },
        { studentId: '3', user: { firstName: 'Emma', lastName: 'Wilson', email: 'emma@email.com' }, services: ['Not Started'], currentStep: '1/8', lastActivity: '3 days ago' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CounselorLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </CounselorLayout>
    );
  }

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-dashboard-main">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Enrolled Students</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.enrolledStudents}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">+15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Services Applied</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.servicesApplied}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commission Earned</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.commissionEarned.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">+22% from last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Services Overview */}
        <div>
          <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Services Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className={`p-5 ${service.color} text-white border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer min-h-[160px] flex flex-col justify-between`}>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{service.name}</h4>
                      <p className="text-white/80 text-sm">{service.description}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0 w-fit"
                      data-testid={`service-${service.id}-action`}
                    >
                      {service.action}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Assigned Students */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-outfit font-bold text-gray-900">Assigned Students</h3>
            <Badge className="bg-blue-100 text-blue-700">{students.length} Students</Badge>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="counselor-students-table">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Active Services</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Current Step</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Activity</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <motion.tr 
                    key={student.studentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.user?.firstName} {student.user?.lastName}</p>
                          <p className="text-sm text-gray-500">{student.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {student.services?.map((status, i) => (
                          <Badge 
                            key={i}
                            className={`text-xs ${
                              status === 'Completed' ? 'bg-green-100 text-green-700' :
                              status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900 font-medium">Step {student.currentStep}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-500 text-sm">{student.lastActivity}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => navigate(`/counselor/students/${student.studentId}`)}
                        data-testid={`view-student-${student.studentId}`}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </CounselorLayout>
  );
}
