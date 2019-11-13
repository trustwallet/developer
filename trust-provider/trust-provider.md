# Trust Provider
Trust dApp browser provides simple a API for **dApp** developers to create multi-chain applications. Currently, our API allows you to get accounts and sign transactions [for any blockchain](https://github.com/trustwallet/wallet-core/blob/master/docs/coins.md) for both iOS and Android.

__Supported Coins__

<a href="https://binance.com/" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png" width="32" /></a>
<a href="https://ethereum.org/" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" width="32" /></a>
<a href="https://cosmos.network/" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png" width="32" /></a>

## Getting started
trustwallet's dApp browser expostes through `window.trustProvider` object. All methods return a `Promise`, whcih is resolved asynchronously with the result of the call.

### Get Accounts
To get a list of supported accounts, you just need to call `trustProvider.getAccounts()` method:

```javascript
window.trustProvider
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
After getting the user account for a specific network, you can sign a transaction using `trustProvider.signTransaction({network: number, transaction: any})` method:

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

window.trustProvider
  .signTransaction({network: network, transaction: tx})
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

> **REMEMBER:** You have to provide the json structure based on [WalletCore's proto messages](https://github.com/trustwallet/wallet-core/tree/master/src/proto). Please check the repository for more details.