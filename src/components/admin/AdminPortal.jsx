import React from 'react';
import { useCart } from '../../context/CartContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminPortal = () => {
  const { adminToken } = useCart();

  if (!adminToken) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};
