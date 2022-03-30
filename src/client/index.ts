import { LoginParams } from '../types';
import request from '../core/request';
import event from '../core/eventEmitter';
import { GetChatsByUserIdParams, GetRoomsParams } from '../types';
import { login } from '../core/utils';
import { Message } from '../message';
import { Room } from '../room';
import { User } from '../user';
import MQTT from '../core/mqtt';
import { getUserInfoFromToken } from 'src/core/config';
import { Channel } from '../channel';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  // ws: socket | undefined;
  mqtt: any | undefined;
  _eventEmitter: event;
  channel: Channel | null;

  constructor(props: LoginParams | string) {
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.mqtt = new MQTT(access_token);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      this.mqtt = new MQTT(props);
    }
    this.subscribe();
    this._eventEmitter = new event();
    this.channel = null;
  }

  public static getInstance = (props: LoginParams | string) => {
    if (!HouseChat._instance) {
      HouseChat._instance = new HouseChat(props);
    }
    return HouseChat._instance as HouseChat;
  };

  createMessage = () => {
    return new Message();
  };

  createRoom = () => {
    return new Room();
  };

  createUser = () => {
    return new User();
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
