import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plane, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (user.role === 'student') {
        navigate('/dashboard');
      } else if (user.role === 'super_admin') {
        navigate('/admin');
      } else if (user.role === 'counselor') {
        navigate('/counselor');
      } else if (user.role === 'agent') {
        navigate('/agent');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-journey-visa rounded-2xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-outfit font-bold">Fly8</h1>
            </div>
            <h2 className="text-2xl font-outfit font-semibold text-gray-900">Welcome back</h2>
            <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="login-email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="login-password-input"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Hero */}
      <div 
        className="hidden lg:flex flex-1 bg-gradient-to-br from-journey-profile via-journey-preapp to-journey-visa items-center justify-center p-12"
        style={{
          backgroundImage: `linear-gradient(rgba(79, 70, 229, 0.9), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1758270705902-f50dde4add9f?crop=entropy&cs=srgb&fm=jpg&q=85)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-lg text-white text-center">
          <h2 className="text-4xl font-outfit font-bold mb-4">Your Launchpad to Global Education</h2>
          <p className="text-xl opacity-90">Track your study abroad journey from application to landing your dream job.</p>
        </div>
      </div>
    </div>
  );
}