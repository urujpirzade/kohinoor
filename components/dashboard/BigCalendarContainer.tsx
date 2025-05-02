import prisma from '@/lib/db';
import BigCalendar from './BigCalendar';
import { convertBigCalendarDate } from '@/lib/validate';

const BigCalendarContainer = async () => {
  const dataRes = await prisma.event.findMany({});

  const additionalEvents = [];

  for (const ele of dataRes) {
    if (ele.hallHandover) {
      // First additional event
       ele.start_time='00:30';
        ele.end_time='10:30';
      additionalEvents.push({
        ...ele,
        hall: 'secondHall',
      });

      // Second additional event (day before)
      const originalDate = new Date(ele.date);

      const previousDateUTC = new Date(
        Date.UTC(
          originalDate.getUTCFullYear(),
          originalDate.getUTCMonth(),
          originalDate.getUTCDate() - 1,
          0, // Set time to 00:00:00 UTC explicitly
          0,
          0
        )
      );

      additionalEvents.push({
        ...ele,
        start_time: '13:30',
        end_time: '18:29',
        // start_time: '19:00',
        // end_time: '23:59',
        date: previousDateUTC,
        hall: 'secondHall',
      });
    }
  }

  const finalData = [...dataRes, ...additionalEvents];

  const schedule = finalData.map((event: any) => ({
    title: event.event_name,
    date: event.date,
    startTime: event.start_time,
    endTime: event.end_time,
    hall: event.hall,
    client: event.client_name,
  }));

  const data = convertBigCalendarDate(schedule);

  return (
    <div className=''>
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;
