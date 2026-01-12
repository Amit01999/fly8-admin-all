import React, { useState } from 'react';
import AgentLayout from '../../components/layout/AgentLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  GraduationCap,
  Plane,
  Home,
  CreditCard,
  Shield,
  Briefcase,
  FileText,
  Users,
  Star,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 1, name: 'Profile Assessment', description: 'Comprehensive student profile evaluation', icon: Users, color: 'from-rose-400 to-pink-500', category: 'Assessment', commission: '10%', rating: 4.8 },
  { id: 2, name: 'Pre-application Support', description: 'Document preparation and guidance', icon: FileText, color: 'from-teal-400 to-cyan-500', category: 'Support', commission: '8%', rating: 4.9 },
  { id: 3, name: 'University Application', description: 'Complete university application assistance', icon: GraduationCap, color: 'from-violet-400 to-purple-500', category: 'Education', commission: '15%', rating: 4.7 },
  { id: 4, name: 'Visa & Interview Support', description: 'Visa processing and interview prep', icon: FileText, color: 'from-blue-400 to-indigo-500', category: 'Visa', commission: '12%', rating: 4.9 },
  { id: 5, name: 'Ticket & Travel Support', description: 'Flight and travel arrangements', icon: Plane, color: 'from-orange-400 to-amber-500', category: 'Travel', commission: '5%', rating: 4.6 },
  { id: 6, name: 'Accommodation Finder', description: 'Student housing search service', icon: Home, color: 'from-pink-400 to-rose-500', category: 'Housing', commission: '8%', rating: 4.5 },
  { id: 7, name: 'Education Loan', description: 'Loan processing assistance', icon: CreditCard, color: 'from-green-400 to-emerald-500', category: 'Finance', commission: '10%', rating: 4.8 },
  { id: 8, name: 'Insurance Services', description: 'Health and travel insurance', icon: Shield, color: 'from-cyan-400 to-blue-500', category: 'Insurance', commission: '6%', rating: 4.7 },
  { id: 9, name: 'Career Services', description: 'Job placement assistance', icon: Briefcase, color: 'from-slate-400 to-gray-500', category: 'Career', commission: '15%', rating: 4.6 },
];

export default function AgentExploreProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AgentLayout>
      <div className="space-y-6" data-testid="agent-explore-products">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">Explore Products</h1>
          <p className="text-gray-500">Discover services to offer and earn commissions</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="products-grid">
          {filteredProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all group">
                  <div className={`h-28 bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white/90" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-gray-100 text-gray-700 text-xs">{product.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Commission</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">{product.commission}</Badge>
                    </div>

                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600" size="sm">
                      Refer Student
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AgentLayout>
  );
}
