/* eslint-disable @typescript-eslint/no-misused-promises */
import { Input } from '@material-tailwind/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import { Actions } from '@/common/territories/components/Actions';
import { HeaderButtons } from '@/common/territories/components/HeaderButtons';
import { ITerritoryActions } from '@/common/territories/useTerritories';
import { Period, PeriodBR } from '@/enum/Period';
import { DoughnutChart } from '@/ui/doughnutChart';

import { ITerritoryCard } from '../type';

interface TerritoryCardProps {
  territoryCard: ITerritoryCard;
  index: number;
  actions: ITerritoryActions;
}

export function TerritoryCard({ territoryCard, index, actions }: TerritoryCardProps) {

  const [overseer, setOverseer] = useState<string>();
  const [date, setDate] = useState<string>();

  const calculatePeriodCounts = (): number[] => {
    const counts = {
      [Period.MORNING]: 0,
      [Period.AFTERNOON]: 0,
      [Period.EVENING]: 0,
      [Period.WEEKEND]: 0,
    };

    territoryCard.positiveCompleted.forEach((item) => {
      switch (item.period) {
        case Period.MORNING:
          counts[Period.MORNING] += 1;
          break;
        case Period.AFTERNOON:
          counts[Period.AFTERNOON] += 1;
          break;
        case Period.EVENING:
          counts[Period.EVENING] += 1;
          break;
        case Period.WEEKEND:
          counts[Period.WEEKEND] += 1;
          break;
        default:
          break;
      }
    });

    return Object.values(counts);
  };

  const getColors = () => {
    return [
      {
        bg: 'rgba(255, 206, 86, 0.2)',
        border: 'rgba(255, 206, 86, 1)',
      },
      {
        bg: 'rgba(255, 159, 64, 0.2)',
        border: 'rgba(255, 159, 64, 1)',
      },
      {
        bg: 'rgba(54, 162, 235, 0.2)',
        border: 'rgba(54, 162, 235, 1)',
      },
      {
        bg: '#d2f8dc',
        border: '#4ee474',
      },
      {
        bg: '#e7e7e7',
        border: '#d3d3d3',
      },
    ];
  };

  useEffect(() => {

    if (!territoryCard.overseer) setOverseer('');
    if (!territoryCard.signature?.key) setOverseer('');
    setOverseer(territoryCard.overseer)
    setDate(dayjs(territoryCard.signature.expirationDate).format('YYYY-MM-DD'))

    return () => {
      setOverseer('');
      setDate('');
    }
  }, [territoryCard]);

  return (
    <div
      className={clsx(
        'flex min-h-[260px] w-full flex-col rounded-lg border p-4 shadow-md',
        territoryCard.signature.key && 'shadow-primary border-primary shadow-sm'
      )}
    >
      <div className='flex h-full w-full items-center justify-between'>
        <h6 className='ml-2 block text-xl font-medium'>{territoryCard.name}</h6>
        <HeaderButtons actions={actions} territoryCard={territoryCard} />
      </div>
      <div className='flex h-4/5 w-full gap-3'>
        <div className='relative flex w-[45%] flex-col items-center justify-start gap-4 text-lg'>
          {territoryCard.positiveCompleted.length || territoryCard.negativeCompleted ? (
            <>
              <div id='admin-chart' className='flex h-[210px] w-full max-w-[150px] flex-col py-4'>
                <DoughnutChart
                  labels={[PeriodBR.MORNING, PeriodBR.AFTERNOON, PeriodBR.EVENING, PeriodBR.WEEKEND, 'A fazer']}
                  values={[...calculatePeriodCounts(), territoryCard.negativeCompleted]}
                  backgroundColor={[...getColors().map((item) => item.bg)]}
                  borderColor={[...getColors().map((item) => item.border)]}
                />
              </div>
              <div className='absolute -bottom-2 left-0 flex w-[150%] flex-wrap gap-2'>
                {calculatePeriodCounts().map((item, index) => {
                  if (item === 0) return null;
                  const color = getColors()[index].bg;
                  const border = getColors()[index].border;
                  return (
                    <div className='flex items-center gap-2' key={index}>
                      <div
                        className='flex h-4 w-4 items-center justify-center rounded-full'
                        style={{ backgroundColor: color, border: `1px solid ${border}` }}
                      ></div>
                      <p className='text-xs text-gray-400'>{PeriodBR[Object.keys(Period)[index]]}</p>
                    </div>
                  );
                })}
                <div className='flex items-center gap-2' key={index}>
                  <div
                    className='flex h-4 w-4 items-center justify-center rounded-full'
                    style={{ backgroundColor: getColors()[4].bg, border: `1px solid ${getColors()[4].border}` }}
                  ></div>
                  <p className='text-xs text-gray-400'>A fazer</p>
                </div>
              </div>
            </>
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <p className='text-xs text-gray-400'>Sem dados</p>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-2 p-2 py-5 w-44'>
          <Input
            id='admin-overseer'
            name='overseer'
            label='Nome Dirigente'
            value={overseer}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              actions.updateData(e, territoryCard.territoryId);
              setOverseer(e.target.value);
            }}
            containerProps={{ className: "!min-w-[100px]" }}
          />
          <Input
            id='admin-expirationTime'
            name='expirationTime'
            label='Duração do acesso'
            type='date'
            value={date}
            className={clsx({
              'bg-secondary': !territoryCard.signature.expirationDate,
            })}
            onChange={(e) => {
              actions.updateDateTime(e, territoryCard.territoryId);
              setDate(e.target.value);
            }}
            containerProps={{ className: "!min-w-[100px]" }}
          />
          <Actions changeOverseer={setOverseer} key={territoryCard.territoryId} territoryCard={territoryCard} actions={actions} />
        </div>
      </div>
    </div>
  );
}
