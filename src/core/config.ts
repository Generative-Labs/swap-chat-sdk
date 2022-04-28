import { PLATFORM_ENUM, MemberUserInfo } from '../types';

export const BASE_URL = 'https://chat.web3messaging.online';
// export const BASE_SOCKET_URL = 'wss://newbietown.com/ws?token=';
export const BASE_MQTT_URL = 'wss://msg.web3messaging.online/mqtt';

export const LOCALSTORAGE_KEY_MAP = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  USER_INFO: 'USER_INFO',
};

export const getToken = () => {
  let key = LOCALSTORAGE_KEY_MAP.ACCESS_TOKEN;
  if (localStorage.getItem(key)) {
    return `Bearer ${localStorage.getItem(key)}`;
  }
  return '';
};

export const setToken = (token: string) => {
  let key = LOCALSTORAGE_KEY_MAP.ACCESS_TOKEN;
  localStorage.setItem(key, token);
};

export const getUserInfoFromToken = (token: string) => {
  const tokenArr = token.substring(7).split('.');
  const userInfo = atob(tokenArr[1]);
  const userInfoObj = JSON.parse(userInfo || '{}');
  userInfoObj.avatar = getUserAvatar(userInfoObj).avatar;
  userInfoObj.user_name = getUserAvatar(userInfoObj).userName;
  localStorage.setItem(LOCALSTORAGE_KEY_MAP.USER_INFO, JSON.stringify(userInfoObj));
  return userInfoObj;
};

export const isExpired = () => {
  const token = localStorage.getItem(LOCALSTORAGE_KEY_MAP.ACCESS_TOKEN) || '';
  if (token === '') {
    return false;
  }
  const accessExpiredAt = getUserInfoFromToken(token).access_expired_at || 0;
  const timestamp = Math.floor(Date.now() / 1000);
  return timestamp >= accessExpiredAt;
};

export const getUserAvatar = (userInfo: MemberUserInfo) => {
  let platforms = [PLATFORM_ENUM.TWITTER, PLATFORM_ENUM.OPENSEA, PLATFORM_ENUM.DISCORD];
  let platform = platforms.find((item) => !!userInfo[`${item}_avatar`]);
  if (platform) {
    return {
      avatar: userInfo[`${platform}_avatar`],
      userName: userInfo[`${platform}_username`],
    };
  }
  return {};
};

export const PAGE_SIZE = 30;
