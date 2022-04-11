import { LoginParams, PageParams, RegisterParams, SendMessageData } from '../types';
import request from '../core/request';
import event from '../core/eventEmitter';
import { GetRoomsParams, UserInfo } from '../types';
import { login } from '../core/utils';
import MQTT from '../core/mqtt';
import { EventTypes } from '../types';

import { Message } from '../message';
import { Channel } from '../channel';
import { User } from '../user';
import { ContactManage } from '../contactManage';
import { getUserInfoFromToken, setToken } from '../core/config';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  // ws: socket | undefined;
  mqtt: any | undefined;
  listeners: event;
  _listeners: event;
  channel: Channel;
  messages: Message;
  user: User;
  contactManage: ContactManage;

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
    this._listeners = new event();
    this.channel = new Channel(this);
    this.messages = new Message(this);
    this.user = new User(this);
    this.contactManage = new ContactManage(this);
    this.subscribe();
  }

  public static getInstance = (props: LoginParams | string) => {
    if (!HouseChat._instance) {
      HouseChat._instance = new HouseChat(props);
    }
    return HouseChat._instance as HouseChat;
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
    return this.contactManage.queryContacts(options);
  }

  /**
   * 搜索所有联系人
   * @param userName
   */

  async queryUsers(userName: string) {
    const platforms = ['twitter', 'discord', 'facebook', 'instagram', 'opensea'];
    const promiseAll = platforms.map((platform) =>
      this.user.getUserInfoForPlatform(<RegisterParams>{
        platform: platform,
        user_name: userName,
      }),
    );
    const promiseResults = await Promise.allSettled(promiseAll);
    const _searchResults: UserInfo[] = [];
    promiseResults.forEach((resultItem) => {
      const { status } = resultItem;
      if (status === 'fulfilled' && resultItem.value) {
        const { data } = resultItem.value;
        _searchResults.push(data);
      }
    });
    return _searchResults;
  }

  send = (text: string, callback?: () => void | undefined) => {
    if (!this.mqtt) {
      throw new Error('Websocket is not initialized');
    }
    if (!this.token) {
      throw new Error('The Token is required!');
    }

    const roomId = this.channel.activeChannel?.room_id || '';
    const { id: messageId = '' } = this.messages.activeMessage || {};
    const messageData: SendMessageData = {
      from_uid: getUserInfoFromToken(this.token).user_id,
      to: roomId,
      msg_contents: text,
      msg_type: 'text',
      is_opensea_item_thread: false,
      opensea_item_contract_address: '',
      opensea_item_token_id: '',
      opensea_item_name: '',
      opensea_item_description: '',
      opensea_item_image_url: '',
      belong_to_thread_id: messageId,
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

  _on = (eventName: EventTypes, callback: any) => this._listeners.on(eventName, callback);
  _emit = (eventName: EventTypes, ...args: any[]) => this._listeners.emit(eventName, ...args);
  // _off = (eventName: EventTypes, callback: any) => this._listeners.off(eventName, callback);
  // _once = (eventName: EventTypes, callback: any) => this._listeners.once(eventName, callback);

  getMyRooms = (params?: GetRoomsParams): Promise<{ data: string[] }> => {
    return request.get('/my_rooms', params as any);
  };
}
