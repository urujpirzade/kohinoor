'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const router = useRouter();
  const [value, onChange] = useState<Value>(new Date());

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
  return <Calendar onChange={onChange} value={value} />;
};
export default EventCalendar;
