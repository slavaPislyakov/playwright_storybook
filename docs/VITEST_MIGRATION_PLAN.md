# План миграции на Vitest Addon

## Обзор

Storybook Test Runner (основан на Playwright) устаревает. Рекомендуется миграция на **@storybook/addon-vitest** — более быстрое и современное решение для тестирования.

---

## Нужен ли Playwright после миграции?

### Что делает Vitest Addon:
- ✅ Запускает `play` функции из stories
- ✅ Проверяет интерактивные сценарии (клики, ввод)
- ✅ Работает в Node.js (jsdom/happy-dom) — быстрее, чем браузер
- ✅ Поддерживает те же assertions (`expect`, `userEvent`, `within`)

### Что Vitest Addon НЕ делает:
- ❌ Визуальное регрессионное тестирование (скриншоты)
- ❌ Тестирование в реальных браузерах (Chromium, Firefox, WebKit)
- ❌ Проверка CSS-рендеринга

### Вывод:

| Задача | После миграции |
|--------|----------------|
| Интерактивные тесты (play функции) | **Vitest addon** ✅ |
| Визуальные регрессионные тесты | **Playwright или Chromatic** (по-прежнему нужен) |
| Кроссбраузерное тестирование | **Playwright** (по-прежнему нужен) |

**Если нужны только интерактивные тесты** → Playwright можно убрать  
**Если нужны скриншоты/визуальные тесты** → Playwright остаётся

---

## План миграции (пошаговый)

### Шаг 1: Установить Vitest addon

```bash
# Установить addon
npm install --save-dev @storybook/addon-vitest

# Установить Vitest (если ещё не установлен)
npm install --save-dev vitest

# Установить среду для DOM (jsdom или happy-dom)
npm install --save-dev jsdom
```

### Шаг 2: Настроить Vitest

Создать файл `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/test-runner';

export default defineConfig({
  plugins: [
    storybookTest({
      storybookScript: 'npm run storybook -- --ci',
      storybookUrl: 'http://localhost:6006',
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./.storybook/vitest.setup.ts'],
  },
});
```

### Шаг 3: Настроить Storybook

Обновить `.storybook/main.ts`:

```typescript
const config = {
  // ... существующая конфигурация
  addons: [
    // ... другие аддоны
    '@storybook/addon-vitest',
  ],
};
```

### Шаг 4: Создать setup файл

Создать `.storybook/vitest.setup.ts`:

```typescript
import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react';
import * as projectAnnotations from './preview';

const project = setProjectAnnotations([projectAnnotations]);

beforeAll(project.beforeAll);
```

### Шаг 5: Обновить package.json скрипты

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test-storybook": "echo 'Deprecated: use npm run test'",
    "test-storybook:play": "echo 'Deprecated: use npm run test'"
  }
}
```

### Шаг 6: Обновить stories (минимальные изменения)

Большинство stories будут работать без изменений! Возможно, потребуется:

```typescript
// Добавить импорт vitest, если используются моки
import { vi } from 'vitest';

// Заменить fn() на vi.fn()
const meta = {
  args: {
    onClick: vi.fn(), // вместо fn() из storybook/test
  },
};
```

### Шаг 7: Обновить CI/CD

Обновить `.github/workflows/ci.yml`:

```yaml
# Было:
- name: Run Storybook tests
  run: npm run test-storybook:play

# Стало:
- name: Run Vitest tests
  run: npm run test
```

### Шаг 8: Удалить старые зависимости (опционально)

```bash
# Если больше не нужен Storybook Test Runner
npm uninstall @storybook/test-runner

# Если не нужны визуальные тесты, можно удалить Playwright
npm uninstall playwright
```

---

## Сравнение производительности

| Метрика | Test Runner (Playwright) | Vitest Addon |
|---------|--------------------------|--------------|
| Запуск | ~30-60 сек (запуск браузера) | ~5-10 сек (Node.js) |
| Выполнение теста | Медленнее (реальный браузер) | Быстрее (jsdom) |
| Память | Больше | Меньше |
| Параллелизм | Ограничен браузерами | Лучше |

---

## Риски и ограничения

1. **jsdom ≠ реальный браузер** — некоторые DOM API могут работать иначе
2. **CSS стили** — не рендерятся полностью (только inline стили)
3. **Анимации** — могут требовать дополнительной настройки

---

## Рекомендация

Если текущие тесты работают стабильно — можно отложить миграцию. Test Runner будет поддерживаться ещё некоторое время.

Для новых проектов или при необходимости ускорить CI — миграция рекомендуется.
