import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Check, Clock, Sparkles } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'sonner';

const SERVICES_DATA = [
  {
    id: 'service-1',
    name: 'Profile Assessment',
    description: 'Comprehensive evaluation of your academic and professional profile to identify the best opportunities.',
    duration: '2-3 days',
    startingAt: '$99',
    color: 'bg-blue-500',
    icon: '🎯',
    features: ['Personalized evaluation', 'University recommendations', 'Gap analysis'],
    popular: true
  },
  {
    id: 'service-2',
    name: 'Pre-application Support',
    description: 'Document preparation, SOP writing, and recommendation letter guidance for a strong application.',
    duration: '1-2 weeks',
    startingAt: '$249',
    color: 'bg-purple-500',
    icon: '📄',
    features: ['SOP drafting', 'Resume building', 'LOR guidance'],
    popular: true
  },
  {
    id: 'service-3',
    name: 'Apply University',
    description: 'End-to-end university application assistance including shortlisting and submission.',
    duration: '2-4 weeks',
    startingAt: '$499',
    color: 'bg-pink-500',
    icon: '🎓',
    features: ['University shortlisting', 'Application filling', 'Fee payment support'],
    popular: true
  },
  {
    id: 'service-4',
    name: 'Visa & Interview Support',
    description: 'Complete visa application guidance and mock interview preparation.',
    duration: '1-3 weeks',
    startingAt: '$349',
    color: 'bg-orange-500',
    icon: '✈️',
    features: ['Visa documentation', 'Form filling', 'Mock interviews']
  },
  {
    id: 'service-5',
    name: 'Ticket & Travel Support',
    description: 'Flight booking, travel insurance, and pre-departure orientation.',
    duration: '3-5 days',
    startingAt: '$149',
    color: 'bg-amber-500',
    icon: '🎫',
    features: ['Flight booking', 'Travel insurance', 'Forex assistance']
  },
  {
    id: 'service-6',
    name: 'Find Accommodation',
    description: 'Housing search and setup assistance in your destination country.',
    duration: '1-2 weeks',
    startingAt: '$199',
    color: 'bg-green-500',
    icon: '🏠',
    features: ['Housing search', 'Lease review', 'Virtual tours']
  },
  {
    id: 'service-7',
    name: 'Education Loan',
    description: 'Financial assistance and loan processing with partner banks.',
    duration: '2-4 weeks',
    startingAt: '$199',
    color: 'bg-emerald-500',
    icon: '💰',
    features: ['Loan comparison', 'Documentation', 'Application support']
  },
  {
    id: 'service-8',
    name: 'Find Jobs Abroad',
    description: 'Career guidance, resume optimization, and job placement assistance.',
    duration: 'Ongoing',
    startingAt: '$399',
    color: 'bg-teal-500',
    icon: '💼',
    features: ['Resume optimization', 'Job search', 'Interview prep']
  }
];

export default function ExploreServices() {
  const [services, setServices] = useState(SERVICES_DATA);
  const [appliedServices, setAppliedServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppliedServices();
  }, []);

  const fetchAppliedServices = async () => {
    try {
      const response = await api.get('/students/my-applications');
      setAppliedServices(response.data.applications.map(app => app.serviceId));
    } catch (error) {
      console.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (serviceId) => {
    try {
      await api.post('/students/apply-services', { serviceIds: [serviceId] });
      toast.success('Service applied successfully!');
      setAppliedServices([...appliedServices, serviceId]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'popular' ? service.popular :
      filter === 'applied' ? appliedServices.includes(service.id) :
      true;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    applied: appliedServices.length,
    available: SERVICES_DATA.length - appliedServices.length,
    popular: SERVICES_DATA.filter(s => s.popular).length
  };

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="explore-services-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-outfit font-bold text-gray-900">Explore Services</h1>
          <p className="text-gray-600 mt-1">Discover and apply for services to support your journey</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.applied}</p>
                <p className="text-sm text-blue-700">Services Applied</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.available}</p>
                <p className="text-sm text-green-700">Available to Apply</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">{stats.popular}</p>
                <p className="text-sm text-purple-700">Popular Services</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-services-input"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              data-testid="filter-all"
            >
              All Services
            </Button>
            <Button
              variant={filter === 'popular' ? 'default' : 'outline'}
              onClick={() => setFilter('popular')}
              data-testid="filter-popular"
            >
              Popular
            </Button>
            <Button
              variant={filter === 'applied' ? 'default' : 'outline'}
              onClick={() => setFilter('applied')}
              data-testid="filter-applied"
            >
              Applied
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isApplied = appliedServices.includes(service.id);
            
            return (
              <Card
                key={service.id}
                className="p-6 hover:shadow-xl transition-shadow relative overflow-hidden"
                data-testid={`service-card-${service.id}`}
              >
                {service.popular && (
                  <Badge className="absolute top-4 right-4 bg-cyan-500 text-white">
                    Popular
                  </Badge>
                )}

                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {service.icon}
                </div>

                <h3 className="text-xl font-outfit font-bold mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-semibold">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Starting at</span>
                    <span className="font-bold text-lg text-primary">{service.startingAt}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {isApplied ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full"
                    data-testid={`applied-${service.id}`}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Already Applied
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleApply(service.id)}
                    className="w-full"
                    data-testid={`apply-${service.id}`}
                  >
                    Apply Now
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}