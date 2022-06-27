import type { PacketCallback } from 'mqtt';
import request from '../core/request';
import {
  CreateThreadsParams,
  MsgTypeEnum,
  SendMessageData,
  GetMessageParams,
  GetThreadsParams,
  MessageResponse,
  GetMessageByIdParams,
  ServiceResponse,
} from '../types';
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
    this.messageList = null;
    this.threadList = null;
    this.activeMessage = null;
    this._client = client;
    this._messagePage = 1;
    this._threadPage = 1;
    this._roomId = '';
    this._client.receive(this.receiveMessage);
  }

  private getReplyInfo = async (message: MessageResponse) => {
    const { user } = this._client;
    if (message.reply_to_msg_id) {
      // 当前消息是回复消息
      let replyMsgInfo: MessageResponse | null | undefined =
        this.messageList?.find((m) => m.id === message.reply_to_msg_id) ||
        (
          await this.getMessageById({
            msg_id: message.reply_to_msg_id,
          })
        ).data;

      if (replyMsgInfo) {
        message.replyMsgInfo = {
          user_name: user.getUserName(replyMsgInfo),
          msg_contents: replyMsgInfo.msg_contents || '',
        };
      }

      this._client.emit('message.getList', {
        type: 'message.getList',
        data: this.messageList,
      });
    }
  };

  getMessageList = async (props: { room_id: string }) => {
    this._messagePage = 1;
    this._roomId = props.room_id;
    const { data = [] } = await this.getMessages({
      ...props,
      page: this._messagePage,
    });
    this.messageList = data?.reverse() ?? [];

    this.messageList?.forEach((m: MessageResponse) => this.getReplyInfo(m));

    this._client.emit('message.getList', { type: 'message.getList', data });
  };

  loadMoreMessageList = async () => {
    this._messagePage++;
    try {
      const { data = [] } = await this.getMessages({
        room_id: this._roomId,
        page: this._messagePage,
      });

      this.messageList = [...data.reverse(), ...(this.messageList as [])];

      data.forEach((m: MessageResponse) => this.getReplyInfo(m));

      this._client.emit('message.getList', { type: 'message.getList', data });
      return data;
    } catch (error) {
      return [];
    }
  };

  loadMoreThreadList = async () => {
    const { to_room_id = '', id = '' } = this.activeMessage || {};
    this._threadPage++;
    try {
      const { data = [] } = await this.getMessageListByThread({
        room_id: to_room_id,
        belong_to_thread_id: id,
        page: this._threadPage,
      });
      this.threadList = [...(data ? data.reverse() : []), ...(this.threadList as [])];
      this._client.emit('message.getThreadList', { type: 'message.getThreadList', data });
      return data;
    } catch (error) {
      return [];
    }
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
    const { channel, emit } = this._client;
    const { belong_to_thread_id, to } = message;
    const newMessage: MessageResponse = { ...message, to_room_id: to };
    console.log('接受消息-------', newMessage);
    if (belong_to_thread_id && this.activeMessage) {
      if (this.activeMessage.id === newMessage.belong_to_thread_id) {
        this.threadList?.push(newMessage);
        emit('message.getList', {
          type: 'message.getList',
          data: this.messageList,
        });
        emit('message.new', { type: 'message.new', data: newMessage });
      }
      return;
    }
    if (channel.activeChannel?.room_id === to) {
      this.messageList?.push(newMessage);
    }
    channel.onNewMessage(newMessage);
    emit('message.getList', {
      type: 'message.getList',
      data: this.messageList,
    });
    if (this.messageList) {
      emit('message.new', { type: 'message.new', data: newMessage });
    }
  };

  sendMessage = (
    text: string,
    isThread: boolean,
    message?: MessageResponse,
    callback?: PacketCallback,
  ) => {
    const { channel, user, send } = this._client;
    const roomId = channel.activeChannel?.room_id || '';
    const { id: messageId = '' } = this.activeMessage || {};
    const replyMsgInfo = {
      id: message?.id,
      from_uid: message?.from_uid,
      msg_contents: message?.msg_contents,
      user_name: user.getUserName(message),
    };

    const messageData: SendMessageData = {
      from_uid: user.userInfo.user_id,
      to: roomId,
      msg_contents: text,
      msg_type: MsgTypeEnum.text,
      is_opensea_item_thread: false,
      opensea_item_contract_address: '',
      opensea_item_token_id: '',
      opensea_item_name: '',
      opensea_item_description: '',
      opensea_item_image_url: '',
      belong_to_thread_id: isThread ? messageId : '',
      reply_to_msg_id: message?.id ?? '',
      created_at: Date.now() * 1000000,
      at_user_ids: [],

      /*****  Used to retrieve data immediately, the database does not store data  *****/
      replyMsgInfo: message && !isThread ? replyMsgInfo : null,
    };
    send(messageData, callback);
    // emit('message.updated', { type: 'message.updated' });
  };

  getMessages = (params: GetMessageParams): Promise<any> => {
    return request.post('/messages', { ...params, size: PAGE_SIZE });
  };

  getMessageById = (params: GetMessageByIdParams): Promise<ServiceResponse> => {
    return request.get(`/messages/${params.msg_id}`);
  };

  getMessageListByThread = (params: GetThreadsParams): Promise<any> => {
    const { room_id, page = 1, size = PAGE_SIZE, belong_to_thread_id } = params;
    return request.get(
      `/threads/${room_id}/${page}/${size}?belong_to_thread_id=${belong_to_thread_id}&page=${page}&size=${size}`,
    );
  };
}
