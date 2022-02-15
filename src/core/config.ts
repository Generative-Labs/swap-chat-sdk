import { TOKEN_KEY_MAP } from '@/types/requestType';

export const BASE_URL = 'https://newbietown.com';

export const getToken = (url: string = 'access') => {
  let key = TOKEN_KEY_MAP.ACCESS_TOKEN;
  if (url === '/refresh') {
    key = TOKEN_KEY_MAP.REFRESH_TOKEN;
  }
  if (localStorage.getItem(key)) {
    return `Bearer ${localStorage.getItem(key)}`;
  }
  return '';
};