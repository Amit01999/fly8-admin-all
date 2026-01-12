import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  Globe,
  Shield,
  Plane,
  Home,
  CreditCard,
  FileCheck,
  Star,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

const VAS_SERVICES = [
  { id: 1, name: 'Travel Insurance', description: 'Comprehensive travel insurance coverage', icon: Shield, price: '$99', commission: '8%', rating: 4.8 },
  { id: 2, name: 'Airport Pickup', description: 'Reliable airport pickup service', icon: Plane, price: '$45', commission: '5%', rating: 4.9 },
  { id: 3, name: 'SIM Card Package', description: 'International SIM with data plans', icon: Globe, price: '$25', commission: '10%', rating: 4.7 },
  { id: 4, name: 'Temporary Housing', description: 'Short-term accommodation service', icon: Home, price: '$150/week', commission: '7%', rating: 4.6 },
  { id: 5, name: 'Forex Services', description: 'Best exchange rates for transfers', icon: CreditCard, price: 'Variable', commission: '2%', rating: 4.8 },
  { id: 6, name: 'Document Attestation', description: 'Official document verification', icon: FileCheck, price: '$75', commission: '12%', rating: 4.5 },
];

export default function AgentVASServices() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = VAS_SERVICES.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-vas-services">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">VAS Services</h1>
          <p className="text-gray-500">Value-Added Services to offer your students</p>
        </div>

        {/* Search */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200"
            />
          </div>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="vas-services-grid">
          {filteredServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-lg transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gray-100 text-gray-700">{service.price}</Badge>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-medium">{service.commission} commission</span>
                    </div>
                  </div>

                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 group-hover:shadow-lg transition-all">
                    Refer Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AgentLayout>
  );
}
