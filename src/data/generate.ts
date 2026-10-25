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

/** Вымышленные названия книг: не существующие произведения, чтобы каталог не путали с реальными изданиями. */
const FICTIONAL_BOOK_TITLES = [
  'Тени над Заречьем', 'Ночь без звёзд', 'Письма из Соснового', 'Хранитель маяка', 'Сад для одного',
  'Зимний перевал', 'Полночный почтальон', 'Ключ от старой башни', 'Река без имени', 'Город в тумане',
  'Последний вагон', 'Огни Лисьего залива', 'Дорога к озеру Тихому', 'Часы на площади Шанс', 'Тихий берег',
  'Двенадцать шагов по снегу', 'Дом с синими ставнями', 'Ветер над Кедровой', 'Записки смотрителя', 'Каменный мост',
  'Осенний караван', 'Забытый сад', 'Соль и медь', 'Жёлтый трамвай', 'Ночной переезд',
  'Карта без адреса', 'Пароход «Надежда»', 'Мельница на краю', 'Голоса в колодце', 'Лестница в облаках',
];

/** Общая заглушка для всех товаров: один SVG вместо отдельной картинки на каждую карточку. */
const PLACEHOLDER_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">` +
  `<rect width="320" height="240" fill="#e5e7eb"/>` +
  `<rect x="120" y="70" width="80" height="100" rx="6" fill="#cbd5e1"/>` +
  `<path d="M160 82 V158" stroke="#94a3b8" stroke-width="3"/>` +
  `<text x="160" y="200" font-family="Arial,sans-serif" font-size="16" text-anchor="middle" fill="#64748b">Нет изображения</text>` +
  `</svg>`;

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(PLACEHOLDER_SVG)}`;

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
  let bookIndex = 0;
  const pick = <T,>(items: readonly T[]): T => items[Math.floor(random() * items.length)];

  return Array.from({ length: count }, (_, index) => {
    const category = pick(CATEGORIES);
    const noun = pick(NOUNS[category]);
    const adjective = pick(ADJECTIVES);
    const id = index + 1;

    return {
      id,
      name: category === 'Книги' ? bookTitle(bookIndex++) : `${adjective} ${noun.toLowerCase()} №${id}`,
      category,
      price: Math.round((random() * 19000 + 290) / 10) * 10,
      rating: Math.round((random() * 4 + 1) * 10) / 10,
      description: `${noun} из категории «${category}». Модель ${adjective.toLowerCase()}, с гарантией производителя.`,
      image: PLACEHOLDER_IMAGE,
    };
  });
}

/** Название книги: первые тексты без номера, повторы получают номер тома. */
function bookTitle(index: number): string {
  const title = FICTIONAL_BOOK_TITLES[index % FICTIONAL_BOOK_TITLES.length];
  const volume = Math.floor(index / FICTIONAL_BOOK_TITLES.length) + 1;
  return volume === 1 ? title : `${title}. Том ${volume}`;
}
