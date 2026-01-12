import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  Target,
  Bell,
  Upload,
  GraduationCap,
  Plane,
  Home,
  DollarSign,
  Briefcase
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

const SERVICES = [
  { id: 'service-1', name: 'Profile Assessment', icon: 'Target', color: 'from-blue-500 to-blue-600' },
  { id: 'service-2', name: 'Pre-application', icon: 'FileText', color: 'from-purple-500 to-purple-600' },
  { id: 'service-3', name: 'Apply University', icon: 'GraduationCap', color: 'from-pink-500 to-pink-600' },
  { id: 'service-4', name: 'Visa Support', icon: 'Plane', color: 'from-orange-500 to-orange-600' },
  { id: 'service-5', name: 'Travel Support', icon: 'FileText', color: 'from-amber-500 to-amber-600' },
  { id: 'service-6', name: 'Accommodation', icon: 'Home', color: 'from-green-500 to-green-600' },
  { id: 'service-7', name: 'Education Loan', icon: 'DollarSign', color: 'from-emerald-500 to-emerald-600' },
  { id: 'service-8', name: 'Find Jobs', icon: 'Briefcase', color: 'from-teal-500 to-teal-600' }
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, profileRes] = await Promise.all([
        api.get('/students/my-applications'),
        api.get('/students/profile')
      ]);
      
      setApplications(appsRes.data.applications || []);
      setStudent(profileRes.data.student);
    } catch (error) {
      if (error.response?.status === 404) {
        setApplications([]);
        setStudent(null);
      } else {
        console.error('Failed to fetch data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const completedSteps = applications.filter(a => a.status === 'completed').length;
  const activeServices = applications.filter(a => a.status === 'in_progress').length;
  const pendingActions = applications.filter(a => a.status === 'not_started' || a.status === 'on_hold').length;
  const totalProgress = applications.length > 0 ? (completedSteps / applications.length) * 100 : 0;

  const iconMap = {
    'Target': Target,
    'FileText': FileText,
    'GraduationCap': GraduationCap,
    'Plane': Plane,
    'Home': Home,
    'DollarSign': DollarSign,
    'Briefcase': Briefcase
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="student-dashboard">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">+25%</Badge>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-1">{completedSteps}</p>
              <p className="text-sm text-blue-700">Completed Steps</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-purple-100 text-purple-700 border-purple-200">Active</Badge>
              </div>
              <p className="text-3xl font-bold text-purple-900 mb-1">{activeServices}</p>
              <p className="text-sm text-purple-700">Active Services</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Urgent</Badge>
              </div>
              <p className="text-3xl font-bold text-amber-900 mb-1">{pendingActions}</p>
              <p className="text-sm text-amber-700">Pending Actions</p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200">{Math.round(totalProgress)}%</Badge>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-1">{applications.length}</p>
              <p className="text-sm text-green-700">Total Applications</p>
            </Card>
          </motion.div>
        </div>

        {/* Journey Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-outfit font-bold mb-1">Your Journey</h2>
                  <p className="text-blue-200 text-sm">Track your progress through each milestone</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{completedSteps}/{SERVICES.length}</p>
                  <p className="text-blue-200 text-sm">Steps Completed</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-blue-200">Overall Progress</span>
                  <span className="font-semibold">{Math.round(totalProgress)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-white/20" />
                <div className="relative grid grid-cols-4 md:grid-cols-8 gap-4">
                  {SERVICES.map((service, index) => {
                    const app = applications.find(a => a.serviceId === service.id);
                    const status = app?.status || 'not_started';
                    const isCompleted = status === 'completed';
                    const isActive = status === 'in_progress';
                    const IconComponent = iconMap[service.icon] || Target;

                    return (
                      <motion.div
                        key={service.id}
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 border-2 transition-all ${
                          isCompleted 
                            ? 'bg-green-500 border-green-400 shadow-lg shadow-green-500/50' 
                            : isActive 
                            ? 'bg-blue-500 border-blue-400 shadow-lg shadow-blue-500/50 animate-pulse' 
                            : 'bg-white/10 border-white/20'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <IconComponent className="w-5 h-5 text-white" />
                          )}
                          {isActive && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
                          )}
                        </div>
                        <p className="text-xs text-center font-medium text-white/90 leading-tight">{service.name}</p>
                        {isActive && (
                          <Badge className="mt-1 bg-blue-500 text-white text-[10px] px-1 py-0">Active</Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="md:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-outfit font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Active Services
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/track')}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {applications.filter(a => a.status === 'in_progress' || a.status === 'not_started').slice(0, 3).map((app, index) => {
                  const service = SERVICES.find(s => s.id === app.serviceId);
                  const progress = app.status === 'in_progress' ? 50 : 10;
                  const ServiceIcon = iconMap[service?.icon] || Target;

                  return (
                    <motion.div
                      key={app.applicationId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer"
                      onClick={() => navigate('/dashboard/track')}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${service?.color || 'from-gray-400 to-gray-500'} rounded-lg flex items-center justify-center`}>
                            <ServiceIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{service?.name || app.serviceId}</h4>
                            <p className="text-xs text-gray-500">
                              {app.status === 'in_progress' ? 'In Progress' : 'Not Started'}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </motion.div>
                  );
                })}

                {applications.filter(a => a.status === 'in_progress' || a.status === 'not_started').length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-3">All services completed!</p>
                    <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/services')}>
                      Explore More Services
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
            <Card className="p-6 h-full">
              <h3 className="text-lg font-outfit font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-50" 
                  onClick={() => navigate('/dashboard/services')}
                >
                  <Sparkles className="w-4 h-4 mr-3 text-blue-500" />
                  <span>Explore Services</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-purple-50"
                  onClick={() => navigate('/dashboard/track')}
                >
                  <Clock className="w-4 h-4 mr-3 text-purple-500" />
                  <span>Track Progress</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-green-50"
                >
                  <Upload className="w-4 h-4 mr-3 text-green-500" />
                  <span>Upload Documents</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-amber-50"
                >
                  <Bell className="w-4 h-4 mr-3 text-amber-500" />
                  <span>View Notifications</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-outfit font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-3">
              {[
                { action: 'Application submitted', service: 'Profile Assessment', time: '2 hours ago', type: 'success' },
                { action: 'Document uploaded', service: 'Pre-application Support', time: '5 hours ago', type: 'info' },
                { action: 'Counselor assigned', service: 'Apply University', time: '1 day ago', type: 'success' },
                { action: 'Status updated', service: 'Visa Support', time: '2 days ago', type: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Bell className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.service}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}
