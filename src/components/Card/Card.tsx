import './card.css';

export type CardProps = {
  title?: string;
  description?: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'small' | 'medium' | 'large';
  onClick?: () => void;
};

function CardContent({
  imageUrl,
  title,
  description,
  footer,
}: {
  imageUrl?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}) {
  return (
    <>
      {imageUrl && (
        <div className='card__image-wrapper' data-testid='card-image-wrapper'>
          <img
            src={imageUrl}
            alt={title || 'Card image'}
            className='card__image'
            data-testid='card-image'
          />
        </div>
      )}

      <div className='card__content' data-testid='card-content'>
        {title && (
          <h3 className='card__title' data-testid='card-title'>
            {title}
          </h3>
        )}
        {description && (
          <p className='card__description' data-testid='card-description'>
            {description}
          </p>
        )}
      </div>

      {footer && (
        <div className='card__footer' data-testid='card-footer'>
          {footer}
        </div>
      )}
    </>
  );
}

export function Card({
  title,
  description,
  imageUrl,
  footer,
  variant = 'default',
  padding = 'medium',
  onClick,
}: CardProps) {
  const isClickable = !!onClick;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!isClickable || !onClick) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const className = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    isClickable ? 'card--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <CardContent
      imageUrl={imageUrl}
      title={title}
      description={description}
      footer={footer}
    />
  );

  if (isClickable) {
    return (
      <div
        className={className}
        data-testid='card'
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={0}
        aria-label={title}
      >
        {content}
      </div>
    );
  }

  return (
    <article className={className} data-testid='card'>
      {content}
    </article>
  );
}
