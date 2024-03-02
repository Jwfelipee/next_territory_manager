/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button } from '@material-tailwind/react';
import clsx from 'clsx';
import { memo, useCallback, useEffect, useState } from 'react';
import { Clock, Eye, StopCircle, Trash, Trash2, User, Users } from 'react-feather';

import { IconContainer } from '@/components/Atoms/IconContainer';
import { ShareCopy } from '@/components/Atoms/ShareCopy';

import { ITerritoryActions } from '@/common/territory/useTerritoryActions';
import { streetGateway } from '@/infra/Gateway/StreetGateway';
import { DoughnutChart } from '@/ui/doughnutChart';

import { IBlock } from '../type';

interface BlockCardProps {
  block: IBlock;
  index: number;
  actions: ITerritoryActions;
  territoryId: string;
  round: string;
  reload: () => void;
}

export function BlockCard({ block, actions, territoryId, round, reload }: BlockCardProps) {

  function sugestion(): string {
    let sugestion = '';
    if (block.negativeCompleted < 15) {
      sugestion = '+1 quadra';
    }
    if (block.negativeCompleted >= 15 && block.negativeCompleted < 25) {
      sugestion = '2 pares ou mais.';
    }
    if (block.negativeCompleted >= 25 && block.negativeCompleted < 30) {
      sugestion = '3 pares ou mais.';
    }
    if (block.negativeCompleted >= 30) {
      sugestion = '4 pares ou mais.';
    }
    return sugestion;
  }

  function geParamsNavigateShare(territoryId: string, blockId: string, signature: string): { title: string; text: string; url: string } {
    const queryRound = new URLSearchParams({ round });
    const query = new URLSearchParams({ p: `territorio/${territoryId}/quadra/${blockId}?${queryRound.toString()}`, s: signature });
    return {
      title: '*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado(a) publicador(a)',
      text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nSegue o link para a *${block.name}* que você está designado(a) para pregar:`,
      url: `${window.location.origin}/home?${query.toString()}`,
    };
  }

  const revokeAccess = async () => {
    await streetGateway.revokeAccess(+territoryId, +block.id);
    reload();
  };

  return (
    <div className={clsx('flex min-h-[260px] w-full rounded-b-[40px] rounded-l-[40px] gap-2 rounded-t-[40px] rounded-br-none rounded-tr-none border p-3 shadow-lg')}>
      <div className='flex h-full w-1/2 flex-col items-baseline justify-start'>
        <h6 className='ml-2 block text-xl font-medium'>
          <span className='ml-2'>{block.name}</span>
        </h6>

        <div id="overseer-chart" className='flex h-[200px] w-full max-w-[170px] flex-col pt-3'>
          <DoughnutChart values={[block.positiveCompleted, block.negativeCompleted]} />
        </div>
        <div className='w-full'>
          {!block.signature?.key ? (
            <div id="overseer-time" className='p-1 pl-2 flex w-full  items-center  gap-2'>
              <Clock className='text-gray-700' />
            </div>
          ) : (
            <div className='flex w-full gap-2'>
              <TimeToExpire signature={block.signature} />
            </div>
          )}
        </div>
      </div>

      <div className='flex w-1/2 flex-col items-end justify-between'>
        <div className='flex w-full justify-end items-center gap-2'>
          {block?.signature?.key && (<Eye className='cursor-pointer' onClick={() => actions.blockNavigation(territoryId, block.id, round)} />)}
          <ShareCopy
            data={{
              message: geParamsNavigateShare(territoryId, block.id, block?.signature?.key || ''),
              signatureKey: block?.signature?.key,
            }}
            key={block.id}
            onShareClick={() => actions.share(block.id)}
          />
        </div>

        <div className='flex w-full flex-col gap-2 p-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-secondary h-6 w-14'></div>
            <span>À fazer: {block.negativeCompleted}</span>
          </div>

          <div className='flex items-center gap-2'>
            <div className='bg-primary h-6 w-14'></div>
            <span>Concluído: {block.positiveCompleted}</span>
          </div>
          <div id="overseer-sugestion" className='text-sm'>Sugestão: {sugestion()}</div>
          {block?.signature?.key && (
            <IconContainer
              className='w-full mt-1'
              onClick={revokeAccess}
              icon={
                <Button variant='outlined' className="flex justify-center p-1.5 w-full text-center text-primary border-primary" >
                  Revogar acesso
                </Button>
              }
            />
          )}
        </div>

        <div className='flex w-full '>
          {block?.signature?.key ? (
            <div className='flex w-full items-center justify-end gap-2 p-2 font-semibold'>
              {block.connections >= 1 && (<span className='text-lg'>{block.connections}</span>)}
              {block.connections >= 1 ? <Users id="overseer-connections" className='stroke-primary fill-primary' /> : <User id="overseer-connections" className='stroke-primary fill-primary' />}
              {/* <div className='h-2 w-2 animate-pulse rounded-full bg-green-700'></div> */}
            </div>
          ) : (
            <div className='flex w-full items-center justify-end gap-2 p-2 font-semibold'>
              <User id="overseer-connections" className='stroke-gray-500 fill-gray-500' />
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

const TimeToExpireComponent = ({ signature }: { signature: IBlock['signature'] }) => {
  const [expireIn, setExpireIn] = useState<string>('');

  const timeToExpire = useCallback((endDate: string) => {
    const date = new Date(endDate);
    if (!endDate) return;
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hoursNumber = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutesNumber = Math.floor((diff / 1000 / 60) % 60);
    const secondsNumber = Math.floor((diff / 1000) % 60);
    const hours = String(hoursNumber).padStart(2, '0');
    const minutes = String(minutesNumber).padStart(2, '0');
    const seconds = String(secondsNumber).padStart(2, '0');
    // verifica se o tempo já expirou ou é negativo e parar o contador
    if (diff <= 0) {
      setExpireIn('00:00:00');
      return;
    }
    setExpireIn(`${hours}:${minutes}:${seconds}`);
  }, []);

  useEffect(() => {
    if (!signature) return;
    const interval = setInterval(() => {
      timeToExpire(signature?.expirationDate || '');
    }, 1000);
    return () => clearInterval(interval);
  }, [signature, signature?.expirationDate, timeToExpire]);

  return (
    <div id="overseer-time" className='p-1 pl-2 flex w-full  items-center  gap-2'>
      <Clock className='text-primary' /> <span className='text-lg  font-semibold'>{expireIn}</span>
    </div>
  );
};

const TimeToExpire = memo(TimeToExpireComponent);
