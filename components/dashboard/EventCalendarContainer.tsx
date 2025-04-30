import EventList from './EventList';
import EventCalendar from './EventCalendar';

const EventCalendarContainer = async ({ searchParams }: any) => {
  const { date } = await searchParams;

  return (
    <div className='bg-white p-4 rounded-md'>
      <EventCalendar />
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>Events</h1>
      </div>
      <div className='flex flex-col gap-4'>
        <EventList dateParam={date} />
      </div>
    </div>
  );
};
export default EventCalendarContainer;
