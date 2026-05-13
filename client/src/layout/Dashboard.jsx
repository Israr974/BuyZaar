import React, { useState, useEffect } from 'react';
import ShowMenu from '../components/ShowMenu';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setShowBottomNav(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowBottomNav(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    switch (path) {
      case 'profile':
        return 'My Profile';
      case 'myorder':
        return 'My Orders';
      case 'address':
        return 'Saved Addresses';
      case 'category':
        return 'Manage Categories';
      case 'subcategory':
        return 'Manage Sub Categories';
      case 'uploadproduct':
        return 'Upload Product';
      case 'product':
        return 'Products Management';
      case 'order':
        return 'Orders Management';
      case 'setting':
        return 'Settings';
      case 'help':
        return 'Help Center';
      case 'wishlist':
        return 'Wishlist';
      default:
        return 'Dashboard';
    }
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: getPageTitle(), path: location.pathname }
  ];

  return (
    <section className="min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr]">

        <aside className="hidden lg:block bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">D</span>
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</h2>
            </div>
          </div>
          <div className="p-3">
            <ShowMenu user={user} isMobile={false} />
          </div>
        </aside>

        <main className="min-h-screen">
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.path}>
                    {index > 0 && (
                      <ChevronRight size={14} className="text-gray-500" />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <span className="font-semibold text-gray-800">
                        {crumb.name}
                      </span>
                    ) : (
                      <a
                        href={crumb.path}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        {crumb.name === 'Home' ? (
                          <Home size={14} className="inline mr-1" />
                        ) : null}
                        {crumb.name}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                {getPageTitle()}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}! Here's what's happening with your account.
              </p>
            </div>
          </div>

          <div className={`p-6 transition-all duration-300 ${
            showBottomNav ? 'pb-28 lg:pb-6' : 'pb-6 lg:pb-6'
          }`}>
            <Outlet />
          </div>
        </main>
      </div>

      <div 
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300 ease-in-out ${
          showBottomNav ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => window.location.href = '/dashboard/profile'}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              location.pathname.includes('profile') 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard/myorder'}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              location.pathname.includes('myorder') 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">Orders</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard/address'}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              location.pathname.includes('address') 
                ? 'text-blue-600' 
                : 'text-gray-500'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Addresses</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;