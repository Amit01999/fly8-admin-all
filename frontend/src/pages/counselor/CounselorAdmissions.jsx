import React, { useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_ADMISSIONS = [
  { id: '1', student: 'Sarah Johnson', university: 'MIT', course: 'Computer Science', intake: 'Fall 2024', status: 'accepted', deadline: 'Mar 15, 2024' },
  { id: '2', student: 'Mike Chen', university: 'Oxford', course: 'Business Analytics', intake: 'Fall 2024', status: 'pending', deadline: 'Apr 1, 2024' },
  { id: '3', student: 'Emma Wilson', university: 'Stanford', course: 'Data Science', intake: 'Spring 2024', status: 'in_review', deadline: 'Feb 28, 2024' },
  { id: '4', student: 'James Brown', university: 'Harvard', course: 'MBA', intake: 'Fall 2024', status: 'accepted', deadline: 'Mar 30, 2024' },
  { id: '5', student: 'Lisa Davis', university: 'Cambridge', course: 'Engineering', intake: 'Fall 2024', status: 'rejected', deadline: 'Apr 15, 2024' },
];

export default function CounselorAdmissions() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted': return <Badge className="bg-green-100 text-green-700">Accepted</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700">Pending</Badge>;
      case 'in_review': return <Badge className="bg-blue-100 text-blue-700">In Review</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700">{status}</Badge>;
    }
  };

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-admissions">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500">Track university admission applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_ADMISSIONS.length}</p>
                <p className="text-sm text-gray-500">Total Applications</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_ADMISSIONS.filter(a => a.status === 'accepted').length}</p>
                <p className="text-sm text-gray-500">Accepted</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_ADMISSIONS.filter(a => a.status === 'pending' || a.status === 'in_review').length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_ADMISSIONS.filter(a => a.status === 'rejected').length}</p>
                <p className="text-sm text-gray-500">Rejected</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search admissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
        </Card>

        {/* Admissions Table */}
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="admissions-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Student</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">University</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Course</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Intake</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Deadline</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ADMISSIONS.map((admission, index) => (
                  <motion.tr 
                    key={admission.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{admission.student}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-900">{admission.university}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{admission.course}</td>
                    <td className="py-4 px-6 text-gray-600">{admission.intake}</td>
                    <td className="py-4 px-6">{getStatusBadge(admission.status)}</td>
                    <td className="py-4 px-6 text-gray-600">{admission.deadline}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm">
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
