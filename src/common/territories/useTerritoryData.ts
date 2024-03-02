import dayjs from 'dayjs';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

import { ITerritoryCard } from '@/components/Organisms/TerritoryCard/type';

import { Mode } from '@/common/loading';
import { TerritoryTypes } from '@/common/territories/useTerritories';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';
import AxiosAdapter from '@/infra/http/AxiosAdapter';
import { authState } from '@/states/auth';

export interface Round {
  id: number;
  roundNumber: number;
  houseId: number;
  territoryId: number;
  blockId: number;
  completed: boolean;
  startDate: Date;
  updateDate: Date | null;
  endDate: Date | null;
  tenantId: number;
}

const axios = new AxiosAdapter();

export const useTerritoryData = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [territoryTypes, setTerritoryTypes] = useState({
    options: [] as TerritoryTypes[],
    selected: '',
  });
  const [territoryRound, setTerritoryRound] = useState({
    options: [] as number[],
    selected: '',
  });
  const [values, setValues] = useRecoilState(authState);
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [territoryCards, setTerritoryCards] = useState<ITerritoryCard[]>([]);

  const getTerritoryRound = async (): Promise<string> => {
    setIsLoading('loading');
    if (territoryRound.selected) return territoryRound.selected;

    const { data: rounds } = await axios.get<Round[]>('rounds');
    if (!rounds || !rounds?.length) {
      setValues({ ...values, notFoundStatusCode: 404 });
      toast.error('Nenhuma rodada encontrada');
      setIsLoading('not-found');
      return '';
    }

    const roundsSort = rounds.sort((a, b) => b.roundNumber - a.roundNumber);
    setTerritoryRound({
      options: roundsSort.map((round) => round.roundNumber),
      selected: territoryRound.selected || roundsSort[0].roundNumber.toString(),
    });
    return roundsSort[0].roundNumber.toString();
  };

  const getTerritoryType = async (): Promise<string> => {
    if (territoryTypes.selected) return territoryTypes.selected;

    const { status, data } = await TerritoryGateway.in().getTerritoryTypes<TerritoryTypes[]>();
    if (!data) {
      setValues({ ...values, notFoundStatusCode: status });
      toast.error('Nenhum tipo de território encontrado');
      setIsLoading('not-found');
      return '';
    }

    const typesSorted = data
      .sort((a, b) => b.name.localeCompare(a.name))
      .filter((type) => type.name.includes('Residencial') || type.name.includes('Comercial'));
    setTerritoryTypes({
      options: typesSorted,
      selected: territoryTypes.selected || typesSorted[0].id.toString(),
    });
    return typesSorted[0].id.toString();
  };

  const getTerritoryCards = async (search?: string): Promise<void> => {
    const [selectedRoundNumber, selectedType] = await Promise.all([getTerritoryRound(), getTerritoryType()]);

    const { status, data } = await TerritoryGateway.in().get(selectedRoundNumber, selectedType.toString(), search ?? searchQuery);
    if (status > 299) {
      setValues({ ...values, notFoundStatusCode: status });
      setIsLoading('not-found');
      return;
    }

    const territoryCards = data.map((territory: ITerritoryCard) => {
      const queryRound = new URLSearchParams({ round: selectedRoundNumber });
      const p = `territorio/${territory.territoryId}?${queryRound.toString()}`;
      const s = territory?.signature.key;
      const query = new URLSearchParams(s ? { p, s } : { p });
      const origin = window.location.origin;

      const shareData = {
        title: `*DESIGNAÇÃO DE TERRITÓRIO*`,
        url: `${origin}/home?${query.toString()}`,
        text: `*DESIGNAÇÃO DE TERRITÓRIO*\n\nPrezado irmão *_${territory.overseer}_*\nsegue o link para o território *${
          territory.name
        }* que você irá trabalhar até ${dayjs(territory.signature.expirationDate).format('DD/MM/YYYY')} \n\n\r`,
      };

      return {
        ...territory,
        round: selectedRoundNumber,
        shareData,
      };
    });

    setTerritoryCards(territoryCards);
    setIsLoading('screen');
  };

  const newRound = async () => {
    setIsLoading('loading');
    await TerritoryGateway.in().startRound();
    setTerritoryRound({ options: [], selected: '' });
    await getTerritoryRound();
    await getTerritoryCards();
    setIsLoading('screen');
  };

  return {
    search: searchQuery,
    setSearch: setSearchQuery,
    round: territoryRound,
    setRound: setTerritoryRound,
    types: territoryTypes,
    setTypes: setTerritoryTypes,
    isLoading,
    territoryCards,
    setTerritoryCards,
    getTerritoryCards,
    newRound,
  };
};
