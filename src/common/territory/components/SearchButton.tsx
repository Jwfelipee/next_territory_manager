import clsx from 'clsx';
import { Search } from 'react-feather';

import { Button } from '@/ui';

export const SearchButton = () => {
  return (
    <Button.Root
      className={clsx(
        'fixed bottom-6 left-1/2 !h-12 !w-12 -translate-x-1/2 animate-pulse !rounded-full !p-2'
      )}
      variant='secondary'
    >
      <Search size={16} />
    </Button.Root>
  );
};
