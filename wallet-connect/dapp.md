# DApp Integration

Trust uses a forked version of WalletConnect with aditional methods to allow **dApp** developers
to sign transactions [for any blockchain](https://github.com/TrustWallet/wallet-core/blob/master/docs/coins.md). 

__Supported Coins__

<a href="https://binance.com" target="_blank"><img src="https://raw.githubusercontent.com/TrustWallet/tokens/master/coins/714.png" width="32" /></a>
<a href="https://ethereum.org" target="_blank"><img src="https://raw.githubusercontent.com/TrustWallet/tokens/master/coins/60.png" width="32" /></a>
<a href="https://cosmos.network/" target="_blank"><img src="https://raw.githubusercontent.com/TrustWallet/tokens/master/coins/118.png" width="32" /></a>


### Demo
Checkout the demo [here](https://wallet-connect.trustwallet.com/)

## Getting started
To use Trust's WalletConnect's implementation, you just need install two packages:

```bash
npm install --save @walletconnect/qrcode-modal @trustwallet/walletconnect
```

### Initiate Connection
Before you can sign transactions, you have to initiate a connection to a WalletConnect bridge server, and handle all possible states:

```javascript
import WalletConnect from "@trustwallet/walletconnect";
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

### Get Accounts
Once you have `walletconnect client` set up, you will be able to get the user's accounts:

```javascript
walletConnector
  .getAccounts()
  .then(result => {
    // Returns the accounts
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

The result is an array with the following structure:
```javascript
[
  {
    network: number,
    address: string
  }
]
```

### Sign Transaction
Once you have the account list, you will be able sign a transaction:

```javascript
const network = 118; // Atom (SLIP-44)
const account = accounts.find((account) => account.network === network);
// Transaction structure based on Trust's protobuf messages.
const tx = {
accountNumber: "1035",
  chainId: "cosmoshub-2",
  fee: {
    amounts: [
      {
        denom: "uatom",
        amount: "5000"
      }
    ],
    gas: "200000"
  },
  sequence: "40",
  sendCoinsMessage: {
    fromAddress: account.address,
    toAddress: "cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa",
    amounts: [
      {
        denom: "uatom",
        amount: "100000"
      }
    ]
  }
};

walletConnector
  .trustSignTransaction(network, tx)
  .then(result => {
    // Returns transaction signed in json or encoded format
    console.log(result);
  })
  .catch(error => {
    // Error returned when rejected
    console.error(error);
  });
```

The result can be either a string JSON or an HEX encoded string. For Atom, the result is JSON:
```javascript
"{\"tx\":{\"fee\":{\"amount\":[{\"amount\":\"5000\",\"denom\":\"uatom\"}],\"gas\":\"200000\"},\"memo\":\"\",\"msg\":[{\"type\":\"cosmos-sdk/MsgSend\",\"value\":{\"amount\":[{\"amount\":\"100000\",\"denom\":\"uatom\"}],\"from_address\":\"cosmos135qla4294zxarqhhgxsx0sw56yssa3z0f78pm0\",\"to_address\":\"cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa\"}}],\"signatures\":[{\"pub_key\":{\"type\":\"tendermint/PubKeySecp256k1\",\"value\":\"A+mYPFOMSp6IYyXsW5uKTGWbXrBgeOOFXHNhLGDsGFP7\"},\"signature\":\"m10iqKAHQ5Ku5f6NcZdP29fPOYRRR+p44FbGHqpIna45AvYWrJFbsM45xbD+0ueX+9U3KYxG/jSs2I8JO55U9A==\"}],\"type\":\"cosmos-sdk/MsgSend\"}}"
```
> **REMEMBER:** You have to provide the json structure based on [WalletCore's proto messages](https://github.com/TrustWallet/wallet-core/tree/master/src/proto). Please check the repository for more details.
