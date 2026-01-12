import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, FileText, School, Stamp, Plane, Home, Banknote, Briefcase, Check, Lock } from 'lucide-react';

const JOURNEY_STEPS = [
  { id: 'service-1', name: 'Profile Assessment', icon: UserCircle, color: 'bg-journey-profile', textColor: 'text-journey-profile' },
  { id: 'service-2', name: 'Pre-application Support', icon: FileText, color: 'bg-journey-preapp', textColor: 'text-journey-preapp' },
  { id: 'service-3', name: 'Apply University', icon: School, color: 'bg-journey-apply', textColor: 'text-journey-apply' },
  { id: 'service-4', name: 'Visa & Interview Support', icon: Stamp, color: 'bg-journey-visa', textColor: 'text-journey-visa' },
  { id: 'service-5', name: 'Ticket & Travel Support', icon: Plane, color: 'bg-journey-ticket', textColor: 'text-journey-ticket' },
  { id: 'service-6', name: 'Find Accommodation', icon: Home, color: 'bg-journey-accom', textColor: 'text-journey-accom' },
  { id: 'service-7', name: 'Education Loan', icon: Banknote, color: 'bg-journey-loan', textColor: 'text-journey-loan' },
  { id: 'service-8', name: 'Find Jobs Abroad', icon: Briefcase, color: 'bg-journey-jobs', textColor: 'text-journey-jobs' }
];

const STATUS_CONFIG = {
  not_started: { label: 'Not Started', color: 'bg-gray-200 text-gray-600', locked: true },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', locked: false },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', locked: false },
  on_hold: { label: 'On Hold', color: 'bg-amber-100 text-amber-700', locked: false }
};

export default function JourneyRail({ applications = [] }) {
  const scrollRef = useRef(null);

  const getApplicationStatus = (serviceId) => {
    const app = applications.find(a => a.serviceId === serviceId);
    return app ? app.status : 'not_started';
  };

  const completedSteps = applications.filter(a => a.status === 'completed').length;
  const progress = (completedSteps / JOURNEY_STEPS.length) * 100;

  return (
    <div className="w-full" data-testid="journey-rail">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-outfit font-bold text-gray-900">Your Journey Timeline</h2>
          <p className="text-gray-600">Track your progress through each step</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-outfit font-bold text-primary">{completedSteps}/{JOURNEY_STEPS.length}</div>
          <div className="text-sm text-gray-600">Steps Completed</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 bg-gray-200 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-journey-profile via-journey-visa to-journey-jobs"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          data-testid="journey-progress-bar"
        />
      </div>

      {/* Timeline */}
      <div 
        ref={scrollRef}
        className="relative overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="inline-flex gap-4 min-w-max px-4">
          {JOURNEY_STEPS.map((step, index) => {
            const status = getApplicationStatus(step.id);
            const statusConfig = STATUS_CONFIG[status];
            const isCompleted = status === 'completed';
            const isActive = status === 'in_progress';
            const isLocked = status === 'not_started';
            const IconComponent = step.icon;

            return (
              <motion.div
                key={step.id}
                className="snap-start flex-shrink-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                data-testid={`journey-step-${step.id}`}
              >
                {/* Step Card */}
                <div className={`relative w-72 p-6 rounded-2xl border-2 transition-all ${
                  isCompleted ? 'border-green-400 bg-green-50 shadow-lg' :
                  isActive ? `border-2 ${step.color.replace('bg-', 'border-')} bg-white shadow-2xl scale-105` :
                  isLocked ? 'border-gray-200 bg-gray-50 opacity-60' :
                  'border-gray-300 bg-white shadow'
                }`}>
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4 mx-auto relative`}>
                    <IconComponent className="w-8 h-8 text-white" />
                    {isCompleted && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" data-testid={`step-completed-${step.id}`} />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" data-testid={`step-locked-${step.id}`} />
                      </div>
                    )}
                  </div>

                  {/* Step Name */}
                  <h3 className={`font-outfit font-semibold text-center mb-2 ${
                    isActive ? step.textColor : 'text-gray-900'
                  }`}>
                    {step.name}
                  </h3>

                  {/* Status Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color} w-full text-center`} data-testid={`step-status-${step.id}`}>
                    {statusConfig.label}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-primary"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>

                {/* Connector Line */}
                {index < JOURNEY_STEPS.length - 1 && (
                  <div className="absolute top-20 left-full w-4 h-1 bg-gray-300">
                    <div className={`h-full transition-all ${isCompleted ? 'bg-green-400 w-full' : 'w-0'}`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="text-center text-sm text-gray-500 mt-4">
        ← Scroll to see all steps →
      </div>
    </div>
  );
}