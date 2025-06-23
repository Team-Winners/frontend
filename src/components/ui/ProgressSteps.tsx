import React from 'react';

type ProgressStepProps = {
  current: number;
  total: number;
  labels?: string[];
};

const ProgressSteps: React.FC<ProgressStepProps> = ({ 
  current, 
  total, 
  labels 
}) => {
  // Generate array from 1 to total
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                ${step < current ? 'bg-green-100 text-green-600 border-2 border-green-500' : 
                  step === current ? 'bg-blue-600 text-white' : 
                  'bg-gray-100 text-gray-400'}`}
            >
              {step < current ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step
              )}
            </div>
            
            {labels && (
              <span 
                className={`mt-2 text-xs font-medium 
                  ${step <= current ? 'text-gray-700' : 'text-gray-400'}`}
              >
                {labels[step - 1]}
              </span>
            )}
          </div>
        ))}
      </div>
      
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
        <div 
          className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressSteps;
