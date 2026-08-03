# Playwright & Storybook UI Kit

Проект представляет собой изолированную среду для разработки и автоматизированного тестирования UI-компонентов на стеке **React + Vite + Storybook + Playwright**.

## Содержание

- [Быстрый старт](#быстрый-старт)
- [Структура проекта](#структура-проекта)
- [Скрипты запуска](#скрипты-запуска)
- [Тестирование в Storybook](#тестирование-в-storybook)
- [CI/CD](#cicd)
- [Дизайн-система](#дизайн-система)
- [TODO](#todo)

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

### Тестирование (Playwright + Storybook Runner)

Тесты запускаются на основе историй (stories) из Storybook.

| Команда | Описание | Теги |
| :--- | :--- | :--- |
| `npm run test-storybook` | Все тесты, кроме демо-ошибок | Все, кроме `intentional-fail` |
| `npm run test-storybook:play` | Интерактивные тесты с `play` функцией | `play-fn` |
| `npm run test-storybook:all` | Все тесты, включая демо-ошибки | Все |
| `npm run test-storybook:demo` | Только демо-ошибки (ожидаемо падают) | `intentional-fail` |
| `npm run test-storybook:chromium` | Интерактивные тесты в Chromium | `play-fn` |
| `npm run test-storybook:firefox` | Интерактивные тесты в Firefox | `play-fn` |
| `npm run test-storybook:webkit` | Интерактивные тесты в WebKit | `play-fn` |

Теги:

- `play-fn` — интерактивные тесты с `play` функцией
- `!play-fn` — тесты без интерактивных сценариев (только рендеринг)
- `intentional-fail` — намеренно падающие тесты
- `autodocs` — автоматическая документация в Storybook

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

Проект использует **Storybook Test Runner** на базе **Playwright**. Все тестовые сценарии описаны непосредственно в файлах `*.stories.tsx` через:

- **JSDoc комментарии** — описание что проверяется в каждой story
- **Play function** — интерактивные сценарии (клики, ввод, проверки)
- **Accessibility checks** — проверки доступности через `@storybook/addon-a11y`

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
│   ← npx test-storybook --browsers <browser>          │
│      --includeTags=play-fn --excludeTags=intentional-fail │
└─────────────────────────────────────────────────────┘
```

### Что проверяется

| Job | Команды | Цель |
| :--- | :--- | :--- |
| **lint-and-typecheck** | `npm run lint` `npm run type-check` | Проверка стиля кода и типизации |
| **build-storybook** | `npm run build-storybook` | Проверка что Storybook собирается без ошибок |
| **test-storybook (chromium)** | `npx test-storybook --browsers chromium` | Интерактивные тесты в Chromium |
| **test-storybook (firefox)** | `npx test-storybook --browsers firefox` | Интерактивные тесты в Firefox |
| **test-storybook (webkit)** | `npx test-storybook --browsers webkit` | Интерактивные тесты в WebKit |

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

## TODO

- [ ] Рассмотреть миграцию с Storybook Test Runner на Vitest addon — см. `docs/FRAMEWORK_IMPROVEMENTS.md` (п.1 «Что добавить»)
