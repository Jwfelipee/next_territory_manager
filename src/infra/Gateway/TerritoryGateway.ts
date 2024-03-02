import AxiosAdapter from '../http/AxiosAdapter';
import { ResponseHttp } from '../http/HttpClient';
import HttpClient from '../http/HttpClient';
import { HttpMemoryAdapter } from '../http/HttpMemoryAdapter';

class TerritoryGatewayHttp {
  constructor(private readonly http: HttpClient) {}

  get(round: string, type: string, filter?: string): Promise<ResponseHttp> {
    const params = {
      round,
      type,
      ...(filter && { filter }),
    };
    const query = new URLSearchParams(params);
    return this.http.get(`territories?${query.toString()}`);
  }

  update(data: any): Promise<ResponseHttp> {
    return this.http.put(`territories/`, data);
  }

  revoke(id: string): Promise<ResponseHttp> {
    return this.http.delete(`territories/${id}/signature`);
  }

  finishRound(id: string): Promise<ResponseHttp> {
    return this.http.post(`territories/${id}/rounds/finish`);
  }

  startRound(): Promise<ResponseHttp> {
    return this.http.post(`rounds/start`);
  }

  signInTerritory(data: { overseer: string; expirationTime: string; round: string }, id: string): Promise<ResponseHttp> {
    return this.http.post(`territories/${id}/signature`, data);
  }

  getById(territoryId: string, round: string): Promise<ResponseHttp> {
    const query = new URLSearchParams({ round });
    return this.http.get(`territories/${territoryId}?${query.toString()}`);
  }

  getSignature(signatureId: string): Promise<ResponseHttp> {
    return this.http.get(`signature/${signatureId}`);
  }

  getTerritoryTypes<T>(): Promise<ResponseHttp<T>> {
    return this.http.get(`territories/types`);
  }

  getTerritoryBlocks<T>(id: number): Promise<ResponseHttp<T>> {
    return this.http.get(`territories/${id}/blocks`);
  }

  getTerritoryEditById<T>(id: number, query: string): Promise<ResponseHttp<T>> {
    return this.http.get(`territories/${id}/edit?${query}`);
  }
}

const territoryGatewayHttp = new TerritoryGatewayHttp(new AxiosAdapter());
const territoryGatewayMemory = new TerritoryGatewayHttp(new HttpMemoryAdapter([]));

export class TerritoryGateway {
  static in(module: 'http' | 'memory' = 'http'): TerritoryGatewayHttp {
    return module === 'http' ? territoryGatewayHttp : territoryGatewayMemory;
  }
}
