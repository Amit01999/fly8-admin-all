import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Users, DollarSign, TrendingUp, Bell, Plane, LogOut, Wallet } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function AgentDashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, commissionsRes] = await Promise.all([
        api.get('/agents/my-students'),
        api.get('/agents/commissions')
      ]);
      
      setStudents(studentsRes.data.students);
      setCommissions(commissionsRes.data.commissions);
      setSummary(commissionsRes.data.summary);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="agent-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold">Fly8</h1>
              <p className="text-xs text-green-600 font-semibold">Agent</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white w-full">
            <Users className="w-5 h-5" />
            <span className="font-medium">My Students</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 w-full">
            <Wallet className="w-5 h-5" />
            <span className="font-medium">Earnings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-green-600">Agent</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" className="w-full justify-start" size="sm" data-testid="agent-logout-button">
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
              <h2 className="text-2xl font-outfit font-bold text-gray-900">Welcome, {user?.firstName}!</h2>
              <p className="text-gray-600">Track your students and earnings</p>
            </div>
            <Button variant="outline" size="icon" className="relative" data-testid="agent-notifications-button">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* Commission Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-6" data-testid="agent-stat-students">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{students.length}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="agent-stat-pending">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">${summary?.totalPending || 0}</p>
                  <p className="text-sm text-gray-600">Pending Commission</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="agent-stat-approved">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">${summary?.totalApproved || 0}</p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="agent-stat-lifetime">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">${summary?.lifetimeEarnings || 0}</p>
                  <p className="text-sm text-gray-600">Lifetime Earnings</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Students and Commissions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Students */}
            <Card className="p-6" data-testid="agent-students-list">
              <h3 className="text-xl font-outfit font-bold mb-4">My Students</h3>
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No students assigned</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {students.slice(0, 5).map((student) => (
                    <div key={student.studentId} className="p-3 border rounded-lg" data-testid={`agent-student-${student.studentId}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{student.user?.firstName} {student.user?.lastName}</p>
                          <p className="text-xs text-gray-600">{student.applications?.length || 0} services</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          {student.commissionPercentage}% commission
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Commission History */}
            <Card className="p-6" data-testid="agent-commissions-list">
              <h3 className="text-xl font-outfit font-bold mb-4">Recent Commissions</h3>
              {commissions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">No commissions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {commissions.slice(0, 5).map((commission) => (
                    <div key={commission.commissionId} className="p-3 border rounded-lg" data-testid={`agent-commission-${commission.commissionId}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">${commission.amount}</p>
                          <p className="text-xs text-gray-600">{commission.percentage}% commission</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          commission.status === 'paid' ? 'bg-green-100 text-green-700' :
                          commission.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {commission.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}