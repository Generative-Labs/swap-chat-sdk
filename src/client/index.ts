import { LoginParams } from '../types/user';
import socket from '../core/socket';
import request from '../core/request';
import event from '../core/eventEmitter';
import { GetChatsByUserIdParams, GetRoomsParams } from '../types';
import { login } from '../core/utils';
import { Message } from '../message';
import { Room } from '../room';
import { User } from '../user';

export class HouseChat {
  private static _instance?: unknown | HouseChat;
  token: string | undefined;
  ws: socket | undefined;
  _eventEmitter: event;

  constructor(props: LoginParams | string) {
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.ws = new socket(access_token);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      this.ws = new socket(props);
    }
    this._eventEmitter = new event();
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

  send = (data: any, callback?: () => void | undefined) => {
    if (!this.ws) {
      throw new Error('Websocket is not initialized');
    }
    return this.ws.send(data, callback);
  };

  // eslint-disable-next-line no-unused-vars
  receive = (fn: (message: any) => void) => {
    if (!this.ws) {
      throw new Error('Websocket is not initialized');
    }
    this.ws.receive = fn;
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
