import { HouseChat } from '../client';
import { Contact } from './contact';
import { PageParams, UserInfo } from '../types';
import request from '../core/request';

export class ContactManage {
  private _client: HouseChat;
  public contacts?: Contact[];

  constructor(client: HouseChat) {
    this._client = client;
  }

  async queryContacts(option?: PageParams) {
    const { data: contacts } = await this.getContacts(option || { page: 1, size: 10 });
    const _contacts: Contact[] = [];
    contacts.forEach((contactItem) => _contacts.push(new Contact(contactItem)));
    this.contacts = _contacts;
    return _contacts;
  }

  getContacts = (params: PageParams): Promise<{ data: UserInfo[] }> => {
    return request.get(`/contacts/${params.page}/${params.size}`);
  };
}
