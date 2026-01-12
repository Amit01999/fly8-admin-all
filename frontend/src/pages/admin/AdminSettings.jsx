import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { 
  Settings,
  DollarSign,
  Bell,
  Shield,
  Globe,
  Mail,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Commission Settings
    defaultAgentCommission: 10,
    defaultCounselorCommission: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    newStudentAlert: true,
    applicationAlert: true,
    
    // Platform Settings
    platformName: 'Fly8',
    supportEmail: 'support@fly8.com',
    defaultCurrency: 'USD'
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-settings-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage platform configuration and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={loading} data-testid="save-settings-btn">
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Commission Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-outfit font-bold text-gray-900">Commission Settings</h2>
                  <p className="text-sm text-gray-600">Configure default commission rates</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="agentCommission">Default Agent Commission (%)</Label>
                  <Input
                    id="agentCommission"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.defaultAgentCommission}
                    onChange={(e) => setSettings({ ...settings, defaultAgentCommission: e.target.value })}
                    className="mt-1"
                    data-testid="agent-commission-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Applied to all new agents</p>
                </div>

                <div>
                  <Label htmlFor="counselorCommission">Default Counselor Commission (%)</Label>
                  <Input
                    id="counselorCommission"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.defaultCounselorCommission}
                    onChange={(e) => setSettings({ ...settings, defaultCounselorCommission: e.target.value })}
                    className="mt-1"
                    data-testid="counselor-commission-input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Applied to all new counselors</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-outfit font-bold text-gray-900">Notification Settings</h2>
                  <p className="text-sm text-gray-600">Configure alert preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                  <Badge className={settings.emailNotifications ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">New Student Alerts</p>
                    <p className="text-xs text-gray-500">Get notified on new registrations</p>
                  </div>
                  <Badge className={settings.newStudentAlert ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                    {settings.newStudentAlert ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Application Alerts</p>
                    <p className="text-xs text-gray-500">Get notified on new applications</p>
                  </div>
                  <Badge className={settings.applicationAlert ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                    {settings.applicationAlert ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Platform Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-outfit font-bold text-gray-900">Platform Settings</h2>
                  <p className="text-sm text-gray-600">General platform configuration</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input
                    id="platformName"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                    className="mt-1"
                    data-testid="platform-name-input"
                  />
                </div>

                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="mt-1"
                    data-testid="support-email-input"
                  />
                </div>

                <div>
                  <Label htmlFor="defaultCurrency">Default Currency</Label>
                  <Input
                    id="defaultCurrency"
                    value={settings.defaultCurrency}
                    onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                    className="mt-1"
                    data-testid="default-currency-input"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-outfit font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-600">Manage security preferences</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Session Timeout</p>
                    <p className="text-xs text-gray-500">Auto logout after inactivity</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">30 minutes</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Audit Logging</p>
                    <p className="text-xs text-gray-500">Track all admin actions</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
