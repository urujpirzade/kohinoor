import prisma from '@/lib/db';
import { formatTime12hr } from '@/lib/validate';

const EventList = async ({ dateParam }: any) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma?.event.findMany({
    where: {
      date: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });

  return data?.map((event: any) => (
    <div
      className='p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple'
      key={event.id}
    >
      <div className='flex items-top justify-between'>
        <div className='flex flex-col'>
          <h1>{event.client_name}</h1>
          <span className='text-green-500 text-sm'>
            {event.hall === 'mainHall' ? 'Main Hall' : 'Open Party Hall'}
          </span>
        </div>
        <div className='flex flex-col'>
          {event.date.toLocaleDateString('en-IN', {
            day: 'numeric',
            year: 'numeric',
            month: 'long',
          })}
          <span className='text-gray-400 text-sm'>
            {event.start_time ? formatTime12hr(event?.start_time) : '-'}-
            {event.end_time ? formatTime12hr(event?.end_time) : '-'}
          </span>
        </div>
      </div>
      <p className='mt-2 text-sm text-gray-500'>{event.event_name}</p>
      <div>
        <span className='text-red-600'>Balance Remaining: {event.balance}</span>
      </div>
    </div>
  ));
};
export default EventList;
