import { useEffect, useState, useCallback } from 'react';
import './toast.css';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export type ToastProps = {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  onClose?: () => void;
  showCloseButton?: boolean;
};

const variantIcons: Record<ToastVariant, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export function Toast({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  showCloseButton = true,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    // Даем время на анимацию перед вызовом onClose
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = window.setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  return (
    <div
      className={[
        'toast',
        `toast--${variant}`,
        isExiting ? 'toast--exiting' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role='alert'
      aria-live='polite'
      data-testid='toast'
    >
      <span
        className='toast__icon'
        aria-hidden='true'
        data-testid='toast-icon'
      >
        {variantIcons[variant]}
      </span>

      <p className='toast__message' data-testid='toast-message'>
        {message}
      </p>

      {showCloseButton && (
        <button
          type='button'
          className='toast__close'
          onClick={handleClose}
          aria-label='Закрыть уведомление'
          data-testid='toast-close'
        >
          ×
        </button>
      )}

      {duration > 0 && !isExiting && (
        <div
          className='toast__progress'
          style={{ animationDuration: `${duration}ms` }}
          data-testid='toast-progress'
        />
      )}
    </div>
  );
}
