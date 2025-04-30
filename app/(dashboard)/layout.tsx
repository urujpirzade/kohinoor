import Menu from '@/components/dashboard/Menu';
import Navbar from '@/components/dashboard/Navbar';
import Image from 'next/image';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-screen flex'>
      <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-2'>
        <Link href='/' className='flex items-center justify-center gap-2'>
          <Image src='/logo_water.png' alt='logo' width={200} height={100} />
          {/* <div>
            <h1 className='hidden lg:block font-bold text-xl'>VENUE</h1>
            <h1 className='hidden lg:block font-bold text-xl'>BOOKING</h1>
          </div> */}
        </Link>
        <Menu />
      </div>
      <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll'>
        <Navbar />
        {children}
      </div>
    </div>
  );
};
export default DashboardLayout;
