import { Channel } from '../channel';
import { Connect } from '../connect';
import { Message } from '../message';
import { User } from '../user';
import { Contact } from '../contact';
import { Notify } from '../notify';

import event from '../core/eventEmitter';
import { selectUrl } from '../utils';
import { KeyPairsType, ClientKeyPaires, Web3EventTypes } from '../types';

export class Client {
  private static _instance: Client | null;
  keys: ClientKeyPaires;
  wsUrl: string;
  channel: Channel;
  listeners: event;
  connect: Connect;
  message: Message;
  user: User;
  contact: Contact;
  notify: Notify;

  constructor(keys: KeyPairsType, wsUrl?: string) {
    this.keys = { ...keys, userid: `user:${keys.PublicKey}` };
    this.wsUrl = wsUrl || selectUrl();
    this.listeners = new event();
    this.channel = new Channel(this);
    this.connect = new Connect(this);
    this.message = new Message(this);
    this.user = new User(this);
    this.contact = new Contact(this);
    this.notify = new Notify(this);
  }

  public static getInstance = (keys: KeyPairsType, wsUrl?: string) => {
    if (!keys) {
      throw new Error('The PrivateKey and PublicKey is required!');
    }
    if (!Client._instance) {
      Client._instance = new Client(keys, wsUrl);
    }
    return Client._instance as Client;
  };

  on = (eventName: Web3EventTypes, callback: any) => this.listeners.on(eventName, callback);
  emit = (eventName: Web3EventTypes, data: { type: Web3EventTypes; data?: any }) =>
    this.listeners.emit(eventName, data);
  off = (eventName: Web3EventTypes, callback?: any) => this.listeners.off(eventName, callback);
  once = (eventName: Web3EventTypes, callback: any) => this.listeners.once(eventName, callback);
}
