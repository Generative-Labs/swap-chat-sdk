import { MessageResponse } from '../types';
import type { Channel } from '.';

export class ChannelState {
  _channel: Channel;
  messages: MessageResponse[];
  constructor(channel: Channel) {
    this.messages = [];
    this._channel = channel;
  }
  addToMessageList(message: MessageResponse) {
    this.messages?.push(message);
  }
}
