import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
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
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_STUDENTS = [
  { id: '1', name: 'Alex Thompson', email: 'alex@email.com', phone: '+1 234 567 8900', country: 'USA', services: 3, commission: 450, status: 'active', stage: 'Visa Processing' },
  { id: '2', name: 'Priya Patel', email: 'priya@email.com', phone: '+1 234 567 8901', country: 'UK', services: 2, commission: 320, status: 'active', stage: 'University Selection' },
  { id: '3', name: 'David Kim', email: 'david@email.com', phone: '+1 234 567 8902', country: 'Canada', services: 1, commission: 150, status: 'pending', stage: 'Profile Assessment' },
  { id: '4', name: 'Maria Garcia', email: 'maria@email.com', phone: '+1 234 567 8903', country: 'Australia', services: 4, commission: 680, status: 'active', stage: 'Travel Booking' },
  { id: '5', name: 'James Wilson', email: 'james@email.com', phone: '+1 234 567 8904', country: 'Germany', services: 2, commission: 280, status: 'completed', stage: 'Completed' },
];

export default function AgentMyStudents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || student.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalCommission = MOCK_STUDENTS.reduce((sum, s) => sum + s.commission, 0);

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-my-students">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">My Students</h1>
            <p className="text-gray-500">Track your referred students and commissions</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="add-student-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-0 shadow-sm">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STUDENTS.length}</p>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STUDENTS.filter(s => s.status === 'active').length}</p>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{MOCK_STUDENTS.filter(s => s.status === 'completed').length}</p>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <p className="text-sm text-gray-500">Total Commission</p>
            <p className="text-2xl font-bold text-emerald-600">${totalCommission.toLocaleString()}</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
              <Button variant={filter === 'active' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('active')}>Active</Button>
              <Button variant={filter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('pending')}>Pending</Button>
              <Button variant={filter === 'completed' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('completed')}>Completed</Button>
            </div>
          </div>
        </Card>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="students-grid">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <Badge className={`text-xs mt-1 ${
                        student.status === 'completed' ? 'bg-green-100 text-green-700' :
                        student.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status}
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
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{student.country}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Stage</p>
                    <p className="font-medium text-sm text-gray-900">{student.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Commission</p>
                    <p className="font-semibold text-emerald-600">${student.commission}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AgentLayout>
  );
}
