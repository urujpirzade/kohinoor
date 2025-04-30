import MonthlyCountChart from './MonthlyCountChart';
import prisma from '@/lib/db';

const MonthlyCountChartContainer = async () => {
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${currentYear}-12-31T23:59:59.999Z`);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      hall: true,
    },
  });

  const monthlyData: { name: string; h1: number; h2: number }[] = Array.from(
    { length: 12 },
    (_, i) => {
      const date = new Date(currentYear, i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return { name: monthName, h1: 0, h2: 0 };
    }
  );

  events.forEach((event: any) => {
    const month = new Date(event.date).getMonth(); // 0 for January, 11 for December
    const hall = event.hall; // Get the hall value

    if (hall === 'mainHall') {
      monthlyData[month].h1++;
    } else if (hall === 'secondHall') {
      monthlyData[month].h2++;
    }
  });

  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='font-semibold text-lg'>Monthly Booking</h1>
      </div>
      {/* Pass the processed monthlyData to the chart component */}
      <MonthlyCountChart data={monthlyData} />
    </div>
  );
};

export default MonthlyCountChartContainer;
