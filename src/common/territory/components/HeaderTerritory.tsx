/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-empty-interface */
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { ArrowLeft } from 'react-feather';
import { useRecoilValue } from 'recoil';

import { authState } from '@/states/auth';
import { Button, Header } from '@/ui';

interface IHeaderHomeProps {
  children: ReactNode;
}

export function HeaderTerritory({ children }: IHeaderHomeProps) {
  const { roles } = useRecoilValue(authState);
  const router = useRouter();
  const back = () => router.push('/territorios');

  return (
    <Header>
      <div className='flex h-full flex-col justify-evenly py-6'>
        <h1 className='flex items-center text-xl font-semibold'>
          <Button.Root
            className={clsx('!w-fit !p-2 !shadow-none', {
              hidden: !roles?.includes('admin'),
            })}
            variant='ghost'
            onClick={back}
          >
            <ArrowLeft />
          </Button.Root>
          {children}
        </h1>
        <p className='text-sm'>
          Gerencie aqui os Territórios digitais e compartilhe com os dirigentes
          do campo.
        </p>
      </div>
    </Header>
  );
}
