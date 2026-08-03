import { useCallback, useEffect, useState } from 'react';
import { Button } from './components/Button/Button';
import { Input } from './components/Input/Input';
import { Card } from './components/Card/Card';
import { Checkbox } from './components/Checkbox/Checkbox';
import { Modal } from './components/Modal/Modal';
import { Select } from './components/Select/Select';
import { Toast, type ToastVariant } from './components/Toast/Toast';
import './App.css';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ui-kit-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

type ToastItem = { id: number; message: string; variant: ToastVariant };

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [inputValue, setInputValue] = useState('');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [checkboxIndeterminate, setCheckboxIndeterminate] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <div className='app'>
      <header className='app__header'>
        <div className='app__header-inner'>
          <h1 className='app__title'>UI Kit Demo</h1>
          <p className='app__subtitle'>
            Витрина компонентов на React + Vite со средой Storybook
          </p>
          <Button
            label={theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
            variant='secondary'
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          />
        </div>
      </header>

      <main className='app__main'>
        <section className='app__section'>
          <h2 className='app__section-title'>Button</h2>
          <div className='app__row'>
            <Button label='Primary' variant='primary' />
            <Button label='Secondary' variant='secondary' />
            <Button label='Outlined' variant='outlined' />
            <Button label='Elevated' variant='elevated' />
            <Button label='✉' variant='icon' icon='✉' />
          </div>
          <div className='app__row'>
            <Button label='Loading' variant='primary' loading />
            <Button label='Disabled' variant='primary' disabled />
            <Button label='Full width' variant='primary' fullWidth />
          </div>
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Input</h2>
          <div className='app__grid-2'>
            <Input
              label='Имя'
              value={inputValue}
              placeholder='Введите имя'
              onChange={setInputValue}
            />
            <Input
              label='Email'
              type='email'
              placeholder='example@mail.com'
              required
            />
            <Input
              label='Заблокировано'
              value='нельзя редактировать'
              disabled
            />
            <Input
              label='С ошибкой'
              value='bad'
              error='Некорректное значение'
            />
          </div>
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Checkbox</h2>
          <div className='app__col'>
            <Checkbox
              label='Согласен с условиями'
              checked={checkboxChecked}
              onChange={(v) => {
                setCheckboxChecked(v);
                setCheckboxIndeterminate(false);
              }}
            />
            <Checkbox
              label='Частичный выбор'
              indeterminate={checkboxIndeterminate}
              onChange={(v) => setCheckboxIndeterminate(!v)}
            />
            <Checkbox label='Недоступно' disabled />
          </div>
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Select</h2>
          <div className='app__grid-2'>
            <Select
              label='Страна'
              value={selectValue}
              placeholder='Выберите страну'
              options={[
                { value: 'ru', label: 'Россия' },
                { value: 'by', label: 'Беларусь' },
                { value: 'kz', label: 'Казахстан' },
              ]}
              onChange={setSelectValue}
            />
            <Select
              label='С ошибкой'
              error='Поле обязательно'
              options={[
                { value: 'a', label: 'Вариант A' },
                { value: 'b', label: 'Вариант B' },
              ]}
            />
          </div>
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Card</h2>
          <div className='app__grid-3'>
            <Card
              title='Default'
              description='Карточка по умолчанию с описанием.'
            />
            <Card
              title='Outlined'
              description='Карточка с рамкой.'
              variant='outlined'
            />
            <Card
              title='Elevated'
              description='Карточка с тенью.'
              variant='elevated'
            />
          </div>
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Modal</h2>
          <Button
            label='Открыть модалку'
            onClick={() => setIsModalOpen(true)}
          />
          <Modal
            isOpen={isModalOpen}
            title='Подтверждение'
            description='Вы уверены, что хотите опубликовать этот документ?'
            onClose={() => setIsModalOpen(false)}
            onAction={(action) => showToast(`Действие: ${action}`, 'success')}
          />
        </section>

        <section className='app__section'>
          <h2 className='app__section-title'>Toast</h2>
          <div className='app__row'>
            <Button
              label='Info'
              variant='outlined'
              onClick={() => showToast('Информационное сообщение', 'info')}
            />
            <Button
              label='Success'
              variant='outlined'
              onClick={() => showToast('Операция успешна', 'success')}
            />
            <Button
              label='Warning'
              variant='outlined'
              onClick={() => showToast('Внимание!', 'warning')}
            />
            <Button
              label='Error'
              variant='outlined'
              onClick={() => showToast('Произошла ошибка', 'error')}
            />
          </div>
        </section>
      </main>

      <div className='app__toast-stack'>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            variant={t.variant}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </div>
  );
}
