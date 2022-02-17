export const BASE_URL = 'https://newbietown.com';

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

export const isExpired = () => {
  const token = localStorage.getItem(TOKEN_KEY_MAP.ACCESS_TOKEN) || '';
  if (token === '') {
    return false;
  }
  const tokenArr = token.substring(7).split('.');
  const tokenObj = JSON.parse(atob(tokenArr[1]) || '{}');
  const accessExpiredAt = tokenObj.access_expired_at || 0;
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp >= accessExpiredAt;
};
