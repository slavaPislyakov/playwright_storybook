import { useEffect, useRef } from 'react';
import './checkbox.css';

export type CheckboxProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
};

export function Checkbox({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  indeterminate = false,
  onChange,
}: CheckboxProps) {
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : defaultChecked;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <label
      className={[
        'checkbox',
        disabled ? 'checkbox--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-testid='checkbox-label'
    >
      <span className='checkbox__input-wrapper'>
        <input
          ref={inputRef}
          type='checkbox'
          className='checkbox__input'
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          data-testid='checkbox-input'
        />
        <span
          className={[
            'checkbox__control',
            isChecked ? 'checkbox__control--checked' : '',
            indeterminate ? 'checkbox__control--indeterminate' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden='true'
          data-testid='checkbox-control'
        >
          {indeterminate ? (
            <svg viewBox='0 0 10 2' className='checkbox__icon'>
              <path d='M0 1h10' stroke='currentColor' strokeWidth='2' />
            </svg>
          ) : isChecked ? (
            <svg viewBox='0 0 10 8' className='checkbox__icon'>
              <path
                d='M1 4l3 3 5-6'
                stroke='currentColor'
                strokeWidth='2'
                fill='none'
              />
            </svg>
          ) : null}
        </span>
      </span>
      <span className='checkbox__label' data-testid='checkbox-text'>
        {label}
      </span>
    </label>
  );
}
