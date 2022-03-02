// @ts-ignore
import mqtt from 'mqtt/dist';
import { MqttClient } from 'mqtt';
import { BASE_MQTT_URL, getUserInfoFromToken } from './config';

class MQTT {
  token: string;
  mqtt: MqttClient | undefined;

  constructor(token: string) {
    this.token = token;
    this.init();
  }

  init() {
    if (!('WebSocket' in window)) {
      throw new Error('Browser not supported WebSocket');
    }

    if (!this.token) {
      throw new Error('The Token is required!');
    }

    this.mqtt = mqtt.connect(BASE_MQTT_URL, {
      username: getUserInfoFromToken(this.token).user_id,
      clientId: getUserInfoFromToken(this.token).user_id,
      password: this.token,
      reconnectPeriod: 3000,
    });

    this.mqtt?.on('connect', function () {
      console.log('连接成功');
    });

    this.mqtt?.on('message', (topic: string, message: string) => {
      this.receive(JSON.parse(message.toString() || '{}'));
    });
  }

  subscribe(id: string) {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    this.mqtt.subscribe(`msg/${id}`);
  }

  send(data: any, callback?: (() => void) | undefined) {
    if (!this.mqtt) {
      throw new Error('websocket Initialization failed');
    }
    if (callback) {
      callback();
    }
    this.mqtt.publish('msg/hub', JSON.stringify(data));
  }

  // eslint-disable-next-line no-unused-vars
  receive(message: any) {}
}

export default MQTT;
