import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wallet, Download, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useSocket } from '../../context/SocketContext';

export default function CommissionTracker() {
  const [commissions, setCommissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchCommissions();

    if (socket) {
      socket.on('commission_paid', () => {
        fetchCommissions();
        toast.success('Commission payment received!');
      });
    }

    return () => {
      if (socket) {
        socket.off('commission_paid');
      }
    };
  }, [socket]);

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/agents/commissions');
      setCommissions(response.data.commissions);
      setSummary(response.data.summary);
    } catch (error) {
      toast.error('Failed to fetch commissions');
    } finally {
      setLoading(false);
    }
  };

  const requestPayout = async (commissionId) => {
    try {
      await api.post(`/agents/commissions/${commissionId}/request-payout`);
      toast.success('Payout requested successfully');
      fetchCommissions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request payout');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'paid': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading commissions...</div>;
  }

  return (
    <div className="space-y-6" data-testid="commission-tracker">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold">${summary?.totalPending?.toFixed(2) || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-bold">${summary?.totalApproved?.toFixed(2) || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-xl font-bold">${summary?.totalPaid?.toFixed(2) || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lifetime</p>
              <p className="text-xl font-bold">${summary?.lifetimeEarnings?.toFixed(2) || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Commission List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-outfit font-bold">Commission History</h3>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {commissions.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No commissions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {commissions.map((commission) => (
              <div
                key={commission.commissionId}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                data-testid={`commission-${commission.commissionId}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                      ${commission.amount}
                    </div>
                    <div>
                      <p className="font-semibold">{commission.percentage}% Commission</p>
                      <p className="text-sm text-gray-600">
                        {new Date(commission.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(commission.status)}>
                    {commission.status}
                  </Badge>
                  
                  {commission.status === 'approved' && (
                    <Button
                      size="sm"
                      onClick={() => requestPayout(commission.commissionId)}
                      data-testid={`request-payout-${commission.commissionId}`}
                    >
                      Request Payout
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}