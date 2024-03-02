import AxiosAdapter from '../http/AxiosAdapter';
import HttpClient, { ResponseHttp } from '../http/HttpClient';

// eslint-disable-next-line @typescript-eslint/no-namespace

interface StreetGatewayParamsMarkHouse {
  addressId: string;
  territoryId: string;
  blockId: string;
  houseId: string;
  status: boolean;
  round: string;
}

interface StreetGatewayParamsGetStreetHouses {
  addressId: string;
  territoryId: string;
  blockId: string;
  round: string;
}

export type CreateHouseInput = {
  streetId: number;
  number: string;
  legend: string;
  dontVisit: boolean;
  territoryId: number;
  blockId: number;
};

class StreetGateway {
  constructor(private readonly httpClient: HttpClient) {}

  getStreetHouses({ addressId, territoryId, blockId, round }: StreetGatewayParamsGetStreetHouses): Promise<ResponseHttp> {
    const query = new URLSearchParams({ round });
    return this.httpClient.get(`territories/${territoryId}/blocks/${blockId}/address/${addressId}?${query.toString()}`);
  }

  markHouse({ addressId, territoryId, blockId, houseId, status, round }: StreetGatewayParamsMarkHouse): Promise<ResponseHttp> {
    return this.httpClient.patch(`territories/${territoryId}/blocks/${blockId}/address/${addressId}/houses/${houseId}`, { status, round });
  }

  getHouseById(houseId) {
    return this.httpClient.get(`houses/${houseId}`);
  }

  getAll(territoryId: number) {
    return this.httpClient.get(`territories/${territoryId}/addresses`);
  }

  createHouse(house: CreateHouseInput) {
    return this.httpClient.post(`houses`, house);
  }

  deleteHouse(houseId: number) {
    return this.httpClient.delete(`houses/${houseId}`);
  }

  updateHouse(house: CreateHouseInput, houseId: number) {
    return this.httpClient.put(`houses/${houseId}`, house);
  }

  revokeAccess(territoryId: number, blockId: number) {
    return this.httpClient.delete(`territories/${territoryId}/blocks/${blockId}/signature`);
  }

  getPhoneReport() {
    return this.httpClient.get(`tenancy/info`);
  }
}

export const streetGateway = new StreetGateway(new AxiosAdapter());
