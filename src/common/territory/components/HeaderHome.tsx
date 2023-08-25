import clsx from 'clsx';
import { Search } from 'react-feather';

import { Header, Input } from '@/ui';

interface IHeaderHomeProps {
  search: string;
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitSearch: () => void;
}

export function HeaderHome({
  search,
  handleChangeSearch,
  submitSearch,
}: IHeaderHomeProps) {
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitSearch();
    }
  };

  return (
    <Header>
      <div className='flex h-full flex-col justify-evenly'>
        <h1 className='text-xl font-semibold'>Olá admin</h1>
        <p className='text-sm'>
          Gerencie aqui os Territórios digitais e compartilhe com os dirigentes
          do campo.
        </p>
        <div
          className={clsx(
            'flex w-full items-center justify-center gap-1 transition-all duration-300 ease-in-out'
          )}
        >
          <Input
            placeholder='pesquise o território'
            className='border-white'
            value={search}
            onChange={handleChangeSearch}
            enterKeyHint='search'
            onKeyDown={handleSearch}
          />
          <Search size={16} />
        </div>
      </div>
    </Header>
  );
}
