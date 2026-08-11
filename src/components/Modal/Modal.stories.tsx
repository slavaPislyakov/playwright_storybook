import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withinBody } from '../../test/helpers';
import { ModalWithState } from '../../test/wrappers';
import { Modal } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  render: (args) => <ModalWithState {...args} />,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    title: 'Опубликовать статью',
    description:
      'Проверь настройки публикации перед отправкой. '
      + 'На мобильном экране кнопки должны перестраиваться в колонку, '
      + 'чтобы по ним было удобно нажимать.',
    showDraftButton: true,
    onClose: fn(),
    onAction: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default / open & close**
 *
 * Компонент `Modal` — модальное окно для подтверждения действий.
 *
 * ⚠️ Этот тест закрывает модалку, поэтому она исчезает из DOM -
 * это ОЖИДАЕМОЕ поведение.
 *
 * Тест проверяет:
 * 1. Открытие модалки по клику на кнопку
 * 2. Все элементы присутствуют (заголовок, кнопки действий, кнопка закрытия)
 * 3. Установлен ARIA атрибут aria-modal="true" для accessibility
 * 4. Закрытие по кнопке X вызывает onClose callback
 */
export const Default: Story = {
  name: 'Default / open & close',
  args: {
    isOpen: false, // В Docs закрыто, в Canvas откроем через play
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = withinBody();

    const openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const dialog = body.getByRole('dialog');
    const title = body.getByText('Опубликовать статью');
    const closeButton = body.getByTestId('modal-close');
    const cancelButton = body.getByTestId('modal-cancel');
    const draftButton = body.getByTestId('modal-draft');
    const publishButton = body.getByTestId('modal-publish');

    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(title).toBeInTheDocument();
    await expect(closeButton).toBeInTheDocument();
    await expect(cancelButton).toHaveTextContent('Отмена');
    await expect(draftButton).toHaveTextContent('Сохранить как черновик');
    await expect(publishButton).toHaveTextContent('Опубликовать');

    await userEvent.click(closeButton);

    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(args.onClose).toHaveBeenCalled();
  },
};

/**
 * **Actions / callbacks only**
 *
 * Компонент `Modal` — проверка callback'ов действий.
 *
 * Тест проверяет вызов onAction callback при нажатии на кнопки:
 * 1. Кнопка "Опубликовать" вызывает onAction('publish')
 * 2. Кнопка "Сохранить как черновик" вызывает onAction('draft')
 *
 * ⚠️ Не проверяет закрытие модалки (это делает другой тест)
 */
export const WithActions: Story = {
  name: 'Actions / callbacks only',
  args: {
    isOpen: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = withinBody();

    let openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const publishButton = body.getByTestId('modal-publish');
    await userEvent.click(publishButton);
    await expect(args.onAction).toHaveBeenCalledWith('publish');

    args.onAction?.mockClear?.();

    openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const draftButton = body.getByTestId('modal-draft');
    await expect(draftButton).toBeInTheDocument();
    await userEvent.click(draftButton);
    await expect(args.onAction).toHaveBeenCalledWith('draft');
  },
};

/**
 * **Cancel / close & callback**
 *
 * Компонент `Modal` — закрытие по кнопке "Отмена".
 *
 * Тест проверяет:
 * 1. Кнопка "Отмена" вызывает onAction('cancel')
 * 2. Модалка закрывается и исчезает из DOM
 *
 * ⚠️ Модалка закрывается - это ожидаемое поведение!
 */
export const CancelAction: Story = {
  name: 'Cancel / close & callback',
  args: {
    isOpen: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = withinBody();

    const openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const cancelButton = body.getByTestId('modal-cancel');

    await userEvent.click(cancelButton);

    await expect(args.onAction).toHaveBeenCalledWith('cancel');

    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/**
 * **Without draft / 2 buttons**
 *
 * Компонент `Modal` — вариант без кнопки черновика.
 *
 * Тест проверяет:
 * 1. При showDraftButton=false показываются только 2 кнопки:
 *    Отмена и Опубликовать
 * 2. Кнопка "Сохранить как черновик" отсутствует в DOM
 */
export const WithoutDraftButton: Story = {
  name: 'Without draft / 2 buttons',
  args: {
    isOpen: false,
    showDraftButton: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = withinBody();

    const openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const cancelButton = body.getByTestId('modal-cancel');
    const publishButton = body.getByTestId('modal-publish');

    await expect(cancelButton).toBeInTheDocument();
    await expect(publishButton).toBeInTheDocument();
    await expect(
      body.queryByTestId('modal-draft'),
    ).not.toBeInTheDocument();
  },
};

/**
 * **Backdrop / click to close**
 *
 * Компонент `Modal` — закрытие по клику на фон.
 *
 * Тест проверяет:
 * 1. Клик на backdrop (затемненную область вне модалки) закрывает её
 * 2. Модалка исчезает из DOM
 * 3. Вызывается onClose callback
 *
 * ⚠️ Стандартное UX поведение для модалок
 */
export const BackdropClick: Story = {
  name: 'Backdrop / click to close',
  args: {
    isOpen: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = withinBody();

    const openButton = canvas.getByRole('button', { name: 'Открыть модалку' });
    await userEvent.click(openButton);

    const overlay = body.getByTestId('modal-overlay');

    await userEvent.click(overlay);
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
    await expect(args.onClose).toHaveBeenCalled();
  },
};
