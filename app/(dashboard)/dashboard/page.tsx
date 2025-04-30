// import CountChart from '@/components/dashboard/CountChart';

import EventCalendarContainer from '@/components/dashboard/EventCalendarContainer';
import MonthlyCountChartContainer from '@/components/dashboard/MonthlyCountChartContainer';
import UserCard from '@/components/dashboard/UserCard';
import prisma from '@/lib/db';

const AdminPage = async ({ searchParams }: any) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const bookings = (await prisma?.event.count()) || 0;
  const upcoming =
    (await prisma?.event.count({
      where: {
        date: {
          gt: startOfToday,
        },
      },
    })) || 0;

  const mainHall =
    (await prisma?.event.count({
      where: {
        date: {
          gt: startOfToday,
        },
        hall: 'mainHall',
      },
    })) || 0;
  const secondHall =
    (await prisma?.event.count({
      where: {
        date: {
          gt: startOfToday,
        },
        hall: 'secondHall',
      },
    })) || 0;
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row'>
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 justify-between'>
          <UserCard type='Total Bookings' data={bookings} />
          <UserCard type='Upcoming Events' data={upcoming} />
          <UserCard type='Main Hall' data={mainHall} />
          <UserCard type='Second Hall' data={secondHall} />
        </div>
        {/* <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          <div className='w-full lg:w-2/3 h-[450px]'></div>
        </div> */}

        <div className='w-full h-[450px] '>
          <MonthlyCountChartContainer />
        </div>
      </div>
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendarContainer searchParams={searchParams} />
      </div>
    </div>
  );
};
export default AdminPage;
