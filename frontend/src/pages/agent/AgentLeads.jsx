import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  Star,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_LEADS = [
  { id: '1', name: 'Robert Chen', email: 'robert@email.com', phone: '+1 234 567 8900', interest: 'USA - Computer Science', score: 92, status: 'hot', source: 'Referral', createdAt: '1 hour ago' },
  { id: '2', name: 'Anna Patel', email: 'anna@email.com', phone: '+1 234 567 8901', interest: 'UK - Business', score: 78, status: 'warm', source: 'Website', createdAt: '3 hours ago' },
  { id: '3', name: 'Kevin Wilson', email: 'kevin@email.com', phone: '+1 234 567 8902', interest: 'Canada - Engineering', score: 55, status: 'cold', source: 'Social Media', createdAt: '1 day ago' },
  { id: '4', name: 'Lisa Kim', email: 'lisa@email.com', phone: '+1 234 567 8903', interest: 'Australia - Medicine', score: 88, status: 'hot', source: 'Event', createdAt: '2 hours ago' },
  { id: '5', name: 'Tom Davis', email: 'tom@email.com', phone: '+1 234 567 8904', interest: 'Germany - MBA', score: 65, status: 'warm', source: 'Referral', createdAt: '5 hours ago' },
];

export default function AgentLeads() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredLeads = MOCK_LEADS.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || lead.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hot': return <Badge className="bg-red-100 text-red-700">Hot</Badge>;
      case 'warm': return <Badge className="bg-amber-100 text-amber-700">Warm</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700">Cold</Badge>;
    }
  };

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-leads">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Shortlisting Leads</h1>
            <p className="text-gray-500">Manage and convert your leads into students</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600">
            Add New Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_LEADS.length}</p>
                <p className="text-sm text-gray-500">Total Leads</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_LEADS.filter(l => l.status === 'hot').length}</p>
                <p className="text-sm text-gray-500">Hot Leads</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{MOCK_LEADS.filter(l => l.status === 'warm').length}</p>
                <p className="text-sm text-gray-500">Warm Leads</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-white border-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-sm text-gray-500">Converted</p>
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
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('all')}>All</Button>
              <Button variant={filter === 'hot' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('hot')}>Hot</Button>
              <Button variant={filter === 'warm' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('warm')}>Warm</Button>
              <Button variant={filter === 'cold' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('cold')}>Cold</Button>
            </div>
          </div>
        </Card>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="leads-grid">
          {filteredLeads.map((lead, index) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                      {getStatusBadge(lead.status)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{lead.phone}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-500 mb-1">Interested In</p>
                  <p className="font-medium text-sm text-gray-900">{lead.interest}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Lead Score</p>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{lead.score}%</span>
                    </div>
                  </div>
                  <Badge className="bg-gray-100 text-gray-700 text-xs">{lead.source}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" size="sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Convert
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>

                <p className="text-xs text-gray-400 mt-3 text-center">Added {lead.createdAt}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AgentLayout>
  );
}
