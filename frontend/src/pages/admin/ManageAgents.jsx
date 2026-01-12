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
  Users,
  DollarSign,
  Eye,
  Trash2,
  Edit,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function ManageAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/admin/agents');
      setAgents(response.data.agents || []);
    } catch (error) {
      toast.error('Failed to fetch agents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const name = `${agent.firstName || ''} ${agent.lastName || ''}`.toLowerCase();
    const email = (agent.email || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="manage-agents-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Manage Agents</h1>
            <p className="text-gray-600">View and manage all agents and their commissions</p>
          </div>
          <Button data-testid="add-agent-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Agent
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                <p className="text-sm text-gray-600">Total Agents</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{agents.filter(a => a.isActive !== false).length}</p>
                <p className="text-sm text-gray-600">Active Agents</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
                <p className="text-sm text-gray-600">Total Commissions</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Students Referred</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search agents by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-agents-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-agents-btn">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {/* Agents Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAgents.length === 0 ? (
          <Card className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No agents found</p>
            <p className="text-sm">Try adjusting your search or add a new agent</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="agents-grid">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {agent.firstName?.[0]}{agent.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{agent.firstName} {agent.lastName}</h3>
                        <Badge className={agent.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                          {agent.isActive !== false ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{agent.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{agent.referredStudents?.length || 0} students referred</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600">${agent.totalCommission || '0'} earned</span>
                    </div>
                  </div>

                  {/* Commission Rate */}
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Commission Rate</span>
                      <span className="font-semibold text-gray-900">{agent.commissionRate || 10}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`view-agent-${index}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`edit-agent-${index}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`delete-agent-${index}`}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredAgents.length} of {agents.length} agents
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
