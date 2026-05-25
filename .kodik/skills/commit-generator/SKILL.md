---
name: Commit Generator
description: Анализирует git-изменения, генерирует коммит-сообщение по Conventional Commits и выполняет коммит.
version: 3
---

## Overview

Когда пользователь просит создать коммит или закоммитить изменения — выполни весь процесс автоматически, без лишних вопросов и подтверждений.

## Process

### 1. Проверка staged-изменений

```bash
git status --short
```

Если staged-изменений нет — автоматически выполни:

```bash
git add .
```

### 2. Анализ изменений

```bash
git diff --cached
```

Изучи изменения и определи суть: что именно изменилось в логике, структуре или поведении.

### 3. Формирование коммит-сообщения

Используй формат **Conventional Commits**, только однострочный:

```
<type>(<scope>): <subject>
```

#### Типы (`type`)

| Тип        | Когда использовать                                    |
|------------|------------------------------------------------------|
| `feat`     | Новая функциональность                               |
| `fix`      | Исправление бага                                     |
| `refactor` | Рефакторинг без изменения поведения                  |
| `style`    | Форматирование, пробелы — без логики                 |
| `test`     | Добавление или исправление тестов                    |
| `docs`     | Изменения документации                               |
| `chore`    | Обновление зависимостей, конфигов, сборки            |
| `perf`     | Улучшение производительности                         |
| `ci`       | Изменения CI/CD конфигурации                         |
| `build`    | Изменения системы сборки                             |
| `revert`   | Откат предыдущего коммита                            |

#### Правила subject

- Отражает **суть изменений**: что добавлено, исправлено, изменено в поведении
- Не описывает перемещения файлов, переименования директорий и технические детали реструктуризации
- Повелительное наклонение на английском: `add`, `fix`, `update`, `remove`
- Максимум **72 символа**
- Без точки в конце
- Строчная буква после двоеточия

#### Scope (опционально)

Указывай по затронутому модулю или компоненту: `feat(auth)`, `fix(api)`, `test(button)`.

### 4. Выполнение коммита

Только однострочный формат:

```bash
git commit -m "<type>(<scope>): <subject>"
```

## Guidelines

- Весь процесс выполняется **автоматически**, без запроса подтверждения у пользователя.
- Если нет staged-изменений — сразу делай `git add .`.
- Subject отражает **суть** изменений, а не технические детали (куда что переместили, переименовали).
- Никогда не используй расплывчатые сообщения: `fix bug`, `update`, `changes`, `wip`.
- Если изменения затрагивают несколько несвязанных областей — предложи разбить на несколько коммитов.
- Пиши subject на **английском языке**.

## Examples

```
feat(button): add loading state to primary button
```

```
fix(api): handle null response from user endpoint
```

```
refactor(auth): replace session cookies with JWT
```

```
chore(deps): update playwright to v1.44
```

Если staged-изменений нет — сообщи пользователю и предложи выполнить `git add` перед коммитом.

### 2. Формирование коммит-сообщения

Используй формат **Conventional Commits**:

```
<type>(<scope>): <subject>

[body]

[footer]
```

#### Типы (`type`)

| Тип        | Когда использовать                                              |
|------------|----------------------------------------------------------------|
| `feat`     | Новая функциональность                                         |
| `fix`      | Исправление бага                                               |
| `refactor` | Рефакторинг без изменения поведения                            |
| `style`    | Форматирование, пробелы, точки с запятой — без логики          |
| `test`     | Добавление или исправление тестов                              |
| `docs`     | Изменения документации                                         |
| `chore`    | Обновление зависимостей, конфигов, сборки                      |
| `perf`     | Улучшение производительности                                   |
| `ci`       | Изменения CI/CD конфигурации                                   |
| `build`    | Изменения системы сборки                                       |
| `revert`   | Откат предыдущего коммита                                      |

#### Правила subject

- Используй **повелительное наклонение** на английском: `add`, `fix`, `update`, `remove` — не `added`, `fixes`, `updated`
- Максимум **72 символа** в первой строке
- Без точки в конце
- Строчная буква после двоеточия

#### Scope (опционально)

Указывай область изменений в скобках: `feat(auth)`, `fix(api)`, `test(button)`.
Определяй scope по затронутым модулям, компонентам или директориям.

#### Body (опционально)

Добавляй body если нужно объяснить **что** изменилось и **почему** (не как).
Отделяй от subject пустой строкой. Переносы строк на 72 символах.

#### Footer (опционально)

- Breaking changes: `BREAKING CHANGE: <описание>`
- Ссылки на задачи: `Closes #123`, `Refs #456`

### 3. Выполнение коммита

Для многострочных сообщений используй heredoc:

```bash
git commit -F - <<'EOF'
feat(auth): add JWT refresh token support

Implement automatic token refresh to prevent session expiry.
Refresh happens 60 seconds before token expiration.

Closes #42
EOF
```

Для однострочных:

```bash
git commit -m "feat(button): add loading state"
```

## Guidelines

- Всегда анализируй реальные изменения через `git diff --cached` перед генерацией сообщения.
- Выбирай тип коммита на основе **сути изменений**, а не названий файлов.
- Если изменения затрагивают несколько несвязанных областей — предложи разбить на несколько коммитов.
- Никогда не используй расплывчатые сообщения: `fix bug`, `update`, `changes`, `wip`.
- Scope определяй по директории или компоненту: `components/Button` → `button`, `src/api/auth` → `auth`.
- Если есть breaking change — обязательно добавляй `BREAKING CHANGE:` в footer.
- Пиши subject на **английском языке**.
- Body и footer пиши на английском, если в проекте нет явного соглашения об ином.
- Перед коммитом покажи пользователю итоговое сообщение и жди подтверждения.

## Examples

### Простой коммит

```
feat(button): add loading state to primary button
```

### С body

```
fix(api): handle null response from user endpoint

The /api/user endpoint can return null when the session expires.
Added a null check to prevent TypeError on the profile page.
```

### С breaking change

```
refactor(auth): replace session cookies with JWT

Migrate authentication from server-side sessions to stateless JWT.
All clients must update to send Authorization header.

BREAKING CHANGE: session-based auth endpoints removed, use /auth/token instead
Closes #88
```

### Несколько типов изменений → несколько коммитов

Если `git diff --cached` показывает и новую фичу, и исправление бага — предложи:

```bash
# Коммит 1
git add src/features/search.ts
git commit -m "feat(search): add fuzzy search support"

# Коммит 2
git add src/utils/format.ts
git commit -m "fix(format): correct date formatting for UTC timezone"
```
```
