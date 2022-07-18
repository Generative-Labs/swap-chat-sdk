import { Web3MQ } from '../client';
import { SendNotifyParams, NotifyAPIParams } from '../types';

import request from '../core/request';

export class Notify {
  _client: Web3MQ;

  constructor(client: Web3MQ) {
    this._client = client;
    this._client.receive(this.receiveNotify);
  }

  sendNotify = async (params: SendNotifyParams) => {
    const sendData: NotifyAPIParams = {
      version: 1,
      sender_id: this._client.user.userInfo.user_id,
      to: params.ids,
      notification_type: 'text',
      notification_payload: params.text,
    };
    await this.sendNotifyAPI(sendData);
  };

  receiveNotify = (message: any, topicType: string) => {
    console.log(message, topicType, 123123123);
    if (topicType !== 'notification') {
      return;
    }
    console.log(message, topicType, 123123123);
  };

  sendNotifyAPI = (params: NotifyAPIParams): Promise<any> => {
    return request.post('/notifications', params);
  };
}
