import type { CatalogQuery, Product, SortKey } from '../types';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'По порядку' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'rating-desc', label: 'По рейтингу' },
];

/**
 * Фильтрует и сортирует товары. Чистая функция: не меняет входной массив.
 * Поиск по названию и описанию без учёта регистра.
 */
export function filterAndSort(products: Product[], query: CatalogQuery): Product[] {
  const needle = query.search.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (query.category !== 'all' && product.category !== query.category) {
      return false;
    }
    if (needle === '') {
      return true;
    }
    return product.name.toLowerCase().includes(needle) || product.description.toLowerCase().includes(needle);
  });

  switch (query.sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => a.price - b.price);
    case 'price-desc':
      return [...filtered].sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return [...filtered].sort((a, b) => b.rating - a.rating);
    case 'relevance':
      return filtered;
  }
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value);
}

/** Читает параметры каталога из query string, чтобы состояние сохранялось при обновлении и в ссылке. */
export function parseQuery(params: URLSearchParams): CatalogQuery {
  const sort = params.get('sort');
  const validSort = SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortKey) : 'relevance';
  return {
    search: params.get('q') ?? '',
    category: params.get('category') ?? 'all',
    sort: validSort,
  };
}

export function toSearchParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search.trim() !== '') {
    params.set('q', query.search.trim());
  }
  if (query.category !== 'all') {
    params.set('category', query.category);
  }
  if (query.sort !== 'relevance') {
    params.set('sort', query.sort);
  }
  return params;
}
