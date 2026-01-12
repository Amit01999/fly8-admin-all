import React, { useState, useEffect } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  Filter, 
  Eye,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  Plus,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function CounselorMyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/counselors/my-students');
      setStudents(response.data.students || []);
    } catch (error) {
      // Mock data for demonstration
      setStudents([
        { studentId: '1', user: { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@email.com', phone: '+1 234 567 8900' }, destinationCountry: 'USA', applications: [{}, {}, {}], onboardingCompleted: true, status: 'active', currentStep: 'Visa Application' },
        { studentId: '2', user: { firstName: 'Mike', lastName: 'Chen', email: 'mike@email.com', phone: '+1 234 567 8901' }, destinationCountry: 'UK', applications: [{}], onboardingCompleted: true, status: 'active', currentStep: 'University Selection' },
        { studentId: '3', user: { firstName: 'Emma', lastName: 'Wilson', email: 'emma@email.com', phone: '+1 234 567 8902' }, destinationCountry: 'Canada', applications: [{}, {}], onboardingCompleted: false, status: 'pending', currentStep: 'Profile Assessment' },
        { studentId: '4', user: { firstName: 'James', lastName: 'Brown', email: 'james@email.com', phone: '+1 234 567 8903' }, destinationCountry: 'Australia', applications: [{}, {}, {}, {}], onboardingCompleted: true, status: 'active', currentStep: 'Documentation' },
        { studentId: '5', user: { firstName: 'Lisa', lastName: 'Davis', email: 'lisa@email.com', phone: '+1 234 567 8904' }, destinationCountry: 'Germany', applications: [{}], onboardingCompleted: true, status: 'completed', currentStep: 'Completed' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const name = `${student.user?.firstName || ''} ${student.user?.lastName || ''}`.toLowerCase();
    const email = (student.user?.email || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-my-students">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">My Students</h1>
            <p className="text-gray-500">Manage and track your assigned students</p>
          </div>
          <Button data-testid="add-student-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
                data-testid="search-students-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-students-btn">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {/* Students Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <Card className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white border-0 shadow-sm">
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="students-grid">
            {filteredStudents.map((student, index) => (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.user?.firstName} {student.user?.lastName}</h3>
                        <Badge className={`text-xs mt-1 ${
                          student.status === 'completed' ? 'bg-green-100 text-green-700' :
                          student.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {student.status === 'completed' ? 'Completed' : student.status === 'active' ? 'Active' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{student.user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{student.user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{student.destinationCountry || 'Not set'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Current Step</p>
                      <p className="font-medium text-sm text-gray-900">{student.currentStep}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {student.applications?.length || 0} services
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`view-student-${student.studentId}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`message-student-${student.studentId}`}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </CounselorLayout>
  );
}
