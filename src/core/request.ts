//@ts-ignore
import axios from 'axios/dist/axios';

import { TOKEN_KEY_MAP, BASE_URL, isExpired, getToken } from './config';

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
    return new Promise((resolve) => {
      const newConfig = { ...config };
      if (isExpired()) {
        axios
          .get(`${BASE_URL}/refresh`, {
            headers: {
              Authorization: getToken(),
            },
          })
          .then((res: any) => {
            const newToken = res.data.data.access_token || '';
            if (newToken) {
              localStorage.setItem(TOKEN_KEY_MAP.ACCESS_TOKEN, newToken);
              newConfig.headers['Authorization'] = newToken;
            }
          })
          .catch((err: any) => {
            if (err) {
              // 刷新失败，重新登陆
            }
          })
          .finally(() => {
            resolve(newConfig);
          });
      }
      newConfig.headers['Authorization'] = getToken();
      resolve(newConfig);
    });
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
      throw new Error(data.message);
    }
  }
);

export default request;
