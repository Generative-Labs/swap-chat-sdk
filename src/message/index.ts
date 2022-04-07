import request from '../core/request';
import {
  CreateThreadsParams,
  GetRoomInfoParams,
  GetThreadsParams,
  MessageResponse,
} from '../types';
import { HouseChat } from '../client';

export class Message {
  _client: HouseChat;
  messageList: MessageResponse[] | null;
  message: MessageResponse | null;
  threadList: MessageResponse[] | null;

  constructor(client: HouseChat) {
    this._client = client;
    this.messageList = null;
    this.threadList = null;
    this.message = null;
  }

  getMessageList = async (props: GetRoomInfoParams) => {
    const { data = [] } = await request.post('/messages', props);
    this.messageList = data.reverse();
    this._client.emit('message.getList', { type: 'message.getList', data });
  };

  openThread = async (message: MessageResponse | null) => {
    if (message === null) {
      return;
    }
    this.message = message;
    const params: CreateThreadsParams = {
      msg_id: message.id,
    };

    if (!message.is_thread) {
      await request.post('/threads', params);
    }

    const { data } = await this.getMessageListByThread({
      page: 1,
      size: 20,
      room_id: message.to_room_id,
      belong_to_thread_id: message.id,
    });
    if (data) {
      this.threadList = data.reverse();
      return data;
    }

  };

  getMessageListByThread = (params: GetThreadsParams): Promise<any> => {
    return request.get(
      `/threads/${params.room_id}/${params.page}/${params.size}?belong_to_thread_id=${params.belong_to_thread_id}&page=${params.page}&size=${params.size}`,
    );
  };
}
