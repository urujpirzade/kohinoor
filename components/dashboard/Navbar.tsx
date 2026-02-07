'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  console.log(session?.user);

  if (!session?.user) return null;

  return (
    <div className='nav-mobile flex items-center justify-between p-4 bg-white shadow-sm'>
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
          aria-label='Toggle menu'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      )}

      {/* Desktop Search */}
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-500 px-2'>
        <Image src='/search.png' alt='search' width={14} height={14} />
        <input
          className='outline-none w-[200px] p-2 bg-transparent'
          type='text'
          placeholder='Search...'
          suppressHydrationWarning
        />
      </div>

      {/* Mobile Search Toggle */}
      <button
        onClick={() => setSearchOpen(!searchOpen)}
        className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
        aria-label='Toggle search'
      >
        <Image src='/search.png' alt='search' width={20} height={20} />
      </button>

      {/* User Info */}
      <div className='user-info flex items-center gap-3'>
        <div className='flex flex-col gap-1 text-right'>
          <span className='text-sm md:text-base leading-3 font-medium  max-w-[120px] md:max-w-none'>
            {session.user.name}
          </span>
          <span className='text-xs text-gray-600'>{session.user.role}</span>
        </div>
        {session.user.username == 'pirzade' ? (
          <Image
            src='/uruj.jpg'
            alt='avatar'
            width={40}
            height={40}
            className='rounded-full flex-shrink-0'
          />
        ) : (
          <Image
            src='/logo.jpg'
            alt='avatar'
            width={40}
            height={40}
            className='rounded-full flex-shrink-0'
          />
        )}
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className='search-container absolute top-full left-0 right-0 p-4 bg-white shadow-md border-t md:hidden'>
          <div className='flex items-center gap-2 text-sm rounded-full ring-[1.5px] ring-gray-500 px-3 py-2'>
            <Image src='/search.png' alt='search' width={16} height={16} />
            <input
              className='outline-none flex-1 bg-transparent'
              type='text'
              placeholder='Search...'
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className='p-1 rounded-full hover:bg-gray-100'
            >
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
