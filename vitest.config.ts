import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import viteConfig from './vite.config';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const allBrowsers = ['chromium', 'firefox', 'webkit'] as const;
const selectedBrowsers = process.env.STORYBOOK_TEST_BROWSERS
  ? process.env.STORYBOOK_TEST_BROWSERS
    .split(',')
    .map((b) => b.trim() as (typeof allBrowsers)[number])
  : allBrowsers;

const isDemoRun = process.env.STORYBOOK_TEST_DEMO === '1';
const tags = isDemoRun
  ? { include: ['intentional-fail'], exclude: [] }
  : { include: ['test'], exclude: ['intentional-fail'] };

export default mergeConfig(
  viteConfig,
  defineConfig({
    optimizeDeps: {
      include: [
        '@storybook/addon-a11y/preview',
        '@storybook/react-vite',
      ],
    },
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/components/**/*.{ts,tsx}'],
        exclude: ['**/*.stories.tsx', '**/*.css'],
      },
      projects: [
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, '.storybook'),
              storybookScript: 'npm run storybook -- --ci',
              tags,
            }),
          ],
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              provider: playwright({}),
              headless: true,
              instances: selectedBrowsers.map((browser) => ({ browser })),
            },
            setupFiles: ['./.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }),
);
