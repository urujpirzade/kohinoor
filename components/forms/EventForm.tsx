'use client';

import { eventSchema, EventSchema } from '@/schema/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from './InputField';
import { createEvent, updateEvent } from '@/lib/actions';
import SelectField from './selectField';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import CheckField from './CheckField';
import emailjs from '@emailjs/browser';

import { z } from 'zod';

type Input = z.input<typeof eventSchema>; // the “raw” inputs before defaults/transforms
type Output = z.output<typeof eventSchema>; // the parsed result, your EventSchema
const EventForm = ({
  type,
  data,
}: {
  type: 'create' | 'update';
  data?: Partial<EventSchema>;
}) => {
  const { data: session } = useSession();
  console.log(session?.user.name);

  // Format a Date or string to an ISO date string (YYYY-MM-DD)
  // const formatInitialDate = (date: Date | string | undefined) => {
  //   if (!date) return '';
  //   const d = date instanceof Date ? date : new Date(date);
  //   return d.toISOString().split('T')[0];
  // };

  // Set default values for the form
  const initialValues: Partial<EventSchema> = {
    ...data,
    date: data?.date ? new Date(data.date) : undefined,
    end_time: data?.end_time ?? '16:00',
    start_time: data?.start_time ?? '06:00',
    contact: data?.contact ?? '',
    event_name: data?.event_name ?? '',
    hall: data?.hall ?? 'mainHall',
    amount: data?.amount ?? 0,
    advance: data?.advance ?? 0,
    balance: (data?.amount ?? 0) - (data?.advance ?? 0),

    email: data?.email ?? '',
    address: data?.address ?? '',
    createdAt: data?.createdAt ? new Date(data.createdAt) : new Date(),
    updatedAt: data?.updatedAt ? new Date(data.updatedAt) : new Date(),

    bookingBy: data?.bookingBy ?? session?.user.name ?? '',
    hallHandover: data?.hallHandover ?? false,
    decoration: data?.decoration ?? false,
    catering: data?.catering ?? false,
    kitchen: data?.kitchen ?? false,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    Input, // <-- raw form-input type
    unknown, // <-- resolver context (almost always `any`)
    Output
  >({
    // <-- parsed/output type
    resolver: zodResolver(eventSchema),
    defaultValues: initialValues,
  });

  // const [formErrors, setFormErrors] = useState<string | null>(null);

  const onSubmit = async (data: EventSchema) => {
    console.log('✅ onValidSubmit triggered');
    console.log(data);

    let result;
    if (type === 'create') {
      result = await createEvent(data);
    } else {
      result = await updateEvent(data);
    }

    if (result) {
      toast(`${result.message}`);
    }
    if (result.success) {
      toast(`${result.message}`);
      emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          client_Name: result?.data?.client_name,
          event_name: result?.data?.event_name,
          event_Date: result?.data?.date,
          event_Time: `${result?.data?.start_time} - ${result?.data?.end_time}`,
          hall: result?.data?.hall,
          email: result?.data?.email,
          contact: result.data?.contact,
          booking_Date: result?.data?.createdAt,
          total_Amount: result?.data?.amount,
          Advance_Paid: result?.data?.advance,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };
  const onSubmitHandler = handleSubmit(onSubmit, (errors) => {
    console.log('🚨 Validation Errors:', errors);
  });
  return (
    <form
      onSubmit={onSubmitHandler}
      className='form-container w-full max-w-4xl bg-white shadow-xl rounded-2xl p-4 md:p-8 space-y-6 md:space-y-8'
    >
      {/* Header */}
      <div className='border-b pb-4'>
        <h1 className='text-3xl font-bold text-gray-800'>
          {type === 'create' ? 'Create New Event' : 'Update Event'}
        </h1>
        <p className='text-sm text-gray-500 mt-2'>
          Complete the event details below to{' '}
          {type === 'create' ? 'schedule a new event' : 'modify your event'}.
        </p>
      </div>

      {/* Event Basic Info */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-blue-600 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Event Information
          </h2>
        </div>
        <div className='form-row grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
          <InputField
            label='Client name'
            name='client_name'
            register={register}
            error={errors.client_name}
            placeholder='Enter Client Name'
            required
          />
          <InputField
            label='Event Type'
            name='event_name'
            register={register}
            error={errors.event_name}
            placeholder='Wedding, Birthday, etc.'
            required
          />
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-1 rounded-md p-3 md:p-4 border-lamaPurple'>
          <div className='flex items-center space-x-2'>
            <CheckField
              id='hallHandover'
              label='Hand Over Hall 1 day before?'
              name='hallHandover'
              register={register}
              error={errors.hallHandover}
              className='h-6 w-6'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <CheckField
              id='decoration'
              label='Decoration'
              name='decoration'
              register={register}
              error={errors.decoration}
              className='h-6 w-6'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <CheckField
              id='catering'
              label='Catering'
              name='catering'
              register={register}
              error={errors.catering}
              className='h-6 w-6'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <CheckField
              id='kitchen'
              label='Only Kitchen'
              name='kitchen'
              register={register}
              error={errors.kitchen}
              className='h-6 w-6'
            />
          </div>
        </div>
      </div>

      {/* Time & Location */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-green-500 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>Date & Time</h2>
        </div>
        <div className='form-row grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
          <InputField
            label='Date'
            name='date'
            type='date'
            register={register}
            error={errors.date}
            required
            helperText='Select event date'
          />
          <SelectField
            label='Hall'
            name='hall'
            register={register}
            error={errors.hall}
            placeholder='Select hall'
            required
          />
          <InputField
            label='Start Time'
            name='start_time'
            type='time'
            register={register}
            error={errors.start_time}
            helperText='Format: HH:MM (24-hour)'
            required
          />
          <InputField
            label='End Time'
            name='end_time'
            type='time'
            register={register}
            error={errors.end_time}
            helperText='Format: HH:MM (24-hour)'
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-amber-500 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Contact Information
          </h2>
        </div>
        <div className='form-row grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
          <InputField
            label='Email'
            name='email'
            type='email'
            register={register}
            error={errors.email}
            placeholder='contact@example.com'
          />
          <InputField
            label='Contact Number'
            name='contact'
            register={register}
            error={errors.contact}
            placeholder='Phone number'
            required
          />
        </div>
        <div className='sm:col-span-2'>
          <InputField
            label='Address'
            name='address'
            register={register}
            error={errors.address}
            placeholder='Client address'
          />
        </div>
        <div className='sm:col-span-2'>
          <InputField
            label='Reference'
            name='reference'
            register={register}
            error={errors.reference}
            placeholder='Referenced By'
          />
        </div>
      </div>

      {/* Financial Details */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-purple-500 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Financial Details
          </h2>
        </div>
        <div className='form-row grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
          <InputField
            label='Total Amount'
            name='amount'
            type='number'
            register={register}
            error={errors.amount}
            placeholder='0'
            valueAsNumber
            required
          />
          <InputField
            label='Advance Payment'
            name='advance'
            type='number'
            register={register}
            error={errors.advance}
            placeholder='0'
            valueAsNumber
            required
          />
        </div>
      </div>

      {/* Additional Details */}
      <div className='space-y-6'>
        <div className='flex items-center gap-2'>
          <div className='h-6 w-1 bg-red-500 rounded-full'></div>
          <h2 className='text-xl font-semibold text-gray-700'>
            Additional Details
          </h2>
        </div>
        <div className='grid grid-cols-1 gap-6'>
          <InputField
            label='Special Requirements'
            name='details'
            register={register}
            error={errors.details}
            placeholder='Any special requirements or notes'
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className='pt-4 md:pt-6 border-t'>
        <div className='flex flex-col sm:flex-row justify-end gap-3 md:gap-4'>
          <button
            onClick={() => window.location.reload()}
            type='button'
            className='btn-mobile px-6 py-3 md:py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition order-2 sm:order-1'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-mobile px-8 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 order-1 sm:order-2'
          >
            {isSubmitting && (
              <svg
                className='animate-spin h-5 w-5 text-white'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
            )}
            {type === 'create' ? 'Create Event' : 'Update Event'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventForm;
