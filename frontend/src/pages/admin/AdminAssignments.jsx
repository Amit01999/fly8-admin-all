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
  UserCheck,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function AdminAssignments() {
  const [students, setStudents] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, counselorsRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/admin/counselors')
      ]);
      setStudents(studentsRes.data.students || []);
      setCounselors(counselorsRes.data.counselors || []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unassignedStudents = students.filter(s => !s.assignedCounselor);
  const assignedStudents = students.filter(s => s.assignedCounselor);

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-assignments-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Manage student-counselor assignments</p>
          </div>
          <Button data-testid="bulk-assign-btn">
            <Plus className="w-4 h-4 mr-2" />
            Bulk Assign
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{unassignedStudents.length}</p>
                <p className="text-sm text-gray-600">Pending Assignment</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{assignedStudents.length}</p>
                <p className="text-sm text-gray-600">Assigned</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{counselors.length}</p>
                <p className="text-sm text-gray-600">Available Counselors</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-assignments-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-assignments-btn">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unassigned Students */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-outfit font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Pending Assignment
                </h2>
                <Badge className="bg-amber-100 text-amber-700">{unassignedStudents.length}</Badge>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto" data-testid="unassigned-students-list">
                {unassignedStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">All students are assigned!</p>
                ) : (
                  unassignedStudents.map((student, index) => (
                    <motion.div
                      key={student.studentId || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{student.user?.firstName} {student.user?.lastName}</p>
                          <p className="text-xs text-gray-500">{student.destinationCountry || 'Country not set'}</p>
                        </div>
                      </div>
                      <Button size="sm" data-testid={`assign-student-${index}`}>
                        Assign
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>

            {/* Available Counselors */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-outfit font-bold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-500" />
                  Available Counselors
                </h2>
                <Badge className="bg-purple-100 text-purple-700">{counselors.length}</Badge>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto" data-testid="counselors-list">
                {counselors.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No counselors available</p>
                ) : (
                  counselors.map((counselor, index) => (
                    <motion.div
                      key={counselor._id || index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {counselor.firstName?.[0]}{counselor.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{counselor.firstName} {counselor.lastName}</p>
                          <p className="text-xs text-gray-500">{counselor.assignedStudents?.length || 0} students</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Available</Badge>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Recent Assignments */}
        <Card className="p-6">
          <h2 className="text-lg font-outfit font-bold text-gray-900 mb-4">Recent Assignments</h2>
          <div className="space-y-3" data-testid="recent-assignments-list">
            {assignedStudents.slice(0, 5).map((student, index) => (
              <motion.div
                key={student.studentId || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{student.user?.firstName} {student.user?.lastName}</p>
                    <p className="text-xs text-gray-500">Assigned to counselor</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Assigned
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
