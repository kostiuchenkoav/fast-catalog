import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../data/store';
import { formatPrice } from '../lib/catalog';

/**
 * Страница товара. Загружается отдельным чанком (React.lazy в App),
 * поэтому главный бандл не содержит её код.
 */
export default function ProductPage() {
  const { id } = useParams();
  const product = getProductById(Number(id));

  if (!product) {
    return (
      <main className="page">
        <h1>Товар не найден</h1>
        <Link to="/">Вернуться в каталог</Link>
      </main>
    );
  }

  return (
    <main className="page product">
      <Link to="/">← В каталог</Link>
      <h1>{product.name}</h1>
      <img src={product.image} alt="" width={640} height={480} className="product__image" />
      <p className="product__price">{formatPrice(product.price)}</p>
      <p>Категория: {product.category}</p>
      <p>Рейтинг: {product.rating.toFixed(1)} из 5</p>
      <p>{product.description}</p>
    </main>
  );
}
