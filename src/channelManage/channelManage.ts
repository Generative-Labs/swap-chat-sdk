import request from '../core/request';
import { HouseChat } from '../client';
import { Channel } from './channel';
import {
  AddMemberToRoomParams,
  ChannelType,
  DelMemberFromRoomParams,
  GetChatsByUserIdParams,
  GetChatsByUserIdResponse,
  GetMessageParams,
  GetRoomInfoParams,
  MessageResponse,
  roomRes,
} from '../types';
import { getUserInfoFromToken } from '../core/config';

export class ChannelManage {
  public _client: HouseChat;
  public channels?: Channel[];
  public activeChannel?: ChannelType;

  constructor(client: HouseChat) {
    this._client = client;
    this._client._on('notification.message_new', this.onNewMessage);
  }

  /**
   * 新消息
   * @param message 消息内容
   */
  onNewMessage = (message: MessageResponse) => {
    const { to_room_id } = message;
    const _channels =
      this.channels?.filter((ChannelType) => ChannelType.room_id !== message.to_room_id) || [];
    const newChannelData = new Channel(to_room_id, message);
    _channels.unshift(newChannelData);
    this._client.emit('channel.updated', _channels);
  };

  /**
   * 用户改变焦点channel
   * @param channel 焦点channel
   */
  setActiveChannel = (channel: GetChatsByUserIdResponse) => {
    this.activeChannel = channel;
    // 通知事件
    this._client.emit('notification.channel_active_change', channel);
  };

  /**
   * 查询所有channel数据
   */
  queryChannels = async (option: GetChatsByUserIdParams) => {
    const { token } = this._client;
    if (!token) {
      throw new Error('The Token is required!');
    }
    const userId = getUserInfoFromToken(token).user_id;
    const { data: chats } = await this.getChatsByUserId({
      ...option,
      user_id: userId,
    });
    const _channels: Channel[] = [];
    chats.forEach((chatItem) =>
      _channels.push(new Channel(chatItem.room_id, chatItem.latest_msg, chatItem.members)),
    );
    this.channels = _channels;
    return _channels;
  };

  getChatsByUserId = (
    params: GetChatsByUserIdParams,
  ): Promise<{ data: GetChatsByUserIdResponse[] }> => {
    return request.post('/my_chats', params);
  };

  getRoomInfo = (params: GetRoomInfoParams): Promise<any> => {
    return request.get<roomRes>(`/rooms/${params.room_id}`);
  };

  addMemberToRoom = (params: AddMemberToRoomParams): Promise<any> => {
    return request.post<roomRes>(`/rooms/${params.room_id}/members`, params);
  };

  delMemberFromRoom = (params: DelMemberFromRoomParams): Promise<any> => {
    return request.delete(`/rooms/${params.room_id}/members/${params.member_id}`);
  };

  getMessages = (params: GetMessageParams): Promise<any> => {
    return request.post('/messages', params);
  };

  threadsList = (params: GetMessageParams): Promise<any> => {
    return request.get(`/threads/${params.room_id}/${params.page}/${params.size}`);
  };
}
