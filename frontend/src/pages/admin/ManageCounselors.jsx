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
  Star,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function ManageCounselors() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const response = await api.get('/admin/counselors');
      setCounselors(response.data.counselors || []);
    } catch (error) {
      toast.error('Failed to fetch counselors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCounselors = counselors.filter(counselor => {
    const name = `${counselor.firstName || ''} ${counselor.lastName || ''}`.toLowerCase();
    const email = (counselor.email || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="manage-counselors-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Manage Counselors</h1>
            <p className="text-gray-600">View and manage all counselors</p>
          </div>
          <Button data-testid="add-counselor-btn">
            <Plus className="w-4 h-4 mr-2" />
            Add Counselor
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search counselors by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-counselors-input"
              />
            </div>
            <Button variant="outline" data-testid="filter-counselors-btn">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </Card>

        {/* Counselors Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCounselors.length === 0 ? (
          <Card className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No counselors found</p>
            <p className="text-sm">Try adjusting your search or add a new counselor</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="counselors-grid">
            {filteredCounselors.map((counselor, index) => (
              <motion.div
                key={counselor._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {counselor.firstName?.[0]}{counselor.lastName?.[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{counselor.firstName} {counselor.lastName}</h3>
                        <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Counselor</Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{counselor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{counselor.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{counselor.assignedStudents?.length || 0} students assigned</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>{counselor.rating || '4.5'} rating</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`view-counselor-${index}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`edit-counselor-${index}`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="icon" data-testid={`delete-counselor-${index}`}>
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
            Showing {filteredCounselors.length} of {counselors.length} counselors
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
