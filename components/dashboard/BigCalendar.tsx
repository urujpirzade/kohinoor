'use client';
import {
  Calendar,
  EventProps,
  momentLocalizer,
  View,
  Views,
  SlotInfo,
} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useRef, useEffect } from 'react';
import { Spinner } from './Spinner';

// Start week from Monday
moment.updateLocale('en', {
  week: {
    dow: 1,
  },
});

const localizer = momentLocalizer(moment);

type EventItem = {
  title: string;
  start: Date;
  end: Date;
  hall: string;
  client: string;
};

interface TooltipState {
  visible: boolean;
  event: EventItem | null;
  position: { x: number; y: number };
}

interface BigCalendarProps {
  data: EventItem[];
  isLoading?: boolean;
}

// Hall types and their corresponding colors
const hallTypes = [
  { name: 'mainHall', className: 'hall-exhibition-hall' },
  { name: 'secondHall', className: 'hall-banquet-hall' },
];

const BigCalendar = ({ data, isLoading = false }: BigCalendarProps) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    event: null,
    position: { x: 0, y: 0 },
  });
  const [filteredData, setFilteredData] = useState<EventItem[]>(data);
  const [filterHall, setFilterHall] = useState<string>('');

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter data when hall filter changes
    if (!filterHall) {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((event) => event.hall === filterHall));
    }
  }, [data, filterHall]);

  // Handle event clicking
  const handleSelectEvent = (event: EventItem, e: React.SyntheticEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Set tooltip position and content
    setTooltip({
      visible: true,
      event,
      position: {
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY,
      },
    });

    // Hide tooltip after 3 seconds
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 3000);

    // Drill down to the event's day
    setCurrentDate(event.start);
    setView(Views.DAY);
  };

  // Handle clicking on the background to hide tooltip
  // const handleClickOutside = () => {
  //   setTooltip((prev) => ({ ...prev, visible: false }));
  // };

  // Get the appropriate CSS class for an event based on hall
  const getEventClass = (event: EventItem) => {
    const hallType = hallTypes.find((h) =>
      event.hall.toLowerCase().includes(h.name.toLowerCase())
    );
    return hallType ? hallType.className : 'hall-default';
  };

  // Custom event component
  const EventComponent = ({ event }: EventProps<EventItem>) => (
    <div className={`flex flex-col text-3xl`}>
      <div className='event-title'>{event.title}</div>
      <div className='event-detail '>
        <span>🏛️</span>{' '}
        <h1 className='text-xl'>
          {event.hall === 'mainHall' ? 'Main Hall' : 'Open Party Hall'}
        </h1>
      </div>
      <div className='event-detail'>
        <span>👤</span>
        <h1 className='text-xl'>{event.client}</h1>
      </div>
    </div>
  );

  // Handle slot selection (for future event creation)
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // Set view to day when clicking on a day cell
    if (view === Views.MONTH) {
      setCurrentDate(slotInfo.start);
      setView(Views.DAY);
    } else {
      // Here you would handle event creation in day or week view
      console.log('Selected slot:', slotInfo);
      // In a real app, you might open a modal to create an event
    }
  };

  // Style event based on hall type
  const eventPropGetter = (event: EventItem) => {
    return {
      className: getEventClass(event),
    };
  };

  return (
    <div className='relative' ref={calendarRef}>
      {/* Calendar Legend */}
      <div className='calendar-legend'>
        {hallTypes.map((hall) => (
          <div
            key={hall.name}
            className='legend-item cursor-pointer'
            onClick={() =>
              setFilterHall(filterHall === hall.name ? '' : hall.name)
            }
          >
            <div
              className={`legend-color ${hall.className.replace('hall-', '')}`}
              style={{
                backgroundColor: hall.className.includes('exhibition-hall')
                  ? '#00DFA2'
                  : hall.className.includes('banquet-hall')
                  ? '#ff0060'
                  : '#f1f5f9',
              }}
            />
            <span
              style={{
                fontWeight: filterHall === hall.name ? 'bold' : 'normal',
              }}
            >
              {hall.name}
            </span>
          </div>
        ))}
        {filterHall && (
          <button
            onClick={() => setFilterHall('')}
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className='calendar-loading'>
          <Spinner />
        </div>
      )}

      {/* Calendar Component */}
      <Calendar
        localizer={localizer}
        events={filteredData}
        startAccessor='start'
        endAccessor='end'
        components={{ event: EventComponent }}
        views={['month', 'week', 'day', 'agenda']}
        view={view}
        onView={(v) => setView(v)}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
        style={{ height: 'calc(100vh - 160px)' }}
        min={new Date(2025, 1, 0, 6, 0, 0)}
        max={new Date(2050, 1, 0, 23, 59, 59)}
        onDrillDown={(date) => {
          setCurrentDate(date);
          setView(Views.DAY);
        }}
      />

      {/* Event Tooltip */}
      {tooltip.visible && tooltip.event && (
        <div
          className='event-tooltip'
          style={{
            left: `${tooltip.position.x}px`,
            top: `${tooltip.position.y}px`,
          }}
        >
          <h3 className='font-semibold text-lg mb-2'>{tooltip.event.title}</h3>
          <p className='mb-1'>
            <strong>Date:</strong>{' '}
            {moment(tooltip.event.start).format('MMM DD, YYYY')}
          </p>
          <p className='mb-1'>
            <strong>Time:</strong>{' '}
            {moment(tooltip.event.start).format('h:mm A')} -{' '}
            {moment(tooltip.event.end).format('h:mm A')}
          </p>
          <p className='mb-1'>
            <strong>Hall:</strong>{' '}
            {tooltip.event.hall === 'mainHall'
              ? 'Main Hall'
              : 'Open Party Hall'}
          </p>
          <p className='mb-1'>
            <strong>Client:</strong> {tooltip.event.client}
          </p>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
