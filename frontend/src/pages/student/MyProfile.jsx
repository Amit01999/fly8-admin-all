import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, FileText, Edit } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

export default function MyProfile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/students/profile');
      setStudent(response.data.student);
    } catch (error) {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="my-profile-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-outfit font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information</p>
        </div>

        {/* Profile Header */}
        <Card className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-outfit font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Student</Badge>
                  <Badge className="bg-green-100 text-green-700">Verified</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">Passionate about technology and eager to pursue advanced studies abroad.</p>
              </div>
            </div>
            <Button onClick={() => setEditMode(!editMode)}>
              <Edit className="w-4 h-4 mr-2" />
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-outfit font-bold">Personal Information</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">Your basic personal details</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">First Name</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.firstName || 'John'}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Last Name</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.lastName || 'Doe'}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.email || 'john.doe@email.com'}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.phone || '+1 (555) 123-4567'}</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">05/15/1998</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Nationality
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{user?.country || 'United States'}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">123 Main Street, New York, NY 10001</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Passport Number
              </Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">US123456789</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Education Details */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-outfit font-bold">Education Details</h3>
          </div>
          <p className="text-sm text-gray-600 mb-6">Your academic background and goals</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Current Education</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">Bachelor's in Computer Science</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Institution</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">MIT</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Graduation Year</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">2024</p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">GPA</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">3.8</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Study Abroad Goals */}
        <Card className="p-6">
          <h3 className="text-xl font-outfit font-bold mb-4">Study Abroad Goals</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-gray-700">Target Country</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">
                  {student?.interestedCountries?.join(', ') || 'United Kingdom'}
                </p>
              </div>
            </div>

            <div>
              <Label className="text-gray-700">Target Program</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">Master's in Data Science</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label className="text-gray-700">Bio / Personal Statement</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900">Passionate about technology and eager to pursue advanced studies abroad.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}