export interface ServiceResponse {
  data: any;
  msg: string;
  code: number;
}

export interface PageParams {
  page: number;
  size: number;
}

export interface GetRoomsParams {
  user_id?: string;
  is_opensea_coll?: boolean;
  opensea_coll_slug?: string;
  item_contract_address?: string;
}

export interface GetChatsByUserIdParams extends PageParams {
  user_id: string;
}

export interface GetMessageByIdParams {
  msg_id: string;
}

export interface CreateThreadsParams {
  msg_id?: string;
  is_opensea_item_thread?: boolean;
  opensea_item_contract_address?: string;
  opensea_item_token_id?: string;
}

export interface GetThreadsParams extends PageParams {
  room_id: string;
  belong_to_thread_id: string;
}

export interface UserInfoInterface {
  created_at: number;
  eth_wallet_address: string;
  discord_username: string;
  facebook_username: string;
  instagram_username: string;
  opensea_username: string;
  twitter_username: string;
  twitter_avatar?: string;
  discord_avatar?: string;
  facebook_avatar?: string;
  instagram_avatar?: string;
  opensea_avatar?: string;
  nick_name: string;
  status: number;
  user_id: string;
}

export interface roomRes {
  created_at: number;
  creator: UserInfoInterface;
  description: string;
  members: UserInfoInterface[];
  name: string;
  room_id: string;
  opensea_coll_cover?: string;
  is_1v1: boolean;
}

export interface GetRoomInfoParams {
  room_id: string;
}

export interface AddMemberToRoomParams {
  room_id: string;
  target_user_id: string;
}

export interface DelMemberFromRoomParams {
  room_id: string;
  member_id: string;
}

export interface GetMessageParams extends PageParams {
  room_id: string;
}
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
