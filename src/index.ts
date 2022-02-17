import request from '@/core/request';
import socket from '@/core/socket';
import { type } from '@/types';

const fun = async () => {
  const res = await request.get('/onetime_jwt');
  console.log(res, 'res');
  return '123';
};

fun();

console.log(type);

const socketInstance1 = new socket(
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjFmMjljYTljOWU3NGNiYWI3Y2VhMmQ0Iiwibmlja19uYW1lIjoiSG91c2VjaGFuQmluIiwidHdpdHRlcl91c2VybmFtZSI6IkhvdXNlY2hhbkJpbiIsInR3aXR0ZXJfYXZhdGFyIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE0NzM5MTk5MzQ2NzM2OTg4MTkvRXo4Z0QzR1JfNDAweDQwMC5wbmciLCJpbnN0YWdyYW1fdXNlcm5hbWUiOiIiLCJpbnN0YWdyYW1fYXZhdGFyIjoiIiwiZmFjZWJvb2tfdXNlcm5hbWUiOiIiLCJmYWNlYm9va19hdmF0YXIiOiIiLCJkaXNjb3JkX3VzZXJuYW1lIjoiIiwiZGlzY29yZF9hdmF0YXIiOiIiLCJvcGVuc2VhX3VzZXJuYW1lIjoiIiwib3BlbnNlYV9hdmF0YXIiOiIiLCJldGhfd2FsbGV0X2FkZHJlc3MiOiIweGU4ZGY0MjczYjk1NmRhZDc3NTIyZmVlOGYzNTgzM2I3Yzg3Yjk5OTciLCJzdGF0dXMiOiIwMTAwMDAxIiwiY3JlYXRlZF9hdCI6MCwiYWNjZXNzX2V4cGlyZWRfYXQiOjE2NDU2MTAyMzcsInJlZnJlc2hfZXhwaXJlZF9hdCI6MTY0NzU5NzQzN30.pfLzP8iTNjppbdTltMUq5qQs7cv3WllQC500RgBh9A8'
);

//@ts-ignore
window.ws = socketInstance1;

export default fun;
