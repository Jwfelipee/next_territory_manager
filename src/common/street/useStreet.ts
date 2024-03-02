import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';

import { Mode } from '@/common/loading';
import { streetGateway } from '@/infra/Gateway/StreetGateway';
import { authState } from '@/states/auth';

import { Street } from './type';

export const useStreet = (addressId: string, blockId: string, territoryId: string, round: string) => {
  const [isLoading, setIsLoading] = useState<Mode>('loading');
  const [street, setStreet] = useState<Street>({
    streetName: '',
    blockName: '',
    territoryName: '',
    houses: [],
  } as Street);
  const [values, setValues] = useRecoilState(authState);

  const getStreet = useCallback(
    async (addressId: string, blockId: string, territoryId: string, round: string) => {
      if (!addressId || !blockId || !territoryId) return;
      const { data, status } = await streetGateway.getStreetHouses({
        addressId,
        blockId,
        territoryId,
        round,
      });
      if (status > 299) {
        setValues({ ...values, notFoundStatusCode: status });
        setIsLoading('not-found');
        return;
      }
      setStreet({
        ...data,
      });
      setIsLoading('screen');
    },
    [setValues, values]
  );

  useEffect(() => {
    void getStreet(addressId, blockId, territoryId, round);
    return () => {
      toast.dismiss();
      setStreet({
        streetName: '',
        blockName: '',
        territoryName: '',
        houses: [],
      } as Street);
    };
  }, [addressId, blockId, getStreet, round, territoryId]);

  const markRow = async (id: string) => {
    let statusHouse = false;
    street.houses.forEach((h) => {
      if (h.id === id) {
        h.status = !h.status;
        statusHouse = h.status;
      }
    });
    setStreet({ ...street });

    const input = {
      addressId,
      blockId,
      territoryId,
      houseId: id,
      status: statusHouse,
      round,
    };

    const { status } = await streetGateway.markHouse(input);
    if (status === 403) {
      street.houses.map((h) => {
        if (h.id === id) {
          h.status = !h.status;
        }
      });
      setStreet({ ...street });
      throw new Error('Você não tem permissão para alterar o status dessa casa.');
    }
    if (status === 503) {
      setIsLoading('loading');
      setTimeout(() => getStreet(addressId, blockId, territoryId, round), 5000);
      throw new Error('Servidor fora do ar.');
    }
  };

  const markRowSocket = () => getStreet(addressId, blockId, territoryId, round);

  return {
    street,
    getStreet,
    actions: {
      mark: markRow,
      markRowSocket,
    },
    isLoading,
    setIsLoading,
  };
};
