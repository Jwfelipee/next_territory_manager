import { useCallback, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

import { Mode } from '@/common/loading';
import { ITerritoryActions, useTerritoryActions } from '@/common/territory/useTerritoryActions';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';
import { authState } from '@/states/auth';

import { ITerritory } from './type';

export interface ITerritoryCustomHook {
  territory: ITerritory;
  actions: ITerritoryActions;
  isLoading: Mode;
  getTerritories: (id: string, round: string) => Promise<void>;
}

export const useTerritory = (territoryId: string, round: string): ITerritoryCustomHook => {
  const [territory, setTerritory] = useState<ITerritory>({
    territoryId: '',
    territoryName: '',
    hasRound: false,
    blocks: [],
    history: [],
  });
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [values, setValues] = useRecoilState(authState);

  const getTerritories = useCallback(
    async (id: string, round: string): Promise<void> => {
      if (!id) {
        return;
      }
      const { status, data } = await TerritoryGateway.in().getById(id, round);
      if (status > 299) {
        setValues({ ...values, notFoundStatusCode: status });
        setIsLoading('not-found');
        return;
      }
      setTerritory(data);
      setIsLoading('screen');
    },
    [setValues, values]
  );

  useEffect(() => {
    getTerritories(territoryId, round);
    return () => {
      setTerritory({
        territoryId: '',
        territoryName: '',
        hasRound: false,
        blocks: [],
        history: [],
      });
    };
  }, [getTerritories, round, territoryId]);

  return {
    territory,
    isLoading,
    getTerritories,
    actions: useTerritoryActions({
      territoryId,
      territory,
      setTerritory,
      getTerritories,
      round,
    }),
  };
};
