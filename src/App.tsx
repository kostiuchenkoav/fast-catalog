import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import CatalogPage from './pages/CatalogPage';

// Страница товара не нужна для первого экрана, поэтому грузится по требованию.
const ProductPage = lazy(() => import('./pages/ProductPage'));

export default function App() {
  return (
    <Suspense fallback={<p className="page">Загрузка…</p>}>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="*" element={<p className="page">Страница не найдена</p>} />
      </Routes>
    </Suspense>
  );
}
