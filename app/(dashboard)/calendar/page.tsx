import BigCalendarContainer from '@/components/dashboard/BigCalendarContainer';

const Calendar = () => {
  return (
    <div className='p-2 md:p-4 flex gap-4 flex-col xl:flex-row'>
      <div className='w-full xl:w-[98%]'>
        <div className='h-[calc(100vh-120px)] md:h-[98vh] bg-white p-2 md:p-4 rounded-md'>
          <h1 className='text-lg md:text-xl font-semibold mb-2 md:mb-4'>
            Schedule
          </h1>
          <BigCalendarContainer />
        </div>
      </div>
    </div>
  );
};
export default Calendar;
