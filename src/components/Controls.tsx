import { SORT_OPTIONS } from '../lib/catalog';
import type { SortKey } from '../types';

interface ControlsProps {
  search: string;
  category: string;
  sort: SortKey;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
}

export function Controls({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ControlsProps) {
  return (
    <form className="controls" role="search" onSubmit={(event) => event.preventDefault()}>
      <label className="controls__field">
        <span>Поиск</span>
        <input type="search" value={search} placeholder="Название или описание" onChange={(e) => onSearchChange(e.target.value)} />
      </label>
      <label className="controls__field">
        <span>Категория</span>
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="all">Все категории</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="controls__field">
        <span>Сортировка</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
