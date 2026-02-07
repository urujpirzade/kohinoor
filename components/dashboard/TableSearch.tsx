'use client';
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const TableSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    params.set('search', value);
    router.push(`${pathname}?${params}`);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='w-full md:w-auto flex items-center  gap-2 text-xs rounded-full ring-[1.5px] ring-gray-500 px-2'
    >
      <Image src='/search.png' alt='search' width={14} height={14} />
      <input
        className='outline-none width-[200px] p-2 bg-transparent'
        type='text'
        placeholder='Search...'
      />
    </form>
  );
};
export default TableSearch;
