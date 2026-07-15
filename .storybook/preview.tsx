import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import type { Preview } from '@storybook/react';
import React from 'react';

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
    actions: { argTypesRegex: '^on[A-Z].*' },
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
  },
  // Глобальный декоратор для отступов вокруг компонента
  decorators: [
    (Story) => {
      return (
        <div style={{ padding: '24px' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
