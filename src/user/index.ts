import type { Client } from '../client';
import {
  // LoginResponse,
  // PlatformType,
  // RegisterParams,
  // CreateContractsParams,
  // UpdateWalletAddressParams,
  // GetOpenSeaAssetParams,
  // GetOpenSeaAssetResponse,
  UserInfo,
  // GetOpenseaUserInfoParams,
  GetNextIdUserInfoParams,
  GetUserNameTagParams,
  GetUserDotBitsParams,
  GetUserNFTListParams,
  // GetTwitterUserInfoParams,
  // CreateNextIdUserParams,
} from '../types';
import request from '../core/request';
import { getUserAvatar, getUserInfoFromToken } from '../core/utils';
import { NEXT_ID_HOST } from '../core/config';

export class User {
  _client: Client;
  userInfo: UserInfo;

  constructor(client: Client) {
    this._client = client;
    this.userInfo = getUserInfoFromToken(client.token as string);
  }

  /**
   * 搜索所有联系人
   * @param userName
   */

  async queryUsers(userName: string) {
    const { data: users } = await this.searchUsersByName({
      keyword: userName,
    });
    return users.map((user: UserInfo) => {
      return {
        ...user,
        ...getUserAvatar(user),
        userId: user.user_id,
      };
    });
  }

  searchUsersByName = (params: { keyword: string }): Promise<any> => {
    return request.post('/search', params);
  };

  // submitInvitedCode = (params: string, platform: PlatformType): Promise<any> => {
  //   return request.post<LoginResponse>('/verify_platform', {
  //     data: params,
  //     platform,
  //   });
  // };

  // getUserInfoForPlatform = (params: RegisterParams): Promise<any> => {
  //   return request.post<any>('/info', params);
  // };

  // getMyInviteCodes = (): Promise<any> => {
  //   return request.get('/my_invite_codes');
  // };

  // getNFTContractsById = (id: string): Promise<any> => {
  //   return request.get(`/contracts/${id}`);
  // };

  // createNFTContract = (params: CreateContractsParams): Promise<any> => {
  //   return request.post('/contracts', params);
  // };

  // updateWalletAddress = (params: UpdateWalletAddressParams): Promise<any> => {
  //   return request.post('/wallet', params);
  // };

  // getOpenSeaAssets = (params: GetOpenSeaAssetParams): Promise<any> => {
  //   return request.get<GetOpenSeaAssetResponse>('/opensea_assets', { params });
  // };

  // /**
  //  * @name 获取twitter用户信息
  //  * @param params
  //  */
  // getTwitterUserInfo(params: GetTwitterUserInfoParams): Promise<any> {
  //   return request.post('/twitter_user_info', params);
  // }

  // /**
  //  * @name 获取opensea用户信息
  //  * @param params
  //  */
  // getOpenseaUserInfo(params: GetOpenseaUserInfoParams): Promise<any> {
  //   return request.post('/opensea_user_info', params);
  // }

  // /**
  //  * @name 获取nextid用户信息
  //  * @param params
  //  */
  getNextIdUserInfo(params: GetNextIdUserInfoParams): Promise<any> {
    return request.get(
      `${NEXT_ID_HOST}/v1/proof?platform=${params.platform}&identity=${params.identity}`,
    );
  }

  /**
   *  @name 获取nametag
   */
  getUserNameTag(params: GetUserNameTagParams): Promise<any> {
    return request.post(`/users/${params.user_id}/nametags `, {
      wallet_address: params.wallet_address,
    });
  }

  /**
   *  @name 获取.bit
   */
  getUserDotBits(params: GetUserDotBitsParams): Promise<any> {
    return request.post(`/users/${params.user_id}/dotbits`, {
      wallet_address: params.wallet_address,
    });
  }

  // 获取用户nft列表
  getUserNFTList(params: GetUserNFTListParams): Promise<any> {
    return request.post(`/users/${params.user_id}/nfts`, {
      wallet_address: params.wallet_address,
      page: params.page,
      size: params.size,
    });
  }

  // /**
  //  * @name 创建nextid用户
  //  * @param params
  //  */
  // createNextIdUser(params: CreateNextIdUserParams) {
  //   return request.post(`${NEXT_ID_HOST}/v1/proof`, params);
  // }
}
