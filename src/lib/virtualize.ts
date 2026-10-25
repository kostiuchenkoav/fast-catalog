/**
 * Вычисляет, какие строки видны в окне прокрутки.
 * Для сетки передайте `columns` и высоту строки, для списка оставьте `columns = 1`.
 */
export interface VisibleRange {
  start: number;
  end: number;
  offsetTop: number;
  totalHeight: number;
}

export interface RangeInput {
  itemCount: number;
  columns: number;
  rowHeight: number;
  scrollTop: number;
  viewportHeight: number;
  overscanRows?: number;
}

export function getVisibleRange({
  itemCount,
  columns,
  rowHeight,
  scrollTop,
  viewportHeight,
  overscanRows = 2,
}: RangeInput): VisibleRange {
  const totalRows = Math.ceil(itemCount / columns);
  const totalHeight = totalRows * rowHeight;

  // Прокрутка может уйти за конец списка (например, после смены фильтра),
  // поэтому первую строку ограничиваем количеством строк, а не просто нулём.
  const firstRow = Math.min(totalRows, Math.max(0, Math.floor(scrollTop / rowHeight) - overscanRows));
  const lastRow = Math.min(totalRows, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscanRows);

  const start = Math.min(itemCount, firstRow * columns);
  const end = Math.min(itemCount, Math.max(start, lastRow * columns));

  return {
    start,
    end,
    offsetTop: firstRow * rowHeight,
    totalHeight,
  };
}
