import React from 'react';

export interface ProcessStepsProps {
  steps: Array<string | ProcessStepItem>;
}

export interface ProcessStepItem {
  title: string;
  description?: string;
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ steps }) => (
  <ol className="grid gap-6 md:grid-cols-3">
    {steps.map((step, index) => {
      const item = typeof step === 'string' ? { title: step } : step;

      return (
      <li key={item.title} className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-cyan/15 text-lg font-black text-primary">{index + 1}</span>
        <div className="pt-2">
          <span className="text-lg font-bold text-text-main">{item.title}</span>
          {item.description && <p className="mt-1 text-sm text-text-secondary">{item.description}</p>}
        </div>
      </li>
      );
    })}
  </ol>
);

export default ProcessSteps;
