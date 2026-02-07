'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useIsMobile } from '@/hooks/use-mobile';

const FilterSortModal = ({ type }: { type: 'filter' | 'sort' }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState({
    hall: '',

    startDate: null as Date | null,
    endDate: null as Date | null,
  });

  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === 'filter') {
      if (filters.hall) params.set('hall', filters.hall);
      else params.delete('hall');

      if (filters.startDate)
        params.set('startDate', filters.startDate.toISOString());
      else params.delete('startDate');

      if (filters.endDate) params.set('endDate', filters.endDate.toISOString());
      else params.delete('endDate');
    }

    if (type === 'sort') {
      if (sortField) params.set('sortField', sortField);
      else params.delete('sortField');

      if (sortOrder) params.set('sortOrder', sortOrder);
      else params.delete('sortOrder');
    }

    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const resetAll = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === 'filter') {
      params.delete('client_name');
      params.delete('event_name');
      params.delete('hall');
      params.delete('startDate');
      params.delete('endDate');
    }

    if (type === 'sort') {
      params.delete('sortField');
      params.delete('sortOrder');
    }

    router.push(`?${params.toString()}`);
    setFilters({
      hall: '',
      startDate: null,
      endDate: null,
    });
    setSortField('');
    setSortOrder('desc');
    setOpen(false);
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow'
      >
        <Image
          src={type === 'filter' ? '/filter.png' : '/sort.png'}
          alt={type}
          width={14}
          height={14}
        />
      </button>

      {open && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <div
              className='fixed inset-0 bg-black bg-opacity-50 z-40'
              onClick={() => setOpen(false)}
            />
          )}

          {/* Modal Content */}
          <div
            className={`
            filter-sort-modal
            ${
              isMobile
                ? 'fixed inset-x-4 top-1/2 -translate-y-1/2 z-50'
                : 'absolute right-0 mt-2 w-72 z-50'
            } 
            bg-white border rounded-lg shadow-lg p-4
          `}
          >
            <div className='flex justify-between items-center'>
              <h2
                className={`font-semibold mb-4 ${
                  isMobile ? 'text-xl' : 'text-lg'
                }`}
              >
                {type === 'filter' ? 'Apply Filters' : 'Sort By'}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className={`text-black hover:text-red-400 mb-4 bg-lamaYellow rounded-full ${
                  isMobile ? 'p-2' : 'p-1'
                }`}
                aria-label='Close modal'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='18' y1='6' x2='6' y2='18'></line>
                  <line x1='6' y1='6' x2='18' y2='18'></line>
                </svg>
              </button>
            </div>
            {type === 'filter' && (
              <div className='flex flex-col gap-3'>
                <select
                  value={filters.hall}
                  onChange={(e) =>
                    setFilters({ ...filters, hall: e.target.value })
                  }
                  className={`border rounded w-full ${
                    isMobile ? 'p-3 text-base' : 'p-2 text-sm'
                  }`}
                >
                  <option value=''>Select Hall</option>
                  <option value='mainHall'>Main Hall</option>
                  <option value='secondHall'>Open Party Hall</option>
                </select>
                {/* Date Range Picker */}
                <div className='flex flex-col gap-2'>
                  <label
                    className={`font-medium ${
                      isMobile ? 'text-base' : 'text-sm'
                    }`}
                  >
                    Start Date
                  </label>
                  <DatePicker
                    selected={filters.startDate}
                    onChange={(date) =>
                      setFilters({ ...filters, startDate: date })
                    }
                    className={`border rounded w-full ${
                      isMobile ? 'p-3 text-base' : 'p-2 text-sm'
                    }`}
                    placeholderText='Select start date'
                    dateFormat='yyyy-MM-dd'
                  />
                  <label
                    className={`font-medium ${
                      isMobile ? 'text-base' : 'text-sm'
                    }`}
                  >
                    End Date
                  </label>
                  <DatePicker
                    selected={filters.endDate}
                    onChange={(date) =>
                      setFilters({ ...filters, endDate: date })
                    }
                    className={`border rounded w-full ${
                      isMobile ? 'p-3 text-base' : 'p-2 text-sm'
                    }`}
                    placeholderText='Select end date'
                    dateFormat='yyyy-MM-dd'
                  />
                </div>
              </div>
            )}

            {type === 'sort' && (
              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <label
                    className={`font-medium ${
                      isMobile ? 'text-base' : 'text-sm'
                    }`}
                  >
                    Sort Field
                  </label>
                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className={`border rounded w-full ${
                      isMobile ? 'p-3 text-base' : 'p-2 text-sm'
                    }`}
                  >
                    <option value=''>Select Field</option>
                    <option value='date'>Date</option>
                    <option value='amount'>Amount</option>
                    <option value='balance'>Balance</option>
                  </select>
                </div>

                <div className='flex flex-col gap-2'>
                  <label
                    className={`font-medium ${
                      isMobile ? 'text-base' : 'text-sm'
                    }`}
                  >
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={`border rounded w-full ${
                      isMobile ? 'p-3 text-base' : 'p-2 text-sm'
                    }`}
                  >
                    <option value='desc'>Descending</option>
                    <option value='asc'>Ascending</option>
                  </select>
                </div>
              </div>
            )}

            <div
              className={`flex gap-2 mt-6 ${
                isMobile ? 'flex-col' : 'justify-end'
              }`}
            >
              <button
                onClick={resetAll}
                className={`${
                  isMobile ? 'py-3 px-4 text-base w-full' : 'py-2 px-3 text-sm'
                } bg-gray-200 rounded hover:bg-gray-300`}
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className={`${
                  isMobile ? 'py-3 px-4 text-base w-full' : 'py-2 px-4 text-sm'
                } bg-blue-600 text-white rounded hover:bg-blue-700`}
              >
                Apply
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSortModal;
