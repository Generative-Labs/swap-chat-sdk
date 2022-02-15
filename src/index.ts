import request from '@/core/request';

const fun = async () => {
  const res = await request.get('/onetime_jwt');
  console.log(res, 'res');
  return '123';
};

fun();

export default fun;
