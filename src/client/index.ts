import socket from '../core/socket';
import Room from '../room';

export default class Client {
  ws: socket;
  room: Room;

  constructor(appId: string, token: string) {
    this.ws = new socket(token);
    this.room = new Room(this);
  }

  receive(msg: string) {
    return this.ws.receive(msg);
  }

  createRoom() {
      
  }

  getRooms() {

  }

  getMessages(room: Room) {
    return room.getMessages();
  }
  
  
}