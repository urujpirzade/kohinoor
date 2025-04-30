import FormModal from '@/components/dashboard/FormModal';
import Pagination from '@/components/dashboard/Pagination';
import Table from '@/components/dashboard/Table';
import TableSearch from '@/components/dashboard/TableSearch';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/db';
import { SignUpSchema } from '@/schema/schema';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Prisma, Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const columns = [
  {
    header: 'Username',
    accessor: 'username',
    className: '',
  },
  {
    header: 'Role',
    accessor: 'role',
    className: '',
  },
  {
    header: 'Name',
    accessor: 'firstName',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Contact',
    accessor: 'contact',
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

  if (role !== 'ROOT' && role !== 'ADMIN') {
    redirect('/login');
  }

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

          {(role === 'ADMIN' || role === 'ROOT') && (
            <FormModal table='employee' type='delete' id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParam } = await searchParams;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.UserWhereInput = {};
  if (queryParam) {
    for (const [key, value] of Object.entries(queryParam)) {
      if (value !== undefined) {
        switch (key) {
          case 'firstName':
            query.firstName = value;
            break;
          case 'middleName':
            query.middleName = value;
            break;
          case 'lastName':
            query.lastName = value;
            break;
          case 'contact':
            query.contact = value;
            break;
          case 'role':
            query.role = value === 'ADMIN' ? value : 'MANAGER';
            break;
          case 'search':
            const rollMatches: string[] = ['ADMIN', 'MANAGER'].filter((h) =>
              h.toUpperCase().includes(value.toUpperCase())
            );
            query.OR = [
              { firstName: { contains: value, mode: 'insensitive' } },
              { middleName: { contains: value, mode: 'insensitive' } },
              { lastName: { contains: value, mode: 'insensitive' } },
              { contact: { contains: value, mode: 'insensitive' } },
              ...rollMatches.map((match) => ({
                role: { equals: match as Role },
              })),
            ];
            break;

          default:
            break;
        }
      }
    }
  }

  // const whereClause = query.OR ? { OR: query.OR } : query;

  const whereClause: Prisma.UserWhereInput = {
    ...query, // Spread any existing conditions
    role: {
      notIn: ['ROOT'],
    },
  };

  if (query.OR) {
    whereClause.OR = query.OR; // If there's an OR condition, add it back
  }

  const [employees, count] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { id: 'desc' },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return (
    <div className='flex-1  bg-white p-4 rounded-md m-4 mt-0'>
      <div className='flex items-center justify-between'>
        <h1 className='hidden md:block text-lg font-semibold'>All Employees</h1>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch />
          <div className='flex items-center gap-4 self-end'>
            {/* <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src='/filter.png' alt='filter' width={14} height={14} />
            </button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'>
              <Image src='/sort.png' alt='sort' width={14} height={14} />
            </button> */}
            <FormModal table='employee' type='create' />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={employees} />
      <Pagination page={p} count={count} />
    </div>
  );
};
export default page;
