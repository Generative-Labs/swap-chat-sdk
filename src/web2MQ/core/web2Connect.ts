import mqtt, { MqttClient, PacketCallback } from 'mqtt';
import { BASE_MQTT_URL } from './config';
import request from './request';
import { getUserInfoFromToken, hasNotifyPermission, isCurrentWindow, notifyMessage } from './utils';
import type { SendMessageData, GetRoomsParams } from '../types';

export class Web2Connect {
  token: string;
  isNotify: boolean;
  hasNotifyPermission: boolean;
  mqtt: MqttClient | null;

  constructor(token: string, isNotify: boolean) {
    this.token = token;
    this.hasNotifyPermission = false;
    this.mqtt = null;
    this.isNotify = isNotify;
    this.init();
    this.subscribe();
  }

  init() {
    if (!('WebSocket' in window)) {
      throw new Error('Browser not supported WebSocket');
    }

    if (!this.token) {
      throw new Error('The Token is required!');
    }

    hasNotifyPermission().then((res: boolean) => {
      this.hasNotifyPermission = res;
    });

    this.mqtt = mqtt.connect(BASE_MQTT_URL, {
      username: getUserInfoFromToken(this.token).user_id,
      clientId: getUserInfoFromToken(this.token).user_id,
      password: this.token,
      reconnectPeriod: 3000,
    });

    if (this.mqtt) {
      this.mqtt.on('connect', function () {
        console.log('连接成功');
      });

      this.mqtt.on('message', (topic: string, message: string) => {
        const topicType = topic.split('/')[0];
        const messageObj = JSON.parse(message.toString() || '{}');
        if (window && this.hasNotifyPermission && !isCurrentWindow()) {
          const notifyMsg = notifyMessage(messageObj);
          new Notification(notifyMsg as string);
        }
        this.receive(messageObj, topicType);
      });
    }
  }

  async subscribe() {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    const userId = getUserInfoFromToken(this.token).user_id;
    this.mqtt?.subscribe(`chat/${userId}`);
    this.mqtt?.subscribe(`notification/${userId}`);
    const { data } = await this.getMyRooms();
    data.forEach((room_id) => {
      this.mqtt?.subscribe(`chat/${room_id}`);
      this.mqtt?.subscribe(`notification/${room_id}`);
    });
  }

  send(data: SendMessageData, callback?: PacketCallback) {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    this.mqtt.publish(
      `msg/${getUserInfoFromToken(this.token).user_id}`,
      JSON.stringify(data),
      callback,
    );
  }
  // eslint-disable-next-line no-unused-vars
  receive(message: any, topicType: string) {}

  /**
   *
   * @param params
   * @returns
   */
  getMyRooms = (params?: GetRoomsParams): Promise<{ data: string[] }> => {
    return request.get('/my_rooms', params as any);
  };
}
