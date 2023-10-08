import { useCallback, useEffect, useState } from 'react';

import { Mode } from '@/common/loading';
import { blockGateway } from '@/infra/Gateway/BlockGateway';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';
import { navigatorShare } from '@/utils/share';

import { ITerritory } from './type';

export const useTerritory = (territoryId: number, initialState?: ITerritory) => {
  const [territory, setTerritory] = useState<ITerritory>(
    initialState || {
      territoryId: 0,
      territoryName: '',
      hasRound: false,
      blocks: [],
      history: [],
    }
  );
  const [isLoading, setIsLoading] = useState<Mode>('loading');

  const getTerritories = useCallback(async (id: number): Promise<void> => {
    if (!id) {
      return;
    }
    const { status, data } = await TerritoryGateway.in().getById(id);
    if (status > 299) {
      setIsLoading('not-found');
      return;
    }
    setTerritory(data);
    setIsLoading('screen');
  }, []);

  const share = async (blockId: number): Promise<void> => {
    const exist = territory.blocks.find((block) => block.id === blockId);
    if (!exist) {
      alert('Quadra não encontrado');
      return;
    }

    const input = {
      blockId,
      territoryId: territory.territoryId,
    };
    const { status, data } = await blockGateway.signInBlock(input);
    if (status > 299) {
      console.log({ data, status });
      alert('Erro ao tentar compartilhar a quadra');
      return;
    }

    const signature = data.signature as string;
    await navigatorShare({
      title: 'Prezado(a) publicador(a)',
      text: `Segue o link para a *${exist.name}* que você está designado(a) para pregar:`,
      url: `${window.location.origin}/home?p=territorio/${territory.territoryId}/quadra/${blockId}&s=${signature}`,
    });

    void getTerritories(territoryId);
  };

  useEffect(() => {
    getTerritories(territoryId);
  }, [getTerritories, territoryId]);

  return {
    territory,
    getTerritories,
    actions: {
      share,
    },
    isLoading,
  };
};
