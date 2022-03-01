export const BASE_URL = 'https://newbietown.com';
export const BASE_SOCKET_URL = 'wss://newbietown.com/ws?token=';
export const BASE_MQTT_URL = 'ws://54.188.184.32:8083/mqtt';

export const TOKEN_KEY_MAP = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
};

export const getToken = () => {
  let key = TOKEN_KEY_MAP.ACCESS_TOKEN;
  if (localStorage.getItem(key)) {
    return `Bearer ${localStorage.getItem(key)}`;
  }
  return '';
};

export const getUserInfoFromToken = (token: string) => {
  const tokenArr = token.substring(7).split('.');
  return JSON.parse(atob(tokenArr[1]) || '{}');
};

export const isExpired = () => {
  const token = localStorage.getItem(TOKEN_KEY_MAP.ACCESS_TOKEN) || '';
  if (token === '') {
    return false;
  }
  const accessExpiredAt = getUserInfoFromToken(token).access_expired_at || 0;
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp >= accessExpiredAt;
};
