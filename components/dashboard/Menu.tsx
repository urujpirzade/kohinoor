import { MenuItems } from '@/constants/data';
import Image from 'next/image';
import Link from 'next/link';
const Menu = () => {
  return (
    <div className='mt-4 text-sm'>
      {MenuItems.map((i) => (
        <div className='flex flex-col m-2 gap-2' key={i.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className='flex items-center justify-center lg:justify-start gap-4 py-2 md:px-2 text-gray-600 scroll-py-20 rounded-md hover:bg-lamaSkyLight'
            >
              <Image src={item.icon} alt='logo' height={20} width={20} />
              <span className='hidden lg:block'>{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Menu;
