import { Web3MQ } from '../client';
import {
  LoginResponse,
  PlatformType,
  RegisterParams,
  CreateContractsParams,
  UpdateWalletAddressParams,
  GetOpenSeaAssetParams,
  GetOpenSeaAssetResponse,
  UserInfo,
} from '../types';
import request from '../core/request';
import { getUserInfoFromToken } from '../core/utils';

export class User {
  _client: Web3MQ;
  userInfo: UserInfo;

  constructor(client: Web3MQ) {
    this._client = client;
    this.userInfo = getUserInfoFromToken(client.token as string);
  }

  submitInvitedCode = (params: string, platform: PlatformType): Promise<any> => {
    return request.post<LoginResponse>('/verify_platform', {
      data: params,
      platform,
    });
  };

  getUserInfoForPlatform = (params: RegisterParams): Promise<any> => {
    return request.post<any>('/info', params);
  };

  getMyInviteCodes = (): Promise<any> => {
    return request.get('/my_invite_codes');
  };

  getNFTContractsById = (id: string): Promise<any> => {
    return request.get(`/contracts/${id}`);
  };

  createNFTContract = (params: CreateContractsParams): Promise<any> => {
    return request.post('/contracts', params);
  };

  updateWalletAddress = (params: UpdateWalletAddressParams): Promise<any> => {
    return request.post('/wallet', params);
  };

  getOpenSeaAssets = (params: GetOpenSeaAssetParams): Promise<any> => {
    return request.get<GetOpenSeaAssetResponse>('/opensea_assets', { params });
  };
}
