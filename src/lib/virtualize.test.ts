import { describe, expect, it } from 'vitest';
import { getVisibleRange } from './virtualize';
import { columnsFor } from '../components/VirtualGrid';

describe('getVisibleRange', () => {
  it('renders only the rows near the viewport', () => {
    const range = getVisibleRange({
      itemCount: 10000,
      columns: 4,
      rowHeight: 100,
      scrollTop: 5000,
      viewportHeight: 800,
      overscanRows: 2,
    });

    // Видны строки 50..58 плюс по две строки запаса: около 40 элементов, а не 10000.
    expect(range.end - range.start).toBeLessThan(60);
    expect(range.start).toBe((50 - 2) * 4);
    expect(range.offsetTop).toBe((50 - 2) * 100);
  });

  it('keeps the total height for the full list', () => {
    const range = getVisibleRange({ itemCount: 10, columns: 3, rowHeight: 50, scrollTop: 0, viewportHeight: 200 });
    expect(range.totalHeight).toBe(Math.ceil(10 / 3) * 50);
  });

  it('does not go past the last item', () => {
    const range = getVisibleRange({ itemCount: 7, columns: 2, rowHeight: 100, scrollTop: 10000, viewportHeight: 500 });
    expect(range.end).toBe(7);
    expect(range.start).toBeLessThanOrEqual(range.end);
  });
});

describe('columnsFor', () => {
  it('fits as many columns as the width allows', () => {
    expect(columnsFor(1100, 260, 16)).toBe(4);
    expect(columnsFor(500, 260, 16)).toBe(1);
  });

  it('never returns less than one column', () => {
    expect(columnsFor(0, 260, 16)).toBe(1);
  });
});
