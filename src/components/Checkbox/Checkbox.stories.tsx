import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox } from './Checkbox';
import { CheckboxWithState } from '../../test/wrappers';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'play-fn'],
  args: {
    label: 'Принять условия',
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default / toggle state**
 *
 * Компонент `Checkbox` — чекбокс с label.
 *
 * Тест проверяет:
 * 1. Рендеринг чекбокса с текстом label
 * 2. Начальное состояние unchecked (не отмечен)
 * 3. Переключение состояния при клике (unchecked → checked)
 * 4. Вызывается onChange callback с новым значением
 */
export const Default: Story = {
  name: 'Default / toggle state',
  render: (args) => <CheckboxWithState {...args} defaultChecked={false} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const checkboxInput = canvas.getByTestId('checkbox-input');
    const checkboxControl = canvas.getByTestId('checkbox-control');
    const checkboxText = canvas.getByTestId('checkbox-text');

    // Проверяем начальное состояние
    await expect(checkboxInput).toBeInTheDocument();
    await expect(checkboxInput).not.toBeChecked();
    await expect(checkboxControl).not.toHaveClass('checkbox__control--checked');
    await expect(checkboxText).toHaveTextContent('Принять условия');

    // Кликаем для включения
    await userEvent.click(checkboxInput);

    // Проверяем что состояние изменилось
    await expect(checkboxInput).toBeChecked();
    await expect(checkboxControl).toHaveClass('checkbox__control--checked');
    await expect(args.onChange).toHaveBeenCalledWith(true);

    // Сбрасываем мок для следующей проверки
    args.onChange?.mockClear();

    // Кликаем для выключения
    await userEvent.click(checkboxInput);

    // Проверяем что состояние снова изменилось
    await expect(checkboxInput).not.toBeChecked();
    await expect(checkboxControl).not.toHaveClass('checkbox__control--checked');
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};

/**
 * **Checked / toggle off**
 *
 * Компонент `Checkbox` — снятие отметки.
 *
 * Тест проверяет:
 * 1. Начальное состояние checked (отмечен)
 * 2. Снятие отметки при клике (checked → unchecked)
 * 3. Вызывается onChange callback с false
 */
export const Checked: Story = {
  name: 'Checked / toggle off',
  render: (args) => <CheckboxWithState {...args} defaultChecked={true} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const checkboxInput = canvas.getByTestId('checkbox-input');
    const checkboxControl = canvas.getByTestId('checkbox-control');

    // Проверяем начальное состояние checked
    await expect(checkboxInput).toBeChecked();
    await expect(checkboxControl).toHaveClass('checkbox__control--checked');

    // Кликаем для снятия отметки
    await userEvent.click(checkboxInput);

    // Проверяем что состояние изменилось
    await expect(checkboxInput).not.toBeChecked();
    await expect(checkboxControl).not.toHaveClass('checkbox__control--checked');
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};

/**
 * **Disabled / blocked**
 *
 * Компонент `Checkbox` в отключенном состоянии.
 *
 * Тест проверяет:
 * 1. Чекбокс имеет атрибут disabled
 * 2. Применяется CSS класс для disabled состояния
 * 3. Клик не вызывает onChange callback
 */
export const Disabled: Story = {
  name: 'Disabled / blocked',
  args: {
    disabled: true,
    defaultChecked: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const checkboxInput = canvas.getByTestId('checkbox-input');
    const checkboxLabel = canvas.getByTestId('checkbox-label');

    await expect(checkboxInput).toBeDisabled();
    await expect(checkboxLabel).toHaveClass('checkbox--disabled');

    await userEvent.click(checkboxInput);

    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/**
 * **Indeterminate / mixed state**
 *
 * Компонент `Checkbox` в состоянии indeterminate (смешанное).
 *
 * Используется для групп чекбоксов, когда часть элементов выбрана,
 * а часть - нет. Например, "Выбрать все" когда выбраны не все элементы.
 *
 * Тест проверяет:
 * 1. Установлено DOM-свойство input.indeterminate = true
 * 2. Применяется CSS класс для визуального отображения (полоска вместо галочки)
 */
export const Indeterminate: Story = {
  name: 'Indeterminate / mixed state',
  args: {
    label: 'Выбрать все',
    indeterminate: true,
    defaultChecked: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const checkboxInput = canvas.getByTestId('checkbox-input');
    const checkboxControl = canvas.getByTestId('checkbox-control');

    await expect(checkboxInput).toHaveProperty('indeterminate', true);
    await expect(checkboxControl)
      .toHaveClass('checkbox__control--indeterminate');
  },
};

/**
 * **Keyboard / space to toggle**
 *
 * Компонент `Checkbox` — управление с клавиатуры.
 *
 * Тест проверяет:
 * 1. Фокусировка чекбокса через Tab
 * 2. Переключение состояния клавишей Space (пробел)
 * 3. Вызывается onChange callback при переключении
 */
export const Keyboard: Story = {
  name: 'Keyboard / space to toggle',
  render: (args) => <CheckboxWithState {...args} defaultChecked={false} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const checkboxInput = canvas.getByTestId('checkbox-input');

    // Устанавливаем фокус на чекбокс
    await checkboxInput.focus();
    await expect(checkboxInput).toHaveFocus();

    // Проверяем начальное состояние
    await expect(checkboxInput).not.toBeChecked();

    // Нажимаем пробел для переключения
    await userEvent.keyboard(' ');

    // Проверяем что состояние изменилось
    await expect(checkboxInput).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith(true);

    // Сбрасываем мок
    args.onChange?.mockClear();

    // Нажимаем пробел снова для обратного переключения
    await userEvent.keyboard(' ');

    // Проверяем что состояние снова изменилось
    await expect(checkboxInput).not.toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith(false);
  },
};
