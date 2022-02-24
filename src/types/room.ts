import { PageParams } from './';

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

