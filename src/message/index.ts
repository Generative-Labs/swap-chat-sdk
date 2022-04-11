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
  activeMessage: MessageResponse | null;
  messageList: MessageResponse[] | null;
  threadList: MessageResponse[] | null;

  constructor(client: HouseChat) {
    this._client = client;
    this.messageList = null;
    this.threadList = null;
    this.activeMessage = null;
    this._client.receive(this.receiveMessage);
  }

  getMessageList = async (props: GetRoomInfoParams) => {
    const { data = [] } = await request.post('/messages', props);
    this.messageList = data ? data.reverse() : [];
    this._client.emit('message.getList', { type: 'message.getList', data });
  };

  openThread = async (message: MessageResponse | null) => {
    if (message === null) {
      return;
    }

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
    this.activeMessage = message;
    this.threadList = data ? data.reverse() : [];
    this._client.emit('message.getThreadList', { type: 'message.getThreadList', data });
  };

  receiveMessage = (message: any) => {
    const { belong_to_thread_id, to } = message;
    const newMessage: MessageResponse = { ...message, to_room_id: to };

    if (belong_to_thread_id && this.activeMessage) {
      if (this.activeMessage.id === newMessage.belong_to_thread_id) {
        this.threadList?.push(newMessage);
        this._client.emit('message.getList', {
          type: 'message.getList',
          data: this.messageList,
        });
      }
      return;
    }
    this.messageList?.push(newMessage);
    this._client.channel.onNewMessage(newMessage);
    this._client.emit('message.getList', {
      type: 'message.getList',
      data: this.messageList,
    });
  };

  getMessageListByThread = (params: GetThreadsParams): Promise<any> => {
    return request.get(
      `/threads/${params.room_id}/${params.page}/${params.size}?belong_to_thread_id=${params.belong_to_thread_id}&page=${params.page}&size=${params.size}`,
    );
  };
}
