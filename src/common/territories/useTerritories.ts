/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter as useNavigation } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useTerritoryActionShare } from '@/common/territories/useTerritoryActionShare';
import { useTerritoryData } from '@/common/territories/useTerritoryData';
import { TerritoryGateway } from '@/infra/Gateway/TerritoryGateway';

export interface TerritoryTypes {
  id: number;
  name: string;
}

export type ITerritoryActions = {
  share: (territoryId: string) => Promise<void>;
  copyShare: (territoryId: string) => Promise<void>;
  changeRound: (id: string) => Promise<void>;
  updateData: (event: any, territoryId: string) => void;
  revoke: (territoryId: string) => Promise<any>;
  updateDateTime: (event: any, territoryId: string) => void;
  blockNavigation: (territoryId: string) => void;
};

let timeout: NodeJS.Timeout;

export const useTerritories = () => {
  const { search, setSearch, round, setRound, types, setTypes, isLoading, territoryCards, setTerritoryCards, getTerritoryCards } = useTerritoryData();
  const navigation = useNavigation();

  const blockNavigation = (territoryId: string) => {
    navigation.push(`/territorio/${territoryId}?round=${round.selected}`);
  };

  useEffect(() => {
    void getTerritoryCards();
  }, [round.selected, types.selected]);

  // actions round
  const changeRound = async (id: string): Promise<void> => {
    const territory = territoryCards.find((territory) => territory.territoryId === id);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }
    if (territory.hasRounds) {
      void (await finishRound(id));
    } else {
      void (await startRound(id));
    }

    void getTerritoryCards();
  };

  // actions round
  const finishRound = async (id: string): Promise<void> => {
    const { status } = await TerritoryGateway.in().finishRound(id);
    if (status > 299) {
      toast.error('Erro ao fechar rodada do território');
      return;
    }
  };

  // actions round
  const startRound = async (id: string): Promise<void> => {
    const { status } = await TerritoryGateway.in().startRound(id);
    if (status > 299) {
      toast.error('Erro ao abrir rodada do território');
      return;
    }
  };

  const updateData = (event: React.ChangeEvent<HTMLInputElement>, territoryId: string): void => {
    const { name, value } = event.target;
    const territory = territoryCards.find((territory) => territory.territoryId === territoryId);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }
    setTerritoryCards((old) =>
      old.map((territory) => {
        if (territory.territoryId === territoryId) {
          (territory as any)[name] = value;
        }
        return territory;
      })
    );
  };

  const updateDateTime = (event: React.ChangeEvent<HTMLInputElement>, territoryId: string): void => {
    const { value } = event.target;
    const territory = territoryCards.find((territory) => territory.territoryId === territoryId);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }
    setTerritoryCards((old) =>
      old.map((territory) => {
        if (territory.territoryId === territoryId) {
          territory.signature.expirationDate = value;
        }
        return territory;
      })
    );
  };

  // actions territory
  const revoke = async (territoryId: string): Promise<void> => {
    const territory = territoryCards.find((territory) => territory.territoryId === territoryId);
    if (!territory) {
      toast.error('Território não encontrado');
      return;
    }
    const { status } = await TerritoryGateway.in().revoke(territoryId);
    if (status > 299) {
      toast.error('Erro ao revogar o território');
      return;
    }

    void getTerritoryCards();

    setTerritoryCards((old) =>
      old.map((territory) => {
        if (territory.territoryId === territoryId) {
          territory.signature.expirationDate = '';
          territory.overseer = '';
        }
        return territory;
      })
    );
  };

  // actions search
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
    void submitSearch(event.target.value);
  };

  const submitSearch = async (search?: string): Promise<void> => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      void getTerritoryCards(search);
    }, 300);
  };

  return {
    search,
    territoryCards,
    actions: {
      changeRound,
      updateData,
      revoke,
      updateDateTime,
      blockNavigation,
      ...useTerritoryActionShare({
        territoryCards,
        setTerritoryCards,
        round,
      }),
    },
    round,
    setRound,
    types,
    setTypes,
    handleChangeSearch,
    submitSearch: () => void submitSearch(),
    isLoading,
  };
};
