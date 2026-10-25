import { describe, expect, it } from 'vitest';
import { filterAndSort, formatPrice, parseQuery, toSearchParams } from './catalog';
import { generateProducts } from '../data/generate';
import type { Product } from '../types';

const sample: Product[] = [
  { id: 1, name: 'Лампа №1', category: 'Дом и сад', price: 500, rating: 4.2, description: 'Тёплый свет', image: '' },
  { id: 2, name: 'Книга №2', category: 'Книги', price: 1200, rating: 4.9, description: 'Роман о море', image: '' },
  { id: 3, name: 'Лампа №3', category: 'Дом и сад', price: 2500, rating: 3.1, description: 'Яркий свет', image: '' },
];

describe('filterAndSort', () => {
  it('filters by category', () => {
    const result = filterAndSort(sample, { search: '', category: 'Книги', sort: 'relevance' });
    expect(result.map((p) => p.id)).toEqual([2]);
  });

  it('searches names and descriptions case-insensitively', () => {
    const byName = filterAndSort(sample, { search: 'ЛАМПА', category: 'all', sort: 'relevance' });
    const byDescription = filterAndSort(sample, { search: 'море', category: 'all', sort: 'relevance' });
    expect(byName.map((p) => p.id)).toEqual([1, 3]);
    expect(byDescription.map((p) => p.id)).toEqual([2]);
  });

  it('sorts by price and rating without mutating the input', () => {
    const snapshot = sample.map((p) => p.id);
    expect(filterAndSort(sample, { search: '', category: 'all', sort: 'price-desc' }).map((p) => p.id)).toEqual([3, 2, 1]);
    expect(filterAndSort(sample, { search: '', category: 'all', sort: 'rating-desc' }).map((p) => p.id)).toEqual([2, 1, 3]);
    expect(sample.map((p) => p.id)).toEqual(snapshot);
  });
});

describe('query string round trip', () => {
  it('serialises only non-default values', () => {
    const params = toSearchParams({ search: ' свет ', category: 'Книги', sort: 'price-asc' });
    expect(params.toString()).toBe('q=%D1%81%D0%B2%D0%B5%D1%82&category=%D0%9A%D0%BD%D0%B8%D0%B3%D0%B8&sort=price-asc');
  });

  it('falls back to defaults for unknown sort values', () => {
    const parsed = parseQuery(new URLSearchParams('sort=hacked&category=Книги'));
    expect(parsed).toEqual({ search: '', category: 'Книги', sort: 'relevance' });
  });
});

describe('formatPrice', () => {
  it('formats rubles without decimals', () => {
    expect(formatPrice(1500)).toContain('1');
    expect(formatPrice(1500)).toContain('₽');
  });
});

describe('generateProducts', () => {
  it('is deterministic for the same seed', () => {
    expect(generateProducts(50, 7)).toEqual(generateProducts(50, 7));
  });

  it('produces unique sequential ids', () => {
    const products = generateProducts(100);
    expect(new Set(products.map((p) => p.id)).size).toBe(100);
    expect(products[0].id).toBe(1);
  });
});
