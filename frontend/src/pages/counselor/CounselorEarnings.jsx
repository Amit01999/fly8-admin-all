import React, { useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  DollarSign,
  TrendingUp,
  Wallet,
  Download,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_EARNINGS = [
  { id: '1', student: 'Sarah Johnson', service: 'University Application', amount: 450, commission: 15, status: 'paid', date: 'Jan 15, 2024' },
  { id: '2', student: 'Mike Chen', service: 'Visa Support', amount: 320, commission: 12, status: 'paid', date: 'Jan 12, 2024' },
  { id: '3', student: 'Emma Wilson', service: 'Accommodation', amount: 180, commission: 10, status: 'pending', date: 'Jan 10, 2024' },
  { id: '4', student: 'James Brown', service: 'Education Loan', amount: 550, commission: 18, status: 'paid', date: 'Jan 8, 2024' },
  { id: '5', student: 'Lisa Davis', service: 'Travel Booking', amount: 120, commission: 8, status: 'pending', date: 'Jan 5, 2024' },
];

const MONTHLY_EARNINGS = [
  { month: 'January', students: 5, amount: 1250, status: 'paid' },
  { month: 'December', students: 4, amount: 980, status: 'paid' },
  { month: 'November', students: 6, amount: 1420, status: 'paid' },
];

export default function CounselorEarnings() {
  const [searchTerm, setSearchTerm] = useState('');

  const totalEarnings = MOCK_EARNINGS.reduce((sum, e) => sum + e.amount, 0);
  const pendingEarnings = MOCK_EARNINGS.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);
  const paidEarnings = MOCK_EARNINGS.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-earnings">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-500">Track your commissions and payments</p>
          </div>
          <Button variant="outline" data-testid="download-report-btn">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${pendingEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">${paidEarnings.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Paid Out</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-5 bg-white border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{MOCK_EARNINGS.length}</p>
                  <p className="text-sm text-gray-500">Transactions</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border-0 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-outfit font-bold text-gray-900">Recent Transactions</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48 border-gray-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {MOCK_EARNINGS.map((earning, index) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {earning.student.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{earning.student}</p>
                        <p className="text-sm text-gray-500">{earning.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${earning.amount}</p>
                      <Badge className={earning.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                        {earning.status}
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

          {/* Monthly Summary */}
          <div>
            <Card className="p-6 bg-white border-0 shadow-sm">
              <h3 className="text-lg font-outfit font-bold text-gray-900 mb-4">Commission History</h3>
              
              <div className="space-y-4">
                {MONTHLY_EARNINGS.map((month, index) => (
                  <motion.div
                    key={month.month}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{month.month}</p>
                      <p className="text-sm text-gray-500">{month.students} students</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${month.amount.toLocaleString()}</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">{month.status}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
                View Full History →
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </CounselorLayout>
  );
}
