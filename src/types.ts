import { EVENT_MAP } from './core/events';

export type EventTypes = 'all' | keyof typeof EVENT_MAP;

export interface ServiceResponse {
  data: any;
  msg: string;
  code: number;
}

export interface PageParams {
  page?: number;
  size?: number;
}

export interface GetRoomsParams {
  user_id?: string;
  is_opensea_coll?: boolean;
  opensea_coll_slug?: string;
  item_contract_address?: string;
}

export interface GetChatsByUserIdResponse {
  created_at: string;
  creator: MemberUserInfo;
  creator_id: string;
  description: string;
  is_1v1: boolean;
  is_opensea_coll: boolean;
  latest_msg: MessageResponse;
  members: MemberUserInfo[];
  name: string;
  opensea_coll_cover: string;
  opensea_coll_name: string;
  opensea_coll_slug: string;
  room_id: string;
}

export interface GetMessageByIdParams {
  msg_id: string;
}

export type CreateThreadsParams = {
  msg_id?: string;
  is_opensea_item_thread?: boolean;
  opensea_item_contract_address?: string;
  opensea_item_token_id?: string;
};

export interface GetThreadsParams extends PageParams {
  room_id: string;
  belong_to_thread_id: string;
}

export interface RoomResponse {
  created_at: number;
  creator: MemberUserInfo;
  description: string;
  members: MemberUserInfo[];
  name: string;
  room_id: string;
  opensea_coll_cover?: string;
  is_1v1: boolean;
}

export interface GetRoomInfoParams extends PageParams {
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

export interface UserInfo {
  access_expired_at: number;
  created_at: number;
  discord_avatar: string;
  discord_username: string;
  eth_wallet_address: string;
  facebook_avatar: string;
  facebook_username: string;
  instagram_avatar: string;
  instagram_username: string;
  nick_name: string;
  opensea_avatar: string;
  opensea_username: string;
  refresh_expired_at: number;
  status: string;
  twitter_avatar: string;
  twitter_username: string;
  user_id: string;
  avatar?: string;
  user_name?: string;
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

export enum MsgTypeEnum {
  text = 'text',
  sudoSwapCard = 'sudo_swap_card',
}

export enum AssetDataTypeEnum {
  ERC20 = '1',
  ERC721 = '2',
  ERC1155 = '3',
}
export interface MsgContentsAssetData {
  address: string;
  amount: string;
  imgURL: string;
  name: string;
  symbol: string;
  type: AssetDataTypeEnum;
  id?: string;
}

export interface MsgContents {
  asset1Data: MsgContentsAssetData[];
  asset2Data: MsgContentsAssetData[];
  creatorAddress: string;
  expiryDate: string;
  jumpUrl: string;
  orderStatus: string;
  recipientAddress: string;
}
export interface MessageResponse {
  at_user_ids: any[];
  belong_to_thread_id: string;
  created_at: number;
  from_uid: string;
  id: string;
  is_opensea_item_thread: boolean;
  is_thread: boolean;
  msg_contents: string | MsgContents;
  msg_type: MsgTypeEnum;
  opensea_item_contract_address: string;
  opensea_item_description: string;
  opensea_item_image_url: string;
  opensea_item_name: string;
  opensea_item_token_id: string;
  reply_to_msg_id: string;
  to_room_id: string;
}

export interface ChannelResponse {
  created_at: number;
  creator: MemberUserInfo[];
  creator_id: number;
  description: string;
  is_1v1: boolean;
  is_opensea_coll: boolean;
  latest_msg: MessageResponse;
  members: MemberUserInfo[];
  name: string;
  opensea_coll_cover: string;
  opensea_coll_name: string;
  opensea_coll_slug: string;
  room_id: string;
}

export type SendMessageData = {
  from_uid: string;
  to: string;
  msg_contents: string;
  msg_type: MsgTypeEnum;
  is_thread?: boolean;
  is_opensea_item_thread: boolean;
  opensea_item_contract_address: string;
  opensea_item_token_id: string;
  opensea_item_name: string;
  opensea_item_description: string;
  opensea_item_image_url: string;
  belong_to_thread_id: string;
  reply_to_msg_id: string;
  created_at: number;
  at_user_ids: any[];
};

export type MembersItem = Record<string, MemberUserInfo[] | undefined>;

export type ActiveMemberItem = Record<string, MemberUserInfo>;

export type MemberUserInfo = Omit<UserInfo, 'access_expired_at'>;
