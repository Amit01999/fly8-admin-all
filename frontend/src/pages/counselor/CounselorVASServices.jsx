import React from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Globe,
  Shield,
  Plane,
  Home,
  CreditCard,
  FileCheck,
  Star,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const VAS_SERVICES = [
  { id: 1, name: 'Travel Insurance', description: 'Comprehensive travel insurance for international students', icon: Shield, price: '$99', rating: 4.8, users: 1250 },
  { id: 2, name: 'Airport Pickup', description: 'Reliable airport pickup service at your destination', icon: Plane, price: '$45', rating: 4.9, users: 890 },
  { id: 3, name: 'SIM Card Package', description: 'International SIM card with data and calling plans', icon: Globe, price: '$25', rating: 4.7, users: 2100 },
  { id: 4, name: 'Temporary Housing', description: 'Short-term accommodation while you find permanent housing', icon: Home, price: '$150/week', rating: 4.6, users: 567 },
  { id: 5, name: 'Forex Services', description: 'Best exchange rates for international transfers', icon: CreditCard, price: 'Variable', rating: 4.8, users: 1890 },
  { id: 6, name: 'Document Attestation', description: 'Official document verification and attestation', icon: FileCheck, price: '$75', rating: 4.5, users: 432 },
];

export default function CounselorVASServices() {
  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-vas-services">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">VAS Services</h1>
          <p className="text-gray-500">Value-Added Services for your students</p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="vas-services-grid">
          {VAS_SERVICES.map((service, index) => {
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
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <Badge className="bg-green-100 text-green-700">{service.price}</Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">{service.users.toLocaleString()} users</span>
                  </div>

                  <Button className="w-full group-hover:bg-blue-600" data-testid={`apply-vas-${service.id}`}>
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </CounselorLayout>
  );
}
