import request from '../core/request';
import {
  AddMemberToRoomParams,
  DelMemberFromRoomParams,
  GetMessageParams,
  GetRoomInfoParams,
  roomRes,
} from '../types';

export class Channel {
  constructor() {}

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
