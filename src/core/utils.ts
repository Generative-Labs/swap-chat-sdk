import { LOCALSTORAGE_KEY_MAP } from './config';
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
