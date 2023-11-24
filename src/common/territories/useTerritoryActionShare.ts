import dayjs from 'dayjs';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';

import { ITerritoryCard } from '@/common/territories/type';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';
import { navigatorShare } from '@/utils/share';

export interface IUseTerritoryActionShare {
  share: (territoryId: string) => Promise<void>;
  copyShare: (territoryId: string) => Promise<void>;
}

export interface ITerritoryActionsShareProps {
  territoryCards: ITerritoryCard[];
  setTerritoryCards: Dispatch<SetStateAction<ITerritoryCard[]>>;
  round: {
    options: number[];
    selected: string;
  };
}

export const useTerritoryActionShare = (props: ITerritoryActionsShareProps): IUseTerritoryActionShare => {
  const { territoryCards, setTerritoryCards, round } = props;
  const share = async (territoryId: string): Promise<void> => {
    const territory = territoryCards.find((territory) => territory.territoryId == territoryId);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }
    const input = {
      overseer: territory.overseer,
      expirationTime: territory.signature.expirationDate,
      round: round.selected,
    };
    const { data, status } = await TerritoryGateway.in().signInTerritory(input, territoryId);
    if (status > 299) {
      toast.error('Erro ao compartilhar o território');
      return;
    }
    const { signature } = data;
    setTerritoryCards((old) =>
      old.map((territory) => {
        if (territory.territoryId === territoryId) {
          territory.signature.key = signature;
          territory.overseer = input.overseer;
        }
        return territory;
      })
    );
    const queryRound = new URLSearchParams({ round: round.selected });
    const query = new URLSearchParams({ p: `territorio/${territoryId}?${queryRound.toString()}`, s: signature });
    const origin = window.location.origin;
    const toShare = {
      title: `*DESIGNAÇÃO DE TERRITÓRIO*`,
      url: `${origin}/home?${query.toString()}`,
      text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado irmão *_${territory.overseer}_*\nsegue o link para o território *${
        territory.name
      }* que você irá trabalhar até ${dayjs(territory.signature.expirationDate).format('DD/MM/YYYY')} \n\n\r`,
    };
    await navigatorShare(toShare);
  };

  // actions share
  const copyShare = async (territoryId: string) => {
    const territory = territoryCards.find((territory) => territory.territoryId == territoryId);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }

    if (!territory.signature.key) {
      toast.error('Chave não encontrada');
      return;
    }

    const queryRound = new URLSearchParams({ round: round.selected });
    const query = new URLSearchParams({ p: `territorio/${territoryId}?${queryRound.toString()}`, s: territory.signature.key });
    const origin = window.location.origin;
    const toShare = {
      title: `*DESIGNAÇÃO DE TERRITÓRIO*`,
      url: `${origin}/home?${query.toString()}`,
      text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado irmão *_${territory.overseer}_*\nsegue o link para o território *${
        territory.name
      }* que você irá trabalhar até ${dayjs(territory.signature.expirationDate).format('DD/MM/YYYY')} \n\n\r`,
    };
    await navigatorShare(toShare);
  };
  return {
    share,
    copyShare,
  };
};
