import request from '../core/request';
import { Web3MQ } from '../client';
import {
  // AddMemberToRoomParams,
  // DelMemberFromRoomParams,
  // GetMessageParams,
  // GetRoomInfoParams,
  PageParams,
  ChannelResponse,
  MessageResponse,
  MembersItem,
  ActiveMemberItem,
  GetRoomInfoByTargetUserIdParams,
} from '../types';
import { getUserAvatar } from '../core/utils';

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
    const { room_id: currentRoomId = '' } = this.activeChannel || {};
    const _channels = this.channelList?.map((item) => {
      if (item.room_id === to_room_id) {
        item.latest_msg = message;
      }
      if (currentRoomId !== to_room_id && item.room_id === to_room_id) {
        if (item.unreadCount) {
          item.unreadCount++;
        } else {
          item.unreadCount = 1;
        }
      }
      return item;
    });
    this._client.emit('channel.updated', { type: 'channel.updated', data: _channels });
  };

  /**
   * 用户改变焦点channel
   * @param channel 焦点channel
   */
  setActiveChannel = (channel: ChannelResponse | null) => {
    this.activeChannel = channel;
    if (channel) {
      delete channel.unreadCount;
      this.getActiveMember(channel);
    }
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
    const cacheObj: MembersItem = {};
    data.forEach((item) => {
      cacheObj[item.room_id] = item.members.map((member) => {
        member.avatar = getUserAvatar(member).avatar;
        member.user_name = getUserAvatar(member).userName;
        return member;
      });
    });
    if (this.channelList && option.page !== 1) {
      this.channelList = [...this.channelList, ...data];
    } else {
      this.channelList = data;
    }
    this.members = cacheObj;
    this._client.emit('channel.getList', { type: 'channel.getList', data });
  };

  getChatsByUserId = (params: PageParams): Promise<{ data: ChannelResponse[] }> => {
    return request.post('/my_chats', params);
  };

  /**
   * 创建新的聊天室
   * @param params
   */
  createRoom = async (params: GetRoomInfoByTargetUserIdParams) => {
    const { data: roomId } = await this.getRoomInfoByTargetUserIdApi(params);
    if (!roomId) {
      throw new Error('Get room info error!');
    }
    let existRoomInfo = this.channelList?.find((item) => item.room_id === roomId);
    if (!existRoomInfo) {
      const { data } = await this.getRoomInfoByRoomIdApi(roomId);
      data.members.map((item) => {
        item.avatar = getUserAvatar(item).avatar;
        item.user_name = getUserAvatar(item).userName;
      });
      existRoomInfo = data;
    }
    // 推送当前room到第一条 设置active room
    if (this.channelList) {
      this.channelList = this.channelList.filter((item) => item.room_id !== existRoomInfo?.room_id);
    }
    this.channelList?.unshift(existRoomInfo);
    // set active room
    this.activeChannel = existRoomInfo;
    this.getActiveMember(existRoomInfo);
    this._client.emit('channel.created', { type: 'channel.created', data: existRoomInfo });
    this._client.emit('channel.activeChange', {
      type: 'channel.activeChange',
      data: existRoomInfo,
    });
  };

  getRoomInfoByRoomIdApi = (roomId: string): Promise<{ data: ChannelResponse }> => {
    return request.get(`/rooms/${roomId}`);
  };

  getRoomInfoByTargetUserIdApi = (params: GetRoomInfoByTargetUserIdParams): Promise<any> => {
    return request.post<string>('/rooms', params);
  };

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
