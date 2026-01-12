import React from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users,
  Mail,
  Phone,
  Star,
  MoreVertical,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_TEAM = [
  { id: '1', name: 'John Smith', role: 'Senior Counselor', email: 'john@fly8.com', phone: '+1 234 567 8900', students: 45, rating: 4.9, status: 'active' },
  { id: '2', name: 'Emily Brown', role: 'Counselor', email: 'emily@fly8.com', phone: '+1 234 567 8901', students: 32, rating: 4.8, status: 'active' },
  { id: '3', name: 'Michael Lee', role: 'Junior Counselor', email: 'michael@fly8.com', phone: '+1 234 567 8902', students: 18, rating: 4.7, status: 'active' },
  { id: '4', name: 'Sarah Davis', role: 'Counselor', email: 'sarah@fly8.com', phone: '+1 234 567 8903', students: 28, rating: 4.6, status: 'away' },
];

export default function CounselorTeam() {
  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-team">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">My Team</h1>
            <p className="text-gray-500">Manage your counseling team</p>
          </div>
          <Button data-testid="add-team-member-btn">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_TEAM.length}</p>
                <p className="text-sm text-gray-500">Team Members</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_TEAM.reduce((sum, m) => sum + m.students, 0)}</p>
                <p className="text-sm text-gray-500">Total Students</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{(MOCK_TEAM.reduce((sum, m) => sum + m.rating, 0) / MOCK_TEAM.length).toFixed(1)}</p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="team-grid">
          {MOCK_TEAM.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <p className="text-blue-600 text-sm">{member.role}</p>
                      <Badge className={member.status === 'active' ? 'bg-green-100 text-green-700 mt-1' : 'bg-amber-100 text-amber-700 mt-1'}>
                        {member.status === 'active' ? 'Active' : 'Away'}
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
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{member.students}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xl font-bold text-gray-900">{member.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </CounselorLayout>
  );
}
