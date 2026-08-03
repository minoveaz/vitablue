import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Stepper Container */}
      <div className="flex items-center justify-between w-full select-none">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator node */}
              <div className="flex items-center gap-2 group">
                <div 
                  className={`size-7 sm:size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-primary text-white shadow-md shadow-primary/10' 
                      : isActive 
                        ? 'bg-accent text-white ring-4 ring-accent/10 shadow-md shadow-accent/10' 
                        : 'bg-slate-100 text-text-secondary/50 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                
                {/* Step label (hidden on narrow screens to ensure perfect responsiveness) */}
                <span 
                  className={`hidden sm:inline text-xs font-bold ${
                    isActive 
                      ? 'text-accent' 
                      : isCompleted 
                        ? 'text-primary' 
                        : 'text-text-secondary/50'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Line connector between steps */}
              {!isLast && (
                <div 
                  className={`flex-grow h-0.5 mx-2 sm:mx-4 rounded-full transition-all duration-300 ${
                    step.id < currentStep 
                      ? 'bg-primary' 
                      : 'bg-slate-100'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Responsive mobile label (shows active step label below the dots for compact mobile styling) */}
      <div className="block sm:hidden text-center mt-3 text-[11px] font-extrabold text-accent uppercase tracking-widest">
        Paso {currentStep}: {steps.find(s => s.id === currentStep)?.title}
      </div>
    </div>
  );
};

export default Stepper;
