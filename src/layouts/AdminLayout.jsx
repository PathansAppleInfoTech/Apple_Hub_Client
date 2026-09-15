import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

import { useAdminAuth } from '../context/AdminAuthContext';

import { getOrders } from '../api/admin';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminFooter from '../components/admin/AdminFooter';

export default function AdminLayout() {
  const {
    admin,
    loading,
    signOut,
  } = useAdminAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [unattendedOrderCount, setUnattendedOrderCount] =
    useState(0);

  /*
   * Load all orders and calculate
   * unattended orders.
   *
   * Unattended = confirmed orders
   */
  useEffect(() => {
    if (!admin) return;

    loadUnattendedOrders();
  }, [admin]);

  async function loadUnattendedOrders() {
    try {
      const orders = await getOrders();

      const confirmedOrders = Array.isArray(orders)
        ? orders.filter(
          (order) =>
            order.order_status === 'confirmed'
        )
        : [];

      setUnattendedOrderCount(
        confirmedOrders.length
      );
    } catch (error) {
      console.error(
        '[AdminLayout] Failed to load order count:',
        error
      );

      setUnattendedOrderCount(0);
    }
  }

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (!admin) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-canvas-soft text-ink">

      {/* Sidebar */}
      <AdminSidebar
        admin={admin}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onSignOut={handleSignOut}
        unattendedOrderCount={unattendedOrderCount}
      />

      {/* Main area */}
      <div className="min-h-screen md:pl-72">

        {/* Header */}
        <AdminHeader
          admin={admin}
          onMenuOpen={() => setMobileOpen(true)}
        />

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:min-h-[calc(100vh-5rem)] lg:p-8 xl:p-10">
          <Outlet />
        </main>

        {/* Footer */}
        <AdminFooter />

      </div>
    </div>
  );
}

function AdminLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-soft">
      <div className="flex flex-col items-center gap-4">

        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />

        <p className="text-sm font-medium text-ink-muted">
          Loading admin portal...
        </p>

      </div>
    </div>
  );
}