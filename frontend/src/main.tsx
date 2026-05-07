import React, { type JSX } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Navigate, 
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
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

const queryClient = new QueryClient()

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* AuthPage is now wrapped in PublicRoute! */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        } 
      />

      {/* Dashboard is protected */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DefaultLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </>
  )
);

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);