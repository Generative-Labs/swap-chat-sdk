export * from './client';
export * from './message';
export * from './user';
export * from './room';

import { Client } from './client';
import { Message } from './message';
import { User } from './user';
import { Room } from './room';

console.log(new Client('123'), new Message(), new User(), new Room());
