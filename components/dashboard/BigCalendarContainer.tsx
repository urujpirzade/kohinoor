import prisma from '@/lib/db';
import BigCalendar from './BigCalendar';
import { convertBigCalendarDate } from '@/lib/validate';

const BigCalendarContainer = async () => {
  const dataRes = await prisma.event.findMany({});

  const additionalEvents = [];

  for (const ele of dataRes) {
    if (ele.hallHandover) {
      // First additional event
      additionalEvents.push({
        ...ele,
        start_time: '06:00',
        end_time: '16:00',
        hall: 'secondHall',
      });

      // Second additional event (day before)
      const previousDate = new Date(ele.date);
      previousDate.setDate(previousDate.getDate() - 1);
      previousDate.setUTCHours(0, 0, 0, 0);
      additionalEvents.push({
        ...ele,
        date: previousDate,
        start_time: '19:00',
        end_time: '23:59',
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
