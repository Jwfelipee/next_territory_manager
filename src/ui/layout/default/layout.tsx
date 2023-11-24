/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useEffect } from 'react';
import { User } from 'react-feather';
import toast from 'react-hot-toast';
import { useRecoilState, useRecoilValue } from 'recoil';

import { authState } from '@/states/auth';

export interface IDefaultLayoutProps {
  haveParams?: boolean;
  children: ReactNode;
}

export function DefaultLayout({
  haveParams = false,
  children,
}: IDefaultLayoutProps) {
  const { token } = useRecoilValue(authState);
  const [_, _setAuthState] = useRecoilState(authState);
  const navigate = useRouter();

  const logout = useCallback(() => {
    toast.error('Você não tem permissão para acessar essa página, faça login');
    navigate.push('/login');
  }, [navigate]);

  useEffect(() => {
    if (!token) {
      if (haveParams) {
        // void saveSignature(params?.signature_id);
        return;
      }
      logout();
    }
  }, [token, navigate, haveParams, logout]);

  // const saveSignature = async (signatureId: string | undefined) => {
  //   if (!signatureId) {
  //     logout();
  //     return;
  //   }
  //   const { data, status } = await TerritoryGateway.in().getSignature(
  //     signatureId
  //   );
  //   if (status > 299) {
  //     toast.error('Erro ao buscar assinatura');
  //     // logout();
  //     return;
  //   }
  //   const { token, mode } = data;
  //   const { overseer, territoryId, blockId, exp, roles } = openToken(token);
  //   _setAuthState({
  //     token,
  //     overseer,
  //     territoryId,
  //     blockId,
  //     expirationTime: exp,
  //     signatureId,
  //     mode,
  //     roles,
  //   });
  //   sessionStorage.setItem(env.storage.token, token);
  //   sessionStorage.setItem(env.storage.territoryId, territoryId?.toString());
  //   sessionStorage.setItem(env.storage.overseer, overseer || '');
  //   sessionStorage.setItem(env.storage.blockId, blockId?.toString() || '');
  //   sessionStorage.setItem(env.storage.expirationTime, exp?.toString());
  //   sessionStorage.setItem(env.storage.signatureId, signatureId);
  //   sessionStorage.setItem(env.storage.mode, mode);
  //   sessionStorage.setItem(env.storage.roles, roles.join(','));
  // };

  // const openToken = (token: string) => {
  //   const tokenDecoded = jwt_decode<{
  //     overseer?: string;
  //     territoryId: number;
  //     blockId?: number;
  //     exp: number;
  //     roles: string[];
  //   }>(token);
  //   return {
  //     overseer: tokenDecoded?.overseer,
  //     territoryId: tokenDecoded?.territoryId,
  //     blockId: tokenDecoded?.blockId,
  //     exp: tokenDecoded?.exp,
  //     roles: tokenDecoded?.roles as any,
  //   };
  // };

  return (
    <div className='relative min-h-screen w-screen bg-slate-50 text-gray-700'>
      <div
        className={clsx(
          'absolute right-2 top-2 flex items-center justify-center rounded-full bg-gray-400 p-2'
        )}
      >
        <User />
      </div>
      {children}
    </div>
  );
}
