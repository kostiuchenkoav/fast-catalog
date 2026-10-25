import { generateProducts } from './generate';
import type { Product } from '../types';

export const PRODUCT_COUNT = 5000;

let cache: Product[] | undefined;

/** Возвращает каталог один раз за сессию, а не при каждом рендере страницы. */
export function getProducts(): Product[] {
  cache ??= generateProducts(PRODUCT_COUNT);
  return cache;
}

export function getProductById(id: number): Product | undefined {
  if (!Number.isInteger(id) || id < 1 || id > PRODUCT_COUNT) {
    return undefined;
  }
  return getProducts()[id - 1];
}
