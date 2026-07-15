import { useId, useState } from 'react';
import './select.css';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  label: string;
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (value: string) => void;
};

export function Select({
  label,
  options,
  value,
  placeholder = 'Выберите вариант',
  disabled = false,
  required = false,
  error,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const triggerId = `${baseId}-trigger`;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    onChange?.(optionValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex].value);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      }
      case 'Escape': {
        setIsOpen(false);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev,
        );
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      }
    }
  };

  return (
    <div className='select-field' data-testid='select-field'>
      <label className='select-field__label'>
        {label}
        {required && <span className='select-field__required'>*</span>}
      </label>

      <div
        id={triggerId}
        className={[
          'select',
          isOpen ? 'select--open' : '',
          disabled ? 'select--disabled' : '',
          error ? 'select--error' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        tabIndex={disabled ? -1 : 0}
        role='combobox'
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-controls={listboxId}
        aria-activedescendant={
          isOpen && highlightedIndex >= 0
            ? `${baseId}-option-${options[highlightedIndex].value}`
            : undefined
        }
        aria-label={label}
        aria-disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        data-testid='select-trigger'
      >
        <span
          className={[
            'select__value',
            !selectedOption ? 'select__value--placeholder' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {selectedOption?.label || placeholder}
        </span>
        <span className='select__arrow' aria-hidden='true'>
          ▼
        </span>
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          className='select__dropdown'
          role='listbox'
          aria-labelledby={triggerId}
          data-testid='select-dropdown'
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${baseId}-option-${option.value}`}
              className={[
                'select__option',
                selectedValue === option.value
                  ? 'select__option--selected'
                  : '',
                highlightedIndex === index
                  ? 'select__option--highlighted'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              role='option'
              aria-selected={selectedValue === option.value}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option.value);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              data-testid={`select-option-${option.value}`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <span className='select-field__error' data-testid='select-error'>
          {error}
        </span>
      )}
    </div>
  );
}
