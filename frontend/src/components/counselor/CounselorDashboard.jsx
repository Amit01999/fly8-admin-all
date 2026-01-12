import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Users, CheckCircle, DollarSign, Bell, Plane, LogOut, TrendingUp } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function CounselorDashboard() {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/counselors/my-students');
      setStudents(response.data.students);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const enrolledStudents = students.length;
  const servicesApplied = students.reduce((sum, s) => sum + (s.applications?.length || 0), 0);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]" data-testid="counselor-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-outfit font-bold">Fly8</h1>
              <p className="text-xs text-purple-600 font-semibold">Counselor</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-white w-full">
            <Users className="w-5 h-5" />
            <span className="font-medium">My Students</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-purple-600">Counselor</p>
            </div>
          </div>
          <Button onClick={logout} variant="outline" className="w-full justify-start" size="sm" data-testid="counselor-logout-button">
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
              <p className="text-gray-600">Assigned Students Dashboard</p>
            </div>
            <Button variant="outline" size="icon" className="relative" data-testid="counselor-notifications-button">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6" data-testid="counselor-stat-students">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{enrolledStudents}</p>
                  <p className="text-sm text-gray-600">Enrolled Students</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="counselor-stat-services">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">{servicesApplied}</p>
                  <p className="text-sm text-gray-600">Services Applied</p>
                </div>
              </div>
            </Card>

            <Card className="p-6" data-testid="counselor-stat-commission">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-outfit font-bold">$0</p>
                  <p className="text-sm text-gray-600">Commission Earned</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Students List */}
          <Card className="p-6" data-testid="counselor-students-list">
            <h3 className="text-xl font-outfit font-bold mb-6">My Students</h3>
            
            {students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No students assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.studentId} className="p-4 border rounded-lg hover:shadow-md transition-shadow" data-testid={`counselor-student-${student.studentId}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-journey-profile to-journey-visa rounded-full flex items-center justify-center text-white font-semibold">
                          {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                        </div>
                        <div>
                          <h4 className="font-semibold">{student.user?.firstName} {student.user?.lastName}</h4>
                          <p className="text-sm text-gray-600">{student.user?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{student.applications?.length || 0} Services</p>
                          <p className="text-xs text-gray-600">Applied</p>
                        </div>
                        <Button size="sm" data-testid={`view-student-${student.studentId}`}>View Details</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}