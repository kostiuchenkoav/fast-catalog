import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import CatalogPage from './pages/CatalogPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('Catalog page', () => {
  it('shows a result count and a limited set of rendered cards', async () => {
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Найдено: 5000/)).toBeInTheDocument();
    // Виртуализация: в DOM попадает только часть карточек, а не все 5000.
    expect(screen.getAllByRole('article').length).toBeLessThan(200);
  });

  it('applies the search from the URL to the result count', async () => {
    renderAt('/?category=Книги');
    expect(await screen.findByText(/Найдено:/)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Категория' })).toHaveValue('Книги');
  });

  it('updates the category filter when the user changes it', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.selectOptions(screen.getByRole('combobox', { name: 'Категория' }), 'Спорт');

    expect(await screen.findByText(/Найдено:/)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Категория' })).toHaveValue('Спорт');
  });
});

describe('Routing', () => {
  it('shows a not-found message for unknown product ids', async () => {
    renderAt('/products/999999');
    expect(await screen.findByRole('heading', { name: 'Товар не найден' })).toBeInTheDocument();
  });

  it('renders the product page for a valid id', async () => {
    renderAt('/products/1');
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Категория:/)).toBeInTheDocument();
  });
});
