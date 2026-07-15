import './button.css';

export type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'icon' | 'outlined' | 'elevated';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: string;
  onClick?: () => void;
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  onClick,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type='button'
      className={[
        'button',
        `button--${variant}`,
        fullWidth ? 'button--full-width' : '',
        loading ? 'button--loading' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isDisabled}
      aria-busy={loading ? 'true' : 'false'}
      aria-label={variant === 'icon' ? label : undefined}
      onClick={onClick}
    >
      {variant === 'icon' ? (
        <span aria-hidden='true' className='button__icon'>
          {icon ?? '✉'}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
