import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Bell, Shield, Settings as SettingsIcon, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [documentReminders, setDocumentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleSave = () => {
    toast.success('Preferences saved successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="account-settings-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-outfit font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and security</p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-outfit font-bold">Notification Settings</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">Choose how you want to be notified</p>

              {/* Notification Channels */}
              <div className="space-y-6 mb-8">
                <h4 className="font-semibold text-gray-900">Notification Channels</h4>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-gray-700 mt-0.5" />
                    <div>
                      <Label className="font-semibold">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                    data-testid="email-notifications-toggle"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-gray-700 mt-0.5" />
                    <div>
                      <Label className="font-semibold">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                    data-testid="push-notifications-toggle"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 text-gray-700 mt-0.5" />
                    <div>
                      <Label className="font-semibold">SMS Notifications</Label>
                      <p className="text-sm text-gray-600">Text message alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                    data-testid="sms-notifications-toggle"
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-6">
                <h4 className="font-semibold text-gray-900">Notification Types</h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Service Updates</Label>
                    <p className="text-sm text-gray-600">Status changes and progress updates</p>
                  </div>
                  <Switch
                    checked={serviceUpdates}
                    onCheckedChange={setServiceUpdates}
                    data-testid="service-updates-toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Document Reminders</Label>
                    <p className="text-sm text-gray-600">Deadline and upload reminders</p>
                  </div>
                  <Switch
                    checked={documentReminders}
                    onCheckedChange={setDocumentReminders}
                    data-testid="document-reminders-toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">Promotions and newsletters</p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                    data-testid="marketing-emails-toggle"
                  />
                </div>
              </div>

              <div className="mt-8">
                <Button onClick={handleSave} data-testid="save-preferences-button">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-outfit font-bold">Security Settings</h3>
              </div>
              <p className="text-gray-600 mb-6">Manage your account security</p>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Connected Devices
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="p-6">
              <h3 className="text-xl font-outfit font-bold mb-6">Preferences</h3>
              <p className="text-gray-600 mb-6">Customize your experience</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Language</Label>
                  <select className="border rounded-lg px-3 py-2">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Timezone</Label>
                  <select className="border rounded-lg px-3 py-2">
                    <option>EST (UTC-5)</option>
                    <option>PST (UTC-8)</option>
                    <option>GMT (UTC+0)</option>
                  </select>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-outfit font-bold">Privacy Settings</h3>
              </div>
              <p className="text-gray-600 mb-6">Control your privacy and data</p>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Delete My Account
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}