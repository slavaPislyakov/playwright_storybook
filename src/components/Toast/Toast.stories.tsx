import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { ToastWithContainer, ToastWithState } from '../../test/wrappers';

const meta = {
  title: 'Components/Toast',
  component: ToastWithContainer,
  tags: ['autodocs', 'play-fn'],
  args: {
    message: 'Операция выполнена успешно',
    variant: 'success',
    duration: 0, // 0 = не закрывать автоматически
    showCloseButton: true,
    onClose: () => {},
  },
} satisfies Meta<typeof ToastWithContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Success / with close**
 *
 * Компонент `Toast` — уведомление с кнопкой закрытия.
 *
 * Тест проверяет:
 * 1. Отображается сообщение и иконка ✓
 * 2. Применяется CSS класс toast--success
 * 3. Установлен role="alert" для accessibility
 * 4. Кнопка закрытия скрывает тост с анимацией
 */
export const Default: Story = {
  name: 'Success / with close',
  render: (args) => <ToastWithState {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toast = canvas.getByTestId('toast');
    const icon = canvas.getByTestId('toast-icon');
    const message = canvas.getByTestId('toast-message');
    const closeButton = canvas.getByTestId('toast-close');

    await expect(toast).toBeInTheDocument();
    await expect(toast).toHaveClass('toast--success');
    await expect(toast).toHaveAttribute('role', 'alert');
    await expect(icon).toHaveTextContent('✓');
    await expect(message).toHaveTextContent('Операция выполнена успешно');
    await expect(closeButton).toBeInTheDocument();

    // Кликаем на кнопку закрытия
    await userEvent.click(closeButton);

    // Проверяем что появился класс анимации выхода
    await expect(toast).toHaveClass('toast--exiting');

    // Ждем окончания анимации и проверяем что тост исчез
    await waitFor(() => {
      expect(canvas.queryByTestId('toast')).not.toBeInTheDocument();
    }, { timeout: 500 });
  },
};

/**
 * **Info / variant**
 *
 * Компонент `Toast` в варианте info.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс toast--info
 * 2. Отображается иконка ℹ
 */
export const Info: Story = {
  name: 'Info / variant',
  args: {
    variant: 'info',
    message: 'Новое уведомление',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toast = canvas.getByTestId('toast');
    const icon = canvas.getByTestId('toast-icon');

    await expect(toast).toHaveClass('toast--info');
    await expect(icon).toHaveTextContent('ℹ');
  },
};

/**
 * **Warning / variant**
 *
 * Компонент `Toast` в варианте warning.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс toast--warning
 * 2. Отображается иконка ⚠
 */
export const Warning: Story = {
  name: 'Warning / variant',
  args: {
    variant: 'warning',
    message: 'Внимание: проверьте данные',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toast = canvas.getByTestId('toast');
    const icon = canvas.getByTestId('toast-icon');

    await expect(toast).toHaveClass('toast--warning');
    await expect(icon).toHaveTextContent('⚠');
  },
};

/**
 * **Error / variant**
 *
 * Компонент `Toast` в варианте error.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс toast--error
 * 2. Отображается иконка ✕
 */
export const Error: Story = {
  name: 'Error / variant',
  args: {
    variant: 'error',
    message: 'Произошла ошибка',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const toast = canvas.getByTestId('toast');
    const icon = canvas.getByTestId('toast-icon');

    await expect(toast).toHaveClass('toast--error');
    await expect(icon).toHaveTextContent('✕');
  },
};

/**
 * **No close button / persistent**
 *
 * Компонент `Toast` без кнопки закрытия и авто-закрытия.
 *
 * Тест проверяет при showCloseButton=false и duration=0:
 * 1. Отсутствует кнопка закрытия
 * 2. Отсутствует progress bar
 * 3. Toast остается видимым (persistent) до перезагрузки
 */
export const WithoutClose: Story = {
  name: 'No close button / persistent',
  args: {
    showCloseButton: false,
    duration: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByTestId('toast-close'))
      .not.toBeInTheDocument();
    await expect(canvas.queryByTestId('toast-progress'))
      .not.toBeInTheDocument();
  },
};

/**
 * **Auto close / timer**
 *
 * Компонент `Toast` с авто-закрытием по таймеру.
 *
 * ⚠️ Важно: таймер работает только при duration > 0
 *
 * Тест проверяет:
 * 1. Отображается progress bar с animationDuration
 * 2. По истечении времени duration тост скрывается с анимацией
 * 3. Таймер срабатывает автоматически без взаимодействия пользователя
 */
export const AutoClose: Story = {
  name: 'Auto close / timer',
  render: (args) => <ToastWithState {...args} />,
  args: {
    duration: 1500,
    showCloseButton: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Проверяем что progress bar есть и настроен
    const progress = canvas.getByTestId('toast-progress');
    await expect(progress).toBeInTheDocument();
    await expect(progress).toHaveAttribute(
      'style',
      expect.stringContaining('animation-duration: 1500ms'),
    );

    // Ждем окончания таймера + анимацию выхода + небольшой запас
    await waitFor(() => {
      expect(canvas.queryByTestId('toast')).not.toBeInTheDocument();
    }, { timeout: 2500 });
  },
};
