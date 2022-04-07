import request from '../core/request';
import { HouseChat } from '../client';
import {
  AddMemberToRoomParams,
  DelMemberFromRoomParams,
  GetChatsByUserIdParams,
  GetMessageParams,
  GetRoomInfoParams,
  roomRes,
  ChannelResponse
} from '../types';
import { getUserInfoFromToken } from '../core/config';
// import {dateFormat} from '../core/utils';

export class Channel {
  private readonly _client: HouseChat;
  channelList: ChannelResponse[] | null;
  activeChannel: ChannelResponse | null;

  constructor(client: HouseChat) {
    this._client = client;
    this.channelList = null;
    this.activeChannel = null;
  }

  /**
   * 新消息
   * @param message 消息内容
   */
  // onNewMessage = (message: MessageResponse) => {
  //   const { to_room_id } = message;
  //   const _channels =
  //     this.channels?.filter((ChannelType) => ChannelType.room_id !== message.to_room_id) || [];
  //   const newChannelData = new Channel(to_room_id, message);
  //   _channels.unshift(newChannelData);
  //   this._client.emit('channel.updated', _channels);
  // };

  /**
   * 用户改变焦点channel
   * @param channel 焦点channel
   */
  setActiveChannel = (channel: ChannelResponse) => {
    this.activeChannel = channel;

    this._client.messages.getMessageList({ room_id: channel.room_id, page: 1, size: 30 });
    this._client.emit('channel.activeChange', { type: 'channel.activeChange', data: channel });
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
    const { data = [] } = await this.getChatsByUserId({
      ...option,
      user_id: userId,
    });
    this.channelList = data;
    this._client.emit('channel.getList', { type: 'channel.getList', data });
  };


  getChatsByUserId = (
    params: GetChatsByUserIdParams,
  ): Promise<{ data: ChannelResponse[] }> => {
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
