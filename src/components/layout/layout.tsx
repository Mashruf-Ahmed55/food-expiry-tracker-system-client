import { Outlet } from 'react-router';
import Footer from './Footer';
import Navbar from './Navbar';
import PageLoader from './PageLoader';

export default function Layout() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main className="w-full flex min-h-screen flex-1 flex-col items-center justify-between">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
