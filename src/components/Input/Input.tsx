import { useId } from 'react';
import './input.css';

export type InputProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  className?: string;
  'data-testid'?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

export function Input({
  label,
  value = '',
  placeholder = 'Введите текст',
  type = 'text',
  required = false,
  disabled = false,
  maxLength = 50,
  error,
  className = '',
  'data-testid': dataTestId,
  onChange,
  onBlur,
}: InputProps) {
  const id = useId();
  const inputId = `input-${id}`;

  const hasError = !!error;

  return (
    <div className={`input-field ${className}`} data-testid={dataTestId}>
      <label className='input-field__label' htmlFor={inputId}>
        {label}
        {required && <span className='input-field__required'>*</span>}
      </label>

      <input
        id={inputId}
        className={`input-field__control ${
          hasError ? 'input-field__control--error' : ''
        }`}
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `error-${inputId}` : undefined}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={onBlur}
      />

      <div className='input-field__meta'>
        {hasError && (
          <span
            id={`error-${inputId}`}
            className='input-field__error input-field__error--visible'
            data-testid='input-error'
          >
            {error}
          </span>
        )}

        <span data-testid='input-counter'>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
