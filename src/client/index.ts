import request from '../core/request';
import event from '../core/eventEmitter';
import { getUserAvatar, login, setToken } from '../core/utils';
import MQTT from '../core/mqtt';

import {
  LoginParams,
  MsgTypeEnum,
  PageParams,
  SendMessageData,
  EventTypes,
  GetRoomsParams,
  UserInfo,
} from '../types';

import { Message } from '../message';
import { Channel } from '../channel';
import { User } from '../user';
import { Contact } from '../contact';

export class Web3MQ {
  private static _instance: Web3MQ | null;
  token?: string;
  mqtt: any | undefined;
  listeners: event;
  channel: Channel;
  messages: Message;
  user: User;
  contact: Contact;

  constructor(props: LoginParams | string) {
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.mqtt = new MQTT(access_token);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      setToken(props);
      this.mqtt = new MQTT(props);
    }
    this.listeners = new event();
    this.channel = new Channel(this);
    this.messages = new Message(this);
    this.user = new User(this);
    this.contact = new Contact(this);
    this.subscribe();
  }

  public static getInstance = (props: LoginParams | string) => {
    if (!Web3MQ._instance) {
      Web3MQ._instance = new Web3MQ(props);
    }
    return Web3MQ._instance as Web3MQ;
  };

  /**
   * Subscribe per room
   * @param {GetRoomsParams}
   */
  async subscribe(params?: GetRoomsParams) {
    const { data } = await this.getMyRooms(params);
    data.forEach((channelItem) => this.mqtt.subscribe(channelItem));
  }

  /**
   * 查询所有联系人
   * @param {PageParams}
   */
  async queryContacts(options?: PageParams) {
    return this.contact.queryContacts(options);
  }

  /**
   * 搜索所有联系人
   * @param userName
   */

  async queryUsers(userName: string) {
    const { data: users } = await this.user.searchUsersByName({
      keyword: userName,
    });
    return users.map((user: UserInfo) => {
      return {
        ...user,
        ...getUserAvatar(user),
        userId: user.user_id,
      };
    });
  }

  send = (text: string, isThread: boolean, callback?: () => void | undefined) => {
    if (!this.mqtt) {
      throw new Error('Websocket is not initialized');
    }
    if (!this.token) {
      throw new Error('The Token is required!');
    }

    const roomId = this.channel.activeChannel?.room_id || '';
    const { id: messageId = '' } = this.messages.activeMessage || {};
    const messageData: SendMessageData = {
      from_uid: this.user.userInfo.user_id,
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
      reply_to_msg_id: '',
      created_at: Date.now() * 1000000,
      at_user_ids: [],
    };
    return this.mqtt.send(messageData, callback);
  };

  // eslint-disable-next-line no-unused-vars
  receive = (fn: (message: any) => void) => {
    if (!this.mqtt) {
      throw new Error('Websocket is not initialized');
    }
    this.mqtt.receive = fn;
  };

  on = (eventName: EventTypes, callback: any) => this.listeners.on(eventName, callback);
  emit = (eventName: EventTypes, ...args: any[]) => this.listeners.emit(eventName, ...args);
  off = (eventName: EventTypes, callback?: any) => this.listeners.off(eventName, callback);
  once = (eventName: EventTypes, callback: any) => this.listeners.once(eventName, callback);

  getMyRooms = (params?: GetRoomsParams): Promise<{ data: string[] }> => {
    return request.get('/my_rooms', params as any);
  };
}
