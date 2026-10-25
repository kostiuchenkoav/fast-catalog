import type { ReactNode } from 'react';
import { useScrollState } from '../hooks/useWindowScroll';
import { getVisibleRange } from '../lib/virtualize';

interface VirtualGridProps<T> {
  items: T[];
  /** Высота одной строки сетки в пикселях, включая зазор. */
  rowHeight: number;
  /** Минимальная ширина колонки. Число колонок вычисляется из ширины контейнера. */
  minColumnWidth: number;
  /** Зазор между колонками и строками в пикселях. */
  gap?: number;
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string | number;
}

/** Сколько колонок помещается в ширину при заданном минимуме и зазоре. */
export function columnsFor(width: number, minColumnWidth: number, gap: number): number {
  return Math.max(1, Math.floor((width + gap) / (minColumnWidth + gap)));
}

/**
 * Рендерит только видимые строки сетки. Остальные заменяются пустым пространством
 * нужной высоты, поэтому полоса прокрутки ведёт себя так же, как при полном списке.
 */
export function VirtualGrid<T>({ items, rowHeight, minColumnWidth, gap = 16, renderItem, getKey }: VirtualGridProps<T>) {
  const { ref, scrollTop, viewportHeight, width } = useScrollState<HTMLDivElement>();
  const columns = columnsFor(width, minColumnWidth, gap);

  const range = getVisibleRange({
    itemCount: items.length,
    columns,
    rowHeight,
    scrollTop,
    viewportHeight,
  });

  const visible = items.slice(range.start, range.end);

  return (
    <div ref={ref} style={{ height: range.totalHeight, position: 'relative' }}>
      <div
        className="virtual-grid"
        style={{
          position: 'absolute',
          top: range.offsetTop,
          left: 0,
          right: 0,
          gap,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {visible.map((item) => (
          <div key={getKey(item)}>{renderItem(item)}</div>
        ))}
      </div>
    </div>
  );
}
