import request from '../core/request';
import {
  CreateThreadsParams,
  GetMessageByIdParams,
  GetMessageParams,
  GetThreadsParams,
} from '../types/message';

export class Message {
  constructor() {}

  // room
  getMessages = (params: GetMessageParams): Promise<any> => {
    return request.post('/messages', params);
  };

  // info
  getMessageById = (params: GetMessageByIdParams): Promise<any> => {
    return request.get(`/messages/${params.msg_id}`);
  };

  // createThread
  createThreads = (params: CreateThreadsParams): Promise<any> => {
    return request.post('/threads', params);
  };


  // 拆分两个 room下获取room中的threads
  // msgid 获取本条消息关联的thread
  getThreads = (params: GetThreadsParams): Promise<any> => {
    let url = `/threads/${params.room_id}/${params.page}/${params.size}`;
    if (params.belong_to_thread_id) {
      url = `/threads/${params.room_id}/${params.page}/${params.size}?belong_to_thread_id=${params.belong_to_thread_id}&page=${params.page}&size=${params.size}`;
    }
    return request.get(url);
  };
}
