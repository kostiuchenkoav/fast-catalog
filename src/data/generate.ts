import type { Product } from '../types';

/**
 * Генерирует детерминированный каталог из N товаров.
 * Один и тот же seed всегда даёт одинаковые данные, поэтому тесты и демо стабильны.
 * В реальном проекте этот модуль заменяется запросом к API.
 */

const CATEGORIES = ['Электроника', 'Книги', 'Дом и сад', 'Спорт', 'Одежда', 'Игрушки'] as const;

const NOUNS: Record<string, string[]> = {
  'Электроника': ['Наушники', 'Колонка', 'Монитор', 'Клавиатура', 'Веб-камера', 'Power bank'],
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
      image: `https://picsum.photos/seed/${id}/320/240`,
    };
  });
}
