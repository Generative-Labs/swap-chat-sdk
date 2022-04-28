import request from '../core/request';
import { Web3MQ } from '../client';
import {
  // AddMemberToRoomParams,
  // DelMemberFromRoomParams,
  // GetMessageParams,
  // GetRoomInfoParams,
  // RoomResponse,
  PageParams,
  ChannelResponse,
  MessageResponse,
  MembersItem,
  ActiveMemberItem,
} from '../types';
import { getUserAvatar } from '../core/config';
// import {dateFormat} from '../core/utils';

export class Channel {
  private readonly _client: Web3MQ;
  channelList: ChannelResponse[] | null;
  activeChannel: ChannelResponse | null;
  members: MembersItem | null;
  activeMember: ActiveMemberItem;

  constructor(client: Web3MQ) {
    this._client = client;
    this.channelList = null;
    this.activeChannel = null;
    this.members = null;
    this.activeMember = {};
  }

  /**
   * 新消息
   * @param message 消息内容
   */
  onNewMessage = (message: MessageResponse) => {
    const { to_room_id } = message;
    const _channels = this.channelList?.map((item) => {
      if (item.room_id === to_room_id) {
        item.latest_msg = message;
      }
      return item;
    });

    this._client.emit('channel.updated', _channels);
  };

  /**
   * 用户改变焦点channel
   * @param channel 焦点channel
   */
  setActiveChannel = (channel: ChannelResponse) => {
    this.activeChannel = channel;
    this.getActiveMember(channel);
    this._client.messages.getMessageList({ room_id: channel.room_id });
    this._client.emit('channel.activeChange', { type: 'channel.activeChange', data: channel });
  };

  /**
   * 获取当前成员对象
   */

  getActiveMember = (current: ChannelResponse) => {
    const chcheObj: ActiveMemberItem = {};
    if (this.members) {
      const arr = this.members[current.room_id] || [];
      arr.forEach((item) => {
        chcheObj[item.user_id] = item;
      });
    }
    this.activeMember = chcheObj;
  };

  /**
   * 查询所有channel数据
   */
  queryChannels = async (option: PageParams) => {
    const { token } = this._client;
    if (!token) {
      throw new Error('The Token is required!');
    }
    const { data = [] } = await this.getChatsByUserId({
      ...option,
    });
    this.channelList = data;
    const cacheObj: MembersItem = {};
    data.forEach((item) => {
      cacheObj[item.room_id] = item.members.map((member) => {
        member.avatar = getUserAvatar(member).avatar;
        member.user_name = getUserAvatar(member).userName;
        return member;
      });
    });
    this.members = cacheObj;
    this._client.emit('channel.getList', { type: 'channel.getList', data });
  };

  getChatsByUserId = (params: PageParams): Promise<{ data: ChannelResponse[] }> => {
    return request.post('/my_chats', params);
  };

  // getRoomInfo = (params: GetRoomInfoParams): Promise<any> => {
  //   return request.get<RoomResponse>(`/rooms/${params.room_id}`);
  // };

  // addMemberToRoom = (params: AddMemberToRoomParams): Promise<any> => {
  //   return request.post<RoomResponse>(`/rooms/${params.room_id}/members`, params);
  // };

  // delMemberFromRoom = (params: DelMemberFromRoomParams): Promise<any> => {
  //   return request.delete(`/rooms/${params.room_id}/members/${params.member_id}`);
  // };

  // threadsList = (params: GetMessageParams): Promise<any> => {
  //   return request.get(`/threads/${params.room_id}/${params.page}/${params.size}`);
  // };
}
