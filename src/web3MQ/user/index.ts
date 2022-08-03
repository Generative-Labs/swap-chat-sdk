import { Client } from '../client';
import { ClientKeyPaires } from '../types';
import { searchUsersRequest, getMyProfileRequest, updateMyProfileRequest } from '../api';
import { getParams } from '../core/utils';

export class User {
  private readonly _client: Client;
  private readonly _keys: ClientKeyPaires;
  constructor(client: Client) {
    this._client = client;
    this._keys = client.keys;
  }

  async SearchUsers(walletAddress: string) {
    const params = await getParams(this._keys);
    const data = await searchUsersRequest({ ...params, keyword: walletAddress });
    return data;
  }

  async getMyProfile() {
    const params = await getParams(this._keys);
    const data = await getMyProfileRequest(params);
    return data;
  }

  async updateMyProfile(nickname: string, avatar_url: string) {
    const params = await getParams(this._keys);
    const data = await updateMyProfileRequest({ ...params, nickname, avatar_url });
    return data;
  }
}
