import { INITIAL_VIEWPORTS } from 'storybook/viewport';
import type { Preview } from '@storybook/react';

const customViewports = {
  desktop1280: {
    name: 'Desktop 1280',
    styles: {
      width: '1280px',
      height: '900px',
    },
    type: 'desktop',
  },
  mobile375: {
    name: 'Mobile 375',
    styles: {
      width: '375px',
      height: '812px',
    },
    type: 'mobile',
  },
  iphone12pro: {
    name: 'iPhone 12 Pro',
    styles: {
      width: '390px',
      height: '844px',
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
  // initialGlobals: {
  //   viewport: { value: 'reset' },
  // },
};

export default preview;