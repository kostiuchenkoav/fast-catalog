import { useEffect, useRef, useState } from 'react';

interface ScrollState {
  /** Прокрутка окна относительно начала элемента. */
  scrollTop: number;
  viewportHeight: number;
  /** Ширина элемента, нужна для расчёта числа колонок. */
  width: number;
}

/**
 * Отслеживает прокрутку окна и размер контейнера. Обновления сворачиваются
 * в один кадр через requestAnimationFrame, поэтому частый скролл не вызывает лишних рендеров.
 */
export function useScrollState<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<ScrollState>({ scrollTop: 0, viewportHeight: 800, width: 1024 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const next: ScrollState = {
        scrollTop: Math.max(0, -rect.top),
        viewportHeight: window.innerHeight,
        width: element.clientWidth || rect.width,
      };
      setState((prev) =>
        prev.scrollTop === next.scrollTop && prev.viewportHeight === next.viewportHeight && prev.width === next.width
          ? prev
          : next,
      );
    };
    const schedule = () => {
      if (frame === 0) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return { ref, ...state };
}

/** Возвращает `value` с задержкой: обновляется только когда значение перестало меняться на `delayMs`. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}
