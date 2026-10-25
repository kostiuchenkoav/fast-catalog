import type { Product } from '../types';

/**
 * Генерирует детерминированный каталог из N товаров.
 * Один и тот же seed всегда даёт одинаковые данные, поэтому тесты и демо стабильны.
 * В реальном проекте этот модуль заменяется запросом к API.
 */

const CATEGORIES = ['Электроника', 'Книги', 'Дом и сад', 'Спорт', 'Одежда', 'Игрушки'] as const;

const NOUNS: Record<string, string[]> = {
  'Электроника': ['Наушники', 'Колонка', 'Монитор', 'Клавиатура', 'Веб-камера', 'Внешний аккумулятор'],
  'Книги': ['Роман', 'Справочник', 'Сборник рассказов', 'Учебник', 'Биография', 'Комикс'],
  'Дом и сад': ['Лампа', 'Горшок', 'Набор посуды', 'Плед', 'Секатор', 'Органайзер'],
  'Спорт': ['Коврик', 'Гантели', 'Велосипедный шлем', 'Скакалка', 'Бутылка', 'Рюкзак'],
  'Одежда': ['Куртка', 'Футболка', 'Кроссовки', 'Шарф', 'Перчатки', 'Кепка'],
  'Игрушки': ['Конструктор', 'Пазл', 'Настольная игра', 'Мягкая игрушка', 'Машинка', 'Кубики'],
};

const ADJECTIVES = ['Компактный', 'Классический', 'Лёгкий', 'Премиум', 'Бюджетный', 'Универсальный', 'Яркий', 'Минималистичный'];

/** Линейный конгруэнтный генератор: простой, быстрый и воспроизводимый. */
function createRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

export function generateProducts(count: number, seed = 42): Product[] {
  const random = createRandom(seed);
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)];

  return Array.from({ length: count }, (_, index) => {
    const category = pick(CATEGORIES);
    const noun = pick(NOUNS[category]);
    const adjective = pick(ADJECTIVES);
    const id = index + 1;

    return {
      id,
      name: `${adjective} ${noun.toLowerCase()} №${id}`,
      category,
      price: Math.round((random() * 19000 + 290) / 10) * 10,
      rating: Math.round((random() * 4 + 1) * 10) / 10,
      description: `${noun} из категории «${category}». Модель ${adjective.toLowerCase()}, с гарантией производителя.`,
      image: placeholderImage(id),
    };
  });
}

/**
 * Встроенная SVG-заглушка: не зависит от внешних сервисов, поэтому картинки
 * одинаково видны в демо, в офлайне и в скриншотах README.
 */
export function placeholderImage(id: number): string {
  const hue = (id * 47) % 360;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="hsl(${hue},70%,78%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},65%,62%)"/>` +
    `</linearGradient></defs>` +
    `<rect width="320" height="240" fill="url(#g)"/>` +
    `<circle cx="160" cy="112" r="46" fill="#fff" fill-opacity="0.55"/>` +
    `<text x="160" y="218" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="#1f2937">№${id}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
