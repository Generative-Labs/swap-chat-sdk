/* eslint-disable no-unused-vars */
export interface LoginRandomSecret {
  wallet_address: string;
}

export interface LoginParams {
  login_random_secret: string;
  signature: string;
  wallet_address: string;
  appid?: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface LoginRandomSecretParams {
  wallet_address: string;
}

export type PlatformType = 'invite_code' | 'twitter';

export enum PLATFORM_ENUM {
  TWITTER = 'twitter',
  DISCORD = 'discord',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  OPENSEA = 'opensea',
}

export interface RegisterParams {
  platform: PLATFORM_ENUM;
  user_name: string;
}

export interface CreateContractsParams {
  contract_id?: string;
  erc20s: string[];
  amounts: number[];
  NFTs: any[];
  NFTIDs: any[];
  recipient_id?: string; // userid
  expiration: number;
}

export interface UpdateWalletAddressParams {
  user_id: string;
  wallet_address: string;
}

export interface GetOpenSeaAssetParams {
  owner: string;
  offset: number;
  limit: number;
}

export interface GetOpenSeaAssetResponse {
  assets: any[];
}
