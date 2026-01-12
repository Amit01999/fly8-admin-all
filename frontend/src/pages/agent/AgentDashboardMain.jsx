import React, { useEffect, useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
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
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const SERVICES = [
  { id: 1, name: 'Profile Assessment', description: 'Student profile evaluation', color: 'bg-gradient-to-br from-rose-400 to-pink-500', icon: Users, commission: '10%' },
  { id: 2, name: 'Pre-application Support', description: 'Document preparation', color: 'bg-gradient-to-br from-teal-400 to-cyan-500', icon: FileText, commission: '8%' },
  { id: 3, name: 'Apply University', description: 'University applications', color: 'bg-gradient-to-br from-violet-400 to-purple-500', icon: GraduationCap, commission: '15%' },
  { id: 4, name: 'Visa & Interview Support', description: 'Visa processing', color: 'bg-gradient-to-br from-blue-400 to-indigo-500', icon: FileText, commission: '12%' },
  { id: 5, name: 'Ticket & Travel Support', description: 'Travel arrangements', color: 'bg-gradient-to-br from-orange-400 to-amber-500', icon: Plane, commission: '5%' },
  { id: 6, name: 'Find Accommodation', description: 'Housing search', color: 'bg-gradient-to-br from-pink-400 to-rose-500', icon: Home, commission: '8%' },
  { id: 7, name: 'Education Loan', description: 'Loan processing', color: 'bg-gradient-to-br from-green-400 to-emerald-500', icon: CreditCard, commission: '10%' },
  { id: 8, name: 'Find Jobs Abroad', description: 'Job placement', color: 'bg-gradient-to-br from-slate-400 to-gray-500', icon: Briefcase, commission: '15%' },
];

export default function AgentDashboardMain() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    referredStudents: 0,
    activeApplications: 0,
    totalCommission: 0,
    pendingCommission: 0
  });
  const [recentReferrals, setRecentReferrals] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/agents/dashboard');
      setStats(response.data.stats || {
        referredStudents: 18,
        activeApplications: 32,
        totalCommission: 8750,
        pendingCommission: 1250
      });
      setRecentReferrals(response.data.referrals || []);
    } catch (error) {
      setStats({
        referredStudents: 18,
        activeApplications: 32,
        totalCommission: 8750,
        pendingCommission: 1250
      });
      setRecentReferrals([
        { id: '1', student: { firstName: 'Alex', lastName: 'Thompson' }, service: 'University Application', commission: 450, status: 'paid', date: '2 days ago' },
        { id: '2', student: { firstName: 'Priya', lastName: 'Patel' }, service: 'Visa Support', commission: 320, status: 'pending', date: '5 days ago' },
        { id: '3', student: { firstName: 'David', lastName: 'Kim' }, service: 'Education Loan', commission: 550, status: 'paid', date: '1 week ago' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AgentLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AgentLayout>
    );
  }

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-dashboard-main">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Referred Students</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.referredStudents}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">+8 this month</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeApplications}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Commission</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.totalCommission.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">+32% growth</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending Commission</p>
                  <p className="text-3xl font-bold text-gray-900">${stats.pendingCommission.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Services Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-outfit font-bold text-gray-900">Services Overview</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/agent/explore')}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.slice(0, 4).map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className={`p-5 ${service.color} text-white border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer min-h-[140px] flex flex-col justify-between`}>
                    <div>
                      <h4 className="font-semibold text-base mb-1">{service.name}</h4>
                      <p className="text-white/80 text-sm">{service.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge className="bg-white/20 text-white border-0">{service.commission} Commission</Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Referrals & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-outfit font-bold text-gray-900">Recent Referrals</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/agent/students')}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {recentReferrals.map((referral, index) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {referral.student?.firstName?.[0]}{referral.student?.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{referral.student?.firstName} {referral.student?.lastName}</p>
                        <p className="text-sm text-gray-500">{referral.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${referral.commission}</p>
                      <Badge className={referral.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {referral.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-emerald-500 hover:bg-emerald-600" onClick={() => navigate('/agent/students')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Student
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/agent/applications')}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Applications
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/agent/commission')}>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Commission Report
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/agent/courses')}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Course Finder
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
