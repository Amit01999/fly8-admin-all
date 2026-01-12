import React, { useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
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
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const PRODUCTS = [
  { id: 1, name: 'Profile Assessment', description: 'Comprehensive evaluation of student profile to identify strengths and areas of improvement', icon: Users, color: 'from-rose-400 to-pink-500', category: 'Assessment', rating: 4.8, applicants: 234 },
  { id: 2, name: 'Pre-application Support', description: 'Expert guidance on document preparation and application strategy', icon: FileText, color: 'from-teal-400 to-cyan-500', category: 'Support', rating: 4.9, applicants: 189 },
  { id: 3, name: 'University Application', description: 'End-to-end university application assistance for top global universities', icon: GraduationCap, color: 'from-violet-400 to-purple-500', category: 'Education', rating: 4.7, applicants: 456 },
  { id: 4, name: 'Visa & Interview Support', description: 'Complete visa application support and mock interview preparation', icon: FileText, color: 'from-blue-400 to-indigo-500', category: 'Visa', rating: 4.9, applicants: 312 },
  { id: 5, name: 'Ticket & Travel Support', description: 'Flight booking assistance and travel arrangement services', icon: Plane, color: 'from-orange-400 to-amber-500', category: 'Travel', rating: 4.6, applicants: 167 },
  { id: 6, name: 'Accommodation Finder', description: 'Find the perfect student housing near your university', icon: Home, color: 'from-pink-400 to-rose-500', category: 'Housing', rating: 4.5, applicants: 289 },
  { id: 7, name: 'Education Loan', description: 'Financial assistance and education loan processing with competitive rates', icon: CreditCard, color: 'from-green-400 to-emerald-500', category: 'Finance', rating: 4.8, applicants: 378 },
  { id: 8, name: 'Insurance Services', description: 'Health and travel insurance packages for international students', icon: Shield, color: 'from-cyan-400 to-blue-500', category: 'Insurance', rating: 4.7, applicants: 145 },
  { id: 9, name: 'Career Services', description: 'Job placement assistance and career guidance for students abroad', icon: Briefcase, color: 'from-slate-400 to-gray-500', category: 'Career', rating: 4.6, applicants: 198 },
];

export default function CounselorExploreProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-explore-products">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">Explore Products</h1>
          <p className="text-gray-500">Discover and offer services to your students</p>
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
                data-testid="search-products-input"
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
                  <div className={`h-32 bg-gradient-to-br ${product.color} flex items-center justify-center`}>
                    <Icon className="w-12 h-12 text-white/90" />
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{product.applicants} applicants</span>
                      <Button size="sm" data-testid={`apply-product-${product.id}`}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </CounselorLayout>
  );
}
