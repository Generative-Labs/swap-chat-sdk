import { EVENT_MAP } from './core/events';

export type EventTypes = 'all' | keyof typeof EVENT_MAP;

export type ServiceResponse = {
  data: any;
  msg: string;
  code: number;
};

export type PageParams = {
  page?: number;
  size?: number;
};

export type KeyPairsType = {
  PrivateKey: string;
  PublicKey: string;
};

export interface ClientKeyPaires extends KeyPairsType {
  userid: string;
}

export type SavePublicKeyParams = {
  userid: string;
  pubkey: string;
  signature: string;
  sign_content: string;
  wallet_address: string;
  wallet_type: 'eth';
  timestamp: number;
};

export type BaseParams = {
  userid: string;
  signature: string;
  timestamp: number;
};

export interface createRoomParams extends PageParams {
  userid: string;
  signature: string;
  timestamp: number;
}

export type ActiveChannelType = {
  topic: string;
  topic_type: string;
};

export interface getMessageListParams extends createRoomParams {
  topic: string;
}

export interface getGroupMemberListParams extends createRoomParams {
  groupid: string;
}

export interface inviteGroupMemberParams extends BaseParams {
  groupid: string;
  members: string[];
}

export type MessageStatus = 'delivered' | 'read';

export interface changeMessageStatusParams extends BaseParams {
  topic: string;
  messages: string[];
  status: MessageStatus;
}

export interface searchParams extends BaseParams {
  keyword: string;
}

export interface profileParams extends BaseParams {
  nickname: string;
  avatar_url: string;
}

export interface sendFriendParams extends BaseParams {
  target_userid: string;
}

export type ActionType = 'agree';

export interface operationFriendParams extends BaseParams {
  target_userid: string;
  action: ActionType;
}
