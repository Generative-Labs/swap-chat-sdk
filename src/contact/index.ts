import { Web3MQ } from '../client';
import { GetRoomInfoByTargetUserIdParams, PageParams, UserInfo } from '../types';
import request from '../core/request';

export class Contact {
  private _client: Web3MQ;
  public contactList?: UserInfo[] | null;
  public activeContact: UserInfo | null;

  constructor(client: Web3MQ) {
    this._client = client;
    this.activeContact = null;
    this.contactList = null;
  }

  /**
   * 用户改变焦点channel
   * @param contact
   */
  setActiveContact = async (contact: UserInfo) => {
    this.activeContact = contact;
    const { data } = await this.getRoomInfoByTargetUserIdApi({ user_id: contact.user_id });
    const newObj = this._client.channel.channelList?.find((item) => item.room_id === data);
    if (newObj) {
      this._client.channel.activeChannel = newObj;
      this._client.channel.getActiveMember(newObj);
    }
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

  getRoomInfoByTargetUserIdApi = (params: GetRoomInfoByTargetUserIdParams): Promise<any> => {
    return request.post<string>('/rooms', params);
  };
}
