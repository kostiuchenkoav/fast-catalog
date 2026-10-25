export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  image: string;
}

export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc';

export interface CatalogQuery {
  search: string;
  category: string;
  sort: SortKey;
}
