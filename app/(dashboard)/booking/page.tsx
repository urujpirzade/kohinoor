import FormModal from '@/components/dashboard/FormModal';
import Pagination from '@/components/dashboard/Pagination';
import BookingTable from '@/components/dashboard/BookingTable';
import TableSearch from '@/components/dashboard/TableSearch';

import prisma from '@/lib/db';
import { EventSchema } from '@/schema/schema';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Hall, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import FilterSortModal from '@/components/dashboard/FilterSortModal';

const columns = [
  {
    header: 'Id',
    accessor: 'id',
  },
  {
    header: 'Name',
    accessor: 'client_name',
    className: 'pl-2',
  },
  {
    header: 'Date',
    accessor: 'date',
    className: '',
  },
  {
    header: 'Event',
    accessor: 'event_name',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Hall',
    accessor: 'hall',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Balance',
    accessor: 'balance',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Amount',
    accessor: 'amount',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const session = await getServerSession(authOptions);
  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login');
  }
  const role = session.user.role;

  const { page, sortField, sortOrder, ...queryParam } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const today = new Date();

  today.setHours(0, 0, 0, 0);
  console.log(today);

  const query: Prisma.EventWhereInput = {};
  query.date = {
    gte: today,
  };
  if (queryParam) {
    if (queryParam.startDate && queryParam.endDate) {
      query.date = {
        gte: new Date(queryParam.startDate),
        lte: new Date(queryParam.endDate),
      };
    }
    for (const [key, value] of Object.entries(queryParam)) {
      if (value !== undefined) {
        switch (key) {
          case 'id':
            query.id = parseInt(value);
            break;
          case 'client_name':
            query.client_name = value;
            break;
          // case 'date':
          //   query.date = new Date(value);
          //   break;
          case 'start_time':
            query.start_time = value;
            break;
          case 'end_time':
            query.end_time = value;
            break;
          case 'email':
            query.email = value;
            break;
          case 'contact':
            query.contact = value;
            break;
          case 'address':
            query.address = value;
            break;
          case 'event_name':
            query.event_name = value;
            break;
          case 'hall':
            query.hall = value === 'mainHall' ? value : 'secondHall';
            break;
          case 'details':
            query.details = value;
            break;
          // case 'amount':
          //   query.amount = parseInt(value);
          //   break;
          // case 'advance':
          //   query.advance = parseInt(value);
          //   break;
          // case 'balance':
          //   query.balance = parseInt(value);
          //   break;
          case 'search':
            const hallMatches: string[] = ['mainHall', 'secondHall'].filter(
              (h) => h.toLowerCase().includes(value.toLowerCase()),
            );
            query.OR = [
              { client_name: { contains: value, mode: 'insensitive' } },
              { event_name: { contains: value, mode: 'insensitive' } },

              { email: { contains: value, mode: 'insensitive' } },
              { contact: { contains: value, mode: 'insensitive' } },
              { address: { contains: value, mode: 'insensitive' } },
              { details: { contains: value, mode: 'insensitive' } },
              ...hallMatches.map((match) => ({
                hall: { equals: match as Hall },
              })),
            ];
            break;

          default:
            break;
        }
      }
    }
  }

  const whereClause = query.OR ? { OR: query.OR } : query;

  const orderBy: Prisma.Enumerable<Prisma.EventOrderByWithRelationInput> =
    sortField
      ? { [sortField]: sortOrder === 'asc' ? 'asc' : 'desc' }
      : { id: 'desc' }; // Default sort by id desc

  const [bookings, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: whereClause,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy,
    }),
    prisma.event.count({ where: whereClause }),
  ]);

  // Convert null to undefined for optional fields to match EventSchema type
  const mappedBookings = bookings.map((booking) => ({
    ...booking,
    email: booking.email ?? undefined,
    address: booking.address ?? undefined,
    details: booking.details ?? undefined,
    bookingBy: booking.bookingBy ?? undefined,
    reference: booking.reference ?? undefined,
    hallHandover: booking.hallHandover ?? undefined,
    decoration: booking.decoration ?? undefined,
    catering: booking.catering ?? undefined,
    kitchen: booking.kitchen ?? undefined,
  }));

  return (
    <div className='flex-1  bg-white p-4 rounded-md m-4 mt-0'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Events</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            <FilterSortModal type='filter' />
            <FilterSortModal type='sort' />
            <FormModal table='booking' type='create' />
          </div>
        </div>
      </div>
      <BookingTable columns={columns} data={mappedBookings} userRole={role} />
      <Pagination page={p} count={count} />
    </div>
  );
};
export default page;
