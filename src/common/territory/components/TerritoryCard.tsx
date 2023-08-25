/* eslint-disable @typescript-eslint/no-misused-promises */
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Pause, Play, Share2 } from 'react-feather';

import { Button, Input, InputSelect } from '@/ui';
import { DoughnutChart } from '@/ui/doughnutChart';

import { IActions, ITerritoryCard } from '../type';

interface TerritoryCardProps {
  territoryCard: ITerritoryCard;
  index: number;
  actions: IActions;
}

export function TerritoryCard({
  territoryCard,
  index,
  actions,
}: TerritoryCardProps) {
  const router = useRouter();

  const redirect = () => {
    const query = new URLSearchParams();
    query.set('t', String(territoryCard.territoryId));
    router.push(`/territorio?${query.toString()}`);
  };

  return (
    <div
      className={clsx(
        { 'rounded-tl-none border-t-0 bg-transparent': index === 0 },
        '-ml-2 min-h-[220px] w-[calc(100%+12px)] rounded-b-[40px] rounded-l-[40px] rounded-t-[40px] rounded-br-none rounded-tr-none border p-4 px-6 shadow-lg',
        'flex flex-col gap-2'
      )}
    >
      <div className='flex h-1/5 w-full items-center justify-between'>
        <h6 onClick={redirect}>{territoryCard.name}</h6>
        <Button.Root
          onClick={() => actions.changeRound(territoryCard.territoryId)}
          variant='dark'
          className='h-8 w-8 !rounded-full !p-0'
        >
          {territoryCard.hasRounds ? <Pause size={16} /> : <Play size={16} />}
        </Button.Root>
      </div>
      <div className='flex h-4/5 w-full gap-[10%]'>
        <div className='flex w-[45%] flex-col items-center justify-start gap-2 text-lg'>
          {territoryCard.positiveCompleted ||
          territoryCard.negativeCompleted ? (
            <>
              <div
                className={clsx(
                  {
                    'h-[calc(100%-20px)]': territoryCard?.name,
                    hidden: !territoryCard?.name,
                  },
                  'flex w-full justify-start pl-2'
                )}
              >
                <DoughnutChart
                  values={[
                    territoryCard.positiveCompleted,
                    territoryCard.negativeCompleted,
                  ]}
                />
              </div>
              <div className='flex h-4 w-full items-center justify-start gap-16 text-xs'>
                <div className='flex w-fit flex-col items-center gap-1'>
                  <div className='bg-primary h-3 w-6'></div>À fazer
                </div>
                <div className='flex w-fit flex-col items-center gap-1'>
                  <div className='bg-secondary h-3 w-6'></div>
                  Concluído
                </div>
              </div>
            </>
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <p className='text-xs text-gray-400'>Sem dados</p>
            </div>
          )}
        </div>

        <div className='flex w-[45%] flex-col justify-between'>
          <InputSelect
            list={[
              { label: 'Dirigente', value: '' },
              { label: 'Paulo', id: 'Paulo' },
              { label: 'Lucas', id: 'Lucas' },
            ]}
            name='overseer'
            label=''
            placeholder='Dirigente'
            value={territoryCard.overseer}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              actions.updateData(e, territoryCard.territoryId)
            }
          />
          <Input
            name='expirationTime'
            label=''
            placeholder='Prazo'
            type='date'
            value={
              territoryCard.expirationTime?.includes('T')
                ? territoryCard.expirationTime.split('T')[0]
                : territoryCard.expirationTime
            }
            className={clsx({ 'bg-secondary': !territoryCard.expirationTime })}
            onChange={(e) => actions.updateData(e, territoryCard.territoryId)}
          />
          {territoryCard.signature ? (
            <Button.Root
              onClick={() => actions.revoke(territoryCard.territoryId)}
              className='!justify-start !px-2 text-xs'
              variant='secondary'
            >
              Revogar acesso
            </Button.Root>
          ) : (
            <div className='flex w-full justify-end'>
              <Button.Root
                variant='secondary'
                className={clsx(
                  {
                    invisible:
                      !territoryCard.overseer ||
                      !territoryCard.expirationTime ||
                      territoryCard.overseer === 'Dirigente' ||
                      !territoryCard.hasRounds,
                  },
                  'w-full !px-2 text-xs'
                )}
                onClick={(e) => actions.share(territoryCard.territoryId, e)}
              >
                Enviar <Share2 size={16} />
              </Button.Root>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
