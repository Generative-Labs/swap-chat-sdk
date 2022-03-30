import { ChannelState } from './channelState';
import { ChannelData, MessageResponse } from '../types';
export type EventHandler = () => void;
/**
 * 每个频道维护各自的state
 */
export class Channel {
  roomId: string;
  listeners: { [key: string]: EventHandler[]};
  state: ChannelState;
  data?: ChannelData;
  is1V1?: boolean;
  creatorId?: string;
  /**
   *
   * @param roomId 频道ID
   * @param data 频道数据
   */
  constructor(roomId: string, data: ChannelData) {
    this.roomId = roomId;
    this.data = data;
    this.listeners = {};
    this.state = new ChannelState(this);
  }

  /**
   * state消息初始化
   * @param messages
   */
  _initializeState (messages: MessageResponse) {
    this.state.messages.push(messages);
  }

}