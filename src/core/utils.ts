import { LOCALSTORAGE_KEY_MAP } from './config';
import { PLATFORM_ENUM, MemberUserInfo } from '../types';
import request from './request';
import {
  LoginParams,
  LoginRandomSecret,
  LoginRandomSecretParams,
  LoginResponse,
  RegisterParams,
} from '../types';

export const register = (params: RegisterParams): Promise<any> => {
  return request.post('/register', params);
};

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const { data } = await request.post<LoginResponse>('/login', params);
  localStorage.setItem(LOCALSTORAGE_KEY_MAP.ACCESS_TOKEN, data.access_token);
  return data;
};

export const getLoginRandomSecret = (params: LoginRandomSecretParams): Promise<any> => {
  return request.post<LoginRandomSecret>('/login_random_secret', params);
};

/**
 * 日期格式化
 * @param time
 * @param format
 */
export function dateFormat(time: number, format?: string) {
  const t = new Date(time);
  format = format || 'Y-m-d h:i:s';
  let year = t.getFullYear();
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();

  const hash = {
    y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  // 是否补 0
  const isAddZero = (o: string) => {
    return /M|D|H|I|S/.test(o);
  };
  return format.replace(/\w/g, (o) => {
    // @ts-ignore
    let rt = hash[o.toLocaleLowerCase()];
    return rt > 10 || !isAddZero(o) ? rt : `0${rt}`;
  });
}

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

export const parseJwt = (str: string) => {
  return JSON.parse(
    decodeURIComponent(escape(window.atob(str.replace(/-/g, '+').replace(/_/g, '/')))) || '{}',
  );
};

export const getUserInfoFromToken = (token: string) => {
  const tokenArr = token.substring(7).split('.');
  const userInfo = parseJwt(tokenArr[1]);
  userInfo.avatar = getUserAvatar(userInfo).avatar;
  userInfo.user_name = getUserAvatar(userInfo).userName;
  localStorage.setItem(LOCALSTORAGE_KEY_MAP.USER_INFO, JSON.stringify(userInfo));
  return userInfo;
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
