'use client';

import clsx from 'clsx';
import jwt_decode from 'jwt-decode';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import * as React from 'react';
import { useSetRecoilState } from 'recoil';

import image from '@/assets/territory_green_1.jpg';
import { env } from '@/constant';
import { authGateway } from '@/infra/Gateway/AuthGateway';
import { authState } from '@/states/auth';
import { loadState } from '@/states/load';
import { Body, Button, Input } from '@/ui';
import { notify, sleep } from '@/utils/';

type LoginData = {
  email: string;
  password: string;
};

export default function Login() {
  const [loginData, setLoginData] = React.useState<LoginData>({
    email: 'john@gmail.com',
    password: '123456',
  });
  const _setAuthState = useSetRecoilState(authState);
  const _setLoadState = useSetRecoilState(loadState);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      notify({
        title: 'Erro',
        message: 'Preencha todos os campos',
      });
      return;
    }
    _setLoadState({ loader: 'spiral', message: 'Realizando login' });

    const { status, data } = await authGateway.login(loginData);
    if (status > 299) {
      notify({
        title: 'Erro',
        message: data.message || 'Erro ao realizar login',
      });
      return;
    }
    const { overseer, territoryId, blockId, exp, roles } = openToken(
      data.token
    );
    _setAuthState({
      token: data.token,
      overseer,
      territoryId,
      blockId,
      expirationTime: exp,
      signatureId: '',
      mode: 'default',
      roles,
    });
    await sleep(1000);
    setCookie(undefined, env.storage.token, data.token, {
      maxAge: exp - Date.now() / 1000,
    });
    router.push('/territorios');
    _setLoadState({ loader: 'none', message: '' });
  };

  const openToken = (token: string) => {
    const tokenDecoded = jwt_decode<{
      overseer?: string;
      territoryId: number;
      blockId?: number;
      exp: number;
      roles: string[];
    }>(token);
    return {
      overseer: tokenDecoded?.overseer,
      territoryId: tokenDecoded?.territoryId,
      blockId: tokenDecoded?.blockId,
      exp: tokenDecoded?.exp,
      roles: tokenDecoded?.roles as any,
    };
  };
  return (
    <main className='border border-red-500'>
      <Head>
        <title>Hi</title>
      </Head>
      <div className={clsx('relative h-screen')}>
        <div className='flex h-2/4 items-center justify-center'>
          <div className='max-w-[66%] overflow-hidden rounded-full bg-[#7AAD58] p-4'>
            <Image src={image} alt='logo' className='w-full' />
          </div>
        </div>
        <Body className='h-[calc(100vh-50%)]'>
          <form
            className={clsx('flex h-full flex-col items-center justify-around')}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit}
          >
            <div className='flex h-1/3 w-10/12 flex-col items-center justify-center gap-10'>
              <h4>Insira suas informações para realizar o login</h4>
              <div className='flex w-full flex-col gap-4'>
                <Input
                  onChange={handleChange}
                  value={loginData.email}
                  name='email'
                  label='E-mail'
                  className='!h-12'
                />
                <Input
                  onChange={handleChange}
                  value={loginData.password}
                  name='password'
                  label='Senha'
                  type='password'
                  className='!h-12'
                />
              </div>
            </div>
            <Button.Root
              type='submit'
              variant='secondary'
              className='flex w-10/12 !flex-row'
            >
              Entrar
            </Button.Root>
          </form>
        </Body>
      </div>
    </main>
  );
}
