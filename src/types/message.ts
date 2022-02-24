import { PageParams } from './';

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
