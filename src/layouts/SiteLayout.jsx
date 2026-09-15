import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-navy text-paper">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
