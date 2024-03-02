import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { Mode } from '@/common/loading';
import { blockGateway } from '@/infra/Gateway/BlockGateway';
import { authState } from '@/states/auth';

import { IBlock } from './type';

export const useBlock = (blockId: string, territoryId: string, round: string) => {
  const [block, setBlock] = useState<IBlock>({
    blockId: '',
    blockName: '',
    territoryId: '',
    territoryName: '',
    addresses: [],
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [values, setValues] = useRecoilState(authState);

  const getBlock = useCallback(
    async (block: string, territory: string, round: string): Promise<void> => {
      if (!block || !territory) return;
      const { status, data } = await blockGateway.getBlock(block, territory, round);
      if (status > 299) {
        setValues({ ...values, notFoundStatusCode: status });
        setIsLoading('not-found');
        return;
      }
      setBlock(data);
      setIsLoading('screen');
    },
    [setValues, values]
  );

  useEffect(() => {
    void getBlock(blockId, territoryId, round);
  }, [blockId, getBlock, round, territoryId]);

  const goToStreet = (addressId: number): void => {
    const query = new URLSearchParams({ round });
    void router.push(`/territorio/${territoryId}/quadra/${blockId}/rua/${addressId}?${query.toString()}`);
  };

  return {
    block,
    actions: {
      goToStreet,
    },
    isLoading,
  };
};
