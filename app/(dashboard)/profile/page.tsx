import React from 'react';
import { Phone, Calendar, Award, User } from 'lucide-react';

import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
const EmployeeView = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  const data = await prisma.user.findUnique({
    where: { username: session.user.username },
  });

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const fullName = `${data?.firstName || ''} ${
    data?.middleName ? data?.middleName + ' ' : ''
  }${data?.lastName || ''}`.trim();

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-white shadow-md rounded-xl p-4 mb-4 flex justify-between items-center print:hidden'>
        <div className='flex items-center'>
          <div className='h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center'>
            <svg
              className='h-6 w-6 text-amber-700'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h2 className='font-semibold text-gray-800'>{data?.username}</h2>
            <p className='text-sm text-gray-500'>Profile</p>
          </div>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Header banner */}
        <div className='bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 h-32 relative'></div>

        {/* Profile section */}
        <div className='px-8 pb-8 relative'>
          <div className='flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6'>
            <div className='w-24 h-24 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-md overflow-hidden'>
              {data?.image ? (
                <Image
                  src={'/avatar.png'}
                  alt={fullName}
                  width={24}
                  height={24}
                  className='w-full h-full object-cover'
                />
              ) : (
                <User size={48} className='text-gray-400' />
              )}
            </div>
            <div className='sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left'>
              <h1 className='text-2xl font-bold text-white mb-2'>{fullName}</h1>
              <div className='flex items-center justify-center sm:justify-start mt-1'>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    data?.role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-800'
                      : data?.role === 'MANAGER'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {data?.role}
                </span>
                <span className='text-gray-500 text-sm ml-3'>
                  @{data?.username}
                </span>
              </div>
            </div>
          </div>

          {/* Information cards */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8'>
            {/* Personal Information */}
            <div className='bg-gray-50 rounded-xl p-6 shadow-sm'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <User className='mr-2 text-blue-600 w-5 h-5' />
                Personal Information
              </h2>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>Full Name</p>
                  <p className='font-medium'>{fullName}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Username</p>
                  <p className='font-medium'>{data?.username}</p>
                </div>

                <div className='flex items-center'>
                  <Phone className='text-gray-400 w-4 h-4 mr-2' />
                  <span>{data?.contact || 'No contact information'}</span>
                </div>

                <div className='flex items-center'>
                  <Award className='text-gray-400 w-4 h-4 mr-2' />
                  <span>{data?.role}</span>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className='bg-gray-50 rounded-xl p-6 shadow-sm'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                <Calendar className='mr-2 text-blue-600 w-5 h-5' />
                Account Details
              </h2>

              <div className='space-y-4'>
                <div>
                  <p className='text-sm text-gray-500'>User ID</p>
                  <p className='font-medium text-sm text-gray-700 break-all'>
                    {data?.id}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Created On</p>
                  <p className='font-medium'>
                    {data?.createdAt ? formatDate(data.createdAt) : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className='text-sm text-gray-500'>Last Updated</p>
                  <p className='font-medium'>
                    {data?.updatedAt ? formatDate(data.updatedAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section (can be expanded) */}
          {/* <div className='mt-8 bg-gray-50 rounded-xl p-6 shadow-sm'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Recent Activity
            </h2>
            <p className='text-gray-500 text-center py-6'>
              No recent activities to display
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeView;
