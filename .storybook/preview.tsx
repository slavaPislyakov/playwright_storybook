import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import type { Preview } from '@storybook/react';
import { useLayoutEffect } from 'react';
import '../src/styles/theme.css';

const customViewports = {
  desktop1920: {
    name: 'Desktop 1920',
    styles: {
      width: '1920px',
      height: '1080px',
    },
    type: 'desktop',
  },
  desktop1440: {
    name: 'Desktop 1440',
    styles: {
      width: '1440px',
      height: '900px',
    },
    type: 'desktop',
  },
  desktop1280: {
    name: 'Desktop 1280',
    styles: {
      width: '1280px',
      height: '900px',
    },
    type: 'desktop',
  },
  tablet1024: {
    name: 'Tablet 1024',
    styles: {
      width: '1024px',
      height: '768px',
    },
    type: 'tablet',
  },
  tablet768: {
    name: 'iPad Mini',
    styles: {
      width: '768px',
      height: '1024px',
    },
    type: 'tablet',
  },
  mobile375: {
    name: 'Mobile 375',
    styles: {
      width: '375px',
      height: '812px',
    },
    type: 'mobile',
  },
  iphone13pro: {
    name: 'iPhone 13 Pro',
    styles: {
      width: '390px',
      height: '844px',
    },
    type: 'mobile',
  },
  mobile320: {
    name: 'Mobile 320',
    styles: {
      width: '320px',
      height: '568px',
    },
    type: 'mobile',
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        ...customViewports,
      },
    },
    // Стандартный layout Storybook вместо ручного padding-декоратора.
    // 'padded' добавляет отступы вокруг story, не искажая геометрию
    // (важно для stories с проверками ширины, например FullWidth в Button).
    layout: 'padded',
  },
  // Глобальный тег статуса для всех stories (фильтрация в sidebar)
  tags: ['stable'],
  globalTypes: {
    theme: {
      description: 'Тема оформления (light/dark)',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Направление текста (LTR/RTL)',
      toolbar: {
        title: 'Direction',
        icon: 'arrowrightalt',
        items: [
          { value: 'ltr', icon: 'arrowrightalt', title: 'LTR' },
          { value: 'rtl', icon: 'arrowleftalt', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    direction: 'ltr',
  },
  // Глобальный декоратор: применение theme/direction к корню iframe canvas
  // (document.documentElement). Тема вешается на <html>, а не на ручную
  // обёртку — это исключает огромный цветной фон вокруг маленьких компонентов
  // (был minHeight: 100vh на div-обёртке) и позволяет тёмной теме закрашивать
  // весь canvas через `body { background: var(--color-bg) }` в theme.css.
  // Padding не нужен — используется стандартный `layout: 'padded'`.
  decorators: [
    (Story, context) => {
      const theme = context.globals?.theme ?? 'light';
      const direction = context.globals?.direction ?? 'ltr';
      useLayoutEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('dir', direction);
      }, [theme, direction]);
      return <Story />;
    },
  ],
};

export default preview;
