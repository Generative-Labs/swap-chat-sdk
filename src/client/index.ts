import { GetChatsByUserIdParams, LoginParams, PageParams, RegisterParams } from '../types';
import request from '../core/request';
import event from '../core/eventEmitter';
import { GetRoomsParams, UserInfo } from '../types';
import { login } from '../core/utils';
import MQTT from '../core/mqtt';
import { EventTypes } from '../types';

import { Message } from '../message';
import { ChannelManage, Channel } from '../channelManage';
import { User } from '../user';
import { ContactManage } from '../contactManage';
import { setToken } from '../core/config';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  // ws: socket | undefined;
  mqtt: any | undefined;
  listeners: event;
  _listeners: event;
  channelManage: ChannelManage;
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
    this.channelManage = new ChannelManage(this);
    this.messages = new Message(this);
    this.user = new User(this);
    this.contactManage = new ContactManage(this);
  }

  public static getInstance = (props: LoginParams | string) => {
    if (!HouseChat._instance) {
      HouseChat._instance = new HouseChat(props);
    }
    return HouseChat._instance as HouseChat;
  };

  /**
   * 查询所有channels
   */
  async queryChannels(options: GetChatsByUserIdParams) {
    const channels = await this.channelManage.queryChannels(options);
    channels.forEach((channelItem: Channel) => this.mqtt.subscribe(channelItem.room_id));
    return channels;
  }

  /**
   * 查询所有联系人
   * @param options
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

  send = (data: any, callback?: () => void | undefined) => {
    if (!this.mqtt) {
      throw new Error('Websocket is not initialized');
    }
    return this.mqtt.send(data, callback);
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

  getRooms = (params: GetRoomsParams): Promise<any> => {
    return request.post('/rooms', params);
  };
}
