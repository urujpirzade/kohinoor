'use client';
import { EventSchema } from '@/schema/schema';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FormModal from '@/components/dashboard/FormModal';
import { useSession } from 'next-auth/react';
import { formatCurrency, formatTime12hr } from '@/lib/validate';

// --- Improved Event Snapshot Component ---
interface ModernEventSnapshotProps {
  data: EventSchema;
  formatTime12hr: (time: string | undefined) => string;
  formatCurrency: (amount: number | undefined) => string;
}

function ModernEventSnapshot({
  data,
  // formatTime12hr,
  formatCurrency,
}: ModernEventSnapshotProps) {
  if (!data) return null;

  // Format date and time
  const eventDate = new Date(data.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const weekday = new Date(data.date).toLocaleDateString('en-IN', {
    weekday: 'long',
  });

  const startTime = data.start_time ? formatTime12hr(data.start_time) : '-';
  const endTime = data.end_time ? formatTime12hr(data.end_time) : '-';

  // Format payment data
  const totalAmount = formatCurrency(data.amount);
  const advancePaid = formatCurrency(data.advance);
  const balanceDue = formatCurrency(data.balance);

  // Calculate percentage paid
  const percentPaid = Math.round((data.advance / data.amount) * 100);
  const hall =
    data.hall === 'mainHall' ? 'Main Hall' : 'Open Party Hall (Hall No.2)';

  return (
    <div className='bg-white rounded-2xl overflow-hidden border border-gray-100  '>
      {/* Event Type Banner - Improved with more elegant gradient */}
      <div className='bg-[#f9fafb] border border-[#d1d5db] p-3 rounded-md ml-4 mr-4 print:bg-gray-50 print:border-gray-300 print:p-2 print:ml-0 print:mr-0'>
        <div className='flex justify-between items-start  print:gap-2'>
          <div className='print:w-full'>
            <h3 className='text-xl font-semibold text-[#1f2937] print:text-base '>
              {data.event_name || 'Event'}
            </h3>
            <div>
              <p className='text-3xl font-bold text-purple-700 print:text-xl'>
                {eventDate}
              </p>
              <div className='flex items-center gap-2 print:gap-1'>
                <p className='text-xl text-gray-600 font-medium tracking-wide print:text-sm '>
                  {weekday}:
                </p>
                <p className='text-xl text-purple-700 font-medium tracking-wide print:text-sm '>
                  {startTime} to {endTime}
                </p>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2 bg-[#e0e7ff] text-[#3730a3] font-medium px-3 py-1 rounded-md border border-[#c7d2fe] text-xl print:bg-gray-100 print:border-gray-400 print:text-base print:px-2 print:py-1  print:self-start'>
            <span className='w-2 h-2 rounded-full bg-[#4ade80] '></span>
            {hall}
          </div>
        </div>
      </div>

      {/* Event Details */}

      <div className='p-4'>
        {/* Date & Time - Redesigned with better visual elements */}

        {/* Client Information Section - Enhanced with better spacing and layout */}
        <div className='bg-gradient-to-r from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-sm space-y-4 hover:shadow-md transition-all duration-300 print:bg-indigo-50 print:border print:border-gray-300 print:p-4 print:space-y-2 print:shadow-none'>
          <div className='flex items-center border-b border-indigo-200 pb-3 print:pb-2 print:border-b print:border-gray-300'>
            <div className='bg-indigo-100 p-2 rounded-lg mr-3 print:p-1.5'>
              <svg
                className='h-5 w-5 text-indigo-600 print:h-4 print:w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-indigo-900 print:text-base print:text-black'>
              <span className='text-lg font-medium text-gray-800 print:text-sm'>
                {data.client_name.toUpperCase() || '—'}
              </span>
            </h3>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 print:grid-cols-2'>
            <div className='space-y-5 print:space-y-2'>
              <div>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block  print:text-2xs print:mb-0.5'>
                  Contact Number
                </span>
                <span className='text-base text-gray-700 print:text-sm'>
                  {data.contact || '—'}
                </span>
              </div>
              <div>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block print:text-2xs print:mb-0.5'>
                  Reference By
                </span>
                <span className='text-base text-gray-700 print:text-sm'>
                  {data.reference || '—'}
                </span>
              </div>
              <div className='block print:hidden'>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block '>
                  Email Address
                </span>
                <span className='text-base text-gray-700 print:text-xs'>
                  {data.email || '—'}
                </span>
              </div>
            </div>

            <div className='space-y-5 print:space-y-2'>
              <div>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block  print:text-2xs print:mb-0.5'>
                  Booking Date
                </span>
                <span className='text-base text-gray-700 print:text-sm'>
                  {data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        year: 'numeric',
                        month: 'long',
                      })
                    : 'N/A'}
                </span>
              </div>
              <div>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block print:text-2xs print:mb-0.5'>
                  Address
                </span>
                <span className='text-base text-gray-700 print:text-xs'>
                  {data.address || '—'}
                </span>
              </div>
              <div className='block print:hidden'>
                <span className='text-sm font-semibold text-violet-600 uppercase tracking-wider block '>
                  Booking Taken By
                </span>
                <span className='text-base text-gray-700 print:text-xs'>
                  {data.bookingBy || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section - Improved with more visual interest */}
        <div className='mt-4'>
          <div className='bg-gradient-to-br from-indigo-50 to-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 print:bg-gray-50 print:border print:border-gray-200 print:p-3'>
            <h4 className='text-lg font-semibold text-gray-700 mb-2 flex items-center print:text-sm '>
              <svg
                className='h-5 w-5 mr-2 text-indigo-600 print:h-4 print:w-4'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Services Included
            </h4>
            <ul className='space-y-2 list-disc list-inside text-base text-gray-700'>
              {data.hallHandover && (
                <li>
                  Hall No.2 cum dining hall for Engagement/Haldi (1 day before
                  after 7 PM)
                </li>
              )}
              {data.decoration && <li>Decoration Included</li>}
              {data.catering && <li>Catering Included</li>}
              {data.kitchen && (
                <li>Kitchen access one day before event after 7pm</li>
              )}

              <li> {data.details || 'No additional details provided.'}</li>
              {/* <li>
                {`evening program: kitchen access will be provided on the same day of the event after 12 PM`}
              </li> */}
            </ul>
          </div>
        </div>

        {/* Payment Summary - Enhanced with interactive elements */}
      </div>
      <div className='bg-white p-2 shadow-md border border-gray-100 overflow-hidden print:shadow-none'>
        {/* Header */}

        {/* Content */}
        <div className='p-5 print:p-3'>
          {/* Progress Bar */}
          <div className='mb-5 print:mb-2'>
            <div className='flex  justify-between items-center mb-1'>
              <h4 className='text-xl text-emerald-600 font-semibold flex items-center'>
                <svg
                  className='h-5 w-5 mr-2'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'
                  />
                </svg>
                Payment Details
              </h4>
              <span className='text-base font-semibold text-emerald-600'>
                {percentPaid}% Paid
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2.5 overflow-hidden'>
              <div
                className='bg-emerald-500 h-2.5 rounded-full transition-all duration-500'
                style={{ width: `${percentPaid}%` }}
              ></div>
            </div>
          </div>

          {/* Payment Cards */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='bg-gray-50 rounded-lg p-4 border border-gray-100 print:p-2'>
              <p className='text-sm font-medium text-gray-500 mb-1'>
                Total Amount
              </p>
              <p className='text-xl font-bold text-gray-800 print:text-base'>
                {totalAmount}
              </p>
            </div>

            <div className='bg-emerald-50 rounded-lg p-4 border border-emerald-100 print:p-2 print:border-gray-200'>
              <p className='text-sm font-medium text-emerald-600 mb-1'>
                Amount Paid
              </p>
              <p className='text-xl font-bold text-emerald-600 print:text-base'>
                {advancePaid}
              </p>
            </div>

            <div className='bg-amber-50 rounded-lg p-4 border border-amber-100 print:p-2 print:border-gray-200'>
              <p className='text-sm font-medium text-amber-600 mb-1'>
                Balance Due
              </p>
              <p className='text-xl font-bold text-amber-600 print:text-base'>
                {balanceDue}
              </p>
              <p className='text-sm text-amber-500 mt-1'>Due before event</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Component Definition ---
const EventView = () => {
  const [data, setData] = useState<EventSchema>();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const { data: session } = useSession();

  useEffect(() => {
    setRole(session?.user?.role || '');
    setLoading(true);
    fetch(`/api/event/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch event data');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching event:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [id, session?.user?.role]);

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
          Event Data Not Found
        </h3>
        <p className='text-red-600 mb-4'>
          {error || 'Unable to load event information.'}
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

  const handlePrint = () => {
    window.print();
  };

  // const handleEdit = () => {
  //   console.log(data.id);
  //   <FormModal table='booking' type='create' />;
  // };

  return (
    <div className='w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6 print:p-0 print:m-0'>
      {/* Action Bar */}
      <div className='bg-white shadow-md rounded-xl p-4 flex justify-between items-center print:hidden'>
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
            <h2 className='text-lg font-semibold text-gray-800'>
              {data.id} : {data.client_name}
            </h2>
            <p className='text-base text-gray-500'>Manage booking details</p>
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

      {/* Printable Receipt Area */}
      <div
        id='receipt-content'
        className='relative overflow-hidden bg-white shadow-xl rounded-2xl border border-gray-100 p-6 md:p-8 space-y-6 text-gray-800 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:space-y-3'
      >
        {/* Watermark */}
        <div
          aria-hidden='true'
          className='absolute inset-0 -translate-y-30 flex items-center justify-center z-12 pointer-events-none'
          style={{
            color: 'rgba(79, 70, 229, 0.03)',
            fontWeight: 'bold',
            userSelect: 'none',
          }}
        >
          <Image
            src='/logo1.png'
            alt='logo watermark'
            height={300}
            width={300}
            className='opacity-10'
          />
        </div>

        {/* Receipt Content */}
        <div className='relative z-10 space-y-6 print:space-y-3'>
          {/* Modern Header with Gradient */}

          <div className='bg-gradient-to-r from-rose-50 via-purple-100 to-pink-50 rounded-xl border border-teal-200 shadow-md'>
            <div className='grid grid-cols-2 items-center py-1'>
              {/* Left Side - Logo & Title */}
              <div className='flex flex-col justify-start'>
                <div className='relative'>
                  <div className='absolute inset-0  rounded-full blur-sm opacity-60'></div>
                  <Image
                    src='/logo_water.png'
                    alt='logo'
                    height={150}
                    width={400}
                    className='relative rounded-full pl-2'
                  />
                </div>
              </div>

              {/* Right Side - Contact Info */}
              <div className='flex items-end justify-center gap-3'>
                <div className='hidden md:block h-16 w-px bg-gradient-to-b from-transparent via-black to-transparent'></div>

                <div className=''>
                  <div className='flex  flex-col '>
                    <span className='text-black text-xl font-medium'>
                      Booking: 7559202911
                    </span>

                    <span className='text-black text-xl font-medium'>
                      Manager: 7028568682
                    </span>
                  </div>
                  <p className='text-lg text-black'>
                    Baslegaon Road, Opposite Lokmangal Plots
                  </p>
                  <p className='text-lg text-black'>
                    Akkalkot, district Solapur, Mh 413216
                  </p>
                </div>
              </div>
            </div>

            {/* Optional decorative elements */}
            <div className='absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-bl-xl opacity-40 -z-10'></div>
            <div className='absolute bottom-0 left-0 h-12 w-12 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-tr-xl opacity-40 -z-10'></div>
          </div>

          {/* Enhanced Receipt Title with Ornamental Design */}
          <div className='text-center my-8 print:my-4'>
            <div className='flex items-center justify-center'>
              <div className='flex-grow h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent max-w-xs print:via-amber-600'></div>
              <svg
                className='h-8 w-8 mx-3 text-amber-700 print:h-6 print:w-6'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              >
                <path d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' />
              </svg>
              <h2 className='text-3xl font-semibold mx-3 text-amber-800 print:text-xl'>
                Venue Booking Receipt
              </h2>
              <svg
                className='h-8 w-8 mx-3 text-amber-700 print:h-6 print:w-6'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              >
                <path d='M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z' />
              </svg>
              <div className='flex-grow h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent max-w-xs print:via-amber-600'></div>
            </div>
          </div>

          {/* Render the Modern Event Snapshot Component */}
          <ModernEventSnapshot
            data={data}
            formatTime12hr={formatTime12hr}
            formatCurrency={formatCurrency}
          />

          {/* Footer with Signature */}
          <div className='flex flex-col md:flex-row justify-between items-end border-t border-gray-200 pt-4 print:pt-3 print:border-t print:border-gray-300 print:flex-row'>
            <div className='flex flex-col items-start mb-4 md:mb-0 print:mb-0'>
              <div className='text-xs text-gray-500 print:text-2xs'>
                <p>
                  Generated:{' '}
                  {new Date().toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* QR Codes Row */}
              <div className='mt-2 flex flex-row gap-8 space-x-4'>
                {/* Payment QR */}
                <div className='flex flex-col items-center'>
                  <div className='bg-gradient-to-br from-gray-100 to-gray-50 h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200  print:bg-gray-100 print:items-start'>
                    <Image
                      src='/pay2.png'
                      alt='Payment'
                      width={48}
                      height={48}
                      className=' h-14 w-14 print:h-12 print:w-12'
                    />
                  </div>
                  <Image
                    src='/upi.png'
                    alt='Payment'
                    width={94}
                    height={32}
                    className='h-6 w-22'
                  />
                </div>

                {/* Google Maps QR */}
                {/* <div className='flex flex-col items-center'>
                  <div className='bg-gradient-to-br from-gray-100 to-gray-50 h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200 print:h-12 print:w-12 print:bg-gray-100'>
                    <Image
                      src='/map.png'
                      alt='Google Maps'
                      width={48}
                      height={48}
                      className='h-14 w-14 print:h-12 print:w-12'
                    />
                  </div>
                  <span className='text-2xs text-gray-600 mt-1 print:text-3xs'>
                    Location
                  </span>
                </div> */}

                {/* WhatsApp QR */}
                {/* <div className='flex flex-col items-center'>
                  <div className='bg-gradient-to-br from-gray-100 to-gray-50 h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200 print:h-12 print:w-12 print:bg-gray-100'>
                    <Image
                      src='/whatsapp.png'
                      alt='WhatsApp'
                      width={48}
                      height={48}
                      className='h-14 w-14 print:h-12 print:w-12'
                    />
                  </div>
                  <span className='text-2xs text-gray-600 mt-1 print:text-3xs'>
                    WhatsApp
                  </span>
                </div> */}

                {/* Instagram QR */}
                <div className='flex flex-col items-center'>
                  <div className='bg-gradient-to-br from-gray-100 to-gray-50 h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200  print:bg-gray-100'>
                    <Image
                      src='/insta.png'
                      alt='Instagram'
                      width={48}
                      height={48}
                      className='h-14 w-14 print:h-12 print:w-12'
                    />
                  </div>
                  <Image
                    src='/ig.png'
                    alt='Instagram'
                    width={120}
                    height={32}
                    className='h-5 w-20 mt-1'
                  />
                </div>

                {/* Scube Profile QR */}
                {/* <div className='flex flex-col items-center'>
                  <div className='bg-gradient-to-br from-gray-100 to-gray-50 h-16 w-16 flex items-center justify-center rounded-lg border border-gray-200 print:h-12 print:w-12 print:bg-gray-100'>
                    <Image
                      src='/scube.png'
                      alt='Scube Profile'
                      width={48}
                      height={48}
                      className='h-14 w-14 print:h-12 print:w-12'
                    />
                  </div>
                  <span className='text-2xs text-gray-600 mt-1 print:text-3xs'>
                    Profile
                  </span>
                </div> */}
              </div>
            </div>
            <div className='text-sm font-semibold text-blue-500'>
              <span className='text-red-500  text-xl'>*</span> नियम व अटी कृपया
              पान उलटा.
            </div>
            <div className='text-right'>
              <div className='border-t-2 border-black px-16 py-1 mb-1 print:border-t print:border-gray-600 print:px-12 print:pt-0 print:pb-1'>
                <span className='block h-6 print:h-4'></span>
              </div>
              <span className='font-medium text-gray-600 text-base print:text-xs print:text-black'>
                Authorized Signature with Stamp
              </span>
            </div>
          </div>
          <div className='hidden print:block print:page-break-before-always bg-white rounded-lg shadow-lg shadow-gray-400 border border-gray-100 overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-yellow-100 via-orange-100 to-amber-100 text-amber-900 p-3'>
              <h4 className='font-semibold flex items-center text-lg'>
                <svg
                  className='h-4 w-4 mr-2 opacity-70'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                  <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                </svg>
                नियम व अटी
              </h4>
            </div>

            {/* Content */}
            <div className='p-5'>
              <ol className='space-y-3'>
                <li className='flex items-baseline'>
                  <span className='text-base font-semibold text-gray-500 mr-3'>{`0१)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    बुकींग करताना आधार कार्ड अनिवार्य आहे.
                  </p>
                </li>

                <li className='flex items-baseline '>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`02)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    संपुर्ण रक्कम जमा केल्यावर कार्यक्रमासाठी हॉल ताब्यात
                    देण्यात येईल.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0३)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    हॉल, लॉन व कंपाऊंड मध्ये डॉल्बी, डी. जे. व बॅन्जो लावू दिले
                    जाणार नाही.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0४)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    मध्यपान व धुम्रपानास सक्त मनाई आहे.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0५)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    फटाके, दारूगोळा ई. हॉल, लॉन व कंपाऊंड मध्ये वापरण्यास मनाई
                    आहे.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0६)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    तुमच्या मौल्यवान वस्तुंची पुर्ण जबाबदारी तुमच्या स्वतःची
                    राहील.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0७)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    हॉल व लॉन कार्यक्रमाच्या दिवशी संध्या. ४.०० मि. पर्यंत
                    रिकामा करून देणे बंधनकारक राहील.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0८)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    बुकींग कॅन्सल झाल्यास अॅडव्हान्स रक्कम परत मिळणार नाही.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`0९)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    तारीख बदलल्यास किंवा रद्द केल्यास ५००० रुपये अॅडव्हान्स
                    रक्कमेतून वजा केले जातील.
                  </p>
                </li>

                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`१0)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    बुकिंग करताना ५००० रुपये ठेव अनिवार्य आहे,जर नुकसान झाले तर
                    रक्कम वजा केली जाईल.
                  </p>
                </li>
                <li className='flex items-baseline'>
                  <span className='text-base tracking-wider font-semibold text-gray-500 mr-3'>{`११)`}</span>
                  <p className='text-base tracking-wider text-gray-900'>
                    संध्याकाळचा कार्यक्रम: कार्यक्रमाच्या त्याच दिवशी दुपारी १२
                    नंतर स्वयंपाकघरात प्रवेश दिला जाईल
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* --- End of receipt-content --- */}
      {/* --- Action Buttons (Edit and Print) --- */}
      <div className='flex justify-center items-center space-x-4 mt-6 print:hidden'>
        {' '}
        {/* Added print:hidden */}
        {/* Edit Button */}
        {(role === 'ADMIN' || role === 'ROOT') && (
          <FormModal table='booking' type='update' data={data} id={data.id} />
        )}
        {/* Print Button */}
        <button
          onClick={handlePrint}
          className='bg-yellow-700 hover:bg-yellow-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out flex items-center'
          aria-label='Print receipt'
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
              d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
            />
          </svg>
          Print Receipt
        </button>
      </div>
      {/* --- Global Print Styles --- */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait; /* Set to standard A4 paper size */
            margin: 0.5cm; /* Reduced margin for more content space */
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            background-color: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }

          /* Hide all elements by default */
          body * {
            visibility: hidden;
          }

          /* Make only the receipt container and its children visible */
          #receipt-content,
          #receipt-content * {
            visibility: visible !important;
          }

          /* Hide elements marked with print:hidden */
          .print\\:hidden {
            display: none !important;
          }

          /* Style the main receipt container for printing */
          #receipt-content {
            position: relative;
            left: 0;
            top: 0;
            width: 100%;
            height: auto; /* Allow content to flow */
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            font-size: 10.5pt !important; /* Increased base font for print */
            line-height: 1.4 !important;
            color: #000 !important;
            background-color: #fff !important;
            overflow: visible !important; /* Show all content */
          }

          #receipt-content > div[aria-hidden='true'] img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          /* Ensure color backgrounds print properly */
          .bg-gradient-to-r,
          .bg-gradient-to-br,
          .bg-yellow-50,
          .bg-gray-50,
          .bg-yellow-100 {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Ensure content stays above watermark */
          #receipt-content > div.relative.z-10 {
            /* Changed z-20 to z-10 */
            position: relative !important;
            z-index: 10 !important; /* Needs to be higher than watermark's z-0 */
            padding: 0 !important; /* Remove extra padding for print */
          }

          /* Remove horizontal padding to fix left margin issue */
          .p-4,
          .p-6,
          .p-8,
          .px-4,
          .px-6,
          .px-8 {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }

          /* Fix QR code containers */
          #receipt-content img {
            max-width: 100% !important;
            height: auto !important;
            object-fit: contain !important;
          }

          /* Fix QR code parent containers */
          #receipt-content .flex.flex-row,
          #receipt-content .flex.flex-col {
            flex-shrink: 0 !important;
            width: auto !important;
            max-width: none !important;
          }

          /* Fix hall name container stretching */
          #receipt-content .flex.items-center.gap-2,
          #receipt-content .bg-\\[\\#e0e7ff\\] {
            flex-shrink: 0 !important;
            width: auto !important;
            max-width: fit-content !important;
            white-space: nowrap !important;
          }

          /* Fix specific component spacing and layout issues */

          /* QR code container - keep it compact */
          #receipt-content .flex.flex-row.gap-8 {
            gap: 1rem !important;
          }

          /* Hall name container - don't let it take full space */
          #receipt-content .flex.items-center.gap-2.bg-\\[\\#e0e7ff\\] {
            width: auto !important;
            flex-shrink: 0 !important;
            white-space: nowrap !important;
          }

          /* Contact and address component - add proper margins */
          #receipt-content .bg-gradient-to-r.from-indigo-50 {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          /* Services included component - add proper margins */
          #receipt-content .bg-gradient-to-br.from-indigo-50 {
            margin-left: 1rem !important;
            margin-right: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          /* Rules and regulations - improve spacing */
          #receipt-content .space-y-3 > * + * {
            margin-top: 0.75rem !important;
          }

          #receipt-content ol.space-y-3 li {
            margin-bottom: 0.75rem !important;
          }

          /* Simple page break only for rules */
          .hidden.print\\:block {
            display: block !important;
            page-break-before: always !important;
          }

          /* Basic page setup */
          @page {
            size: A4 portrait;
            margin: 0.5cm;
          }

          /* Let global CSS handle the positioning */
          #receipt-content {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Aggressively hide all dashboard layout elements */
          .h-screen > div:first-child,
          .sidebar-mobile,
          .sidebar-overlay,
          nav,
          .bg-white.z-50 {
            display: none !important;
            visibility: hidden !important;
          }

          /* Hide sidebar by targeting common sidebar classes */
          .w-\\[14\\%\\],
          .w-\\[8\\%\\],
          .w-\\[16\\%\\],
          .xl\\:w-\\[14\\%\\],
          .lg\\:w-\\[16\\%\\],
          .md\\:w-\\[8\\%\\] {
            display: none !important;
            visibility: hidden !important;
          }

          /* Reset all parent containers to use full width */
          body,
          html,
          #__next,
          #__next > div,
          .h-screen,
          .flex,
          .w-full,
          .max-w-4xl {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }

          /* Specifically target the main container that has the max-width constraint */
          .w-full.max-w-4xl.mx-auto {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }

          /* Hide elements marked with print:hidden */
          .print\\:hidden {
            display: none !important;
          }

          /* Only prevent page breaks where necessary */
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }

          /* Ensure borders specified for print appear */
          .print\\:border {
            border-width: 1px;
          }
          .print\\:border-t {
            border-top-width: 1px;
          }
          .print\\:border-b {
            border-bottom-width: 1px;
          }
          .print\\:border-gray-300 {
            border-color: #d1d5db;
          } /* Example gray */

          /* Force black text where needed for clarity */
          .print\\:text-black {
            color: #000 !important;
          }

          /* Reduce margins/padding for print */
          .print\\:mb-1 {
            margin-bottom: 0.25rem;
          }
          .print\\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .print\\:mb-3 {
            margin-bottom: 0.75rem;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem;
          }
          .print\\:mt-0 {
            margin-top: 0;
          }
          .print\\:p-0 {
            padding: 0;
          }
          .print\\:p-2 {
            padding: 0.5rem;
          }
          .print\\:p-3 {
            padding: 0.75rem;
          }
          .print\\:p-4 {
            padding: 1rem;
          }
          .print\\:pt-4 {
            padding-top: 1rem;
          }
          .print\\:pb-4 {
            padding-bottom: 1rem;
          }

          /* Specific print font sizes */
          .print\\:text-2xs {
            font-size: 0.75rem;
            line-height: 1rem;
          } /* ~9pt */
          .print\\:text-xs {
            font-size: 0.875rem;
            line-height: 1.25rem;
          } /* ~10.5pt */
          .print\\:text-sm {
            font-size: 1rem;
            line-height: 1.5rem;
          } /* ~12pt */
          .print\\:text-base {
            font-size: 1.125rem;
            line-height: 1.75rem;
          } /* ~13.5pt */
          .print\\:text-lg {
            font-size: 1.25rem;
            line-height: 1.75rem;
          } /* ~15pt */
          .print\\:text-xl {
            font-size: 1.5rem;
            line-height: 2rem;
          } /* ~18pt */
          .print\\:text-2xl {
            font-size: 1.75rem;
            line-height: 2.25rem;
          } /* ~21pt */
        }
      `}</style>
    </div> // --- End of main component container ---
  );
};

export default EventView;
