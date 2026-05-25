# Playwright & Storybook UI Kit

Проект представляет собой изолированную среду для разработки и автоматизированного тестирования UI-компонентов на стеке **React + Vite + Storybook + Playwright**.

## 🚀 Быстрый старт

### Требования
*   Node.js (рекомендуется LTS версия)
*   npm или yarn

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

## 📂 Структура проекта

```text
.
├── .storybook/          # Конфигурация Storybook
├── src/
│   └── components/      # Библиотека компонентов
│       ├── Button/      # Кнопка: логика, стили и сценарии
│       ├── Input/       # Поле ввода
│       └── Modal/       # Модальное окно
├── vite.config.ts       # Конфигурация сборки (Vite + React)
├── tsconfig.json        # Настройки типизации TypeScript
└── package.json         # Скрипты запуска и зависимости
```

## 🛠 Скрипты запуска

### Разработка и визуализация
*   `npm run storybook` — Запускает локальную среду Storybook (порт 6006). Основное место разработки компонентов.
*   `npm run dev` — Запуск Vite сервера для основного приложения.

### Тестирование (Playwright + Storybook Runner)
Тесты запускаются на основе историй (stories) из Storybook.
*   `npm run test-storybook` — Прогон всех тестов в headless режиме.
*   `npm run test-storybook:play` — Запуск тестов, помеченных тегом `play-fn` (интерактивные сценарии).
*   `npm run test-storybook:all-browsers` — Кроссбраузерная проверка (Chromium, Firefox, Webkit).
*   `npm run test-storybook:[browser]` — Запуск тестов в конкретном браузере (`chromium`/`firefox`/`webkit`).

### Сборка
*   `npm run build` — Сборка основного проекта.
*   `npm run build-storybook` — Генерация статического билда Storybook.

## ⚙️ Логика и концепция

1.  **Компонентный подход**: Каждый компонент полностью автономен и находится в своей директории (`src/components/Name`). Это включает в себя логику (`.tsx`), стили (`.css`) и истории (`.stories.tsx`).
2.  **Storybook как среда тестирования**: Мы используем функцию `play` внутри файлов `*.stories.tsx` для описания пользовательских взаимодействий (клики, ввод текста).
3.  **Автоматизация с Playwright**: Инструмент `@storybook/test-runner` использует Playwright для выполнения сценариев `play` в реальных браузерах.
4.  **Vite & TypeScript**: Обеспечивают быструю сборку и строгую типизацию компонентов.
