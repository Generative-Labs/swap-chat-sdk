export class Web3Connect {
  token: string;
  isNotify: boolean;

  constructor(token: string, isNotify: boolean) {
    this.token = token;
    this.isNotify = isNotify;
  }

  send() {
    console.log('web3 send event');
  }
  receive() {}
}
