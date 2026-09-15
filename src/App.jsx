import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';

import SiteLayout from './layouts/SiteLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/user/Home';
import About from './pages/user/About';
import Contact from './pages/user/Contact'
import Services from './pages/user/Services';
import ServiceDetail from './pages/user/ServiceDetail';
import Checkout from './pages/user/Checkout';
import OrderConfirmation from './pages/user/OrderConfirmation';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminTeam from './pages/admin/AdminTeam';
;
import { Toaster } from 'react-hot-toast';
import SmoothScroll from './components/common/SmoothScroll';

export default function App() {
  return (
    <>
      <BrowserRouter>

        <SmoothScroll />
        <Routes>

          {/* Customer-facing site */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/checkout/:serviceId" element={<Checkout />} />
            <Route path="/order-success/:orderNumber" element={<OrderConfirmation />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/team" element={<AdminTeam />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: '14px',
            padding: '12px 16px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
    </>
  );
}
