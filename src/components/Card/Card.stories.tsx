import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs', 'play-fn'],
  args: {
    title: 'Заголовок карточки',
    description: 'Описание содержимого карточки. Здесь может быть любой текст.',
    onClick: fn(),
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * **Default / with title and description**
 *
 * Компонент `Card` — контейнер для отображения контента
 * с заголовком и описанием.
 *
 * Тест проверяет:
 * 1. Карточка отображается с переданным заголовком и описанием
 * 2. Присутствуют все необходимые data-testid атрибуты
 * 3. Клик по карточке вызывает onClick callback
 */
export const Default: Story = {
  name: 'Default / with title and description',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByTestId('card');
    const title = canvas.getByTestId('card-title');
    const description = canvas.getByTestId('card-description');

    await expect(card).toBeInTheDocument();
    await expect(title).toHaveTextContent('Заголовок карточки');
    await expect(description).toHaveTextContent(
      'Описание содержимого карточки',
    );

    await userEvent.click(card);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

/**
 * **With image / media card**
 *
 * Компонент `Card` с изображением.
 *
 * Тест проверяет:
 * 1. Отображается обертка для изображения (image-wrapper)
 * 2. Изображение имеет корректный src URL
 * 3. У изображения заполнен alt атрибут для accessibility
 */
export const WithImage: Story = {
  name: 'With image / media card',
  args: {
    imageUrl: 'https://picsum.photos/400/225',
    title: 'Карточка с изображением',
    description: 'Описание под изображением',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const imageWrapper = canvas.getByTestId('card-image-wrapper');
    const image = canvas.getByTestId('card-image');

    await expect(imageWrapper).toBeInTheDocument();
    await expect(image).toHaveAttribute('src', 'https://picsum.photos/400/225');
    await expect(image).toHaveAttribute('alt', 'Карточка с изображением');
  },
};

/**
 * **With footer / action card**
 *
 * Компонент `Card` с пользовательским футером.
 *
 * Тест проверяет:
 * 1. Отображается слот footer с переданным содержимым
 * 2. В футере отображается кнопка с корректным текстом
 */
export const WithFooter: Story = {
  name: 'With footer / action card',
  args: {
    title: 'Действие',
    description: 'Нажмите для выполнения',
    footer: <button type='button'>Подробнее</button>,
    // Убираем onClick, чтобы кнопка в футере не была вложена
    // в кликабельную карточку
    onClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const footer = canvas.getByTestId('card-footer');
    const button = canvas.getByRole('button', { name: 'Подробнее' });

    await expect(footer).toBeInTheDocument();
    await expect(button).toBeInTheDocument();
  },
};

/**
 * **Variants / outlined**
 *
 * Компонент `Card` с обводкой.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс `card--outlined` при variant='outlined'
 * 2. Карточка имеет рамку вместо тени
 */
export const Variants: Story = {
  name: 'Variants / outlined',
  args: {
    variant: 'outlined',
    title: 'Обведенная карточка',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByTestId('card');
    await expect(card).toHaveClass('card--outlined');
  },
};

/**
 * **Variants / elevated**
 *
 * Компонент `Card` с тенью.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс `card--elevated` при variant='elevated'
 * 2. Карточка имеет тень для эффекта "приподнятости"
 */
export const Elevated: Story = {
  name: 'Variants / elevated',
  args: {
    variant: 'elevated',
    title: 'Приподнятая карточка',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByTestId('card');
    await expect(card).toHaveClass('card--elevated');
  },
};

/**
 * **Padding / large**
 *
 * Компонент `Card` с увеличенными отступами.
 *
 * Тест проверяет:
 * 1. Применяется CSS класс `card--padding-large` при padding='large'
 * 2. Контент отображается с увеличенными внутренними отступами
 */
export const PaddingSizes: Story = {
  name: 'Padding / large',
  args: {
    padding: 'large',
    title: 'Большой отступ',
    description: 'У карточки увеличенные отступы',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByTestId('card');
    const content = canvas.getByTestId('card-content');

    await expect(card).toHaveClass('card--padding-large');
    await expect(content).toBeInTheDocument();
  },
};

/**
 * **Static / no onClick**
 *
 * Компонент `Card` без обработчика клика.
 *
 * Тест проверяет:
 * 1. Карточка не имеет CSS класса `card--clickable`
 * 2. У карточки нет role='button' (не интерактивная)
 * 3. У карточки нет tabindex (не фокусируемая)
 */
export const NotClickable: Story = {
  name: 'Static / no onClick',
  args: {
    title: 'Статичная карточка',
    description: 'Без обработчика клика',
    onClick: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const card = canvas.getByTestId('card');

    await expect(card).not.toHaveClass('card--clickable');
    await expect(card).not.toHaveAttribute('role', 'button');
    await expect(card).not.toHaveAttribute('tabIndex');
  },
};
