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
import { Client } from '../client';
import { PAGE_SIZE } from '../core/config';

export class Message {
  _client: Client;
  _messagePage: number;
  _threadPage: number;
  _roomId: string;
  activeMessage: MessageResponse | null;
  messageList: MessageResponse[] | null;
  threadList: MessageResponse[] | null;
  allThreadList: MessageResponse[] | null;

  constructor(client: Client) {
    this.messageList = null;
    this.threadList = null;
    this.allThreadList = null;
    this.activeMessage = null;
    this._client = client;
    this._messagePage = 1;
    this._threadPage = 1;
    this._roomId = '';
    this._client.receive(this.receiveMessage);
  }

  private getReplyInfo = async (message: MessageResponse) => {
    const { emit, channel } = this._client;
    if (message.reply_to_msg_id) {
      // 当前消息是回复消息
      let replyMsgInfo: MessageResponse | undefined =
        this.messageList?.find((m) => m.id === message.reply_to_msg_id) ||
        (
          await this.getMessageById({
            msg_id: message.reply_to_msg_id,
          })
        ).data;

      if (replyMsgInfo) {
        message.reply_msg_info = {
          user_name: channel.activeMember[replyMsgInfo.from_uid]?.user_name,
          msg_contents: replyMsgInfo.msg_contents || '',
        };
      }

      emit('message.getList', {
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

      data.forEach((m: MessageResponse) => this.getReplyInfo(m));

      this.messageList = [...data.reverse(), ...(this.messageList as [])];

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

  openAllThread = async (params?: null) => {
    if (params === null) {
      this.allThreadList = null;
      this._client.emit('message.openAllThread', { type: 'message.openAllThread', data: null });
      return;
    }
    const { data = [] } = await this.getAllThreadsList({
      room_id: this._roomId,
      page: 1,
      size: 500,
    });
    this.allThreadList = data;
    this._client.emit('message.openAllThread', { type: 'message.openAllThread', data });
  };

  receiveMessage = (message: any, topicType: string) => {
    const { notify } = this._client;
    if (topicType === 'notification') {
      notify.receiveNotify(message, topicType);
      return;
    }
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
    replyMsgInfo?: MessageResponse | null,
    callback?: PacketCallback,
  ) => {
    const { channel, user, send } = this._client;
    const roomId = channel.activeChannel?.room_id || '';
    const { id: messageId = '' } = this.activeMessage || {};

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
      created_at: Date.now() * 1000000,
      at_user_ids: [],
      reply_to_msg_id: '',
    };

    if (replyMsgInfo) {
      messageData.reply_to_msg_id = replyMsgInfo.id;
      messageData.reply_msg_info = {
        msg_contents: replyMsgInfo.msg_contents,
        user_name: channel.activeMember[replyMsgInfo.from_uid]?.user_name,
      };
    }

    send(messageData, callback);
    // emit('message.updated', { type: 'message.updated' });
  };

  // 通过 Bulk messaging 进行发送消息
  sendMessageByBulk = (text: string, room_id: string, callback?: PacketCallback) => {
    const { user, send } = this._client;
    const roomId = room_id;

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
      belong_to_thread_id: '',
      created_at: Date.now() * 1000000,
      at_user_ids: [],
      reply_to_msg_id: '',
    };

    send(messageData, callback);
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

  getAllThreadsList = (params: GetMessageParams): Promise<any> => {
    return request.get(`/threads/${params.room_id}/${params.page}/${params.size}`);
  };
}
