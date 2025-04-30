'use client';
import Image from 'next/image';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Total',
    count: 106,
    fill: 'white',
  },
  {
    name: 'Main Hall',
    count: 53,
    fill: '#c3ebfa',
  },
  {
    name: '2nd Hall',
    count: 53,
    fill: '#fae27c',
  },
];

const CountChart = () => {
  return (
    <div className='bg-white rounded-xl w-full h-full p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Venue Booked</h1>
      </div>
      <div className='relative w-full h-[75%]'>
        <ResponsiveContainer>
          <RadialBarChart
            cx='50%'
            cy='50%'
            innerRadius='40%'
            outerRadius='100%'
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey='count' />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          src='/maleFemale.png'
          width={32}
          height={32}
          alt='hall'
        />
      </div>

      <div className='flex justify-center gap-16'>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-lamaSky rounded-full' />
          <h1 className='font-bold'>Main Hall</h1>
          <h2 className='text-xs text-gray-300'>55%</h2>
        </div>

        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-lamaYellow rounded-full' />
          <h1 className='font-bold'>2nd Hall</h1>
          <h2 className='text-xs text-gray-300'>35%</h2>
        </div>
      </div>
    </div>
  );
};
export default CountChart;
