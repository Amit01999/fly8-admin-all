import React, { useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  Filter, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_APPLICATIONS = [
  { id: '1', student: { name: 'Sarah Johnson', email: 'sarah@email.com' }, service: 'University Application', university: 'MIT', status: 'in_progress', progress: 60, submittedAt: '2 days ago', documents: 4 },
  { id: '2', student: { name: 'Mike Chen', email: 'mike@email.com' }, service: 'Student Visa', university: 'Oxford', status: 'pending', progress: 30, submittedAt: '5 days ago', documents: 2 },
  { id: '3', student: { name: 'Emma Wilson', email: 'emma@email.com' }, service: 'Accommodation', university: 'Stanford', status: 'completed', progress: 100, submittedAt: '1 week ago', documents: 6 },
  { id: '4', student: { name: 'James Brown', email: 'james@email.com' }, service: 'Education Loan', university: 'Harvard', status: 'in_progress', progress: 80, submittedAt: '3 days ago', documents: 5 },
  { id: '5', student: { name: 'Lisa Davis', email: 'lisa@email.com' }, service: 'Travel Booking', university: 'Cambridge', status: 'pending', progress: 10, submittedAt: '1 day ago', documents: 1 },
];

export default function CounselorApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredApplications = MOCK_APPLICATIONS.filter(app => {
    const matchesSearch = app.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || app.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default: return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
    }
  };

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-applications">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Applications</h1>
            <p className="text-gray-500">Track and manage student applications</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_APPLICATIONS.length}</p>
                <p className="text-sm text-gray-500">Total Applications</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_APPLICATIONS.filter(a => a.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_APPLICATIONS.filter(a => a.status === 'in_progress').length}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_APPLICATIONS.filter(a => a.status === 'completed').length}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
                data-testid="search-applications-input"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending
              </Button>
              <Button 
                variant={filter === 'in_progress' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('in_progress')}
              >
                In Progress
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </Card>

        {/* Applications List */}
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="applications-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Student</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Service</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">University</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Progress</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Documents</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app, index) => (
                  <motion.tr 
                    key={app.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {app.student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.student.name}</p>
                          <p className="text-sm text-gray-500">{app.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{app.service}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-600">{app.university}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              app.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{app.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-4 px-6">
                      <Badge className="bg-gray-100 text-gray-700">{app.documents} files</Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" data-testid={`view-application-${app.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
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
