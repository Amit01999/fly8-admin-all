import React, { useState } from 'react';
import CounselorLayout from '../../components/layout/CounselorLayout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { 
  Search,
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COURSES = [
  { id: '1', name: 'Computer Science', university: 'MIT', country: 'USA', duration: '4 years', fee: '$58,000/year', rating: 4.9, intake: 'Fall, Spring' },
  { id: '2', name: 'Business Analytics', university: 'Oxford', country: 'UK', duration: '2 years', fee: '£45,000/year', rating: 4.8, intake: 'Fall' },
  { id: '3', name: 'Data Science', university: 'Stanford', country: 'USA', duration: '2 years', fee: '$62,000/year', rating: 4.9, intake: 'Fall, Spring' },
  { id: '4', name: 'MBA', university: 'Harvard', country: 'USA', duration: '2 years', fee: '$73,000/year', rating: 5.0, intake: 'Fall' },
  { id: '5', name: 'Engineering', university: 'Cambridge', country: 'UK', duration: '3 years', fee: '£38,000/year', rating: 4.8, intake: 'Fall' },
  { id: '6', name: 'Medicine', university: 'Toronto', country: 'Canada', duration: '4 years', fee: 'CAD 45,000/year', rating: 4.7, intake: 'Fall' },
];

export default function CounselorCourseFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  const countries = ['all', ...new Set(MOCK_COURSES.map(c => c.country))];

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || course.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  return (
    <CounselorLayout>
      <div className="space-y-6" data-testid="counselor-course-finder">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-outfit font-bold text-gray-900">Course Finder</h1>
          <p className="text-gray-500">Find the perfect course for your students</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 bg-white border-0 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses or universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {countries.map(country => (
                <Button 
                  key={country}
                  variant={selectedCountry === country ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCountry(country)}
                  className="capitalize"
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="courses-grid">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-6 bg-white border-0 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{course.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-3">{course.university}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{course.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{course.fee}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <Badge className="bg-blue-100 text-blue-700">{course.intake}</Badge>
                  <Button size="sm" data-testid={`apply-course-${course.id}`}>
                    Apply Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </CounselorLayout>
  );
}
