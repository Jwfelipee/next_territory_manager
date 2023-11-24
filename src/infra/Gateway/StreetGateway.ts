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

class StreetGateway {
  constructor(private readonly httpClient: HttpClient) {}

  getStreetHouses({ addressId, territoryId, blockId, round }: StreetGatewayParamsGetStreetHouses): Promise<ResponseHttp> {
    const query = new URLSearchParams({ round });
    return this.httpClient.get(`territories/${territoryId}/blocks/${blockId}/address/${addressId}?${query.toString()}`);
  }

  markHouse({ addressId, territoryId, blockId, houseId, status, round }: StreetGatewayParamsMarkHouse): Promise<ResponseHttp> {
    return this.httpClient.patch(`territories/${territoryId}/blocks/${blockId}/address/${addressId}/houses/${houseId}`, { status, round });
  }
}

export const streetGateway = new StreetGateway(new AxiosAdapter());
