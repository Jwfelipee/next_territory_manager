import { Input } from "@material-tailwind/react";
import { driver } from "driver.js";
import Image from 'next/image';
import { Info, Search } from 'react-feather';

import "driver.js/dist/driver.css";

import image from '@/assets/territory_green_1.jpg';
interface IHeaderHomeProps {
  search: string;
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
}

export function HeaderHome({
  search,
  handleChangeSearch,
  children
}: IHeaderHomeProps) {



  return (
    <div className='p-2 py-4'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 items-center'>
          <div className='w-[50px] overflow-hidden rounded-full '>
            <Image src={image} alt='logo' className='w-full' />
          </div>

          <div className="w-40 mini:w-60 md:96">
            <Input
              id="admin-filter-search"
              label='Pesquise o território'
              className='shadow-md w-full'
              value={search}
              onChange={handleChangeSearch}
              icon={<Search size={16} />}
              autoFocus
            />
          </div>

        </div>
        {children}
      </div>
    </div>

  );
}
