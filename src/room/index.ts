import request from '../core/request';
import {
  AddMemberToRoomParams,
  DelMemberFromRoomParams,
  GetChatsByUserIdParams,
  GetRoomInfoParams,
  GetRoomsParams,
  roomRes,
} from '../types/room';

export class Room {
  constructor() {}

  // client  通过对方user_id获取对应room_id 如果不存在room 则创建
  getRooms = (params: GetRoomsParams): Promise<any> => {
    return request.post('/rooms', params);
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

  // client
  getChatsByUserId = (params: GetChatsByUserIdParams): Promise<any> => {
    return request.post('/my_chats', params);
  };
  // getMessages

  // getThreads 获取聊天室内的话题

}
