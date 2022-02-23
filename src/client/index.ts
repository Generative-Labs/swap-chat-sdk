import { LoginParams } from '../types/user';
import socket from '../core/socket';

export class Client {
  token: string | undefined;
  options: LoginParams | undefined;
  ws: socket | undefined;

  constructor(token: LoginParams | string) {
    if (typeof token === 'object') {
      this.options = token;
    } else {
      this.token = token;
      this.ws = new socket(token);
    }
  }

  receive = (msg: string) => {
    if (!this.ws) {
      throw new Error('Websocket is not initialized');
    }
    return this.ws.receive(msg);
  };
}
