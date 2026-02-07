'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useIsMobile } from '@/hooks/use-mobile';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const router = useRouter();
  const [value, onChange] = useState<Value>(null);
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsClient(true);
    onChange(new Date());
  }, []);

  useEffect(() => {
    if (value instanceof Date) {
      const istFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const parts = istFormatter.formatToParts(value);
      const year = parts.find((p) => p.type === 'year')?.value;
      const month = parts.find((p) => p.type === 'month')?.value;
      const day = parts.find((p) => p.type === 'day')?.value;

      const istDate = `${year}-${month}-${day}`;
      router.push(`?date=${istDate}`);
    }
  }, [value, router]);

  if (!isClient) {
    return <div className='h-64 bg-gray-100 animate-pulse rounded'></div>;
  }

  return (
    <div className='w-full'>
      <Calendar
        onChange={onChange}
        value={value}
        className={`
          w-full border-none font-sans
          ${isMobile ? 'text-sm' : ''}
        `}
        tileClassName={() => {
          return isMobile ? 'mobile-calendar-tile' : '';
        }}
        navigationLabel={({ label }) => (
          <span
            className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}
          >
            {label}
          </span>
        )}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={!isMobile}
      />

      <style jsx global>{`
        .mobile-calendar-tile {
          height: 32px !important;
          font-size: 12px !important;
          padding: 2px !important;
        }

        @media (max-width: 768px) {
          .react-calendar {
            font-size: 12px !important;
          }

          .react-calendar__navigation button {
            min-width: 32px !important;
            height: 32px !important;
            font-size: 12px !important;
          }

          .react-calendar__month-view__weekdays {
            font-size: 11px !important;
          }

          .react-calendar__month-view__weekdays__weekday {
            padding: 4px !important;
          }

          .react-calendar__tile {
            height: 32px !important;
            font-size: 11px !important;
            padding: 2px !important;
          }

          .react-calendar__tile--active {
            font-weight: 600 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventCalendar;
