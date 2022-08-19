import type { PacketCallback } from 'mqtt';
import event from '../core/eventEmitter';
import { Connect } from '../core/connect';
import { login, setToken } from '../core/utils';

import { LoginParams, EventTypes } from '../types';

import { Message } from '../message';
import { Channel } from '../channel';
import { User } from '../user';
import { Contact } from '../contact';
import { Notify } from '../notify';

export class Client {
  private static _instance: Client | null;
  token?: string;
  mqtt?: Connect;
  listeners: event;
  channel: Channel;
  messages: Message;
  user: User;
  contact: Contact;
  notify: Notify;

  /**
   *
   * @param {LoginParams | string} props - Login params or token
   * @param {OptionsType} options - Web2 is used by default and system notifications are enabled
   */

  constructor(props: LoginParams | string, isNotify: boolean) {
    if (typeof props === 'object') {
      login(props).then(({ access_token }) => {
        this.token = access_token;
        this.mqtt = new Connect(access_token, isNotify);
      });
    }
    if (typeof props === 'string') {
      this.token = props;
      setToken(props);
      this.mqtt = new Connect(props, isNotify);
    }
    this.listeners = new event();
    this.channel = new Channel(this);
    this.messages = new Message(this);
    this.user = new User(this);
    this.contact = new Contact(this);
    this.notify = new Notify(this);
  }

  public static getInstance = (props: LoginParams | string, isNotify: boolean = true) => {
    if (!Client._instance) {
      Client._instance = new Client(props, isNotify);
    }
    return Client._instance as Client;
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
  receive = (fn: (message: any, topicType: string) => void) => {
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
