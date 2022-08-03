// import { getLoginRandomSecret } from '../core/utils';

export class Slope {
  constructor() {}

  static signSlope = async () => {
    // @ts-ignore
    const slope = new window.Slope();
    try {
      const {
        msg,
        data: { publicKey },
      } = await slope.connect();

      if (msg === 'ok') {
        // const { data: secret } = await getLoginRandomSecret({
        //   wallet_address: address,
        // });
        const message = `test ${publicKey}`;
        const encodedMessage = new TextEncoder().encode(message);
        const { msg, data } = await slope.signMessage(
          encodedMessage,
          'utf8', // 'utf8' or 'hex'
        );
        if (msg === 'ok') {
          const signedMessage = data.signature;
          console.log(signedMessage, 'signedMessage');
        }
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.log(error);
      // Slope is not installed or other errors.
    }
  };

  static disconnecting = () => {
    // @ts-ignore
    const slope = new window.Slope();
    slope.disconnect();
  };
}
