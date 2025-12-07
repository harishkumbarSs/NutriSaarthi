/**
 * Form Field Components
 * =====================
 * Reusable form components with react-hook-form integration.
 */

import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface BaseFieldProps {
  label?: string;
  error?: FieldError;
  helperText?: string;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps, React.InputHTMLAttributes<HTMLInputElement> {}

interface SelectFieldProps extends BaseFieldProps, React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

interface TextAreaFieldProps extends BaseFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Input Field Component
 */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-theme-surface border rounded-xl px-4 py-3
            text-theme-primary placeholder-theme-tertiary
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200
            ${error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-theme-border'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-theme-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

/**
 * Select Field Component
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full bg-theme-surface border rounded-xl px-4 py-3
            text-theme-primary
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200 appearance-none cursor-pointer
            ${error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-theme-border'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.25rem 1.25rem',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-theme-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

/**
 * TextArea Field Component
 */
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-theme-secondary mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-theme-surface border rounded-xl px-4 py-3
            text-theme-primary placeholder-theme-tertiary
            focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
            transition-all duration-200 resize-none
            ${error 
              ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' 
              : 'border-theme-border'
            }
            ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error.message}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-theme-tertiary">{helperText}</p>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = 'TextAreaField';

/**
 * Form Error Summary
 */
interface FormErrorSummaryProps {
  errors: Record<string, FieldError | undefined>;
  className?: string;
}

export const FormErrorSummary = ({ errors, className = '' }: FormErrorSummaryProps) => {
  const errorMessages = Object.entries(errors)
    .filter(([, error]) => error?.message)
    .map(([field, error]) => ({ field, message: error!.message! }));

  if (errorMessages.length === 0) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center gap-2 text-red-500 font-medium mb-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        Please fix the following errors:
      </div>
      <ul className="list-disc list-inside text-sm text-red-400 space-y-1">
        {errorMessages.map(({ field, message }) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Submit Button
 */
interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const SubmitButton = ({ 
  children, 
  isLoading, 
  loadingText = 'Loading...', 
  className = '',
  ...props 
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading || props.disabled}
      className={`
        btn-primary w-full flex items-center justify-center gap-2
        ${isLoading ? 'cursor-wait' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

