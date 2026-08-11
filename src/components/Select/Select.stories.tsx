import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SelectWithErrorState } from '../../test/wrappers';
import { Select } from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Выберите категорию',
    options: [
      { value: 'tech', label: 'Технологии' },
      { value: 'design', label: 'Дизайн' },
      { value: 'business', label: 'Бизнес' },
      { value: 'science', label: 'Наука' },
    ],
    placeholder: 'Выберите вариант',
    onChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default / select option**
 *
 * Компонент `Select` — выпадающий список с опциями.
 *
 * Тест проверяет:
 * 1. Отображается placeholder когда ничего не выбрано
 * 2. Клик открывает dropdown с опциями
 * 3. Клик по опции выбирает её и обновляет trigger
 * 4. Вызывается onChange callback с выбранным значением
 * 5. Dropdown закрывается после выбора
 */
export const Default: Story = {
  name: 'Default / select option',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const selectTrigger = canvas.getByTestId('select-trigger');
    await expect(selectTrigger).toBeInTheDocument();
    await expect(selectTrigger).toHaveTextContent('Выберите вариант');

    await userEvent.click(selectTrigger);

    const dropdown = canvas.getByTestId('select-dropdown');
    await expect(dropdown).toBeInTheDocument();

    const techOption = canvas.getByTestId('select-option-tech');
    await expect(techOption).toHaveTextContent('Технологии');

    await userEvent.click(techOption);

    await expect(selectTrigger).toHaveTextContent('Технологии');
    await expect(args.onChange).toHaveBeenCalledWith('tech');

    await expect(canvas.queryByTestId('select-dropdown'))
      .not.toBeInTheDocument();
  },
};

/**
 * **Keyboard / arrow navigation**
 *
 * Компонент `Select` — навигация с клавиатуры.
 *
 * Тест проверяет:
 * 1. Фокусировка Tab на селекте
 * 2. ArrowDown открывает dropdown
 * 3. ArrowDown перемещает выделение на следующую опцию
 * 4. Enter выбирает выделенную опцию
 * 5. Вызывается onChange callback с выбранным значением
 */
export const KeyboardNavigation: Story = {
  name: 'Keyboard / arrow navigation',
  args: {
    label: 'Навигация с клавиатуры',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const selectTrigger = canvas.getByTestId('select-trigger');

    await selectTrigger.focus();
    await expect(selectTrigger).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');

    const dropdown = canvas.getByTestId('select-dropdown');
    await expect(dropdown).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}');

    await userEvent.keyboard('{Enter}');

    await expect(selectTrigger).toHaveTextContent('Дизайн');
    await expect(args.onChange).toHaveBeenCalledWith('design');
  },
};

/**
 * **Disabled / blocked interaction**
 *
 * Компонент `Select` в отключенном состоянии.
 *
 * Тест проверяет:
 * 1. Селект имеет aria-disabled="true"
 * 2. Клик не открывает dropdown
 * 3. onChange не вызывается
 */
export const Disabled: Story = {
  name: 'Disabled / blocked interaction',
  args: {
    label: 'Отключенный селект',
    disabled: true,
    value: 'tech',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const selectTrigger = canvas.getByTestId('select-trigger');
    await expect(selectTrigger).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(selectTrigger);

    await expect(canvas.queryByTestId('select-dropdown'))
      .not.toBeInTheDocument();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/**
 * **Error / validation**
 *
 * Компонент `Select` с ошибкой валидации.
 *
 * Тест проверяет:
 * 1. Отображается сообщение об ошибке
 * 2. Индикатор обязательности (*) показывается рядом с label
 * 3. Применяется CSS класс для визуального выделения ошибки
 */
export const WithError: Story = {
  name: 'Error / validation',
  args: {
    label: 'Категория',
    required: true,
    error: 'Пожалуйста, выберите категорию',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectTrigger = canvas.getByTestId('select-trigger');
    await expect(selectTrigger).toHaveClass('select--error');

    const errorMessage = canvas.getByTestId('select-error');
    await expect(errorMessage)
      .toHaveTextContent('Пожалуйста, выберите категорию');

    const label = canvas.getByText('Категория');
    await expect(label).toBeInTheDocument();

    const requiredIndicator = canvas.getByText('*');
    await expect(requiredIndicator).toBeInTheDocument();
  },
};

/**
 * **Preselected / with value**
 *
 * Компонент `Select` с предвыбранным значением.
 *
 * Тест проверяет:
 * 1. Триггер показывает выбранное значение (не placeholder)
 * 2. Dropdown изначально закрыт
 * 3. После клика открывается dropdown с выделенной выбранной опцией
 * 4. Выбранная опция имеет aria-selected="true" и CSS класс
 */
export const Preselected: Story = {
  name: 'Preselected / with value',
  args: {
    label: 'Выбранное значение',
    value: 'design',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectTrigger = canvas.getByTestId('select-trigger');
    await expect(selectTrigger).toHaveTextContent('Дизайн');

    await expect(canvas.queryByTestId('select-dropdown'))
      .not.toBeInTheDocument();

    await userEvent.click(selectTrigger);

    const selectedOption = canvas.getByTestId('select-option-design');
    await expect(selectedOption).toBeInTheDocument();
    await expect(selectedOption).toHaveAttribute('aria-selected', 'true');
    await expect(selectedOption).toHaveClass('select__option--selected');
  },
};

/**
 * **Error / clears on selection**
 *
 * Компонент `Select` — очистка ошибки при выборе.
 *
 * Тест проверяет что при выборе значения ошибка исчезает:
 * 1. Отображается ошибка валидации (поле обязательно)
 * 2. Пользователь открывает селект
 * 3. Пользователь выбирает значение
 * 4. Ошибка исчезает из DOM
 */
export const ErrorClearOnSelect: Story = {
  name: 'Error / clears on selection',
  render: (args) => <SelectWithErrorState {...args} />,
  args: {
    label: 'Категория',
    required: true,
    onChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const errorMessage = canvas.getByTestId('select-error');
    await expect(errorMessage)
      .toHaveTextContent('Пожалуйста, выберите категорию');

    const selectTrigger = canvas.getByTestId('select-trigger');
    await userEvent.click(selectTrigger);

    const techOption = canvas.getByTestId('select-option-tech');
    await userEvent.click(techOption);

    await expect(selectTrigger).toHaveTextContent('Технологии');
    await expect(args.onChange).toHaveBeenCalledWith('tech');

    await expect(canvas.queryByTestId('select-error')).not.toBeInTheDocument();
  },
};
