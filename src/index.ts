import request from '@/core/request';

const fun = () => {
  request.get('/onetime_jwt');
  return '123';
};

fun();

export default fun;
