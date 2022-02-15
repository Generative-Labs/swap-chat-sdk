//@ts-ignore
import axios from 'axios/dist/axios';

import { BASE_URL, getToken } from './config';
import { TOKEN_KEY_MAP } from '@/types/requestType';

const refreshAPIUrl = `${BASE_URL}/refresh`;
const request = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  timeout: 10000,
  // withCredentials: true,
});

request.interceptors.request.use(
  async (config: any) => {
    const newConfig = { ...config };
    let accessToken = getToken();
    if (accessToken) {
      let jwtToken = accessToken.substring(7);
      let tokenArr = jwtToken.split('.');
      let tokenObj = JSON.parse(atob(tokenArr[1]));
      let accessExpiredAt = tokenObj.access_expired_at;
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime / 1000);
      if (timestamp >= accessExpiredAt) {
        // ready to refresh token
        console.log('ready to refresh token');
        const token = await axios.get(refreshAPIUrl, {
          headers: {
            Authorization: accessToken,
          },
        });
        if (token.data.data.access_token) {
          localStorage.setItem(
            TOKEN_KEY_MAP.ACCESS_TOKEN,
            token.data.data.access_token
          );
        }
      }
      newConfig.headers['Authorization'] = getToken();
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
    if (data.code !== 0) {
      throw new Error(data.msg);
    }
    return data.data;
  },
  (error: any) => {
    const { status, data } = error.response;
    if (status !== 200) {
      return data.message;
    }
  }
);

export default request;
