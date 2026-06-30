import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { FavouritesProvider } from '@/features/favourites/FavouritesProvider';
import { applyDesignTokens } from '@/styles/engine';
import 'modern-normalize/modern-normalize.css';
import '@/styles/scss/global.scss';

applyDesignTokens();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FavouritesProvider>
        <App />
      </FavouritesProvider>
    </AuthProvider>
  </StrictMode>,
);
