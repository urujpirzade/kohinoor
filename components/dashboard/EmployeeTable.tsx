'use client';

import Table from './Table';
import Image from 'next/image';
import Link from 'next/link';
import FormModal from './FormModal';
import { SignUpSchema } from '@/schema/schema';

interface EmployeeTableProps {
  columns: { header: string; accessor: string; className?: string }[];
  data: SignUpSchema[];
  userRole: string;
}

const EmployeeTable = ({ columns, data, userRole }: EmployeeTableProps) => {
  const renderRow = (item: SignUpSchema) => (
    <tr
      key={item.id}
      className='border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight'
    >
      <td className='pt-3 pb-2 '>{item.username}</td>
      <td className='pt-3 pb-2  md:table-cell'>{item.role}</td>
      <td className='pt-3 pb-2 hidden md:table-cell'>{`${item.firstName} ${item.middleName} ${item.lastName}`}</td>
      <td className='pt-3 pb-2 hidden lg:table-cell'>{item.contact}</td>
      <td>
        <div className='flex items-center gap-2'>
          <Link href={`/employee/${item.id}`}>
            <button className='w-7 h-7 flex items-center justify-center hover:scale-105'>
              <Image src='/view.png' alt='view' width={24} height={24} />
            </button>
          </Link>
          {(userRole === 'ADMIN' || userRole === 'ROOT') && (
            <FormModal table='employee' type='delete' id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const renderMobileCard = (item: SignUpSchema) => (
    <div className='space-y-2'>
      <div className='flex justify-between items-start'>
        <div>
          <p className='font-semibold text-sm'>{item.username}</p>
          <p className='text-xs text-gray-600 capitalize'>
            {item.role.toLowerCase()}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href={`/employee/${item.id}`}>
            <button className='w-7 h-7 flex items-center justify-center hover:scale-105'>
              <Image src='/view.png' alt='view' width={20} height={20} />
            </button>
          </Link>
          {(userRole === 'ADMIN' || userRole === 'ROOT') && (
            <FormModal table='employee' type='delete' id={item.id} />
          )}
        </div>
      </div>
      <div className='grid grid-cols-1 gap-1 text-xs'>
        <div>
          <span className='text-gray-500'>Name:</span>
          <p>{`${item.firstName} ${item.middleName} ${item.lastName}`}</p>
        </div>
        <div>
          <span className='text-gray-500'>Contact:</span>
          <p>{item.contact}</p>
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

export default EmployeeTable;
