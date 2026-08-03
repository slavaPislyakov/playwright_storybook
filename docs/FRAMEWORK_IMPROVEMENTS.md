# Анализ и предложения по улучшению фреймворка

> Тестовый фреймворк для демо (React + Vite + Storybook 10 + Playwright/test-runner).
> Все предложения опираются на официальную документацию Storybook (v10.2.9).

---

## Содержание

- [Что добавить](#что-добавить)
- [Что удалить](#что-удалить)
- [Что улучшить](#что-улучшить)
- [Сводная таблица приоритетов](#сводная-таблица-приоритетов)

---

## Что добавить

### 1. `@storybook/addon-vitest` вместо `@storybook/test-runner`

**Почему.** Официальная документация Storybook 10 прямо рекомендует миграцию с Jest-based `test-runner` на Vitest addon. Преимущества: Vitest как runner (быстрее Jest), встроенная интеграция с UI Storybook, нативная поддержка accessibility-тестов и coverage, запуск тестов без отдельного build Storybook.

> «Migrating to the Vitest addon replaces the previous Jest-based test-runner with a modern, browser-friendly testing stack… reducing setup complexity and bringing built-in support for accessibility and coverage.»
> — [Migration guide (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/integrations/vitest-addon/migration-guide.mdx)

**Что сделать.**

- Установить `@storybook/addon-vitest`, `vitest`, `jsdom` (или `happy-dom`).
- Создать `vitest.config.ts` с плагином `storybookTest` и фильтрацией по тегам:

```typescript
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/test-runner';

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [
          storybookTest({
            storybookScript: 'npm run storybook -- --ci',
            storybookUrl: 'http://localhost:6006',
            tags: { include: ['test'], exclude: ['intentional-fail'] },
          }),
        ],
        environment: 'jsdom',
        setupFiles: ['./.storybook/vitest.setup.ts'],
      },
    ],
  },
});
```

> Источник конфигурации: [Vitest 4 tags configuration (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/vitest-plugin-vitest-tags-configuration.md)

- Добавить `.storybook/vitest.setup.ts`:

```typescript
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as projectAnnotations from './preview';

const project = setProjectAnnotations([projectAnnotations]);
beforeAll(project.beforeAll);
```

- Добавить аддон в `.storybook/main.ts`:

```typescript
addons: ['@storybook/addon-a11y', '@storybook/addon-docs', '@storybook/addon-vitest'],
```

> Источник: [Accessibility tests integration with Vitest addon (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/accessibility-testing.mdx)

---



### 2. Автоматические accessibility-тесты в CI

**Почему.** Сейчас `@storybook/addon-a11y` только отображает отчёт в UI Storybook, но не падает в CI. С Vitest addon a11y-проверки запускаются автоматически вместе с компонентными тестами.

> «When you run `npx storybook add @storybook/addon-vitest` in a project that already has `@storybook/addon-a11y` installed, Storybook will automatically… Configure accessibility tests to run alongside your component tests.»
> — [Accessibility testing (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/accessibility-testing.mdx)

**Что сделать.** После миграции на Vitest addon — добавить в CI шаг запуска a11y-тестов и настроить `a11y` parameters в `preview.tsx` (уровни violations, контекст).

---



### 3. Coverage-отчёты

**Почему.** Vitest имеет встроенную поддержку coverage — больше не нужен `@storybook/addon-coverage`. Это упрощает конфигурацию и ускоряет рендер stories.

> «Code coverage is enabled via Vitest's built-in coverage support, meaning you no longer need instrumentation from the `@storybook/addon-coverage` package.»
> — [Migration guide (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/integrations/vitest-addon/migration-guide.mdx)

**Что сделать.** Добавить в `vitest.config.ts`:

```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    include: ['src/components/**/*.{ts,tsx}'],
    exclude: ['**/*.stories.tsx', '**/*.css'],
  },
}
```

---



### 4. Глобальные `globalTypes` для тем/локали/направления текста

**Почему.** В `preview.tsx` нет `globalTypes` — нет тулбарных переключателей для тем (light/dark), RTL/LTR, locale. Для демо-фреймворка это полезно для демонстрации адаптивности компонентов.

> Источник паттерна: [Preview with global decorators and globals (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/next/test-storybooks/portable-stories-kitchen-sink/react/.storybook/preview.tsx)

**Что сделать.** Добавить в `preview.tsx`:

```typescript
globalTypes: {
  theme: {
    description: 'Тема оформления',
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
    description: 'Направление текста',
    toolbar: {
      title: 'Direction',
      items: ['ltr', 'rtl'],
      dynamicTitle: true,
    },
  },
},
initialGlobals: {
  theme: 'light',
  direction: 'ltr',
},
```

**✅ Расширение: тёмная тема реализована.** Глобальный декоратор `preview.tsx` вешает `data-theme` на контейнер-обёртку. Создан `src/styles/theme.css` с дизайн-токенами через CSS-переменные (`:root` — light, `[data-theme='dark']` — dark). Все 7 CSS-файлов компонентов рефакторены с хардкод-цветов на `var(--color-*)`. Переключатель Theme в тулбаре теперь реально меняет внешний вид всех компонентов (поверхности, текст, границы, primary, семантические цвета, тени).

---

### 5. Вынос общих обёрток и хелперов в `src/test/`

**Почему.** Сейчас `InputWithState`, `CheckboxWithState`, `ToastWithState`, `SelectWithErrorState`, `withinBody` дублируются/определены локально в каждом `*.stories.tsx`. Это нарушает DRY и усложняет переиспользование в Vitest-тестах (portable stories).

**Что сделать.** Создать `src/test/wrappers.tsx` и `src/test/helpers.ts`, экспортировать обёртки и `withinBody`. Это также облегчит миграцию на Vitest addon — обёртки можно будет переиспользовать в `.test.tsx` файлах.

**✅ Что сделано.** Создан `src/test/wrappers.tsx` с экспортом `InputWithState`, `CheckboxWithState`, `ToastWithContainer`, `ToastWithState`, `SelectWithErrorState`, `ModalWithState` (см. также п.17). Создан `src/test/helpers.ts` с экспортом `withinBody` (helper для поиска в `document.body` — используется в Modal stories с порталами). Импорты обновлены в `Input.stories.tsx`, `Checkbox.stories.tsx`, `Toast.stories.tsx`, `Select.stories.tsx`, `Modal.stories.tsx`; локальные определения и неиспользуемые импорты (`useState`/`useCallback`/`Toast`) удалены. `type-check`, `lint`, `build-storybook` и `test-storybook:chromium` (41/41) проходят.

---



### 6. Кэширование Playwright-браузеров в CI

**Почему.** В `.github/workflows/ci.yml` шаг `npx playwright install --with-deps chromium` выполняется при каждом запуске — медленно. Есть официальный action с кэшированием.

**Что сделать.** Использовать `browser-actions/setup-playwright` или кэшировать `~/.cache/ms-playwright` через `actions/cache`.

**✅ Что сделано.** В `.github/workflows/ci.yml` в job `test-storybook` добавлен шаг `actions/cache@v4` для `~/.cache/ms-playwright` перед установкой браузера. Ключ кэша: `${{ runner.os }}-playwright-${{ matrix.browser }}-${{ hashFiles('**/package-lock.json') }}` (отдельный для каждого браузера матрицы + хэш lock-файла для инвалидации при обновлении `playwright`). `restore-keys` с частичным совпадением позволяет переиспользовать кэш от предыдущих версий. Шаг `playwright install --with-deps` оставлен — при cache hit установка браузера пропускается, ставятся только системные зависимости. YAML валиден.

---



### 7. Запуск кроссбраузерных тестов в CI (опционально)

**Почему.** В `package.json` есть скрипты `test-storybook:firefox` и `test-storybook:webkit`, но в CI запускается только `:play` (chromium). Либо использовать матрицу, либо удалить неиспользуемые скрипты (см. раздел «Что удалить»).

---



## Что удалить



### 1. `actions: { argTypesRegex: '^on[A-Z].*' }` из `preview.tsx`

**Почему.** `argTypesRegex` помечен как **NOT recommended** в Storybook 8+, а в Storybook 10 при использовании вместе с visual test addon выдаёт предупреждение. Auto-inferred args не доступны как spies в play-функциях. В проекте уже везде используются явные `fn()` из `storybook/test` — `argTypesRegex` бесполезно и потенциально вредно.

> «We recommend removing the `argTypesRegex` and assigning explicit action with the `fn` function from `storybook/test` instead.»
> — [argTypesRegex deprecation warning (Storybook)](https://github.com/storybookjs/storybook/blob/next/code/core/src/core-server/utils/warnWhenUsingArgTypesRegex.ts)
>
> «Storybook 8 removes this implicit behavior, requiring actions to be explicitly defined as spies using `fn()` from `@storybook/test` in the component's `args` property.»
> — [Migration guide (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/MIGRATION.md)

**Что сделать.** Удалить блок `actions` из `parameters` в `.storybook/preview.tsx`. Проверить, что все stories уже используют явные `fn()` (это уже так).

**✅ Что сделано.** Удалён блок `actions: { argTypesRegex: '^on[A-Z].*' }` из `parameters` в `.storybook/preview.tsx`. Проверены все stories: все callback'и (`onClick`, `onChange`, `onClose`, `onAction`, `onBlur`) явно определены через `fn()` из `storybook/test` в `args` (meta или story). Toast использует `onClose: () => {}` (явно, не полагается на auto-inference) — также безопасно. `type-check`, `lint`, `build-storybook` проходят без предупреждений об `argTypesRegex`; `test-storybook:chromium` — 41/41.

---



### 2. Дублирующие ESLint-зависимости

**Почему.** В `package.json` одновременно установлены:

- `@typescript-eslint/eslint-plugin` (^8.60.0)
- `typescript-eslint` (^8.60.0)

Пакет `typescript-eslint` — это umbrella-пакет, который уже включает и parser, и plugin. Явный `@typescript-eslint/eslint-plugin` здесь лишний и не используется в `eslint.config.js` (там импортируется только `typescript-eslint`).

**Что сделать.** `npm uninstall @typescript-eslint/eslint-plugin`.

---



### 3. Неиспользуемые поля в `package.json`

**Почему.** `\"main\": \"index.js\"` указывает на несуществующий файл; `\"description\": \"\"`, `\"keywords\": []`, `\"author\": \"\"` — пустые. Для демо-проекта это шум.

**Что сделать.** Удалить `\"main\"` или заменить на реальный entry-point. Заполнить `description` (например, «Demo UI kit with Storybook + Playwright testing»).

---



### 4. `http-server` и `wait-on` (после миграции на Vitest addon)

**Почему.** Эти пакеты нужны только для запуска статического билда Storybook в CI при использовании `test-runner`. Vitest addon запускает Storybook сам через `storybookScript` — отдельный http-сервер и `wait-on` не нужны.

**Что сделать.** После миграции (см. п. 1 в «Что добавить») — `npm uninstall http-server wait-on` и упростить CI-шаг.

---



### 5. Устаревший `docs/VITEST_MIGRATION_PLAN.md` — ✅ уже удалён

**Почему.** В файле упоминалось `environment: 'jsdom'` — но в Storybook 10 Vitest addon использует **Vitest Browser mode** с Playwright, а не чистый jsdom. Также файл предлагал опционально удалить Playwright, что неверно для Storybook 10. Документ вводил в заблуждение.

> «Tests are still tested in a Playwright environment, but in Vitest's Browser mode.»
> — [Migration guide (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/integrations/vitest-addon/migration-guide.mdx)

**Что сделано.** Файл `docs/VITEST_MIGRATION_PLAN.md` удалён. Актуальный план миграции теперь описан в п.1 раздела «Что добавить» этого документа. Ссылка в `README.md` (раздел TODO) обновлена на `docs/FRAMEWORK_IMPROVEMENTS.md`.

---



### 6. Неиспользуемые кроссбраузерные скрипты (опционально)

**Почему.** Скрипты `test-storybook:firefox`, `test-storybook:webkit`, `test-storybook:all-browsers` не запускаются в CI и вряд ли используются вручную в демо-проекте. Либо удалить, либо добавить в CI матрицу.

**Что сделать.** На усмотрение — удалить, если кроссбраузерность не нужна для демо.

## Что улучшить



### 1. Использовать стандартный тег `test` вместо кастомного `play-fn`

**Почему.** Storybook 10 добавляет неявные теги `dev` и `test` ко всем stories. Кастомный `play-fn` — нестандартный и требует ручного тегирования каждой story с play-функцией (`tags: ['autodocs', 'play-fn']`) и `!play-fn` для story без play. Стандартный `test` тег наследуется автоматически — фильтрация в Vitest addon работает из коробки.

> «All stories in this file will have these tags applied: autodocs, dev (implicit default, inherited from preview), test (implicit default, inherited from preview).»
> — [Tags in meta and story (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/tags-in-meta-and-story.md)

**Что сделать.** Удалить `play-fn` из тегов, использовать неявный `test`. Для story без play-функции использовать `tags: ['!test']` (а не `!play-fn`). Для намеренно падающих — `tags: ['intentional-fail', '!test']`. Это упростит конфигурацию Vitest addon (см. п. 1 в «Что добавить»).

---



### 2. Глобальный декоратор `padding: 24px` мешает геометрическим тестам

**Почему.** В `preview.tsx` глобальный декоратор оборачивает все stories в `<div style={{ padding: '24px' }}>`. Это мешает тестам, проверяющим геометрию (например, `FullWidth` в `Button.stories.tsx` проверяет `buttonRect.width`), и искажает screenshots. Декоратор padding лучше делать через `layout: 'centered'` или `padded` параметр docs, а не через обёртку.

**Что сделать.** Заменить глобальный декоратор на:

```typescript
parameters: {
  layout: 'centered', // или 'padded'
}
```

Или оставить декоратор, но использовать `parameters: { layout: 'fullscreen' }` в stories с геометрическими проверками.

**✅ Что сделано.** В `.storybook/preview.tsx` добавлен `parameters.layout = 'padded'` (стандартный layout Storybook). Из глобального декоратора убраны `padding: '24px'` и `boxSizing: 'border-box'`; сохранены `data-theme`, `dir`, `background: var(--color-bg)`, `color: var(--color-text)`, `minHeight: 100vh` — тёмная тема по-прежнему закрашивает весь холст. `layout: 'padded'` не искажает геометрию внутри story (внутренние обёртки, например `<div style={{ width: '320px' }}>` в `FullWidth`, сохраняют размеры), поэтому геометрические тесты корректны. `test-storybook:chromium` — 41/41, включая `Button › FullWidth`.

---



### 3. `IntentionalFail` stories засоряют autodocs

**Почему.** Story `IntentionalFail` в `Button.stories.tsx` и `Input.stories.tsx` помечена `tags: ['intentional-fail', '!play-fn']`, но наследует `autodocs` из meta — попадает в документацию компонента. Для демо-проекта это сбивает с толку читателя docs.

> «The 'autodocs' tag enables documentation generation for the component and all stories, while the '!autodocs' tag excludes individual stories from the generated documentation.»
> — [Autodocs tag (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/tags-autodocs-remove-story.md)

**Что сделать.** Добавить `!autodocs` к тегам намеренно падающих stories:

```typescript
tags: ['intentional-fail', '!play-fn', '!autodocs'],
```

**✅ Что сделано.** В `Button.stories.tsx` и `Input.stories.tsx` (story `IntentionalFail`) добавлен тег `!autodocs`. Итоговые теги: `['intentional-fail', '!play-fn', '!stable', 'experimental', '!autodocs']` (отформатированы на несколько строк для соблюдения `max-len: 80`). Проверка `storybook-static/index.json` после `build-storybook`: `components-button--intentional-fail` и `components-input--intentional-fail` не содержат тег `autodocs` (исключены из docs-страницы), при этом story остаётся доступной в sidebar для ручного запуска в Canvas.

---



### 4. Дублирование `render` функции в `Modal.stories.tsx`

**Почему.** В `Modal.stories.tsx` одна и та же `render: function Render(args)` с `useState` копируется в 5 stories (Default, WithActions, CancelAction, WithoutDraftButton, BackdropClick). Это нарушение DRY и KISS.

**Что сделать.** Вынести `render` в общий декоратор на уровне meta или в обёртку `ModalWithState` (как сделано в `Toast.stories.tsx` и `Checkbox.stories.tsx`):

```typescript
const ModalWithState = (args: React.ComponentProps<typeof Modal>) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);
  return (
    <>
      <button type='button' onClick={() => setIsOpen(true)}>
        Открыть модалку
      </button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); args.onClose?.(); }}
        onAction={(action) => { setIsOpen(false); args.onAction?.(action); }}
      />
    </>
  );
};

const meta = {
  component: Modal,
  render: (args) => <ModalWithState {...args} />,
  // ...
} satisfies Meta<typeof Modal>;
```

**✅ Что сделано.** Обёртка `ModalWithState` вынесена в `src/test/wrappers.tsx` (совместно с обёртками из п.5). В `Modal.stories.tsx` установлен `render: (args) => <ModalWithState {...args} />` на уровне `meta` — применяется ко всем stories. Дублирующий `render: function Render(args)` удалён из 5 stories: `Default`, `WithActions`, `CancelAction`, `WithoutDraftButton`, `BackdropClick` (устранено ~100 строк дублирования). Неиспользуемый импорт `useState` удалён. `test-storybook:chromium` — 41/41, включая все 5 Modal stories.

---



### 5. Хардкод `setTimeout(2000)` в `Toast.stories.tsx`

**Почему.** В `Toast.stories.tsx` (story `Default`) используется `await new Promise(resolve => setTimeout(resolve, 2000))` — хардкод 2 секунды замедляет тесты и нестабилен. Лучше использовать `waitFor` или fake timers.

**Что сделать.** Убрать `setTimeout`, сразу кликать по кнопке закрытия и использовать `waitFor` для проверки анимации выхода (как уже сделано ниже в той же story).

---



### 6. Явно указать viewport addon в `.storybook/main.ts`

**Почему.** В `preview.tsx` импортируется `INITIAL_VIEWPORTS` из `storybook/viewport`, но в `main.ts` аддон `storybook/viewport` не указан. В Storybook 10 viewport входит в essentials и работает неявно, но явное указание делает конфигурацию самодокументируемой.

> «Add the viewport addon to the Storybook configuration file (.storybook/main.js) by including it in the addons array.»
> — [Viewport addon README (Storybook v10.2.9)](https://github.com/storybookjs/storybook/blob/v10.2.9/code/core/src/viewport/README.md)

**Что сделать.** Либо явно добавить `'storybook/viewport'` в addons (если не входит в essentials для вашей конфигурации), либо оставить как есть, но добавить комментарий, что viewport — часть essentials.

---



### 7. `tsconfig.json` — `tsc -b` без `composite: true`

**Статус:** ✅ Выполнено.

**Почему.** Скрипт `build` использует `tsc -b && vite build`, но в `tsconfig.json` нет `composite: true` и `noEmit: true` одновременно. `tsc -b` (build mode) требует `composite: true` в referenced проектах. Сейчас это может работать, но семантически некорректно.

**Что сделано.** Скрипт `build` заменён на `tsc --noEmit && vite build` (без `-b`). Дополнительно: так как в проекте отсутствовало основное Vite-приложение (нет `index.html`), `vite build` падал с `Could not resolve entry module "index.html"`. Создано demo-приложение-витрина (`index.html` + `src/main.tsx` + `src/App.tsx` + `src/App.css`), показывающее все компоненты UI-кита с переключателем тем. Теперь `npm run build` собирает `dist/` корректно, добавлен скрипт `npm run preview` для локального просмотра собранной демки.

---



### 8. Типизация `args.onChange?.mockClear()` как Mock

**Почему.** В stories используется `args.onChange?.mockClear()` и `args.onClick.mockClear()` — но `args.onChange` типизирован как `(value: string) => void`, а не как `Mock`. Это работает потому что `fn()` возвращает jest-совместимый mock, но TypeScript не знает об этом. После миграции на Vitest addon (с `vi.fn()`) типы будут `Mock` из vitest — нужно будет обновить типизацию.

**Что сделать.** Использовать `fn()` из `storybook/test` (уже так) и при миграции — `vi.fn()` с типом `Mock`. Не вызывать `mockClear()` напрямую через optional chaining — лучше `args.onChange?.mockClear?.()` или явная проверка.

---



### 9. CI: `npm ci --legacy-peer-deps` — ✅ исправлено (даунгрейд ESLint)

**Почему.** В CI использовался `--legacy-peer-deps` — это был сигнал о конфликте peer-зависимостей. Причина выяснена эмпирически: **НЕ React 18 vs 19** (как предполагалось изначально), а **ESLint 10 vs** `eslint-plugin-react`. Проект использовал `eslint@^10.4.0`, но `eslint-plugin-react@7.37.5` (даже последняя версия) требует `eslint: ^3-^9.7` — не поддерживает ESLint 10. Также `@eslint-community/eslint-utils` требовал `eslint: ^6-^9`. Экосистема плагинов ещё не готова к ESLint 10.

**Что сделано.**

1. Даунгрейд `eslint` и `@eslint/js` с `^10.x` до `^9.39.5` в `package.json`. Все остальные плагины (`@stylistic/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) поддерживают и ESLint 9, и 10 — даунгрейд им не мешает.
2. `--legacy-peer-deps` удалён из всех 3 job'ов `.github/workflows/ci.yml` (`npm ci --legacy-peer-deps` → `npm ci`).
3. `npm install` теперь работает без флагов-костылей (проверено: `added 25 packages, removed 2 packages, changed 11 packages`, без ERESOLVE).
4. `npm run lint`, `npm run type-check`, `npm run build-storybook` — все проходят без ошибок.

**Когда вернуться к ESLint 10.** После выхода `eslint-plugin-react@8` (или новее) с поддержкой ESLint 10 в `peerDependencies`. Тогда можно будет поднять `eslint` и `@eslint/js` обратно до `^10` — `--legacy-peer-deps` не понадобится.

---



### 10. Тег `status` для stories — ✅ реализовано через теги (а не parameters.status)

**Почему.** Для демо-проекта полезно помечать stories статусом (stable / beta / deprecated / experimental).

**⚠️ Важная поправка.** Изначально в этом пункте предлагалось использовать `parameters.status` — это устаревший подход из Storybook 6-7 (тогда был `@storybook/addon-statuses`). В Storybook 10 этот параметр **удалён** и игнорируется (build проходит, потому что `parameters` — свободный объект, но бейджа в docs нет).

> «While "beta," "stable," and "deprecated" remain common labels for categorizing components, these are now typically implemented as **tags** in your CSF files rather than a dedicated badge parameter.»
> — [Tags (Storybook docs)](https://storybook.js.org/docs/writing-stories-tags)

**Что сделано (правильный подход для Storybook 10).**

1. В `.storybook/preview.tsx` добавлен глобальный тег `stable` на верхнем уровне (наследуется всеми stories):
  ```typescript
   tags: ['stable'],
  ```
2. В `Button.stories.tsx` и `Input.stories.tsx` (story `IntentionalFail`) — тег `experimental` с удалением унаследованного `stable`:
  ```typescript
   tags: ['intentional-fail', '!play-fn', '!stable', 'experimental'],
  ```

**Как это выглядит.** В Storybook 10 теги не дают цветной бейдж в docs (как было раньше с `parameters.status`), но они **видимы в sidebar** и доступны для фильтрации — можно отфильтровать stories по тегу `experimental` или `stable`. Это текущий официальный способ категоризации по статусу в Storybook 10.

---



## Сводная таблица приоритетов

> Статус: ⬜ — не начат · 🟡 — в работе · ✅ — выполнен · ⏭️ — пропущен/неактуален
> Таблица отсортирована по приоритету (Высокий → Средний → Низкий). Номера пунктов — исходные, на них ссылаются другие разделы документа.


| #   | Действие                                | Категория | Приоритет | Сложность | Зависимости | Статус |
| --- | --------------------------------------- | --------- | --------- | --------- | ----------- | ------ |
| 1   | Миграция на `@storybook/addon-vitest`   | Добавить  | Высокий   | Средняя   | —           | ⬜      |
| 2   | A11y-тесты в CI                         | Добавить  | Высокий   | Низкая    | п.1         | ⬜      |
| 8   | Удалить `argTypesRegex`                 | Удалить   | Высокий   | Низкая    | —           | ✅      |
| 14  | Стандартный тег `test` вместо `play-fn` | Улучшить  | Высокий   | Низкая    | п.1         | ⬜      |
| 3   | Coverage-отчёты                         | Добавить  | Средний   | Низкая    | п.1         | ⬜      |
| 5   | Вынос обёрток в `src/test/`             | Добавить  | Средний   | Низкая    | —           | ✅      |
| 6   | Кэш Playwright в CI                     | Добавить  | Средний   | Низкая    | —           | ✅      |
| 9   | Удалить дублирующий ESLint plugin       | Удалить   | Средний   | Низкая    | —           | ✅      |
| 11  | Удалить `http-server`/`wait-on`         | Удалить   | Средний   | Низкая    | п.1         | ⬜      |
| 12  | Удалить `VITEST_MIGRATION_PLAN.md`      | Удалить   | Средний   | Низкая    | п.1         | ✅      |
| 15  | Убрать глобальный padding-декоратор     | Улучшить  | Средний   | Низкая    | —           | ✅      |
| 16  | `!autodocs` для `IntentionalFail`       | Улучшить  | Средний   | Низкая    | —           | ✅      |
| 17  | Вынести `render` в `Modal.stories.tsx`  | Улучшить  | Средний   | Низкая    | —           | ✅      |
| 4   | `globalTypes` (theme/direction)         | Добавить  | Низкий    | Низкая    | —           | ✅      |
| 7   | Кроссбраузерность в CI                  | Добавить  | Низкий    | Средняя   | —           | ✅      |
| 10  | Убрать пустые поля `package.json`       | Удалить   | Низкий    | Низкая    | —           | ✅      |
| 13  | Удалить неиспользуемые скрипты          | Удалить   | Низкий    | Низкая    | —           | ✅      |
| 18  | Убрать хардкод `setTimeout` в Toast     | Улучшить  | Низкий    | Низкая    | —           | ✅      |
| 19  | Явный viewport addon в `main.ts`        | Улучшить  | Низкий    | Низкая    | —           | ✅      |
| 20  | `tsc -b` без `composite`                | Улучшить  | Низкий    | Низкая    | —           | ✅      |
| 21  | Типизация `mockClear`                   | Улучшить  | Низкий    | Низкая    | п.1         | ⬜      |
| 22  | Разобраться с `--legacy-peer-deps`      | Улучшить  | Низкий    | Средняя   | —           | ✅      |
| 23  | Тег `status` для stories (через tags)   | Улучшить  | Низкий    | Низкая    | —           | ✅      |


---



## Рекомендуемый порядок внедрения

1. **Быстрые победы (low-hanging fruit):** п.8 (удалить `argTypesRegex`), п.9 (убрать дублирующий ESLint), п.10 (почистить `package.json`), п.16 (`!autodocs` для `IntentionalFail`), п.18 (убрать `setTimeout`), п.20 (`tsc --noEmit`).
2. **Миграция на Vitest addon:** п.1 → п.2 → п.3 → п.11 → п.12 → п.14 → п.21.
3. **Структурные улучшения:** п.5 (вынос обёрток), п.17 (`ModalWithState`), п.15 (padding-декоратор).
4. **Опциональные улучшения:** п.4 (globalTypes), п.6 (кэш CI), п.7 (кроссбраузерность), п.19, п.22, p.23.

---



## Источники (официальная документация Storybook v10.2.9)

- [Migration guide: test-runner → Vitest addon](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/integrations/vitest-addon/migration-guide.mdx)
- [Accessibility testing](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-tests/accessibility-testing.mdx)
- [Vitest plugin tags configuration](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/vitest-plugin-vitest-tags-configuration.md)
- [Tags in meta and story (CSF3)](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/tags-in-meta-and-story.md)
- [Autodocs tag](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/tags-autodocs-remove-story.md)
- [Autodocs documentation](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/writing-docs/autodocs.mdx)
- [Actions: argTypesRegex deprecation](https://github.com/storybookjs/storybook/blob/next/code/core/src/core-server/utils/warnWhenUsingArgTypesRegex.ts)
- [Actions: explicit fn() spies](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/essentials/actions.mdx)
- [Migration guide (MIGRATION.md)](https://github.com/storybookjs/storybook/blob/v10.2.9/MIGRATION.md)
- [Viewport addon](https://github.com/storybookjs/storybook/blob/v10.2.9/code/core/src/viewport/README.md)
- [Play function with steps](https://github.com/storybookjs/storybook/blob/v10.2.9/docs/_snippets/storybook-interactions-play-function.md)
- [Preview with globals (kitchen sink)](https://github.com/storybookjs/storybook/blob/next/test-storybooks/portable-stories-kitchen-sink/react/.storybook/preview.tsx)

