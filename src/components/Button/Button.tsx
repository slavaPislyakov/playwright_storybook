import { useState } from 'react';
import './button.css';

export type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  asyncSuccess?: boolean;
  successDelayMs?: number;
  onClick?: () => void;
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  asyncSuccess = false,
  successDelayMs = 1000,
  onClick,
}: ButtonProps) {
  const [localLoading, setLocalLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isLoading = loading || localLoading;

  const handleClick = () => {
    if (disabled || isLoading) return;

    onClick?.();

    if (asyncSuccess) {
      setLocalLoading(true);
      setIsSent(false);

      window.setTimeout(() => {
        setLocalLoading(false);
        setIsSent(true);
      }, successDelayMs);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsPressed(true);
    }
  };

  const isDisabled = disabled || isLoading;
  const text = isLoading
    ? 'Загрузка...'
    : isSent
      ? 'Отправлено'
      : isPressed
        ? 'Нажат enter'
        : isFocused
          ? 'Кнопка в фокусе'
          : label;

  return (
    <button
      type='button'
      className={[
        'button',
        `button--${variant}`,
        fullWidth ? 'button--full-width' : '',
        isLoading ? 'button--loading' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      aria-busy={isLoading ? 'true' : 'false'}
      aria-label={variant === 'icon' ? label : undefined}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        setIsPressed(false);
      }}
      onKeyDown={handleKeyDown}
    >
      {variant === 'icon' ? (
        <span aria-hidden='true' className='button__icon'>
          {icon ?? '✉'}
        </span>
      ) : (
        text
      )}
    </button>
  );
}
