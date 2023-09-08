'use client';

import clsx from 'clsx';
import { useRouter as useNavigate } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { RootModeScreen } from '@/common/loading';
import { BlockCard, useTerritory } from '@/common/territory';
import { authState } from '@/states/auth';
import { Body, Button, Header } from '@/ui';


export default function Territory() {
  const { territoryId: territoryIdState, overseer, roles } = useRecoilValue(authState);
  const { territory, getTerritories, actions, isLoading } = useTerritory(Number(territoryIdState));

  const navigate = useNavigate();
  const back = () => navigate.back();

  useEffect(() => {
    const interval = setInterval(() => getTerritories(Number(territoryIdState)), 1000 * 30)
    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <RootModeScreen mode={isLoading}>
      <div className={clsx('relative')}>
        <Header>
          {/* <Button.Root
            className={clsx('left-2 !w-fit !p-2 !shadow-none', {
              hidden: roles?.includes('admin' || 'overseer'),
            })}
            variant='ghost'
            onClick={back}
          >
            <ArrowLeft />
          </Button.Root> */}
          <div className='flex flex-col gap-2'>
            <h1 className='flex items-center text-xl font-semibold'>Olá Dirigente,</h1>
            <p className='flex items-center text-[20px] font-normal' >Gerencie aqui as quadras do território e compartilhe com os publicadores.</p>
          </div>
        </Header>
        <div className='mt-2 text-2xl font-bold p-4 text-gray-600 text-center'>{territory.territoryName}</div>
        <Body>
          <div className='flex h-full w-full flex-col  gap-4'>
            {territory.blocks?.map((block, index) => (
              <BlockCard key={block.id} block={block} index={index} actions={actions} territoryId={territory.territoryId} />
            ))}
          </div>
        </Body>
      </div>
    </RootModeScreen>
  );
}
