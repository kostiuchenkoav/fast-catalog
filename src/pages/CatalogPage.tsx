import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Controls } from '../components/Controls';
import { ProductCard } from '../components/ProductCard';
import { VirtualGrid } from '../components/VirtualGrid';
import { getProducts } from '../data/store';
import { filterAndSort, parseQuery, toSearchParams } from '../lib/catalog';
import { useDebouncedValue } from '../hooks/useWindowScroll';
import type { CatalogQuery, SortKey } from '../types';

/** Высота карточки 324px плюс зазор 16px между строками. */
const ROW_HEIGHT = 340;
/** Минимальная ширина карточки: колонки добавляются, пока хватает места. */
const MIN_CARD_WIDTH = 260;

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const query = parseQuery(params);

  // Поиск запускается с задержкой, чтобы не фильтровать 5000 товаров на каждую букву.
  const debouncedSearch = useDebouncedValue(query.search, 250);
  const categories = useMemo(() => Array.from(new Set(getProducts().map((p) => p.category))).sort(), []);

  const results = useMemo(
    () => filterAndSort(getProducts(), { search: debouncedSearch, category: query.category, sort: query.sort }),
    [debouncedSearch, query.category, query.sort],
  );

  function update(next: Partial<CatalogQuery>) {
    setParams(toSearchParams({ ...query, ...next }), { replace: true });
  }

  return (
    <main className="page">
      <h1>Каталог</h1>
      <Controls
        search={query.search}
        category={query.category}
        sort={query.sort}
        categories={categories}
        onSearchChange={(value) => update({ search: value })}
        onCategoryChange={(value) => update({ category: value })}
        onSortChange={(value: SortKey) => update({ sort: value })}
      />
      <p className="results" aria-live="polite">
        Найдено: {results.length}
      </p>
      {results.length === 0 ? (
        <p className="empty">Ничего не найдено. Попробуйте изменить запрос.</p>
      ) : (
        <VirtualGrid
          items={results}
          rowHeight={ROW_HEIGHT}
          minColumnWidth={MIN_CARD_WIDTH}
          getKey={(product) => product.id}
          renderItem={(product) => <ProductCard product={product} />}
        />
      )}
    </main>
  );
}
