import { useCallback, useState } from 'react';
import { Checkbox } from '../components/Checkbox/Checkbox';
import { Input } from '../components/Input/Input';
import { Modal } from '../components/Modal/Modal';
import { Select } from '../components/Select/Select';
import { Toast } from '../components/Toast/Toast';

/**
 * Обёртка с управляемым состоянием для интерактивных stories `Input`.
 * Хранит введённое значение в useState и пробрасывает его в controlled-инпут.
 */
export const InputWithState = (props: {
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}) => {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <Input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
};

/**
 * Обёртка с управляемым состоянием для интерактивных stories `Checkbox`.
 * Хранит состояние checked в useState, инициализируется из defaultChecked.
 */
export const CheckboxWithState = (props: {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}) => {
  const [checked, setChecked] = useState(props.defaultChecked ?? false);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    props.onChange?.(newChecked);
  };

  return (
    <Checkbox
      {...props}
      checked={checked}
      onChange={handleChange}
    />
  );
};

/**
 * Обёртка для позиционирования тоста в правом верхнем углу
 * (без управления состоянием).
 */
export const ToastWithContainer = (
  props: React.ComponentProps<typeof Toast>,
) => {
  return (
    <div className='toast-container'>
      <Toast {...props} />
    </div>
  );
};

/**
 * Обёртка с внутренним состоянием для демонстрации закрытия тоста.
 * Скрывает Toast после срабатывания onClose.
 */
export const ToastWithState = (props: React.ComponentProps<typeof Toast>) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    props.onClose?.();
  }, [props]);

  return (
    <div className='toast-container'>
      {isVisible && <Toast {...props} onClose={handleClose} />}
    </div>
  );
};

const SELECT_INITIAL_ERROR = 'Пожалуйста, выберите категорию';

type SelectWithErrorStateProps = Omit<
  React.ComponentProps<typeof Select>,
  'error' | 'value'
>;

/**
 * Обёртка с управлением состоянием ошибки для `Select` —
 * очищает ошибку валидации при выборе значения.
 */
export const SelectWithErrorState = (props: SelectWithErrorStateProps) => {
  const [error, setError] = useState<string | undefined>(SELECT_INITIAL_ERROR);
  const [value, setValue] = useState<string>('');

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setError(undefined);
    props.onChange?.(newValue);
  }, [props]);

  return (
    <Select
      {...props}
      value={value}
      error={error}
      onChange={handleChange}
    />
  );
};

/**
 * Обёртка с управляемым состоянием для `Modal` — отображает кнопку
 * "Открыть модалку" и управляет isOpen через useState. Пробрасывает
 * onClose/onAction с закрытием модалки и вызовом исходных callback'ов.
 *
 * Используется как `render` на уровне meta в `Modal.stories.tsx`,
 * чтобы не дублировать логику в каждой story.
 */
export const ModalWithState = (args: React.ComponentProps<typeof Modal>) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  return (
    <>
      <button type='button' onClick={() => setIsOpen(true)}>
        Открыть модалку
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          args.onClose?.();
        }}
        onAction={(action) => {
          setIsOpen(false);
          args.onAction?.(action);
        }}
      />
    </>
  );
};
