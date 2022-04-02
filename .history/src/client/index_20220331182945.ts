import { ChannelData, GetChatsByUserIdParams, GetRoomsParams, LoginParams } from '../types';
import request from '../core/request';
import event from '../core/eventEmitter';
import { login } from '../core/utils';
import MQTT from '../core/mqtt';
import { setToken } from '../core/config';

import { Message } from '../message';
import { Channel } from '../channelManage';
import { User } from '../user';
import { Chats } from '../contactManage';
import { Thread } from '../thread';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  // ws: socket | undefined;
  mqtt: any | undefined;
  _eventEmitter: event;

  channel: Channel;
  messages: Message;
  users: User;
  chats: Chats;
  threads: Thread;

  constructor(props: LoginParams | string) {
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.mqtt = new MQTT(access_token);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      setToken(this.token);
      this.mqtt = new MQTT(props);
    }
    // this.subscribe();
    this._eventEmitter = new event();
    this.channel = new Channel(this);
    this.users = new User();
    this.messages = new Message(this);
    this.chats = new Chats();
    this.threads = new Thread();
  }

  public static getInstance = (props: LoginParams | string) => {
    if (!HouseChat._instance) {
      HouseChat._instance = new HouseChat(props);
    }
    return HouseChat._instance as HouseChat;
  };

  queryChannels = async () => {
    const channels: ChannelData[] = await this.channel.queryChannels();
    channels.forEach((channelData) => {
      this.mqtt.subscribe(channelData.room_id);
    });
  };
  // subscribe = async () => {
  //   if (!this.token) {
  //     throw new Error('The Token is required!');
  //   }
  //   const userId = getUserInfoFromToken(this.token).user_id;
  //   this.mqtt.subscribe(userId);
  //   const {data: contactManage = []} = await this.getChatsByUserId({
  //     user_id: userId,
  //     page: 1,
  //     size: 10,
  //   });
  //   contactManage.forEach((item: any) => {
  //     this.mqtt.subscribe(item.room_id);
  //   });
  // };

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

  on = (eventName: string | number, callback: any) => this._eventEmitter.on(eventName, callback);
  emit = (eventName: string | number, ...args: any[]) =>
    this._eventEmitter.emit(eventName, ...args);
  off = (eventName: string | number, callback: any) => this._eventEmitter.off(eventName, callback);
  once = (eventName: string | number, callback: any) =>
    this._eventEmitter.once(eventName, callback);

  getRooms = (params: GetRoomsParams): Promise<any> => {
    return request.post('/rooms', params);
  };

  getChatsByUserId = (params: GetChatsByUserIdParams): Promise<any> => {
    return request.post('/my_chats', params);
  };
}
