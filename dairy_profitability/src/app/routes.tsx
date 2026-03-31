// src/routes/index.tsx
import { createHashRouter, Navigate } from 'react-router';   // ← changed to createHashRouter
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { FarmerProfilePage } from './pages/dashboard/FarmerProfilePage';
import { DataManagementPage } from './pages/data-management/DataManagementPage';
import { UserManagementPage } from './pages/user-management/UserManagementPage';
import { ConfigurationPage } from './pages/configuration/ConfigurationPage';

export const router = createHashRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: () => <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: OverviewPage },
      { path: 'dashboard/farmer-profile', Component: FarmerProfilePage },
      { path: 'data-management', Component: DataManagementPage },
      { path: 'user-management', Component: UserManagementPage },
      { path: 'configuration', Component: ConfigurationPage },
    ],
  },
  {
    path: '*',
    Component: () => <Navigate to="/dashboard" replace />,
  },
]);
