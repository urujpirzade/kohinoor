'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { ITEM_PER_PAGE } from '@/lib/settings';

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * page < count;
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <div className='p-4 flex items-center gap-2 justify-between text-gray-500'>
      <Button
        disabled={!hasPrev}
        className='bg-lamaPurple hover:bg-lamaSky'
        onClick={() => changePage(page - 1)}
      >
        Prev
      </Button>
      <div className='flex items-center gap-2'>
        {Array.from(
          { length: Math.ceil(count / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <Button
                key={pageIndex}
                className={`px-2  rounded-sm ${
                  page === pageIndex
                    ? 'bg-lamaSky hover:bg-lamaSky'
                    : 'bg-lamaPurple hover:bg-lamaSky/60'
                }`}
                onClick={() => changePage(pageIndex)}
              >
                {pageIndex}
              </Button>
            );
          }
        )}
      </div>
      <Button
        disabled={!hasNext}
        className='bg-lamaPurple hover:bg-lamaSky'
        onClick={() => changePage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};
export default Pagination;
