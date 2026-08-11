import { setProjectAnnotations } from '@storybook/react-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import * as projectAnnotations from './preview';

// Регистрируем preview-аннотации проекта и a11y-аддона.
// a11yAddonAnnotations подключают accessibility-проверки (axe-core) к тестам,
// запускаемым через @storybook/addon-vitest в browser mode. Без них a11y-тесты
// не запускаются — addon только показывает отчёт в UI Storybook.
// Начиная со Storybook 10.3, @storybook/addon-vitest может применять preview
// автоматически, но явный вызов setProjectAnnotations остаётся поддерживаемым
// и гарантирует корректный рендер stories + работу a11y-проверок.
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
