import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2,
  UserPlus,
  FileText,
  AlertCircle,
  Settings,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'new_student',
    title: 'New Student Registration',
    message: 'John Smith has registered and completed onboarding.',
    timestamp: '2 hours ago',
    read: false,
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 2,
    type: 'application',
    title: 'Application Submitted',
    message: 'Sarah Johnson submitted an application for UK Student Visa.',
    timestamp: '4 hours ago',
    read: false,
    icon: FileText,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Pending Assignment',
    message: '5 students are waiting for counselor assignment.',
    timestamp: '6 hours ago',
    read: true,
    icon: AlertCircle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  {
    id: 4,
    type: 'system',
    title: 'System Update',
    message: 'New commission rates have been applied successfully.',
    timestamp: '1 day ago',
    read: true,
    icon: Settings,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 5,
    type: 'new_student',
    title: 'New Student Registration',
    message: 'Emily Chen has registered from China.',
    timestamp: '1 day ago',
    read: true,
    icon: UserPlus,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState('all'); // all, unread, read

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-notifications-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0} data-testid="mark-all-read-btn">
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <Card className="p-2">
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('all')}
              data-testid="filter-all-btn"
            >
              All ({notifications.length})
            </Button>
            <Button 
              variant={filter === 'unread' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('unread')}
              data-testid="filter-unread-btn"
            >
              Unread ({unreadCount})
            </Button>
            <Button 
              variant={filter === 'read' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setFilter('read')}
              data-testid="filter-read-btn"
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3" data-testid="notifications-list">
          {filteredNotifications.length === 0 ? (
            <Card className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">
                {filter === 'unread' ? 'All notifications have been read' : 'No notifications to display'}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                      !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${notification.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.iconColor}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <Badge className="bg-blue-500 text-white text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{notification.timestamp}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                            data-testid={`mark-read-${notification.id}`}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                          data-testid={`delete-notification-${notification.id}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
