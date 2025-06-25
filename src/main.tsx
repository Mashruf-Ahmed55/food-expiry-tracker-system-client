import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Provider from './components/layout/Provider.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import './index.css';
import Router from './router/Router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <Router />
      <Toaster />
    </Provider>
  </StrictMode>
);
