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
