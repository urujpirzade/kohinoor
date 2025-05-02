import prisma from '@/lib/db';
import BigCalendar from './BigCalendar';
import { convertBigCalendarDate } from '@/lib/validate';

const BigCalendarContainer = async () => {
  const dataRes = await prisma.event.findMany({});

   dataRes.forEach((ele) => {
    if (ele.hallHandover) {
      const dataCopy = { ...ele };
      dataCopy.start_time = '06:00';
      dataCopy.end_time = '16:00';
      dataCopy.hall = 'secondHall';
      dataRes.push(dataCopy);
      const dataCopy2 = { ...ele };
      const currentDate = new Date(dataCopy2.date);
      currentDate.setDate(currentDate.getDate() - 1);
      dataCopy2.date = currentDate;
      dataCopy2.hall = 'secondHall';
      dataCopy2.start_time = '19:00';
      dataCopy2.end_time = '23:59';
      dataRes.push(dataCopy2);
    }
  });
  
  const schedule = dataRes.map((event: any) => ({
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
