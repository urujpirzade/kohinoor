'use client';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MonthlyCountChart = ({
  data,
}: {
  data: { name: string; h1: number; h2: number }[];
}) => {
  return (
    <ResponsiveContainer width='100%' height='90%'>
      <BarChart width={500} height={300} data={data} barSize={20}>
        <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#ddd' />
        <XAxis dataKey='name' axisLine={false} tickLine={false} />
        <YAxis axisLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }}
        />
        <Legend
          align='left'
          verticalAlign='top'
          wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
        />
        <Bar
          dataKey='h1'
          fill='gold'
          activeBar={<Rectangle fill='#fae27c' stroke='blue' />}
          legendType='circle'
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey='h2'
          fill='skyblue'
          activeBar={<Rectangle fill='#c3ebfa' stroke='purple' />}
          legendType='circle'
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
export default MonthlyCountChart;
