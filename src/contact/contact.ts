import { HouseChat } from '../client';
import {PageParams, UserInfo} from '../types';
import request from '../core/request';

export class Contact {
  private _client: HouseChat;
  public contactList?: UserInfo[] | null;
  public activeContact: UserInfo | null;

  constructor(client: HouseChat) {
    this._client = client;
    this.activeContact = null;
    this.contactList = null;
  }

  /**
   * 用户改变焦点channel
   * @param contact
   */
  setActiveContact = (contact: UserInfo) => {
    this.activeContact = contact;
    this._client.emit('contact.activeChange', { type: 'contact.activeChange', data: contact });
  };

  async queryContacts(option?: PageParams) {
    const { data } = await this.getContacts(option || { page: 1, size: 10 });
    this.contactList = data;
    this._client.emit('contact.getList', { type: 'contact.getList', data });
  }

  getContacts = (params: PageParams): Promise<{ data: UserInfo[] }> => {
    return request.get(`/contacts/${params.page}/${params.size}`);
  };
}
