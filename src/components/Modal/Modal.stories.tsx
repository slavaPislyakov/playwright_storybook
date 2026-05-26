import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { Modal } from './Modal';

const withFrame = (width: number): Decorator => {
  return (Story) => (
    <div
      style={{
        width: `${width}px`,
        margin: '0 auto',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Story />
    </div>
  );
};

const assertDesktopLayout = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  const dialog = canvas.getByRole('dialog');
  const actions = canvas.getByTestId('modal-actions');
  const draftButton = canvas.getByRole('button', {
    name: 'Сохранить как черновик',
  });
  const publishButton = canvas.getByRole('button', { name: 'Опубликовать' });

  await expect(dialog).toBeInTheDocument();
  await expect(
    canvas.getByRole('button', { name: 'Отмена' }),
  ).toBeInTheDocument();
  await expect(draftButton).toBeInTheDocument();
  await expect(publishButton).toBeInTheDocument();

  const actionsStyle = window.getComputedStyle(actions);
  await expect(actionsStyle.flexDirection).toBe('row');
};

const assertTabletLayout = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  const dialog = canvas.getByRole('dialog');
  const actions = canvas.getByTestId('modal-actions');

  await expect(dialog).toBeInTheDocument();
  await expect(
    canvas.getByRole('button', { name: 'Отмена' }),
  ).toBeInTheDocument();
  await expect(
    canvas.queryByRole('button', { name: 'Сохранить как черновик' }),
  ).toBeNull();
  await expect(
    canvas.getByRole('button', { name: 'Опубликовать' }),
  ).toBeInTheDocument();

  const actionsStyle = window.getComputedStyle(actions);
  await expect(actionsStyle.flexDirection).toBe('row');
};

const assertMobileLayout = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  const dialog = canvas.getByRole('dialog');
  const actions = canvas.getByTestId('modal-actions');
  const cancelButton = canvas.getByRole('button', { name: 'Отмена' });
  const publishButton = canvas.getByRole('button', { name: 'Опубликовать' });

  await expect(dialog).toBeInTheDocument();
  await expect(cancelButton).toBeInTheDocument();
  await expect(
    canvas.getByRole('button', { name: 'Сохранить как черновик' }),
  ).toBeInTheDocument();
  await expect(publishButton).toBeInTheDocument();

  const actionsStyle = window.getComputedStyle(actions);
  await expect(actionsStyle.flexDirection).toBe('column');

  const actionsRect = actions.getBoundingClientRect();
  const cancelRect = cancelButton.getBoundingClientRect();
  const publishRect = publishButton.getBoundingClientRect();

  await expect(Math.abs(actionsRect.width - cancelRect.width) < 2).toBe(true);
  await expect(Math.abs(actionsRect.width - publishRect.width) < 2).toBe(true);
};

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs', 'play-fn'],
  args: {
    title: 'Опубликовать статью',
    description:
      'Проверь настройки публикации перед отправкой. На мобильном экране кнопки должны перестраиваться в колонку, чтобы по ним было удобно нажимать.',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  name: 'Desktop',
  args: {
    mode: 'desktop',
    showDraftButton: true,
  },
  decorators: [withFrame(1280)],
  play: async ({ canvasElement }) => {
    await assertDesktopLayout(canvasElement);
  },
};

export const TabletIPad: Story = {
  name: 'Tablet / iPad',
  args: {
    mode: 'tablet',
    showDraftButton: false,
  },
  decorators: [withFrame(768)],
  play: async ({ canvasElement }) => {
    await assertTabletLayout(canvasElement);
  },
};

export const MobileIPhone13Pro: Story = {
  name: 'Mobile / iPhone 13 Pro',
  args: {
    mode: 'mobile',
    showDraftButton: true,
  },
  decorators: [withFrame(390)],
  play: async ({ canvasElement }) => {
    await assertMobileLayout(canvasElement);
  },
};
