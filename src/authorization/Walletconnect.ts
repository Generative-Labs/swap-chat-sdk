import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

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
