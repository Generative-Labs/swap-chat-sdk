//@ts-ignore
import axios from 'axios/dist/axios';

import { BASE_URL, getToken } from './config';

const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 10000,
  // withCredentials: true,
});

request.interceptors.request.use(
  (config: any) => {
    const newConfig = { ...config };
    const { url } = newConfig;
    if (getToken(url as string)) {
      //@ts-ignore
      newConfig.headers['Authorization'] = getToken(url);
    }
    return newConfig;
  },
  (error: any) => {
    throw new Error(error);
  }
);

request.interceptors.response.use(
  (response: any) => {
    const { data } = response;
    return data;
  },
  (error: any) => {
    const { status, data } = error.response;
    if (status !== 200) {
      return data.message;
    }
  }
);

export default request;
