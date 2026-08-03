import { within } from 'storybook/test';

/**
 * Helper для поиска элементов в `document.body`.
 * Используется в stories с порталами (Modal рендерит контент в body),
 * где `canvasElement` не содержит портала.
 */
export const withinBody = () => within(document.body);
