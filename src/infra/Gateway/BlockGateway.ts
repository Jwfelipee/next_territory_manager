import AxiosAdapter from '../http/AxiosAdapter';
import HttpClient, { ResponseHttp } from '../http/HttpClient';

class BlockGateway {
  constructor(private readonly httpClient: HttpClient) {}

  signInBlock(data: { blockId: string; territoryId: string }): Promise<ResponseHttp> {
    return this.httpClient.post(`territories/${data.territoryId}/blocks/${data.blockId}/signature`, {});
  }

  getBlock(blockId: string, territoryId: string, round: string): Promise<ResponseHttp> {
    const query = new URLSearchParams({ round });
    return this.httpClient.get(`territories/${territoryId}/blocks/${blockId}?${query.toString()}}`);
  }

  revokeBlock(data: { blockId: string; territoryId: number }): Promise<ResponseHttp> {
    return this.httpClient.delete(`territories/${data.territoryId}/blocks/${data.blockId}/signature`);
  }
}

export const blockGateway = new BlockGateway(new AxiosAdapter());
