import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs', 'play-fn'],
  args: {
    label: 'Сохранить',
    variant: 'primary',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  name: 'Primary / click',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Сохранить' });

    await expect(button).toBeInTheDocument();
    await expect(button).toHaveTextContent('Сохранить');
    await expect(button).toHaveAttribute('aria-busy', 'false');

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  name: 'Secondary / render',
  args: {
    variant: 'secondary',
    label: 'Отмена',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Отмена' });

    await expect(button).toBeInTheDocument();
    await expect(button).not.toBeDisabled();
  },
};

export const Disabled: Story = {
  name: 'Disabled / blocked click',
  args: {
    label: 'Удалить',
    disabled: true,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Удалить' });

    await expect(button).toBeDisabled();

    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const IconButton: Story = {
  name: 'Icon / render',
  args: {
    variant: 'icon',
    label: 'Отправить сообщение',
    icon: '✉',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Отправить сообщение' });

    await expect(button).toBeInTheDocument();
    await expect(button).toHaveAttribute('aria-label', 'Отправить сообщение');
  },
};

export const KeyboardAccess: Story = {
  name: 'Keyboard / tab and enter',
  args: {
    label: 'Продолжить',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await expect(button).toHaveTextContent('Кнопка в фокусе');

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await userEvent.keyboard('{Enter}');
    await expect(button).toHaveTextContent('Нажат enter');

    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const AsyncSubmit: Story = {
  name: 'Async submit / loading to success',
  args: {
    label: 'Отправить',
    asyncSuccess: true,
    successDelayMs: 800,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Отправить' });

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await expect(button).toBeDisabled();
    await expect(button).toHaveTextContent('Загрузка...');
    await expect(button).toHaveAttribute('aria-busy', 'true');

    await waitFor(async () => {
      await expect(button).toHaveTextContent('Отправлено');
      await expect(button).not.toBeDisabled();
      await expect(button).toHaveAttribute('aria-busy', 'false');
    });
  },
};

export const FullWidth: Story = {
  name: 'Full width / render',
  args: {
    label: 'Продолжить',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Продолжить' });

    const buttonRect = button.getBoundingClientRect();
    await expect(buttonRect.width > 300).toBe(true);
  },
};

export const IntentionalFail: Story = {
  name: 'Intentional fail / button',
  args: {
    label: 'Сохранить',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Сохранить' });

    await expect(button).toHaveTextContent('Удалить');
  },
};
