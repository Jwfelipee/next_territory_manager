'use client';
import { Button, Input } from "@material-tailwind/react";
import clsx from 'clsx';
import jwt_decode from 'jwt-decode';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { setCookie } from 'nookies';
import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from "react-feather";
import toast from 'react-hot-toast';
import { useSetRecoilState } from 'recoil';

import image from '@/assets/territory_green_1.jpg';
import { Mode, RootModeScreen } from '@/common/loading';
import { env } from '@/constant';
import { authGateway } from '@/infra/Gateway/AuthGateway';
import { authState } from '@/states/auth';
import { loadState } from '@/states/load';
import { Body } from '@/ui';

type LoginData = {
  email: string;
  password: string;
};

export default function HomePage() {
  const [loginData, setLoginData] = React.useState<LoginData>({
    email: '',
    password: '',
  });
  const [currentType, setCurrentType] = useState("password");
  const _setAuthState = useSetRecoilState(authState);
  const _setLoadState = useSetRecoilState(loadState);
  const [isLoading, setIsLoading] = useState<Mode>('screen');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Erro ao realizar login');
      return;
    }
    setIsLoading('loading')

    const { status, data } = await authGateway.login(loginData);
    if (status > 299 || !status) {
      toast.error(data?.message || 'Erro ao realizar login');
      setIsLoading('screen');
      return;
    }
    const { overseer, territoryId, blockId, exp, roles } = openToken(data?.token);
    _setAuthState({
      token: data?.token,
      overseer,
      territoryId,
      blockId,
      expirationTime: exp,
      signatureId: '',
      mode: 'default',
      roles,
    });
    const configCookie = {
      maxAge: 60 * 60 * 24 * 30,
    };
    setCookie(undefined, env.storage.token, data.token, configCookie);
    setCookie(undefined, env.storage.mode, 'default', configCookie);
    setCookie(undefined, env.storage.territoryId, String(territoryId), configCookie);
    setCookie(undefined, env.storage.blockId, String(blockId), configCookie);
    setCookie(undefined, env.storage.overseer, String(overseer), configCookie);
    const rolesToSave = roles?.join(',');
    setCookie(undefined, env.storage.roles, JSON.stringify(rolesToSave), configCookie);
    setCookie(undefined, env.storage.expirationTime, String(exp), configCookie);
    router.push('/territorios');
    setIsLoading('screen');
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
    <main>
      <Head>
        <title>Territory Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RootModeScreen mode={isLoading}>
        <div className={clsx('relative h-screen m-auto max-w-[500px] flex flex-col justify-center py-10')}>
          <div className='flex h-2/4 items-center justify-center'>
            <div className='max-w-[250px] overflow-hidden rounded-full bg-[#5B98AB]'>
              <Image src={image} alt='logo' className='w-[200px]' />
            </div>
          </div>
          <Body className='h-[calc(100vh-50%)]'>
            <form
              className={clsx('flex h-full flex-col items-center justify-around')}
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
                  />
                  <Input
                    onChange={handleChange}
                    value={loginData.password}
                    name='password'
                    label='Senha'
                    type={currentType}
                    icon={<Password currentType={currentType} setCurrentType={setCurrentType} />}
                  />
                </div>
              </div>
              <Button
                type='submit'
                className='w-10/12 bg-primary text-gray-50'
              >
                Entrar
              </Button>
            </form>
          </Body>
        </div>
      </RootModeScreen>
    </main>
  );
}


const Password = ({
  setCurrentType,
  currentType,
}) => {

  return (
    <button
      type="button"
      className="text-slate-500 text-sm font-semibold"
      onClick={() => {
        setCurrentType(currentType === "password" ? "text" : "password");
      }}
    >
      {currentType === "password" ? <Eye size={16} /> : <EyeOff size={16} />}
    </button>
  );
}