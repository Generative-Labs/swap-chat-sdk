import type { PacketCallback } from 'mqtt';
import event from '../core/eventEmitter';
import { Web2Connect } from '../core/web2Connect';
import { Web3Connect } from '../core/web3Connect';
import { NotifyConnect } from '../core/notifyConnect';
import { login, setToken } from '../core/utils';

import { OptionsType, LoginParams, EventTypes } from '../types';

import { Message } from '../message';
import { Channel } from '../channel';
import { User } from '../user';
import { Contact } from '../contact';

export class Web3MQ {
  private static _instance: Web3MQ | null;
  token?: string;
  mqtt?: Web2Connect | Web3Connect | NotifyConnect;
  options: OptionsType;
  listeners: event;
  channel: Channel;
  messages: Message;
  user: User;
  contact: Contact;

  /**
   *
   * @param {LoginParams | string} props - Login params or token
   * @param {OptionsType} options - Web2 is used by default and system notifications are enabled
   */

  constructor(props: LoginParams | string, options?: OptionsType) {
    const defaultOptions = { sdkType: 'web2', isNotify: true } as OptionsType;
    this.options = options ? { ...defaultOptions, ...options } : defaultOptions;
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.initSDK(access_token);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      setToken(props);
      this.initSDK(props);
    }
    this.listeners = new event();
    this.channel = new Channel(this);
    this.messages = new Message(this);
    this.user = new User(this);
    this.contact = new Contact(this);
  }

  public static getInstance = (props: LoginParams | string, options?: OptionsType) => {
    if (!Web3MQ._instance) {
      Web3MQ._instance = new Web3MQ(props, options);
    }
    return Web3MQ._instance as Web3MQ;
  };

  private initSDK = (token: string) => {
    const { sdkType, isNotify } = this.options;
    console.log(this.options);
    if (sdkType === 'web2') {
      this.mqtt = new Web2Connect(token, isNotify);
    }
    if (sdkType === 'web3') {
      this.mqtt = new Web3Connect(token, isNotify);
    }
    // Developed later as a separate feature
    if (sdkType === 'none' && isNotify) {
      this.mqtt = new NotifyConnect(token);
    }
  };

  send = (messageData: any, callback?: PacketCallback) => {
    if (!this.mqtt) {
      throw new Error('Websocket is not initialized');
    }
    if (!this.token) {
      throw new Error('The Token is required!');
    }
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
  emit = (eventName: EventTypes, data: { type: EventTypes; data?: any }) =>
    this.listeners.emit(eventName, data);
  off = (eventName: EventTypes, callback?: any) => this.listeners.off(eventName, callback);
  once = (eventName: EventTypes, callback: any) => this.listeners.once(eventName, callback);
}
