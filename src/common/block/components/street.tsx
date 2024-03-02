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

// regex para remover todas as letras do house e manter apenas os numeros

const regex = /\D/g;

export function Street({ address, actions, block }: AddressProps) {
  const houses = address.houses.filter((house) => !regex.test(house));
  const FIRST_HOUSE = houses[0];
  const LAST_HOUSE = houses[houses.length - 1];
  const [url, setUrl] = useState<string>('');

  const addressTo = useCallback(() => {
    const middleHouse = Math.round(houses.length / 2);
    const loc = `${address.name} ${houses[middleHouse]} - Sorocaba - SP`;
    return loc;
  }, [address]);

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
        'flex h-20 mini:h-24 w-full items-center justify-center gap-3 rounded-b-[40px] rounded-l-[40px] rounded-t-[40px] rounded-br-none rounded-tr-none bg-white p-2 pl-4 shadow-sm drop-shadow-xl '
      )}
    >
      {url ? (<a className='flex cursor-pointer flex-col items-center rounded-full bg-[#CEE1E6] p-2' href={url} target='_blank'>
        <div id='publisher-gps' className='flex h-7 w-7 items-center justify-center fill-zinc-600'>
          <CarIcon />
        </div>
      </a>) : (<div className='p-2' />)}
      <div onClick={() => void actions.goToStreet(address.id)} className={clsx('flex w-11/12 cursor-pointer flex-col items-start')}>
        <h6 className='inline-block w-full max-w-[220px] mini:max-w-[250px] truncate text-xl font-semibold text-gray-900'>{address.name}</h6>
        <p className='text-lg text-gray-600'>
          N° de {FIRST_HOUSE} à {LAST_HOUSE}
        </p>
      </div>
      <Button.Root
        id="publisher-details"
        variant='ghost'
        className="
          hidden 
          h-8 w-1/12 !p-0 mr-2 font-bold text-primary !shadow-non  shadow-none  
          mini:flex  mini:justify-center mini:items-center
        "
        onClick={() => void actions.goToStreet(address.id)}
      >
        <Button.Icon icon={NavigateNext} size={24} />
      </Button.Root>
    </div>
  );
}
