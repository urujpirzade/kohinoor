'use client';

import { SignUpSchema } from '@/schema/schema';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Phone, Calendar, Award, User } from 'lucide-react';

import Image from 'next/image';
import FormModal from '@/components/dashboard/FormModal';

const EmployeeView = () => {
  const [data, setData] = useState<SignUpSchema>();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    setRole(session?.user?.role || '');
    setLoading(true);
    fetch(`/api/user/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='h-16 w-16 bg-amber-200 rounded-full mb-4'></div>
          <div className='h-4 w-48 bg-gray-200 rounded mb-2'></div>
          <div className='h-3 w-36 bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='text-center p-10 bg-red-50 rounded-xl border border-red-100 shadow-md'>
        <svg
          className='h-12 w-12 text-red-500 mx-auto mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
          />
        </svg>
        <h3 className='text-xl font-bold text-red-700 mb-2'>
          User Data Not Found
        </h3>
        <p className='text-red-600 mb-4'>
          {error || 'Unable to load user information.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className='bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg shadow transition duration-150'
        >
          Try Again
        </button>
      </div>
    );
  }

  const fullName = `${data.firstName || ''} ${
    data.middleName ? data.middleName + ' ' : ''
  }${data.lastName || ''}`.trim();

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
            <h2 className='font-semibold text-gray-800'>{data.username}</h2>
            <p className='text-sm text-gray-500'>Manage user details</p>
          </div>
        </div>
        <div className='flex space-x-2'>
          <button
            onClick={() => window.history.back()}
            className='bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-150'
          >
            Back
          </button>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
        {/* Header banner */}
        <div className='bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 h-32 relative'></div>

        {/* Profile section */}
        <div className='px-8 pb-8 relative'>
          <div className='flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6'>
            <div className='w-24 h-24 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center shadow-md overflow-hidden'>
              {data.username == 'pirzade' ? (
                <Image
                  src={'/uruj.jpg'}
                  alt={fullName}
                  width={48}
                  height={48}
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
                    data.role === 'ADMIN'
                      ? 'bg-amber-100 text-amber-800'
                      : data.role === 'MANAGER'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {data.role}
                </span>
                <span className='text-gray-500 text-sm ml-3'>
                  @{data.username}
                </span>
              </div>
            </div>

            {session?.user?.role === 'ADMIN' ||
              (session?.user?.role === 'ROOT' && (
                <div className='ml-auto mt-4 sm:mt-0'>
                  {(role === 'ADMIN' || role === 'ROOT') && (
                    <FormModal
                      table='employee'
                      type='update'
                      data={data}
                      id={data.id}
                    />
                  )}
                </div>
              ))}
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
                  <p className='font-medium'>{data.username}</p>
                </div>

                <div className='flex items-center'>
                  <Phone className='text-gray-400 w-4 h-4 mr-2' />
                  <span>{data.contact || 'No contact information'}</span>
                </div>

                <div className='flex items-center'>
                  <Award className='text-gray-400 w-4 h-4 mr-2' />
                  <span>{data.role}</span>
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
                    {data.id}
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
