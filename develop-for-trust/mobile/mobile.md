# Mobile (WalletConnect)

[WalletConnect](https://walletconnect.org/) is an open source protocol for connecting dApps to mobile wallets with QR code scanning or deep linking, basically it's a websocket JSON-RPC channel.

There are two common ways to integrate: Standalone Client and Web3Model (Web3 Provider)

## Standalone Client

Trust extends WalletConnect 1.x with aditional JSON-RPC methods to support multi-chain **dApps**. Currently, you can get all accounts and sign transactions [for any blockchain](https://github.com/trustwallet/wallet-core/blob/master/docs/registry.md) implements `signJSON` method in wallet core.

**Supported Coins**

- Binance Chain
- Ethereum and forks
- Cosmos, Kava and other sdk based chains
- Tezos
- Nano
- Filecoin
- Harmony
- Solana
- Zilliqa

### Installation

```bash
npm install --save @walletconnect/client @walletconnect/qrcode-modal
```

### Initiate Connection

Before you can sign transactions, you have to initiate a connection to a WalletConnect bridge server, and handle all possible states:

```javascript
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

// Check if connection is already established
if (!connector.connected) {
  // create new session
  connector.createSession();
}

// Subscribe to connection events
connector.on("connect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get provided accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on("session_update", (error, payload) => {
  if (error) {
    throw error;
  }

  // Get updated accounts and chainId
  const { accounts, chainId } = payload.params[0];
});

connector.on("disconnect", (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
});
```

code snippet above is copied from https://docs.walletconnect.org/quick-start/dapps/client#initiate-connection, please check out the original link for standard methods.

### Get multiple chain accounts from Trust

Once you have `walletconnect client` set up, you will be able to get user's accounts:

```javascript
const request = connector._formatRequest({
  method: "get_accounts",
});

connector
  ._sendCallRequest(request)
  .then((result) => {
    // Returns the accounts
    console.log(result);
  })
  .catch((error) => {
    // Error returned when rejected
    console.error(error);
  });
```

The result is an array with following structure:

```javascript
[
  {
    network: number,
    address: string,
  },
];
```

### Sign multi chain transaction

Once you have the account list, you will be able to sign a transaction, please note that the json structure is based on [WalletCore's proto messages](https://github.com/trustwallet/wallet-core/tree/master/src/proto), we suggest using `protobuf.js` or [@trustwallet/wallet-core](https://github.com/trustwallet/wallet-core/packages/294430) to generate it properly.

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
        amount: "5000",
      },
    ],
    gas: "200000",
  },
  sequence: "40",
  sendCoinsMessage: {
    fromAddress: account.address,
    toAddress: "cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa",
    amounts: [
      {
        denom: "uatom",
        amount: "100000",
      },
    ],
  },
};

const request = connector._formatRequest({
  method: "trust_signTransaction",
  params: [
    {
      network,
      transaction: JSON.stringify(tx),
    },
  ],
});

connector
  ._sendCallRequest(request)
  .then((result) => {
    // Returns transaction signed in json or encoded format
    console.log(result);
  })
  .catch((error) => {
    // Error returned when rejected
    console.error(error);
  });
```

The result can be either a string JSON or an HEX encoded string. For Atom, the result is JSON:

```json
{
  "tx": {
    "fee": {
      "amount": [
        {
          "amount": "5000",
          "denom": "uatom"
        }
      ],
      "gas": "200000"
    },
    "memo": "",
    "msg": [
      {
        "type": "cosmos-sdk/MsgSend",
        "value": {
          "amount": [
            {
              "amount": "100000",
              "denom": "uatom"
            }
          ],
          "from_address": "cosmos135qla4294zxarqhhgxsx0sw56yssa3z0f78pm0",
          "to_address": "cosmos1zcax8gmr0ayhw2lvg6wadfytgdhen25wrxunxa"
        }
      }
    ],
    "signatures": [
      {
        "pub_key": {
          "type": "tendermint/PubKeySecp256k1",
          "value": "A+mYPFOMSp6IYyXsW5uKTGWbXrBgeOOFXHNhLGDsGFP7"
        },
        "signature": "m10iqKAHQ5Ku5f6NcZdP29fPOYRRR+p44FbGHqpIna45AvYWrJFbsM45xbD+0ueX+9U3KYxG/jSs2I8JO55U9A=="
      }
    ],
    "type": "cosmos-sdk/MsgSend"
  }
}
```

## Web3Modal

[Web3Modal](https://github.com/Web3Modal/web3modal) is an easy-to-use library to help developers add support for multiple providers (including WalletConnect) in their apps with a simple customizable configuration.

### Installation

```bash
npm install --save web3modal web3 @walletconnect/web3-provider
```

### Customize chain id

Sample code for configuring WalletConnect with Binance Smart Chain

```js
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

// set chain id and rpc mapping in provider options
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed1.binance.org",
      },
      chainId: 56,
    },
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

const provider = await web3Modal.connect();
await web3Modal.toggleModal();

// regular web3 provider methods
const newWeb3 = new Web3(provider);
const accounts = await newWeb3.eth.getAccounts();

console.log(accounts);
```
