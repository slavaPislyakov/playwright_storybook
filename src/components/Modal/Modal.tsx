import './modal.css';

export type ModalProps = {
  title: string;
  description: string;
  mode?: 'desktop' | 'tablet' | 'mobile';
  showDraftButton?: boolean;
};

export function Modal({
  title,
  description,
  mode = 'desktop',
    showDraftButton = true,
     
}: ModalProps) {
  const isMobile = mode === 'mobile';
  const isTablet = mode === 'tablet';

  return (
    <div
      className={[
        'modal-page',
        isMobile ? 'modal-page--mobile' : '',
        isTablet ? 'modal-page--tablet' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="modal-backdrop" />

      <div
        className={[
          'modal',
          isMobile ? 'modal--mobile' : '',
          isTablet ? 'modal--tablet' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>

          <button type="button" className="modal__close" aria-label="Закрыть">
            ×
          </button>
        </div>

        <p id="modal-description" className="modal__description">
          {description}
        </p>

        <div
          className={[
            'modal__actions',
            isMobile ? 'modal__actions--mobile' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          data-testid="modal-actions"
        >
          <button
            type="button"
            className={`modal__button ${isMobile ? 'modal__button--mobile' : ''} modal__button--ghost`}
          >
            Отмена
          </button>

          {showDraftButton && (
            <button
              type="button"
              className={`modal__button ${isMobile ? 'modal__button--mobile' : ''} modal__button--secondary`}
            >
              Сохранить как черновик
            </button>
          )}

          <button
            type="button"
            className={`modal__button ${isMobile ? 'modal__button--mobile' : ''} modal__button--primary`}
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  );
}
