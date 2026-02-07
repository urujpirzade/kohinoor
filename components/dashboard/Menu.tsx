import { MenuItems } from '@/constants/data';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuProps {
  onItemClick?: () => void;
}

const Menu = ({ onItemClick }: MenuProps) => {
  const pathname = usePathname();

  return (
    <div className='mt-4 text-sm'>
      {MenuItems.map((section) => (
        <div className='flex flex-col m-2 gap-2' key={section.title}>
          <span className='block text-gray-400 font-light my-4 px-2'>
            {section.title}
          </span>
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.label}
                onClick={onItemClick}
                className={`
                  flex items-center justify-center lg:justify-start gap-4 py-3 px-2 
                  text-gray-600 rounded-md transition-all duration-200
                  hover:bg-lamaSkyLight hover:text-gray-800
                  ${isActive ? 'bg-lamaSky text-gray-800 font-medium' : ''}
                  min-h-[44px] touch-manipulation
                `}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  height={20}
                  width={20}
                  className='flex-shrink-0'
                />
                <span className='block truncate'>{item.label}</span>
                {/* Mobile: Show label on hover/active */}
                <span className='lg:hidden absolute left-16 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50'>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
