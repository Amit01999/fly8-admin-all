import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText, 
  MessageSquare,
  Calendar,
  User
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

const SERVICE_NAMES = {
  'service-1': 'Profile Assessment',
  'service-2': 'Pre-application Support',
  'service-3': 'Apply University',
  'service-4': 'Visa & Interview Support',
  'service-5': 'Ticket & Travel Support',
  'service-6': 'Find Accommodation',
  'service-7': 'Education Loan',
  'service-8': 'Find Jobs Abroad'
};

const STATUS_CONFIG = {
  not_started: { 
    label: 'Not Started', 
    color: 'bg-gray-100 text-gray-700',
    icon: Clock,
    progress: 0
  },
  in_progress: { 
    label: 'In Progress', 
    color: 'bg-blue-100 text-blue-700',
    icon: Clock,
    progress: 50
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle,
    progress: 100
  },
  on_hold: { 
    label: 'On Hold', 
    color: 'bg-amber-100 text-amber-700',
    icon: AlertCircle,
    progress: 25
  }
};

export default function TrackServices() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/students/my-applications');
      setApplications(response.data.applications || []);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const serviceName = SERVICE_NAMES[app.serviceId] || app.serviceId;
    return serviceName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const stats = {
    completed: applications.filter(a => a.status === 'completed').length,
    inProgress: applications.filter(a => a.status === 'in_progress').length,
    pendingStart: applications.filter(a => a.status === 'not_started').length,
    pendingActions: applications.filter(a => a.status === 'in_progress' || a.status === 'on_hold').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your services...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="track-services-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-outfit font-bold text-gray-900">Track Services</h1>
          <p className="text-gray-600 mt-1">Monitor the progress of your applied services</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingStart}</p>
                <p className="text-sm text-gray-600">Pending Start</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingActions}</p>
                <p className="text-sm text-gray-600">Pending Actions</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-track-services"
          />
        </div>

        {/* Services List */}
        {filteredApplications.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
            <p className="text-gray-600 mb-4">You haven't applied for any services yet.</p>
            <Button onClick={() => window.location.href = '/dashboard/services'}>
              Explore Services
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusConfig = STATUS_CONFIG[application.status];
              const StatusIcon = statusConfig.icon;
              const serviceName = SERVICE_NAMES[application.serviceId] || application.serviceId;
              
              return (
                <Card
                  key={application.applicationId}
                  className="p-6 hover:shadow-lg transition-shadow"
                  data-testid={`application-${application.applicationId}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-outfit font-bold">{serviceName}</h3>
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        {application.assignedCounselor && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>Counselor Assigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{statusConfig.progress}%</span>
                    </div>
                    <Progress value={statusConfig.progress} className="h-2" />
                  </div>

                  {/* Notes */}
                  {application.notes && application.notes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Recent Updates
                      </p>
                      <div className="space-y-2">
                        {application.notes.slice(-2).map((note, idx) => (
                          <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                            <p className="text-gray-700">{note.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(note.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {application.documents && application.documents.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents ({application.documents.length})
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Documents
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Counselor
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}