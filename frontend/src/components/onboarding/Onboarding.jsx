import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Plane, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 
  'Germany', 'France', 'Netherlands', 'Singapore', 
  'New Zealand', 'Ireland', 'Switzerland', 'Sweden'
];

const SERVICES = [
  { id: 'service-1', name: 'Profile Assessment', icon: '👤', color: 'bg-journey-profile' },
  { id: 'service-2', name: 'Pre-application Support', icon: '📄', color: 'bg-journey-preapp' },
  { id: 'service-3', name: 'Apply University', icon: '🎓', color: 'bg-journey-apply' },
  { id: 'service-4', name: 'Visa & Interview Support', icon: '✈️', color: 'bg-journey-visa' },
  { id: 'service-5', name: 'Ticket & Travel Support', icon: '🎫', color: 'bg-journey-ticket' },
  { id: 'service-6', name: 'Find Accommodation', icon: '🏠', color: 'bg-journey-accom' },
  { id: 'service-7', name: 'Education Loan', icon: '💰', color: 'bg-journey-loan' },
  { id: 'service-8', name: 'Find Jobs Abroad', icon: '💼', color: 'bg-journey-jobs' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    interestedCountries: [],
    selectedServices: [],
    phone: '',
    country: ''
  });

  const toggleCountry = (country) => {
    setFormData(prev => ({
      ...prev,
      interestedCountries: prev.interestedCountries.includes(country)
        ? prev.interestedCountries.filter(c => c !== country)
        : [...prev.interestedCountries, country]
    }));
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleNext = () => {
    if (step === 1 && formData.interestedCountries.length === 0) {
      toast.error('Please select at least one country');
      return;
    }
    if (step === 2 && formData.selectedServices.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!formData.phone || !formData.country) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await api.post('/students/onboarding', formData);
      
      // Apply for selected services
      await api.post('/students/apply-services', {
        serviceIds: formData.selectedServices
      });

      toast.success('Onboarding completed! Welcome to Fly8!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6" data-testid="onboarding-step-1">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-outfit font-bold mb-2">Which countries interest you?</h2>
        <p className="text-gray-600">Select all countries you'd like to study in</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {COUNTRIES.map((country) => (
          <div
            key={country}
            onClick={() => toggleCountry(country)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              formData.interestedCountries.includes(country)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            data-testid={`country-option-${country}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{country}</span>
              {formData.interestedCountries.includes(country) && (
                <Check className="w-5 h-5 text-primary" data-testid={`country-selected-${country}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleNext} size="lg" data-testid="onboarding-next-step-1">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6" data-testid="onboarding-step-2">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-outfit font-bold mb-2">Which services do you need?</h2>
        <p className="text-gray-600">Select all services you want assistance with</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            onClick={() => toggleService(service.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              formData.selectedServices.includes(service.id)
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            data-testid={`service-option-${service.id}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center text-2xl`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                </div>
              </div>
              {formData.selectedServices.includes(service.id) && (
                <Check className="w-5 h-5 text-primary flex-shrink-0" data-testid={`service-selected-${service.id}`} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={() => setStep(1)} variant="outline" data-testid="onboarding-back-step-2">
          Back
        </Button>
        <Button onClick={handleNext} size="lg" data-testid="onboarding-next-step-2">
          Continue
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6" data-testid="onboarding-step-3">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-outfit font-bold mb-2">Complete your profile</h2>
        <p className="text-gray-600">Just a few more details to get started</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 234 567 8900"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            data-testid="onboarding-phone-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Current Country</Label>
          <Input
            id="country"
            placeholder="e.g., India, USA, UK"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            data-testid="onboarding-country-input"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h4 className="font-semibold mb-2">Your Selections:</h4>
          <div className="text-sm space-y-1">
            <p><span className="font-medium">Countries:</span> {formData.interestedCountries.join(', ')}</p>
            <p><span className="font-medium">Services:</span> {formData.selectedServices.length} selected</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 max-w-md mx-auto">
        <Button onClick={() => setStep(2)} variant="outline" data-testid="onboarding-back-step-3">
          Back
        </Button>
        <Button onClick={handleComplete} size="lg" disabled={loading} data-testid="onboarding-complete-button">
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Completing...</>
          ) : (
            'Complete Setup'
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-journey-visa rounded-2xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-outfit font-bold">Fly8</h1>
          </div>
          <p className="text-lg text-gray-600">Welcome, {user?.firstName}! Let's set up your journey.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12" data-testid="onboarding-progress">
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`} data-testid={`progress-step-${num}`}>
                {num}
              </div>
              {num < 3 && (
                <div className={`w-20 h-1 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
}
