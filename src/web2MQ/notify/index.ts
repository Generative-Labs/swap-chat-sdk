import { Client } from '../client';
import {
  SendNotifyParams,
  NotifyAPIParams,
  NotificationResponse,
  PageParams,
  ActiveSenderItem,
} from '../types';
import { PAGE_SIZE } from '../core/config';

import request from '../core/request';

export class Notify {
  _client: Client;
  notificationList: NotificationResponse[] | null;
  activeSender: ActiveSenderItem;
  _notificationPage: number;
  _unReadCount: number;

  constructor(client: Client) {
    this._client = client;
    this.notificationList = null;
    this.activeSender = {};
    this._notificationPage = 1;
    this._unReadCount = 0;
    // this._client.receive(this.receiveNotify);
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
    if (topicType !== 'notification') {
      return;
    }
    const newNotification: NotificationResponse = { ...message, has_been_read: false };
    console.log('接受推送-------', newNotification);
    this.notificationList?.unshift(newNotification);
    // 分页去重
    this.notificationList?.pop();
    this._unReadCount++;
    this._client.emit('notification.getList', {
      type: 'notification.getList',
      data: this.notificationList,
    });
    this._client.emit('notification.messageNew', {
      type: 'notification.messageNew',
      data: newNotification,
    });
  };

  getRecvNotificationList = async () => {
    this._notificationPage = 1;
    const { data = [] } = await this.getRecvNotificationsAPI({
      page: this._notificationPage,
      size: PAGE_SIZE,
    });
    this.notificationList = [...data];
    this._unReadCount = this.notificationList.filter((item) => item.has_been_read === false).length;
    this._client.emit('notification.getList', { type: 'notification.getList', data });
  };

  loadMoreRecvNotificationList = async () => {
    this._notificationPage++;
    try {
      const { data = [] } = await this.getRecvNotificationsAPI({
        page: this._notificationPage,
        size: PAGE_SIZE,
      });
      // let count = data.filter((item: NotificationResponse) => item.has_been_read === false).length;
      this.notificationList = [...(this.notificationList as []), ...data];
      // this._unReadCount += count;
      this._client.emit('notification.getList', { type: 'notification.getList', data });
      return data;
    } catch (error) {
      return [];
    }
  };

  readAllRecvNotifications = () => {
    this._unReadCount = 0;
  };

  sendNotifyAPI = (params: NotifyAPIParams): Promise<any> => {
    return request.post('/notifications', params);
  };

  getRecvNotificationsAPI = (params: PageParams): Promise<any> => {
    return request.get(`notifications/recv/${params.page}/${params.size}`);
  };
}
