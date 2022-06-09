import request from '../core/request';
import { CreateThreadsParams, GetMessageParams, GetThreadsParams, MessageResponse } from '../types';
import { Web3MQ } from '../client';
import { PAGE_SIZE } from '../core/config';

export class Message {
  _client: Web3MQ;
  _messagePage: number;
  _threadPage: number;
  _roomId: string;
  activeMessage: MessageResponse | null;
  messageList: MessageResponse[] | null;
  threadList: MessageResponse[] | null;

  constructor(client: Web3MQ) {
    this._client = client;
    this.messageList = null;
    this.threadList = null;
    this.activeMessage = null;
    this._messagePage = 1;
    this._threadPage = 1;
    this._roomId = '';
    this._client.receive(this.receiveMessage);
  }

  getMessageList = async (props: { room_id: string }) => {
    this._messagePage = 1;
    this._roomId = props.room_id;
    const { data = [] } = await this.getMessages({
      ...props,
      page: this._messagePage,
    });
    this.messageList = data ? data.reverse() : [];
    this._client.emit('message.getList', { type: 'message.getList', data });
  };

  loadMoreMessageList = () => {
    return new Promise(async (resolve) => {
      this._messagePage++;
      const { data = [] } = await this.getMessages({
        room_id: this._roomId,
        page: this._messagePage,
      });
      this.messageList = [...data.reverse(), ...(this.messageList as [])];
      this._client.emit('message.getList', { type: 'message.getList', data });
      resolve(true);
    });
  };

  loadMoreThreadList = () => {
    const { to_room_id = '', id = '' } = this.activeMessage || {};
    return new Promise(async (resolve) => {
      this._threadPage++;
      const { data = [] } = await this.getMessageListByThread({
        room_id: to_room_id,
        belong_to_thread_id: id,
        page: this._threadPage,
      });
      this.threadList = [...(data ? data.reverse() : []), ...(this.threadList as [])];
      this._client.emit('message.getThreadList', { type: 'message.getThreadList', data });
      resolve(true);
    });
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
    console.log('接受消息-------', newMessage);
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
    if (this._client.channel.activeChannel?.room_id === to) {
      this.messageList?.push(newMessage);
    }
    this._client.channel.onNewMessage(newMessage);
    this._client.emit('message.getList', {
      type: 'message.getList',
      data: this.messageList,
    });
  };

  getMessages = (params: GetMessageParams): Promise<any> => {
    return request.post('/messages', { ...params, size: PAGE_SIZE });
  };

  getMessageById = (msgId: string): Promise<MessageResponse> => {
    return request.get(`/messages/${msgId}`);
  };

  getMessageListByThread = (params: GetThreadsParams): Promise<any> => {
    const { room_id, page = 1, size = PAGE_SIZE, belong_to_thread_id } = params;
    return request.get(
      `/threads/${room_id}/${page}/${size}?belong_to_thread_id=${belong_to_thread_id}&page=${page}&size=${size}`,
    );
  };
}
