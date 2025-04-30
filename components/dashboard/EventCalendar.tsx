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
      router.push(`?date=${value.toLocaleDateString()}`);
    }
  }, [value, router]);
  return <Calendar onChange={onChange} value={value} />;
};
export default EventCalendar;
