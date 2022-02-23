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

  getChatsByUserId = (params: GetChatsByUserIdParams): Promise<any> => {
    return request.post('/my_chats', params);
  };
}
