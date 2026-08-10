import React from 'react';

interface ProcessStepsProps {
  steps: string[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => (
  <ol className="grid gap-6 md:grid-cols-3">
    {steps.map((step, index) => (
      <li key={step} className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-lg font-black text-primary">{index + 1}</span>
        <span className="pt-2 text-lg font-bold text-text-main">{step}</span>
      </li>
    ))}
  </ol>
);

export default ProcessSteps;
