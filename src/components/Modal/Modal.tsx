import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

export type ModalAction = 'cancel' | 'draft' | 'publish';

export type ModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  showDraftButton?: boolean;
  onClose?: () => void;
  onAction?: (action: ModalAction) => void;
};

export function Modal({
  isOpen,
  title,
  description,
  showDraftButton = true,
  onClose,
  onAction,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const handleAction = (action: ModalAction) => {
    onAction?.(action);
    onClose?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className='modal-overlay'
      onClick={handleBackdropClick}
      data-testid='modal-overlay'
    >
      <div
        ref={dialogRef}
        className='modal'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
        data-testid='modal-dialog'
      >
        <div className='modal__header'>
          <h2 id='modal-title' className='modal__title'>
            {title}
          </h2>

          <button
            type='button'
            className='modal__close'
            aria-label='Закрыть'
            onClick={() => onClose?.()}
            data-testid='modal-close'
          >
            ×
          </button>
        </div>

        <p id='modal-description' className='modal__description'>
          {description}
        </p>

        <div className='modal__actions' data-testid='modal-actions'>
          <button
            type='button'
            className='modal__button modal__button--ghost'
            onClick={() => handleAction('cancel')}
            data-testid='modal-cancel'
          >
            Отмена
          </button>

          {showDraftButton && (
            <button
              type='button'
              className='modal__button modal__button--secondary'
              onClick={() => handleAction('draft')}
              data-testid='modal-draft'
            >
              Сохранить как черновик
            </button>
          )}

          <button
            type='button'
            className='modal__button modal__button--primary'
            onClick={() => handleAction('publish')}
            data-testid='modal-publish'
          >
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
