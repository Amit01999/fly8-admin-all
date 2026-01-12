import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  Wallet,
  Download,
  Calendar,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COMMISSIONS = [
  { id: '1', student: 'Alex Thompson', service: 'University Application', amount: 450, rate: '15%', status: 'paid', date: 'Jan 15, 2024' },
  { id: '2', student: 'Priya Patel', service: 'Visa Support', amount: 320, rate: '12%', status: 'paid', date: 'Jan 12, 2024' },
  { id: '3', student: 'David Kim', service: 'Education Loan', amount: 550, rate: '10%', status: 'pending', date: 'Jan 10, 2024' },
  { id: '4', student: 'Maria Garcia', service: 'Accommodation', amount: 180, rate: '8%', status: 'paid', date: 'Jan 8, 2024' },
  { id: '5', student: 'James Wilson', service: 'Travel Booking', amount: 120, rate: '5%', status: 'pending', date: 'Jan 5, 2024' },
];

const COMMISSION_RATES = [
  { service: 'University Application', rate: '15%', avgEarning: '$450' },
  { service: 'Visa Support', rate: '12%', avgEarning: '$320' },
  { service: 'Education Loan', rate: '10%', avgEarning: '$550' },
  { service: 'Accommodation', rate: '8%', avgEarning: '$180' },
  { service: 'Travel Booking', rate: '5%', avgEarning: '$120' },
];

export default function AgentCommission() {
  const totalEarned = MOCK_COMMISSIONS.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0);
  const pendingAmount = MOCK_COMMISSIONS.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0);

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-commission">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Commission</h1>
            <p className="text-gray-500">Track your earnings and commission rates</p>
          </div>
          <Button variant="outline" data-testid="download-report-btn">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Total Earned</p>
                  <p className="text-3xl font-bold">${totalEarned.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-2 text-emerald-100">
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="text-sm">+24% vs last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">${pendingAmount.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">$1,250</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Students</p>
                  <p className="text-2xl font-bold text-gray-900">{MOCK_COMMISSIONS.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Commissions */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Recent Commissions</h3>
              
              <div className="space-y-3" data-testid="commissions-list">
                {MOCK_COMMISSIONS.map((commission, index) => (
                  <motion.div
                    key={commission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {commission.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{commission.student}</p>
                        <p className="text-sm text-gray-500">{commission.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${commission.amount}</p>
                      <Badge className={commission.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {commission.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                View All Transactions
              </Button>
            </Card>
          </div>

          {/* Commission Rates */}
          <div>
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Commission Rates</h3>
              
              <div className="space-y-4">
                {COMMISSION_RATES.map((rate, index) => (
                  <motion.div
                    key={rate.service}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{rate.service}</p>
                      <p className="text-xs text-gray-500">Avg: {rate.avgEarning}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">{rate.rate}</Badge>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}
