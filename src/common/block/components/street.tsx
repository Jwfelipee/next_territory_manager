import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/ui';

import { CarIcon } from './';
import { NavigateNext } from './navigate_next';
import { IActions, IAddress, IBlock } from '../type';

interface AddressProps {
  block: Omit<IBlock, 'addresses'>;
  address: IAddress;
  actions: IActions;
}

export function Street({ address, actions, block }: AddressProps) {
  const FIRST_HOUSE = address?.houses[0];
  const LAST_HOUSE = address?.houses[address?.houses.length - 1];
  const [url, setUrl] = useState<string>('');

  const addressTo = useCallback(() => {
    const [_, territoryNameRaw] = block.territoryName.split('-');
    const territoryName = territoryNameRaw.trim().replace(/\d/g, '');
    const middleHouse = Math.round(address?.houses.length / 2);
    const loc = `${territoryName} ${address.name} ${address?.houses[middleHouse]}`;
    return loc;
  }, [address, block.territoryName]);

  const toMapsWithNavigator = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const to = addressTo();
        const so = discoverSO();
        const urlMaps = so === 'android' ? androidMaps(latitude, longitude, to) : iosMaps(latitude, longitude, to);
        setUrl(urlMaps);
      });
    }
  }, [addressTo]);

  useEffect(() => {
    toMapsWithNavigator();
  }, [toMapsWithNavigator]);

  const androidMaps = (currLatitude: number, currLongitude: number, to: string) => {
    const origin = `origin=${currLatitude},${currLongitude}`;
    const encoded = encodeURI(to);

    const destination = `destination=${encoded}`;
    const urlMaps = `https://www.google.com/maps/dir/?api=1&${origin}&${destination}`;
    return urlMaps;
  };

  const iosMaps = (currLatitude: number, currLongitude: number, destination: string) => {
    const mapsUrl = `maps://maps.apple.com/?saddr=${currLatitude},${currLongitude}&daddr=${encodeURIComponent(destination)}`;
    return mapsUrl;
  };

  const discoverSO = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return 'android';

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) return 'ios';
    return 'android';
  };

  return (
    <div
      className={clsx(
        'flex h-24 w-full items-center justify-center gap-3 rounded-b-[40px] rounded-l-[40px] rounded-t-[40px] rounded-br-none rounded-tr-none bg-white p-4 shadow-sm drop-shadow-xl '
      )}
    >
      {url ? (<a className='flex cursor-pointer flex-col items-center rounded-full  bg-[#DDF5CE] p-2' href={url} target='_blank'>
        <div className='flex h-6 w-6 items-center justify-center fill-zinc-600'>
          <CarIcon />
        </div>
      </a>) : (null)}
      <div onClick={() => void actions.goToStreet(address.id)} className={clsx('flex w-11/12 cursor-pointer flex-col px-4 items-start')}>
        <h6 className='inline-block w-full max-w-[280px] truncate text-xl font-semibold text-gray-900'>{address.name}</h6>
        <p className='text-lg text-gray-600'>
          N° de {FIRST_HOUSE} à {LAST_HOUSE}
        </p>
      </div>
      <Button.Root
        variant='ghost'
        className={clsx('!shadow-non text-primary flex h-8 w-1/12 items-center justify-center shadow-none !p-0 font-bold')}
        onClick={() => void actions.goToStreet(address.id)}
      >
        <Button.Icon icon={NavigateNext} size={24} />
      </Button.Root>
    </div>
  );
}
