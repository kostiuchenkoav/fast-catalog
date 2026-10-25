import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatPrice } from '../lib/catalog';

interface ProductCardProps {
  product: Product;
}

/**
 * Карточка товара. Изображение загружается лениво: браузер запрашивает его
 * только когда карточка близка к окну просмотра. Размеры заданы, чтобы не было сдвигов макета.
 */
export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card__link">
        <img
          src={product.image}
          alt=""
          width={320}
          height={240}
          loading="lazy"
          decoding="async"
          className="card__image"
        />
        <h3 className="card__title">{product.name}</h3>
      </Link>
      <div className="card__meta">
        <span className="card__price">{formatPrice(product.price)}</span>
        <span className="card__rating" aria-label={`Рейтинг ${product.rating} из 5`}>
          ★ {product.rating.toFixed(1)}
        </span>
      </div>
    </article>
  );
}
