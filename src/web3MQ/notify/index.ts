import { Client } from '../client';
import { ClientKeyPaires, MessageStatus, NotifyResponse } from '../types';
import { changeNotificationStatusRequest } from '../api';
import { getParams } from '../core/utils';

export class Notify {
  private readonly _client: Client;
  private readonly _keys: ClientKeyPaires;
  constructor(client: Client) {
    this._client = client;
    this._keys = client.keys;
  }

  async changeNotificationStatus(messages: string[], status: MessageStatus = 'delivered') {
    const params = await getParams(this._keys);
    const data = await changeNotificationStatusRequest({ ...params, messages, status });
    return data;
  }

  receiveNotify(notificationList: NotifyResponse) {
    console.log('notify class -------', notificationList);
  }
}
