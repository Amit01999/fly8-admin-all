import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DollarSign, Check, X, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCommissionManager() {
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/admin/commissions');
      setCommissions(response.data.commissions);
      setSummary(response.data.summary);
    } catch (error) {
      toast.error('Failed to fetch commissions');
    } finally {
      setLoading(false);
    }
  };

  const approveCommission = async (commissionId) => {
    try {
      await api.put(`/admin/commissions/${commissionId}/approve`);
      toast.success('Commission approved');
      fetchCommissions();
    } catch (error) {
      toast.error('Failed to approve commission');
    }
  };

  const processPayoutAdmin = async (commissionId) => {
    try {
      await api.post(`/admin/commissions/${commissionId}/payout`);
      toast.success('Payout processed successfully');
      fetchCommissions();
    } catch (error) {
      toast.error('Failed to process payout');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700',
      approved: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return <div className="text-center py-8">Loading commissions...</div>;
  }

  return (
    <div className="space-y-6" data-testid="admin-commission-manager">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total Commissions</p>
          <p className="text-2xl font-bold">{summary?.total || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
          <p className="text-2xl font-bold text-amber-600">{summary?.pending || 0}</p>
          <p className="text-xs text-gray-500">${summary?.totalPending?.toFixed(2) || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-blue-600">{summary?.approved || 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-green-600">${summary?.totalPaid?.toFixed(2) || 0}</p>
        </Card>
      </div>

      {/* Commission List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-outfit font-bold">Commission Management</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 font-semibold text-gray-700">Agent</th>
                <th className="pb-3 font-semibold text-gray-700">Amount</th>
                <th className="pb-3 font-semibold text-gray-700">Percentage</th>
                <th className="pb-3 font-semibold text-gray-700">Status</th>
                <th className="pb-3 font-semibold text-gray-700">Date</th>
                <th className="pb-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr
                  key={commission.commissionId}
                  className="border-b last:border-0"
                  data-testid={`admin-commission-${commission.commissionId}`}
                >
                  <td className="py-4">
                    <div className="font-medium">{commission.agentId}</div>
                  </td>
                  <td className="py-4 font-semibold text-green-600">
                    ${commission.amount.toFixed(2)}
                  </td>
                  <td className="py-4">{commission.percentage}%</td>
                  <td className="py-4">
                    <Badge className={getStatusBadge(commission.status)}>
                      {commission.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {new Date(commission.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {commission.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => approveCommission(commission.commissionId)}
                          data-testid={`approve-commission-${commission.commissionId}`}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {commission.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => processPayoutAdmin(commission.commissionId)}
                          data-testid={`payout-commission-${commission.commissionId}`}
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Process Payout
                        </Button>
                      )}
                      {commission.status === 'paid' && (
                        <span className="text-sm text-green-600 font-medium">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
