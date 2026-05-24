import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(loading);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleClick = () => {
    if (disabled || isLoading) return;

    onClick?.();

    if (asyncSuccess) {
      setIsLoading(true);
      setIsSent(false);

      window.setTimeout(() => {
        setIsLoading(false);
        setIsSent(true);
      }, successDelayMs);
    }
  };

  const isDisabled = disabled || isLoading;
  const text = isLoading ? 'Загрузка...' : isSent ? 'Отправлено' : label;

  return (
    <button
      type="button"
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
    >
      {variant === 'icon' ? (
        <span aria-hidden="true" className="button__icon">
          {icon ?? '✉'}
        </span>
      ) : (
        text
      )}
    </button>
  );
}