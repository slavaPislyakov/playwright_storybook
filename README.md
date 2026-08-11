# Playwright & Storybook UI Kit

Проект представляет собой изолированную среду для разработки и автоматизированного тестирования UI-компонентов на стеке **React + Vite + Storybook + Vitest addon (Playwright browser mode)**.

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Структура проекта](#структура-проекта)
- [Скрипты запуска](#скрипты-запуска)
- [Тестирование в Storybook](#тестирование-в-storybook)
- [CI/CD](#cicd)
- [Дизайн-система](#дизайн-система)

## Быстрый старт

### Требования

- Node.js (рекомендуется LTS версия)
- npm или yarn

### Установка

1. Клонируйте репозиторий.
2. Установите зависимости:
   ```bash
   npm install
   ```
3. Установите браузеры для Playwright (если запускаете тесты впервые):
   ```bash
   npx playwright install
   ```

## Структура проекта

```text
.
├── .github/workflows/    # CI/CD конфигурация (GitHub Actions)
├── .storybook/          # Конфигурация Storybook
├── src/
│   ├── components/      # Библиотека компонентов
│   │   ├── Button/      # Кнопка: логика, стили и stories
│   │   ├── Card/        # Карточка контента
│   │   ├── Checkbox/    # Чекбокс
│   │   ├── Input/       # Поле ввода
│   │   ├── Modal/       # Модальное окно
│   │   ├── Select/      # Выпадающий список
│   │   └── Toast/       # Уведомления
│   ├── styles/         # Дизайн-токены (theme.css)
│   ├── App.tsx          # Витрина компонентов (demo-приложение)
│   ├── App.css          # Стили витрины
│   └── main.tsx         # Точка входа demo-приложения
├── index.html           # HTML-точка входа Vite
├── vite.config.ts       # Конфигурация сборки (Vite + React)
├── tsconfig.json        # Настройки типизации TypeScript
└── package.json         # Скрипты запуска и зависимости
```

## Скрипты запуска

### Разработка и визуализация

- `npm run storybook` — Запускает локальную среду Storybook (порт 6006). Основное место разработки компонентов.
- `npm run dev` — Запуск Vite-сервера для demo-приложения (витрина компонентов).
- `npm run preview` — Локальный просмотр собранной demo-страницы из `dist/`.

### Качество кода

- `npm run lint` — Проверка ESLint.
- `npm run lint:fix` — Автоисправление ESLint.
- `npm run type-check` — Проверка TypeScript без генерации файлов.

### Тестирование (Vitest addon + Playwright browser mode)

Тесты запускаются на основе историй (stories) из Storybook через `@storybook/addon-vitest`. Vitest addon сам поднимает Storybook (через `storybookScript` из `vitest.config.ts`) и прогоняет stories в Playwright browser mode — отдельный build Storybook, `http-server` и `wait-on` не нужны.

| Команда | Описание | Теги / браузеры |
| :--- | :--- | :--- |
| `npm run test-storybook` | Один прогон всех тестов, кроме демо-ошибок | `test`, исключая `intentional-fail`; chromium, firefox, webkit |
| `npm run test-storybook:watch` | Watch-режим: перезапуск тестов при изменении файлов | `test`, исключая `intentional-fail` |
| `npm run test-storybook:chromium` | Один прогон только в Chromium | `STORYBOOK_TEST_BROWSERS=chromium` |
| `npm run test-storybook:firefox` | Один прогон только в Firefox | `STORYBOOK_TEST_BROWSERS=firefox` |
| `npm run test-storybook:webkit` | Один прогон только в WebKit | `STORYBOOK_TEST_BROWSERS=webkit` |
| `npm run test-storybook:demo` | Только демо-ошибки (ожидаемо падают) | `STORYBOOK_TEST_DEMO=1` → `intentional-fail` |
| `npm run test-storybook:coverage` | Тесты + coverage-отчёт (V8, Chromium) | `--coverage`, отчёт в `coverage/index.html` |

Теги:

- `test` — стандартный тег Storybook 10, наследуется всеми stories автоматически
- `!test` — явное исключение story из тестов (для stories без play-функции)
- `intentional-fail` — намеренно падающие тесты (демонстрация)
- `autodocs` — автоматическая документация в Storybook

Фильтрация тегов настраивается в `vitest.config.ts` (опция `tags` плагина `storybookTest`).

### Сборка

- `npm run build` — Сборка demo-приложения (витрины компонентов) в `dist/`: проверка типов (`tsc --noEmit`) + `vite build`.
- `npm run build-storybook` — Генерация статического билда Storybook.

### Demo-приложение (витрина компонентов)

Помимо Storybook, в проекте есть отдельное Vite-приложение-витрина (`index.html` + `src/main.tsx` + `src/App.tsx`), которое показывает все компоненты UI-кита на одной странице с переключателем тем (light/dark).

- `npm run dev` — запуск в режиме разработки.
- `npm run build` — production-сборка в `dist/`.
- `npm run preview` — просмотр собранной версии.

Тема сохраняется в `localStorage` и учитывает системные настройки (`prefers-color-scheme`).

## Тестирование в Storybook

Проект использует **`@storybook/addon-vitest`** (Vitest + Playwright browser mode). Все тестовые сценарии описаны непосредственно в файлах `*.stories.tsx` через:

- **JSDoc комментарии** — описание что проверяется в каждой story
- **Play function** — интерактивные сценарии (клики, ввод, проверки)
- **Accessibility checks** — автоматические проверки axe-core через `@storybook/addon-a11y` (запускаются в `afterEach` после каждой story; `parameters.a11y.test='error'` в `preview.tsx` делает нарушения упавшими в CI). Настройка: `context: 'body'`, дефолты axe-core.

Откройте Storybook (`npm run storybook`) и перейдите в **Docs** или **Canvas** режим для просмотра:

- Визуального состояния компонента
- Описания тестового сценария
- Результатов выполнения теста
- Accessibility-отчёта в панели **Accessibility**

## CI/CD

Pipeline запускается при каждом `push` в `main`/`master` или при создании Pull Request.

### Последовательность выполнения

```
┌─────────────────────┐
│ lint-and-typecheck  │  ← npm run lint + npm run type-check
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ build-storybook     │  ← npm run build-storybook
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│ test-storybook (matrix: chromium, firefox, webkit)  │
│   ← npm run test-storybook:<browser>                │
│      Vitest addon сам поднимает Storybook через      │
│      storybookScript (http-server/wait-on не нужны) │
└─────────────────────────────────────────────────────┘
```

### Что проверяется

| Job | Команды | Цель |
| :--- | :--- | :--- |
| **lint-and-typecheck** | `npm run lint` `npm run type-check` | Проверка стиля кода и типизации |
| **build-storybook** | `npm run build-storybook` | Проверка что Storybook собирается без ошибок |
| **test-storybook (chromium)** | `npm run test-storybook:chromium` | Компонентные тесты в Chromium (Vitest + Playwright) |
| **test-storybook (firefox)** | `npm run test-storybook:firefox` | Компонентные тесты в Firefox (Vitest + Playwright) |
| **test-storybook (webkit)** | `npm run test-storybook:webkit` | Компонентные тесты в WebKit (Vitest + Playwright) |

Конфигурация: `.github/workflows/ci.yml`

## Дизайн-система

### Темы оформления (light/dark)

Проект поддерживает две темы через CSS-переменные в `src/styles/theme.css`:

- **Light** (по умолчанию) — на `:root`
- **Dark** — переопределяется через `[data-theme='dark']`

Глобальный декоратор `preview.tsx` вешает `data-theme` на контейнер-обёртку каждой story из значения `globals.theme`. Переключатель **Theme** (☀️/🌙) в тулбаре Storybook меняет тему для всех компонентов.

Дизайн-токены: `--color-bg`, `--color-bg-muted`, `--color-bg-subtle`, `--color-border`, `--color-border-strong`, `--color-text`, `--color-text-secondary`, `--color-text-muted`, `--color-primary`, `--color-primary-hover`, `--color-primary-bg`, `--color-primary-bg-strong`, `--color-on-primary`, `--color-error`(+`-bg`), `--color-success`(+`-bg`), `--color-warning`(+`-bg`), `--color-info`(+`-bg`), `--color-overlay`, `--shadow-elevated`(+`-hover`).

Все CSS-файлы компонентов используют `var(--color-*)` вместо хардкод-цветов — добавление новой темы сводится к переопределению переменных.

### Viewport пресеты

Storybook настроен с пресетами для тестирования responsive layout:

| Viewport | Размер | Тип |
| :--- | :--- | :--- |
| Desktop 1920 | 1920x1080 | Desktop |
| Desktop 1440 | 1440x900 | Desktop |
| Desktop 1280 | 1280x900 | Desktop |
| Tablet 1024 | 1024x768 | Tablet |
| iPad Mini | 768x1024 | Tablet |
| Mobile 375 | 375x812 | Mobile |
| iPhone 13 Pro | 390x844 | Mobile |
| Mobile 320 | 320x568 | Mobile |
