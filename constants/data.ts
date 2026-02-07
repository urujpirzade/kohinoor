export const MenuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: '/home.png',
        label: 'Home',
        href: '/dashboard',
      },

      {
        icon: '/book.png',
        label: 'Booking',
        href: '/booking',
      },
      {
        icon: '/calendar.png',
        label: 'Calendar',
        href: '/calendar',
      },
    ],
  },
  {
    title: 'PANEL',
    items: [
      {
        icon: '/profile.png',
        label: 'Profile',
        href: '/profile',
      },
      {
        icon: '/employee.png',
        label: 'Employee',
        href: '/employee',
      },
      {
        icon: '/finance.png',
        label: 'Reports',
        href: '/reports',
      },
      {
        icon: '/logout.png',
        label: 'Logout',
        href: '/logout',
      },
    ],
  },
];

export const announcementsData = [
  {
    id: 1,
    title: 'About 4A Math Test',
    class: '4A',
    date: '2025-04-04',
  },
];

export type BookingEvent = {
  title: string;
  hall: 'mainHall' | 'secondHall';
  start: Date;
  end: Date;
};
export const calendarEvents: BookingEvent[] = [
  {
    title: 'Wedding',
    hall: 'mainHall',
    start: new Date(2025, 3, 15, 8, 0),
    end: new Date(2025, 3, 15, 12, 45),
  },
  {
    title: 'Farewell',
    hall: 'secondHall',
    start: new Date(2025, 3, 15, 18, 0),
    end: new Date(2025, 3, 15, 22, 45),
  },
];
