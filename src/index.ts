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
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNjFmMTAwNmQ2MDRjYzViZTVmN2EzYzJkIiwibmlja19uYW1lIjoiV2VpWmhhbzYyMjA3MjkyIiwidHdpdHRlcl91c2VybmFtZSI6IldlaVpoYW82MjIwNzI5MiIsInR3aXR0ZXJfYXZhdGFyIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL3Byb2ZpbGVfaW1hZ2VzLzE0Njg5MTk3MjUwOTA1NjIwNDgvUTFOOFZNNjJfNDAweDQwMC5wbmciLCJpbnN0YWdyYW1fdXNlcm5hbWUiOiIiLCJpbnN0YWdyYW1fYXZhdGFyIjoiIiwiZmFjZWJvb2tfdXNlcm5hbWUiOiIiLCJmYWNlYm9va19hdmF0YXIiOiIiLCJkaXNjb3JkX3VzZXJuYW1lIjoiIiwiZGlzY29yZF9hdmF0YXIiOiIiLCJvcGVuc2VhX3VzZXJuYW1lIjoiIiwib3BlbnNlYV9hdmF0YXIiOiJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vb3BlbnNlYS1zdGF0aWMvb3BlbnNlYS1wcm9maWxlLzgucG5nIiwiZXRoX3dhbGxldF9hZGRyZXNzIjoiMHg3MjM2YjBmNGYxNDA5YWZkYzdjOWZjNDQ2OTQzYTdiODRiNjUxM2ExIiwic3RhdHVzIjoiMDEwMDAwMSIsImNyZWF0ZWRfYXQiOjAsImFjY2Vzc19leHBpcmVkX2F0IjoxNjQ1NjAyNTI1LCJyZWZyZXNoX2V4cGlyZWRfYXQiOjE2NDc1ODk3MjV9.LZw0HZ_5q42RoC7fNaoGi3WPXApjnJow4JbWQeLjRyQ'
);

//@ts-ignore
window.ws = socketInstance1;

export default fun;
