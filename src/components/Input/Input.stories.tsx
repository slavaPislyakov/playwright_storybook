import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs', 'play-fn'],
  args: {
    label: 'Название статьи',
    placeholder: 'Введите название',
    required: true,
    maxLength: 20,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default / success',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const counter = canvas.getByTestId('input-counter');

    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('placeholder', 'Введите название');
    await expect(counter).toHaveTextContent('0/20');

    await userEvent.type(input, 'Storybook');

    await expect(input).toHaveValue('Storybook');
    await expect(counter).toHaveTextContent('9/20');
  },
};

export const RequiredValidation: Story = {
  name: 'Validation / required',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const error = canvas.getByTestId('input-error');

    await userEvent.click(input);
    await userEvent.tab();

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toHaveTextContent('Поле обязательно');
    await expect(error).toHaveClass('input-field__error--visible');
  },
};

export const IntentionalFail: Story = {
  name: 'Validation / intentional fail',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const counter = canvas.getByTestId('input-counter');

    await userEvent.type(input, 'QA');

    await expect(input).toHaveValue('QA');
    await expect(counter).toHaveTextContent('10/20');
  },
};