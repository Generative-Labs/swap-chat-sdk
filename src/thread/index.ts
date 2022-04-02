import { GetThreadsParams } from '../types';
import request from '../core/request';

export class Thread {
  constructor() {}
  getThreads = (params: GetThreadsParams): Promise<any> => {
    return request.get(
      `/threads/${params.room_id}/${params.page}/${params.size}?belong_to_thread_id=${params.belong_to_thread_id}&page=${params.page}&size=${params.size}`,
    );
  };
}
