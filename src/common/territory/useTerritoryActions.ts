import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { IBlock, ITerritory } from '@/common/territory/type';
import { blockGateway } from '@/infra/Gateway/BlockGateway';
import { navigatorShare } from '@/utils/share';

export interface ITerritoryActionsProps {
  territoryId: string;
  round: string;
  territory: ITerritory;
  setTerritory: Dispatch<SetStateAction<ITerritory>>;
  getTerritories: (id: string, round: string) => Promise<void>;
}

export interface ITerritoryActions {
  share: (blockId: string) => Promise<void>;
  copyShare: (blockId: string) => Promise<void>;
  blockNavigation: (territoryId: string, blockId: string, round: string) => void;
}

export const useTerritoryActions = (props: ITerritoryActionsProps): ITerritoryActions => {
  const navigation = useRouter();
  const { round, territoryId, territory, setTerritory, getTerritories } = props;

  function geParamsNavigateShare(block: IBlock, signature: string): { title: string; text: string; url: string } {
    const queryRound = new URLSearchParams({ round });
    const query = new URLSearchParams({ p: `territorio/${territory.territoryId}/quadra/${block.id}?${queryRound.toString()}`, s: signature });
    return {
      title: '*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado(a) publicador(a)',
      text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nSegue o link para a *${block.name}* que você está designado(a) para pregar:`,
      url: `${window.location.origin}/home?${query.toString()}`,
    };
  }

  const share = async (blockId: string): Promise<void> => {
    const block = territory.blocks.find((block) => block.id === blockId);
    if (!block) {
      toast.error('Quadra não encontrado');
      return;
    }

    const input = {
      blockId,
      territoryId: territory.territoryId,
    };
    const { status, data } = await blockGateway.signInBlock(input);
    if (status > 299) {
      toast.error('Erro ao tentar compartilhar a quadra');
      return;
    }

    const signature = data.signature as string;
    const params = geParamsNavigateShare(block, signature);
    await navigatorShare(params);

    setTerritory((old) => {
      const blocks = old.blocks.map((block) => {
        if (block.id === blockId) {
          block.signature = {
            key: signature,
            expirationDate: data.expirationDate,
          };
        }
        return block;
      });
      return { ...old, blocks };
    });

    void getTerritories(territoryId, round);
  };

  const copyShare = async (blockId: string) => {
    const block = territory.blocks.find((block) => block.id === blockId);
    if (!block) {
      toast.error('Quadra não encontrado');
      return;
    }

    if (!block.signature?.key) {
      toast.error('Quadra não compartilhada');
      return;
    }

    const params = geParamsNavigateShare(block, block.signature.key);
    await navigatorShare(params);
  };

  const blockNavigation = (territoryId: string, blockId: string, round: string) => {
    const query = new URLSearchParams({ round });
    navigation.push(`/territorio/${territoryId}/quadra/${blockId}?${query.toString()}`);
  };

  return {
    share,
    copyShare,
    blockNavigation,
  };
};
