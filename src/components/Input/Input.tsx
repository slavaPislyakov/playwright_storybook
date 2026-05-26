import { useState } from 'react';
import './input.css';

export type InputProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
};

export function Input({
  label,
  placeholder = 'Введите текст',
  required = false,
  maxLength = 50,
}: InputProps) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  const showError = required && touched && value.trim().length === 0;

  return (
    <div className='input-field'>
      <label className='input-field__label' htmlFor='storybook-input'>
        {label}
      </label>

      <input
        id='storybook-input'
        className={`input-field__control ${showError ? 'input-field__control--error' : ''}`}
        type='text'
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        aria-invalid={showError ? 'true' : 'false'}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => setTouched(true)}
      />

      <div className='input-field__meta'>
        <span
          className={`input-field__error ${showError ? 'input-field__error--visible' : ''}`}
          data-testid='input-error'
        >
          Поле обязательно
        </span>

        <span data-testid='input-counter'>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}
