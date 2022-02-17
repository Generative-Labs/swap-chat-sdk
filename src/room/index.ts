import Client from '@/client';

export default class Room {
  _client: Client;
  constructor(client: Client) {
    this._client = client;
  }

  join() {}
  leave() {}

  addMember() {}

  onMessage() {}
  getMessages() {}
}
