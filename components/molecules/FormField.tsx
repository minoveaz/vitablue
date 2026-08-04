import React from 'react';

interface FormFieldProps {
  label?: string;
  description?: string;
  error?: string;
  children: React.ReactElement<{ id?: string; error?: string }>;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  description,
  error,
  children,
  className = '',
}) => {
  // Inject error prop directly to child if error exists
  const inputId = children.props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const clonedChild = React.cloneElement(children, {
    error: error || children.props.error,
    id: inputId,
  });

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      {clonedChild}

      {description && !error && (
        <span className="text-xs text-text-secondary/60 mt-0.5">
          {description}
        </span>
      )}
    </div>
  );
};

export default FormField;
