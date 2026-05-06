import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, 
  RouterProvider 
} from 'react-router';

// Layouts & Pages
import DefaultLayout from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Global Styles
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

// Build the router using JSX routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<DefaultLayout />}>
      {/* The "index" route renders at the exact "/" path */}
      <Route index element={<Dashboard />} />
      
      {/* Catch-all route for 404s */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);