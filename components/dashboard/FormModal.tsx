'use client';

import Image from 'next/image';
import { JSX, useState } from 'react';
import dynamic from 'next/dynamic';
import { deleteEvent, deleteUser } from '@/lib/actions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const EventForm = dynamic(() => import('../forms/EventForm'), {
  loading: () => (
    <div className='flex items-center justify-center p-12'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
    </div>
  ),
});
const UserForm = dynamic(() => import('../forms/UserForm'), {
  loading: () => (
    <div className='flex items-center justify-center p-12'>
      <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
    </div>
  ),
});

const forms: {
  [key: string]: (type: 'create' | 'update', data?: any) => JSX.Element;
} = {
  booking: (type, data) => <EventForm type={type} data={data} />,
  employee: (type, data) => <UserForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: 'booking' | 'employee';
  type: 'create' | 'update' | 'delete';
  data?: any;
  id?: any;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const getButtonStyles = () => {
    const baseStyle =
      'flex items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105';

    switch (type) {
      case 'create':
        return `${baseStyle} bg-lamaYellow w-7 h-7`;
      case 'update':
        return `${baseStyle} bg-lamaSky w-7 h-7`;
      case 'delete':
        return `${baseStyle} bg-red-100 rounded-md w-7 h-7`;
      default:
        return baseStyle;
    }
  };

  const Form = () => {
    const handleDelete = async (id: number) => {
      const result = await deleteEvent(id);
      if (result.success) {
        toast(`${result.message}`);
        router.refresh();
      }
    };
    const handleUserDelete = async (id: string) => {
      const result = await deleteUser(id);
      if (result.success) {
        toast(`${result.message}`);
        router.refresh();
      }
    };

    if (type === 'delete' && id) {
      return (
        <div className='p-8 flex flex-col items-center'>
          <div className='mb-6 bg-red-100 rounded-full p-4'>
            <Image src='/delete.png' alt='Delete' height={28} width={28} />
          </div>

          <h2 className='text-center text-xl font-semibold mb-2'>
            Confirm Deletion
          </h2>
          <p className='text-center text-gray-500 mb-8'>
            Are you sure you want to delete this item? All data will be
            permanently removed. This action cannot be undone.
          </p>

          <div className='flex gap-4 w-full'>
            <button
              onClick={() => setOpen(false)}
              className='flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              className='flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700'
              type='submit'
              onClick={() =>
                table === 'booking' ? handleDelete(id) : handleUserDelete(id)
              }
            >
              Yes, Delete
            </button>
          </div>
        </div>
      );
    }

    return type === 'create' || type === 'update' ? (
      forms[table](type, data)
    ) : (
      <div className='p-8 text-center'>Form not found</div>
    );
  };

  return (
    <>
      {type !== 'update' && (
        <button
          className={getButtonStyles()}
          onClick={() => setOpen(true)}
          aria-label={`${type} item`}
        >
          <Image src={`/${type}.png`} alt={type} height={22} width={22} />
        </button>
      )}
      {type === 'update' && (
        <button
          className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center'
          onClick={() => setOpen(true)}
          aria-label={`${type} item`}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
            />
          </svg>
          Edit
        </button>
      )}

      {open && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity'>
          <div
            className='bg-white rounded-2xl relative max-h-[90vh] w-full md:w-[70%] lg:w-[60%] overflow-auto animate-slideIn shadow-2xl'
            style={{ animation: 'slideIn 0.3s ease-out' }}
          >
            <div className='sticky top-0 right-0 pt-4 pr-4 flex justify-end z-10'>
              <button
                onClick={() => setOpen(false)}
                className='bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors'
                aria-label='Close modal'
              >
                <Image src='/close.png' alt='close' height={14} width={14} />
              </button>
            </div>

            <div className='px-1 pb-6'>
              <Form />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* For Webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 8px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </>
  );
};

export default FormModal;
