export const BASE_URL = 'https://newbietown.com';

export const getToken = (url: string) => {
  let key = 'ACCESS_TOKEN';
  if (url === '/refresh') {
    key = 'REFRESH_TOKEN';
  }
  if (localStorage.getItem(key)) {
    return `Bearer ${localStorage.getItem(key)}`;
  }
  return '';
};
