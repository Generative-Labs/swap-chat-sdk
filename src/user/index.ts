import { Web3MQ } from '../client';
import {
  MemberUserInfo,
  LoginResponse,
  PlatformType,
  RegisterParams,
  CreateContractsParams,
  UpdateWalletAddressParams,
  GetOpenSeaAssetParams,
  GetOpenSeaAssetResponse,
  UserInfo,
  GetOpenseaUserInfoParams,
  GetNextIdUserInfoParams,
  GetTwitterUserInfoParams,
  CreateNextIdUserParams,
} from '../types';
import request from '../core/request';
import { getUserInfoFromToken } from '../core/utils';
import { NEXT_ID_HOST } from '../core/config';

export class User {
  _client: Web3MQ;
  userInfo: UserInfo;

  constructor(client: Web3MQ) {
    this._client = client;
    this.userInfo = getUserInfoFromToken(client.token as string);
  }

  getUserName = (from_uid: string) => {
    const { channel } = this._client;
    const members = channel.activeChannel?.members.concat(this.userInfo);
    const member = members?.find((m: MemberUserInfo) => m.user_id === from_uid);
    return member?.user_name || '';
  };

  submitInvitedCode = (params: string, platform: PlatformType): Promise<any> => {
    return request.post<LoginResponse>('/verify_platform', {
      data: params,
      platform,
    });
  };

  getUserInfoForPlatform = (params: RegisterParams): Promise<any> => {
    return request.post<any>('/info', params);
  };

  searchUsersByName = (params: { keyword: string }): Promise<any> => {
    return request.post('/search', params);
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

  /**
   * @name 获取twitter用户信息
   * @param params
   */
  getTwitterUserInfo(params: GetTwitterUserInfoParams): Promise<any> {
    return request.post('/twitter_user_info', params);
  }

  /**
   * @name 获取opensea用户信息
   * @param params
   */
  getOpenseaUserInfo(params: GetOpenseaUserInfoParams): Promise<any> {
    return request.post('/opensea_user_info', params);
  }

  /**
   * @name 获取nextid用户信息
   * @param params
   */
  getNextIdUserInfo(params: GetNextIdUserInfoParams) {
    return request.get(
      `${NEXT_ID_HOST}/v1/proof?platform=${params.platform}&identity=${params.identity}`,
    );
  }

  /**
   * @name 创建nextid用户
   * @param params
   */
  createNextIdUser(params: CreateNextIdUserParams) {
    return request.post(`${NEXT_ID_HOST}/v1/proof`, params);
  }
}
