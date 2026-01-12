import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  ArrowUpRight,
  Wallet,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import { motion } from 'framer-motion';

const MONTHLY_EARNINGS = [
  { month: 'January 2024', referrals: 8, amount: 2450, growth: '+24%' },
  { month: 'December 2023', referrals: 6, amount: 1980, growth: '+15%' },
  { month: 'November 2023', referrals: 7, amount: 2120, growth: '+18%' },
  { month: 'October 2023', referrals: 5, amount: 1650, growth: '+8%' },
];

const PAYOUT_HISTORY = [
  { id: '1', amount: 2450, method: 'Bank Transfer', status: 'completed', date: 'Jan 30, 2024' },
  { id: '2', amount: 1980, method: 'Bank Transfer', status: 'completed', date: 'Dec 30, 2023' },
  { id: '3', amount: 2120, method: 'PayPal', status: 'completed', date: 'Nov 30, 2023' },
];

export default function AgentEarnings() {
  const totalEarnings = MONTHLY_EARNINGS.reduce((sum, m) => sum + m.amount, 0);
  const totalReferrals = MONTHLY_EARNINGS.reduce((sum, m) => sum + m.referrals, 0);

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-earnings">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-500">Your complete earnings overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="download-earnings-btn">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="request-payout-btn">
              <Wallet className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">${totalEarnings.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-emerald-200" />
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">$1,250</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Referrals</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Avg per Referral</p>
                  <p className="text-2xl font-bold text-gray-900">${Math.round(totalEarnings / totalReferrals)}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Breakdown */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Monthly Breakdown</h3>
            
            <div className="space-y-4" data-testid="monthly-breakdown">
              {MONTHLY_EARNINGS.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{month.month}</p>
                    <p className="text-sm text-gray-500">{month.referrals} referrals</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${month.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="w-3 h-3" />
                      <span className="text-xs">{month.growth}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Payout History */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Payout History</h3>
            
            <div className="space-y-4" data-testid="payout-history">
              {PAYOUT_HISTORY.map((payout, index) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">${payout.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{payout.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700">{payout.status}</Badge>
                    <p className="text-xs text-gray-400 mt-1">{payout.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View All Payouts
            </Button>
          </Card>
        </div>
      </div>
    </AgentLayout>
  );
}
