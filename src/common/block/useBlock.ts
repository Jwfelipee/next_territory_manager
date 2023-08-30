/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { blockGateway } from '@/infra/Gateway/BlockGateway';
import { loadState } from '@/states/load';

import { IBlock, IUseBlock } from './type';

export const useBlock = (blockId: number, territoryId: number, initialState?: IBlock): IUseBlock => {
  const [block, setBlock] = useState<IBlock>(
    initialState || {
      blockId: 0,
      blockName: '',
      territoryId: 0,
      territoryName: '',
      addresses: [],
    }
  );
  const router = useRouter();
  const [_, _setLoadState] = useRecoilState(loadState);

  const getBlock = useCallback(
    async (block: number, territory: number): Promise<void> => {
      _setLoadState({ loader: 'spiral', message: 'Buscando quadra' });
      if (!block || !territory) return;
      const { status, data } = await blockGateway.getBlock(block, territory);
      if (status > 299) {
        console.log({ status, data });
        _setLoadState({ loader: 'none', message: '' });
        alert('Erro ao buscar a quadra');
        return;
      }
      setBlock(data);
      _setLoadState({ loader: 'none', message: '' });
    },
    [_setLoadState]
  );

  useEffect(() => {
    void getBlock(blockId ?? 0, territoryId ?? 0);
  }, [blockId, getBlock, territoryId]);

  const goToStreet = (addressId: number): Promise<void> => {
    const exist = block.addresses.find((address) => address.id === addressId);
    if (!exist) {
      alert('Rua não encontrada');
      return Promise.resolve();
    }
    if (!blockId || !territoryId) return Promise.resolve(alert('Erro ao buscar a quadra'));
    const query = `?a=${addressId}&b=${blockId}&t=${territoryId}`;
    router.push(`rua${query}`);
    return Promise.resolve();
  };

  return {
    block,
    actions: {
      goToStreet,
    },
  };
};
