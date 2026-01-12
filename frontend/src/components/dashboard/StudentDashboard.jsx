import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import JourneyRail from './JourneyRail';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import { UserCircle, Calendar, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

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
        toast.error('Please complete onboarding first');
        navigate('/onboarding');
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

  const activeServices = applications.filter(a => a.status === 'in_progress').length;
  const completedServices = applications.filter(a => a.status === 'completed').length;

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="student-dashboard">
        {/* Journey Timeline - MAIN FEATURE */}
        <Card className="p-8 bg-gradient-to-br from-white to-blue-50 shadow-lg">
          <JourneyRail applications={applications} />
        </Card>

        {/* Tetris Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Current Action Card - Large */}
          <Card className="col-span-12 md:col-span-8 row-span-2 p-6" data-testid="current-action-card">
            <h3 className="text-xl font-outfit font-bold mb-4">Current Focus</h3>
            {applications.filter(a => a.status === 'in_progress').length > 0 ? (
              <div className="space-y-4">
                {applications
                  .filter(a => a.status === 'in_progress')
                  .map(app => (
                    <div key={app.applicationId} className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg">{app.serviceId}</h4>
                          <p className="text-sm text-gray-600 mt-1">Status: In Progress</p>
                          {app.notes && app.notes.length > 0 && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Latest Note:</span> {app.notes[app.notes.length - 1].text}
                            </p>
                          )}
                        </div>
                        <Button size="sm" data-testid={`view-details-${app.applicationId}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">No active services at the moment</p>
                <Button onClick={() => navigate('/dashboard/services')} data-testid="explore-services-button">
                  Explore Services
                </Button>
              </div>
            )}
          </Card>

          {/* Stats Cards */}
          <Card className="col-span-12 md:col-span-4 p-6" data-testid="stats-card-active">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-outfit font-bold">{activeServices}</p>
                <p className="text-sm text-gray-600">Active Services</p>
              </div>
            </div>
          </Card>

          <Card className="col-span-12 md:col-span-4 p-6" data-testid="stats-card-completed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-outfit font-bold">{completedServices}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </Card>

          {/* Profile Summary */}
          {student && (
            <Card className="col-span-12 md:col-span-8 p-6" data-testid="profile-summary">
              <h3 className="text-xl font-outfit font-bold mb-4">Your Profile</h3>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-journey-profile to-journey-visa rounded-2xl flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm"><span className="font-medium">Interested Countries:</span> {student.interestedCountries?.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm"><span className="font-medium">Services Applied:</span> {student.selectedServices?.length || 0}</span>
                  </div>
                  {student.assignedCounselor && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Your Counselor Assigned</p>
                      <p className="text-xs text-blue-700 mt-1">A counselor will guide you through your journey</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}