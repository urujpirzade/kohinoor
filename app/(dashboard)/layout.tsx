'use client';

import Menu from '@/components/dashboard/Menu';
import Navbar from '@/components/dashboard/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering mobile-specific content until mounted
  if (!mounted) {
    return (
      <div className='h-screen flex relative'>
        {/* Sidebar - Default desktop layout during SSR */}
        <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-2 bg-white z-50'>
          <Link
            href='/'
            className='flex items-center justify-center gap-2 mb-4'
          >
            <Image
              src='/logo_water.png'
              alt='logo'
              width={200}
              height={100}
              className='object-contain'
            />
          </Link>
          <Menu />
        </div>

        {/* Main Content - Default desktop layout during SSR */}
        <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-auto'>
          <Navbar />
          <div className='p-2 md:p-4'>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen flex relative'>
      {/* Mobile Sidebar Overlay */}
      {isMobile && (
        <div
          className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${
            isMobile
              ? `sidebar-mobile ${sidebarOpen ? 'open' : ''}`
              : 'w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%]'
          } 
          p-2 bg-white z-50
        `}
      >
        <Link href='/' className='flex items-center justify-center gap-2 mb-4'>
          <Image
            src='/logo_water.png'
            alt='logo'
            width={isMobile ? 150 : 200}
            height={isMobile ? 75 : 100}
            className='object-contain'
          />
        </Link>
        <Menu onItemClick={isMobile ? closeSidebar : undefined} />
      </div>

      {/* Main Content */}
      <div
        className={`
        ${isMobile ? 'w-full' : 'w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]'} 
        bg-[#F7F8FA] overflow-auto
      `}
      >
        <Navbar onMenuClick={isMobile ? toggleSidebar : undefined} />
        <div className='p-2 md:p-4'>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
