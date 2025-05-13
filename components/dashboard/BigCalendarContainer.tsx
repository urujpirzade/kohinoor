import prisma from '@/lib/db';
import BigCalendar from './BigCalendar';
import { convertBigCalendarDate } from '@/lib/validate';

const BigCalendarContainer = async () => {
  const dataRes = await prisma.event.findMany({});

  const additionalEvents = [];
  const toCorrectedISTTime = (date: Date, timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Combine with date (as local time)
    const localDate = new Date(date);
    localDate.setHours(hours, minutes, 0, 0);

    // Subtract 5 hours 30 minutes to get actual UTC time
    const correctedUTC = new Date(localDate.getTime() - 5.5 * 60 * 60 * 1000);

    // Return in 'HH:mm' format
    return correctedUTC.toTimeString().slice(0, 5);
  };

  for (const ele of dataRes) {
    ele.start_time = toCorrectedISTTime(new Date(ele.date), ele.start_time);
    ele.end_time = toCorrectedISTTime(new Date(ele.date), ele.end_time);
    if (ele.hallHandover) {
      // First additional event
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
