import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
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

/**
 * **Primary / click**
 *
 * Компонент `Button` — основная интерактивная кнопка.
 *
 * Тест проверяет:
 * 1. Кнопка отображается с переданным текстом label
 * 2. Установлен атрибут aria-busy="false" (не в состоянии загрузки)
 * 3. Клик по кнопке вызывает onClick callback
 */
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

/**
 * **Secondary / render**
 *
 * Компонент `Button` с вариантом `secondary` (серый фон).
 *
 * Тест проверяет:
 * 1. Кнопка рендерится в DOM
 * 2. Кнопка имеет состояние enabled (не disabled)
 */
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

/**
 * **Disabled / blocked click**
 *
 * Компонент `Button` в отключенном состоянии.
 *
 * Тест проверяет:
 * 1. Кнопка имеет атрибут disabled
 * 2. Клик по отключенной кнопке не вызывает onClick callback
 */
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

/**
 * **Icon / render**
 *
 * Компонент `Button` в варианте `icon` (иконочная кнопка).
 *
 * Тест проверяет:
 * 1. Отображается иконка вместо текстового label
 * 2. Установлен aria-label для accessibility (так как нет видимого текста)
 */
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

/**
 * **Loading / state**
 *
 * Компонент `Button` в состоянии загрузки.
 *
 * Тест проверяет:
 * 1. Кнопка отключена (disabled)
 * 2. Установлен aria-busy="true" для accessibility
 * 3. Применяется CSS класс button--loading для визуального отображения
 * 4. Клик не вызывает onClick callback
 */
export const Loading: Story = {
  name: 'Loading / state',
  args: {
    label: 'Отправить',
    loading: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Отправить' });

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveClass('button--loading');

    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

/**
 * **Full width / render**
 *
 * Компонент `Button` с флагом fullWidth (растягивание на всю ширину).
 *
 * Тест проверяет:
 * 1. Кнопка растянута на всю ширину родительского контейнера (320px)
 * 2. Ширина кнопки соответствует ожидаемым значениям
 */
export const FullWidth: Story = {
  name: 'Geometry / full width',
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

    // Проверяем что кнопка растянута почти на всю ширину контейнера
    const buttonRect = button.getBoundingClientRect();
    await expect(buttonRect.width).toBeGreaterThan(270);
    await expect(buttonRect.width).toBeLessThanOrEqual(320);
  },
};

/**
 * **Outlined / variant**
 *
 * Компонент `Button` с вариантом `outlined` (контурная кнопка).
 *
 * Тест проверяет:
 * 1. Применяется CSS класс button--outlined
 * 2. Кнопка имеет прозрачный фон с обводкой
 * 3. Клик вызывает onClick callback
 *
 * Outlined кнопки используются для второстепенных действий,
 * когда нужно меньше визуального веса чем у primary.
 */
export const Outlined: Story = {
  name: 'Variants / outlined',
  args: {
    label: 'Дополнительно',
    variant: 'outlined',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Дополнительно' });

    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('button--outlined');
    await expect(button).toHaveTextContent('Дополнительно');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/**
 * **Elevated / variant with shadow**
 *
 * Компонент `Button` с вариантом `elevated` (кнопка с тенью).
 *
 * Тест проверяет:
 * 1. Применяется CSS класс button--elevated
 * 2. Кнопка имеет эффект тени
 * 3. Клик вызывает onClick callback
 *
 * Elevated кнопки используются для важных действий на
 * контрастных/цветных фонах, где нужен эффект "плавающей" кнопки.
 */
export const Elevated: Story = {
  name: 'Variants / elevated with shadow',
  args: {
    label: 'Важное действие',
    variant: 'elevated',
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <>
        <style>
          {`
            .button--elevated.color-blue {
              background: #2563eb;
              color: #ffffff;
            }
            .button--elevated.color-blue:hover:not(:disabled) {
              background: #1d4ed8;
            }
          `}
        </style>
        <div className='color-blue'>
          <Story />
        </div>
      </>
    ),
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Важное действие' });

    await expect(button).toBeInTheDocument();
    await expect(button).toHaveClass('button--elevated');

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/**
 * **❌ Demo / intentional test failure**
 *
 * ⚠️ **ЭТОТ ТЕСТ ДОЛЖЕН ПАДАТЬ** (демонстрация ошибки)
 *
 * Тест ожидает текст "Удалить", но кнопка имеет текст "Сохранить".
 * Это демонстрирует как выглядит упавший тест в Storybook.
 */
export const IntentionalFail: Story = {
  name: '❌ Demo / intentional test failure',
  args: {
    label: 'Сохранить',
  },
  tags: ['intentional-fail', '!play-fn'],
  parameters: {
    docs: {
      description: {
        story: '⚠️ Этот тест НАМЕРЕННО падает. Ожидается "Удалить", '
          + 'но реальный текст "Сохранить".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Сохранить' });

    // ❌ НАМЕРЕННАЯ ОШИБКА
    await expect(button).toHaveTextContent('Удалить');
  },
};

/**
 * **Static / render only**
 *
 * ⚠️ **ЭТА STORY БЕЗ PLAY ФУНКЦИИ**
 *
 * Эта story только рендерит кнопку без интерактивных тестов.
 * Используется для демонстрации разницы между:
 * - `npm run test-storybook` (запустит эту story)
 * - `npm run test-storybook:play` (пропустит эту story)
 *
 * Тег `play-fn` убран — эта story не будет запущена при фильтрации по play-fn.
 */
export const StaticOnly: Story = {
  name: 'Static / render only (no play)',
  args: {
    label: 'Просто кнопка',
    variant: 'primary',
  },
  // Явно исключаем 'play-fn' через префикс !
  // Теперь эта story НЕ будет запущена при --includeTags=play-fn
  tags: ['!play-fn', 'autodocs'],
  // Нет play функции — только рендеринг
};
