import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { InputWithState } from '../../test/wrappers';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Название статьи',
    placeholder: 'Введите название',
    required: false,
    maxLength: 50,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default / controlled input**
 *
 * Компонент `Input` — текстовое поле ввода с label и счётчиком символов.
 *
 * ⚠️ **Важно:** Это controlled компонент. Для ввода текста
 * используется обёртка с useState.
 *
 * Тест проверяет:
 * 1. Рендеринг инпута с label и placeholder
 * 2. Ввод текста пользователем обновляет value
 * 3. Счётчик символов обновляется (0/50 → 9/50)
 * 4. Вызывается onChange callback при каждом изменении
 */
export const Default: Story = {
  name: 'Default / controlled input',
  render: (args) => <InputWithState {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const counter = canvas.getByTestId('input-counter');

    await expect(input).toBeInTheDocument();
    await expect(input).toHaveAttribute('placeholder', 'Введите название');
    await expect(input).toHaveValue('');
    await expect(counter).toHaveTextContent('0/50');

    await userEvent.type(input, 'Storybook');

    await expect(input).toHaveValue('Storybook');
    await expect(counter).toHaveTextContent('9/50');
    await expect(args.onChange).toHaveBeenCalled();
  },
};

/**
 * **With value / pre-filled**
 *
 * Компонент `Input` с предзаполненным значением.
 *
 * Тест проверяет:
 * 1. Значение инпута предзаполнено ('Моя статья')
 * 2. Счётчик символов показывает правильное количество (10/50)
 */
export const WithValue: Story = {
  name: 'With value / pre-filled',
  args: {
    value: 'Моя статья',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const counter = canvas.getByTestId('input-counter');

    await expect(input).toHaveValue('Моя статья');
    await expect(counter).toHaveTextContent('10/50');
  },
};

/**
 * **With error / external validation**
 *
 * Компонент `Input` с ошибкой валидации.
 *
 * Тест проверяет:
 * 1. Отображается сообщение об ошибке ('Поле обязательно для заполнения')
 * 2. Индикатор required (*) показывается рядом с label
 * 3. Установлен aria-invalid="true" для accessibility
 * 4. Применяется CSS класс для визуального выделения ошибки
 *
 * ⚠️ Ошибка передаётся извне (внешнее управление), например из формы
 */
export const WithError: Story = {
  name: 'With error / external validation',
  args: {
    value: '',
    required: true,
    error: 'Поле обязательно для заполнения',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи*' });
    const error = canvas.getByTestId('input-error');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toHaveTextContent('Поле обязательно для заполнения');
    await expect(error).toHaveClass('input-field__error--visible');
  },
};

/**
 * **Disabled / blocked**
 *
 * Компонент `Input` в отключенном состоянии.
 *
 * Тест проверяет:
 * 1. Инпут имеет атрибут disabled
 * 2. Ввод текста невозможен (onChange не вызывается)
 */
export const Disabled: Story = {
  name: 'Disabled / blocked',
  args: {
    value: 'Текст',
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });

    await expect(input).toBeDisabled();

    await userEvent.type(input, 'Новый текст');
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/**
 * **Validation / demo fail (intentional)**
 *
 * ⚠️ **ЭТОТ ТЕСТ ДОЛЖЕН ПАДАТЬ** (демонстрация ошибки для обучения)
 *
 * Тест показывает пример намеренно неправильной проверки:
 * - Значение в инпуте: 'QA' (2 символа)
 * - Ожидается в тесте: '10/20' (неверно!)
 * - Правильно должно быть: '2/20'
 *
 * Это демонстрирует как выглядит упавший тест в Storybook.
 */
export const IntentionalFail: Story = {
  name: '❌ Demo / intentional test failure',
  args: {
    value: 'QA',
    maxLength: 20,
  },
  tags: [
    'intentional-fail',
    '!test',
    '!stable',
    'experimental',
    '!autodocs',
  ],
  parameters: {
    docs: {
      description: {
        story: '⚠️ Этот тест НАМЕРЕННО падает для демонстрации ошибки. '
          + 'Счётчик показывает "2/20", но тест ожидает "10/20".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: 'Название статьи' });
    const counter = canvas.getByTestId('input-counter');

    await expect(input).toHaveValue('QA');
    // ❌ НАМЕРЕННАЯ ОШИБКА: ожидается "10/20", но реальное значение "2/20"
    await expect(counter).toHaveTextContent('10/20');
  },
};
