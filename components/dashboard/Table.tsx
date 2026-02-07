'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

const Table = <T,>({
  columns,
  renderRow,
  renderMobileCard,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: T) => React.ReactNode;
  renderMobileCard?: (item: T) => React.ReactNode;
  data: T[];
}) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render desktop table during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className='table-container'>
        <table className='w-full m-4'>
          <thead>
            <tr className='text-left text-gray-500 text-sm'>
              {columns.map((col) => (
                <th key={col.accessor} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map((item) => renderRow(item))}</tbody>
        </table>
      </div>
    );
  }

  if (isMobile) {
    // Mobile card view
    return (
      <div className='space-y-4 p-4'>
        {data.map((item, index) => (
          <div
            key={index}
            className='card-mobile bg-white rounded-lg shadow-sm border p-4'
          >
            {renderMobileCard ? renderMobileCard(item) : renderRow(item)}
          </div>
        ))}
      </div>
    );
  }

  // Desktop table view
  return (
    <div className='table-container'>
      <table className='w-full m-4'>
        <thead>
          <tr className='text-left text-gray-500 text-sm'>
            {columns.map((col) => (
              <th key={col.accessor} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item) => renderRow(item))}</tbody>
      </table>
    </div>
  );
};

export default Table;
