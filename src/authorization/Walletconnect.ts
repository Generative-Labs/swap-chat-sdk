// @ts-ignore
import WalletConnect from '@walletconnect/client/dist/umd/index.min.js';
// @ts-ignore
import QRCodeModal from '@walletconnect/qrcode-modal/dist/umd/index.min.js';

export class Walletconnect {
  static signWalletconnect = async () => {
    console.log(2233);
    // Create a connector
    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: QRCodeModal,
    });
    console.log(connector);
    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();
    }
  };
}
