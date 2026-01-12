import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/admin/students');
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch students');
      console.error(error);
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
    <AdminLayout>
      <div className="space-y-6" data-testid="manage-students-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Manage Students</h1>
            <p className="text-gray-600">View and manage all registered students</p>
          </div>
          <Button data-testid="add-student-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-students-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-students-btn">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg font-medium">No students found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="students-table">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Country</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Services</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Counselor</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => (
                    <motion.tr 
                      key={student.studentId || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.user?.firstName} {student.user?.lastName}</p>
                            <p className="text-xs text-gray-500">{student.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{student.user?.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{student.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{student.destinationCountry || 'Not set'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-blue-100 text-blue-700">
                          {student.applications?.length || 0} services
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={student.onboardingCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {student.onboardingCompleted ? 'Active' : 'Onboarding'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {student.assignedCounselor ? (
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-600">Assigned</span>
                          </div>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">Unassigned</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" data-testid={`view-student-${index}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`delete-student-${index}`}>
                            <Trash2 className="w-4 h-4 text-red-500" />
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
          )}
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
