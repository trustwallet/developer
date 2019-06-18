# DApp Integration

Trust uses a forked version of WalletConnect with aditional methods to allow **dApp** developers
to sign transactions for any blockchain. 

## Getting started
To use Trust's WalletConnect implementation, you need to clone the following repository:

```bash
git clone git@github.com:TrustWallet/walletconnect-monorepo.git
```

then build and link `@walletconnect/core` package:

```bash
cd packages/core
npm install
npm run build
npm link
```

and build and link `@walletconnect/browser` package:

```bash
cd walletconnect-monorepo/browser
npm install
npm link @walletconnect/core
npm run build
npm link
```

> **Notice:** This package must use our core implementation. The command `npm link @walletconnect/core` link's our core package to the browser package before building it.

After having both packages linked to your global repository, you have to install the following packages in your project:

```bash
npm install --save @walletconnect/browser @walletconnect/qrcode-modal
npm link @walletconnect/browser
```

Now you're ready to sign transactions.

### Initiate Connection
Before you can sign transactions, you have to initiate a connection to a WalletConnect bridge server, and handle all possible states:

```javascript
import WalletConnect from "@walletconnect/browser";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";

// Create a walletConnector
const walletConnector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org" // Required
});

// Check if connection is already established
if (!walletConnector.connected) {
  // create new session
  walletConnector.createSession().then(() => {
    // get uri for QR Code modal
    const uri = walletConnector.uri;
    // display QR Code modal
    WalletConnectQRCodeModal.open(uri, () => {
      console.log("QR Code Modal closed");
    });
  });
}

// Subscribe to connection events
walletConnector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Close QR Code Modal
  WalletConnectQRCodeModal.close();

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

walletConnector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

walletConnector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete walletConnector
});
```

### Sign Transaction
Once you have `walletconnect client` set up, you can sign a transaction:

```javascript
const network = 118; // Atom (SLIP-44)
// Transaction structure based on Trust's protobuf messages.
const tx = {
"accountNumber": "1035",
  "chainId": "cosmoshub-2",
  "fee": {
    "amounts": [
      {
        "denom": "uatom",
        "amount": "5000"
      }
    ],
    "gas": "200000"
  },
  "sequence": "40",
  "sendCoinsMessage": {
    "fromAddress": "cosmos135qla4294zxarqhhgxsx0sw56yssa3z0f78pm0",
    "toAddress": "cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa",
    "amounts": [
      {
        "denom": "uatom",
        "amount": "100000"
      }
    ]
  }
};

walletConnector
  .trusSignTransaction(network, tx)
  .then(result => {
    // Returns transaction signed in json or encoded format
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

> **REMEMBER:** You have to provide the json structure based on [WalletCore's proto messages](https://github.com/TrustWallet/wallet-core/tree/master/src/proto). Please check the repository for more details.