import { LoginParams } from '../types';
import request from '../core/request';
import event from '../core/eventEmitter';
import { GetChatsByUserIdParams, GetRoomsParams } from '../types';
import { login } from '../core/utils';
import MQTT from '../core/mqtt';
import { getUserInfoFromToken, LOCALSTORAGE_KEY_MAP } from '../core/config';
import { EventTypes } from '../types';

import { Message } from '../message';
import { Channel } from '../channel';
import { User } from '../user';
import { Chats } from '../chats';
import { Thread } from '../thread';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  // ws: socket | undefined;
  mqtt: any | undefined;
  listeners: event;
  _listeners: event;
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
      localStorage.setItem(LOCALSTORAGE_KEY_MAP.ACCESS_TOKEN, props);
      this.mqtt = new MQTT(props);
    }
    this.subscribe();
    this.listeners = new event();
    this._listeners = new event();
    this.channel = new Channel();
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

  subscribe = async () => {
    if (!this.token) {
      throw new Error('The Token is required!');
    }
    const userId = getUserInfoFromToken(this.token).user_id;
    this.mqtt.subscribe(userId);
    const { data: chats = [] } = await this.getChatsByUserId({
      user_id: userId,
      page: 1,
      size: 10,
    });
    chats.forEach((item: any) => {
      this.mqtt.subscribe(item.room_id);
    });
  };

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
  off = (eventName: EventTypes, callback: any) => this.listeners.off(eventName, callback);
  once = (eventName: EventTypes, callback: any) => this.listeners.once(eventName, callback);

  _on = (eventName: EventTypes, callback: any) => this._listeners.on(eventName, callback);
  _emit = (eventName: EventTypes, ...args: any[]) => this._listeners.emit(eventName, ...args);
  // _off = (eventName: EventTypes, callback: any) => this._listeners.off(eventName, callback);
  // _once = (eventName: EventTypes, callback: any) => this._listeners.once(eventName, callback);

  getRooms = (params: GetRoomsParams): Promise<any> => {
    return request.post('/rooms', params);
  };

  getChatsByUserId = (params: GetChatsByUserIdParams): Promise<any> => {
    return request.post('/my_chats', params);
  };
}
