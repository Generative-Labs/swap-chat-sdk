import {
  LoginRandomSecret,
  LoginParams,
  LoginResponse,
  LoginRandomSecretParams,
  PlatformType,
  RegisterParams,
  CreateContractsParams,
  UpdateWalletAddressParams,
  GetOpenSeaAssetParams,
  GetOpenSeaAssetResponse,
} from '../types/user';
import request from '../core/request';
import { PageParams } from '../types';

export class User {
  constructor() {}

  // 移出去
  register = (params: RegisterParams): Promise<any> => {
    return request.post('/register', params);
  };

  login = (params: LoginParams): Promise<any> => {
    return request.post<LoginResponse>('/login', params);
  };

  getLoginRandomSecret = (params: LoginRandomSecretParams): Promise<any> => {
    return request.post<LoginRandomSecret>('/login_random_secret', params);
  };

  submitInvitedCode = (params: string, platform: PlatformType): Promise<any> => {
    return request.post<LoginResponse>('/verify_platform', {
      data: params,
      platform,
    });
  };

  getUserInfo = (params: RegisterParams): Promise<any> => {
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

  getContacts = (params: PageParams): Promise<any> => {
    return request.get(`/contacts/${params.page}/${params.size}`);
  };
}
