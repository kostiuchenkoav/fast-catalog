import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element #root was not found');
}

createRoot(container).render(
  <StrictMode>
    {/* HashRouter работает на статическом хостинге без серверных перенаправлений. */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
