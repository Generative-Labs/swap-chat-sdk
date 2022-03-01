import request from '../core/request';
import { CreateThreadsParams, GetMessageByIdParams, GetThreadsParams } from '../types';

export class Message {
  constructor() {}

  getInfo = (params: GetMessageByIdParams): Promise<any> => {
    return request.get(`/messages/${params.msg_id}`);
  };

  createThread = (params: CreateThreadsParams): Promise<any> => {
    return request.post('/threads', params);
  };

  getThreads = (params: GetThreadsParams): Promise<any> => {
    return request.get(
      `/threads/${params.room_id}/${params.page}/${params.size}?belong_to_thread_id=${params.belong_to_thread_id}&page=${params.page}&size=${params.size}`,
    );
  };
}
