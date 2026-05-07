import { Outlet } from 'react-router';
import MainNavbar from '../components/MainNavbar';
import Footer from '../components/Footer';

export default function DefaultLayout() {
  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-800 overflow-hidden">
      
      {/* Global Main Navbar */}
      <MainNavbar />

      {/* Main Page Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <Outlet /> 
      </div>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}