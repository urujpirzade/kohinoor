'use client';

import Table from './Table';
import Image from 'next/image';
import Link from 'next/link';
import FormModal from './FormModal';
import { EventSchema } from '@/schema/schema';

interface BookingTableProps {
  columns: { header: string; accessor: string; className?: string }[];
  data: EventSchema[];
  userRole: string;
}

const BookingTable = ({ columns, data, userRole }: BookingTableProps) => {
  const renderRow = (item: EventSchema) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'
    >
      <td className='pt-3 pb-2 '>{item.id}</td>
      <td className='pt-3 pb-2 pl-2'>{item.client_name}</td>
      <td className='pt-3 pb-2 '>
        {item.date.toLocaleDateString('en-IN', {
          day: 'numeric',
          year: 'numeric',
          month: 'long',
        })}
      </td>
      <td className='pt-3 pb-2 hidden md:table-cell'>{item.event_name}</td>
      <td className='pt-3 pb-2 hidden md:table-cell'>
        {item.hall === 'mainHall' ? 'Main Hall' : 'Open Party Hall'}
      </td>
      <td className='pt-3 pb-2 hidden lg:table-cell'>{item.balance}</td>
      <td className='pt-3 pb-2 hidden md:table-cell'>{item.amount}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link className=' flex' href={`/booking/${item.id}`}>
            <button className='w-7 h-7 flex items-center justify-center hover:scale-105'>
              <Image src='/view.png' alt='view' width={24} height={24} />
            </button>
          </Link>
          {(userRole === 'ADMIN' || userRole === 'ROOT') && (
            <FormModal table='booking' type='delete' id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const renderMobileCard = (item: EventSchema) => (
    <div className='space-y-2'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='font-semibold text-sm'>
            #{item.id} - {item.client_name}
          </p>
          <p className='text-xs text-gray-600'>{item.event_name}</p>
        </div>
        <div className='flex items-center gap-2'>
          <Link className='flex' href={`/booking/${item.id}`}>
            <button className='w-7 h-7 flex items-center justify-center hover:scale-105'>
              <Image src='/view.png' alt='view' width={20} height={20} />
            </button>
          </Link>
          {(userRole === 'ADMIN' || userRole === 'ROOT') && (
            <FormModal table='booking' type='delete' id={item.id} />
          )}
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2 text-xs'>
        <div>
          <span className='text-gray-500'>Date:</span>
          <p>
            {item.date.toLocaleDateString('en-IN', {
              day: 'numeric',
              year: 'numeric',
              month: 'short',
            })}
          </p>
        </div>
        <div>
          <span className='text-gray-500'>Hall:</span>
          <p>{item.hall === 'mainHall' ? 'Main Hall' : 'Open Party Hall'}</p>
        </div>
        <div>
          <span className='text-gray-500'>Amount:</span>
          <p>₹{item.amount}</p>
        </div>
        <div>
          <span className='text-gray-500'>Balance:</span>
          <p>₹{item.balance}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      renderRow={renderRow}
      renderMobileCard={renderMobileCard}
      data={data}
    />
  );
};

export default BookingTable;
