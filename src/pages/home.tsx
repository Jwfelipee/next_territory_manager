import Image from 'next/image';
import { useRouter as useNavigation } from 'next/navigation';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { openToken } from '@/lib/openToken';

import logo from '@/assets/territory_green_1.jpg';
import { Mode, RootModeScreen } from '@/common/loading';
import { env } from '@/constant';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';
import { authState } from '@/states/auth';
import { Button } from '@/ui';

export default function Home() {
  const { query } = useRouter();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const _setAuthState = useSetRecoilState(authState);
  const [values, setValues] = useRecoilState(authState);
  const signature = query.s as string;
  const path = query.p as string;

  useEffect(() => {
    setIsLoading('screen');
  }, []);

  const saveSignature = async (signatureId: string) => {
    setIsLoading('loading');
    const { data, status } = await TerritoryGateway.in().getSignature(signatureId);
    if (status > 299) {
      setValues({ ...values, notFoundStatusCode: status });
      setIsLoading('not-found');
      return;
    }

    const { token, mode } = data;
    const { overseer, territoryId, blockId, exp, roles } = openToken(token);

    _setAuthState({
      token,
      overseer,
      territoryId,
      blockId,
      expirationTime: exp,
      signatureId,
      mode,
      roles,
    });
    const configCookie = {
      maxAge: 30 * 24 * 60 * 60,
    };
    setCookie(null, env.storage.token, token, configCookie);
    setCookie(null, env.storage.territoryId, territoryId?.toString(), configCookie);
    setCookie(null, env.storage.overseer, overseer || '', configCookie);
    setCookie(null, env.storage.blockId, blockId?.toString() || '', configCookie);
    setCookie(null, env.storage.expirationTime, exp?.toString(), configCookie);
    setCookie(null, env.storage.signatureId, signatureId, configCookie);
    setCookie(null, env.storage.mode, mode, configCookie);
    setCookie(null, env.storage.roles, roles.join(','), configCookie);

    navigation.push(path);
  };

  return (
    <RootModeScreen mode={isLoading}>
      <div className='flex h-screen flex-col items-center justify-center p-4 pb-12 bg-[#CEE1E6]'>

        <div className='flex flex-col justify-center items-center bg-gray-50 rounded-xl w-full p-4 mini:p-6 pb-8 gap-4 shadow-xl'>
          <div className='max-w-[250px] overflow-hidden rounded-full bg-[#5B98AB]'>
            <Image src={logo} alt='Logo Território Digital' className='w-[200px]' />
          </div>

          <div className='my-4'>
            <p className='text-gray-800  text-lg text-center'>Bem-vindo ao Território Digital</p>
            <p className='text-gray-800 text-md text-center'>Clique no botão abaixo para acessar a área o território designado.</p>
          </div>

          <Button.Root
            type='button'
            variant='primary'
            className='flex h-12 w-full !flex-row text-gray-50'
            onClick={() => void saveSignature(signature)}
          >
            Entrar
          </Button.Root>
        </div>
      </div>
    </RootModeScreen>

  );
}


