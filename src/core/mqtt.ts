// @ts-ignore
import mqtt from 'mqtt/dist';
import { MqttClient } from 'mqtt';
import { BASE_MQTT_URL } from './config';
import { getUserInfoFromToken, hasNotifyPermission, isCurrentWindow, notifyMessage } from './utils';
import type { SendMessageData } from '../types';

class MQTT {
  token: string;
  hasNotifyPermission: boolean;
  mqtt: MqttClient | undefined;

  constructor(token: string) {
    this.token = token;
    this.hasNotifyPermission = false;
    this.init();
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
        const messageObj = JSON.parse(message.toString() || '{}');
        if (this.hasNotifyPermission && !isCurrentWindow()) {
          const notifyMsg = notifyMessage(messageObj);
          new Notification(notifyMsg as string);
        }
        this.receive(messageObj);
      });
    }
  }

  subscribe(room_id: string) {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    this.mqtt.subscribe(`chat/${room_id}`);
  }

  send(data: SendMessageData, callback?: (() => void) | undefined) {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    if (callback) {
      callback();
    }
    this.mqtt.publish(`msg/${getUserInfoFromToken(this.token).user_id}`, JSON.stringify(data));
  }
  // eslint-disable-next-line no-unused-vars
  receive(message: any) {}
}

export default MQTT;
