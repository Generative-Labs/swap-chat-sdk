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
  SearchFormatUserInfo,
} from '../types';
import request from '../core/request';
import { getUserInfoFromToken } from '../core/config';

export class User {
  userInfo?: UserInfo;
  avatar?: string;
  userName?: string;
  _client: Web3MQ;
  constructor(client: Web3MQ) {
    this._client = client;
    this._initialization(this._client.token as string);
  }

  private _initialization(token: string) {
    const _userInfo: UserInfo = getUserInfoFromToken(token);
    this.userInfo = _userInfo;
    const { avatar, userName } = this.searchFormatUserInfo(_userInfo);
    this.avatar = avatar;
    this.userName = userName;
  }

  public searchFormatUserInfo(userinfo: UserInfo): SearchFormatUserInfo {
    let userName = '',
      avatar = '';
    const _userInfo = userinfo;
    avatar =
      _userInfo.twitter_avatar ||
      _userInfo.discord_avatar ||
      _userInfo.facebook_avatar ||
      _userInfo.opensea_avatar ||
      _userInfo.instagram_avatar ||
      '';
    userName =
      _userInfo.twitter_username ||
      _userInfo.discord_username ||
      _userInfo.facebook_username ||
      _userInfo.opensea_username ||
      _userInfo.instagram_username ||
      '';
    const { user_id, created_at } = _userInfo;
    return {
      avatar,
      userId: user_id,
      userName,
      createdAt: created_at,
    };
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
