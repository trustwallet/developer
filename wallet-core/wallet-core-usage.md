# Wallet Core Usage Guide

We present here an overview of the basic wallet operations.  Language-specific samples are provided in step-by-step [guides](integration-guide.md).

The covered basic operations are:

* Wallet management
  * Creating a new multi-coin wallet
  * Importing a multi-coin wallet
* Address derivation (receiving)
  * Generating the default address for a coin
  * Generating an address using a custom derivation path (expert)
* Transaction signing (sending)
  * Coin-specific transaction signing
  * Coin-independent method ('AnySigner')

For the examples we use *Bitcoin*, *Ethereum* and *Binance Coin* as sample coins/blockchains.

Note: Wallet Core does not cover communication with blockchain networks (nodes): 
address derivation is covered, but address balance retrieval not; 
transaction signing is covered, but broadcasting transactions to the network not.

In this guide we use small code examples from a Swift sample application, but the focus is on the explanations.


## Wallet Management

### Multi-Coin Wallet

The Multi-Coin Wallet is a structure allowing accounts for many coins, all controlled by a single recovery phrase.
It is a standard HD Wallet (Hierarchically Derived), employing the standard derivation schemes, interoperable with many other wallets:
**BIP39** for recovery phrase, **BIP44**/**BIP84** for account derivation.

### Creating a New Multi-Coin Wallet

When a new wallet is created, a new seed (and thus recovery phrase) is chosen at random.  
*After creation, the user has to be informed and guided to backup the recovery phrase.*

The random generation employs secure random generation, as available on the device.

```swift
let wallet = HDWallet(strength: 128, passphrase: "")
```

Input parameter | Description
---|---
*strength* | The strength of the secret seed.  Higher seed means more information content, longer recovery phrase.  Default value is **128**, but 256 is also possible.
*passphrase* | Optional passphrase, used to scramble the seed.  If specified, the wallet can be imported and opened only with the passphrase (Not to be confused with recovery phrase).

### Importing a Multi-Coin Wallet

A previously created wallet can be imported using the recovery phrase.  Typical usecases for import are:
* re-importing a wallet later, into a later installation, or
* importing into another device, or 
* importing into another wallet app.

If the wallet was created with a passphrase, it is also required.

```swift
let wallet = HDWallet(mnemonic: "ripple scissors kick mammal hire column oak again sun offer wealth tomorrow wagon turn fatal", passphrase: "")
```

Input parameter | Description
---|---
*mnemonic* | a.k.a. *recovery phrase*.  The string of several words that was used to create the wallet.
*passphrase* | Optional passphrase, used to encrypt the seed.


## Account Address Derivation

Each coin needs a different account, with matching address.  Addresses are derived from the multi-coin wallet.
Derivation is based on a *derivation path*, which is unique for each coin, but can have other parameters as well.
Each coin has a default derivation path, such as `"m/84'/0'/0'/0/0"` for Bitcoin and `"m/44'/60'/0'/0/0"` for Ethereum.

### Generating the Default Address for a Coin

The simplest is to get the default address for a coin -- this requires no further inputs.
The address is generated using the default derivation path of the coin.

For example, the default BTC address, derived for the wallet with the mnemonic shown above, with the default BTC derivation path (`m/84'/0'/0'/0/0`) is:
`bc1qpsp72plnsqe6e2dvtsetxtww2cz36ztmfxghpd`.
For Ethereum, this is `0xA3Dcd899C0f3832DFDFed9479a9d828c6A4EB2A7`.

Here is the sample code fort obtaining the default address for different coins:

```swift
let addressBTC = wallet.getAddressForCoin(coin: .bitcoin)
let addressETH = wallet.getAddressForCoin(coin: .ethereum)
let addressBNB = wallet.getAddressForCoin(coin: .binance)
```

### Generating an Address Using a Custom Derivation Path (Expert)

It is also possible to derive addresses using custom derivation paths.
This can be done in two steps: first a derived private key is obtained, then an address from it.

> **Warning**: use this only if you are well aware of the semantics of the derivation path used!

> **Security Warning**: if secrets such as private keys are handled by the wallet, even if for a short time, handle with care!
> Avoid any risk of leakage of secrets!

```swift
let key = wallet.getKey(derivationPath: "m/44\'/60\'/1\'/0/0")   // m/44'/60'/1'/0/0
let address = CoinType.ethereum.deriveAddress(privateKey: key)
```

For example, a second Ethereum address can be derived using the custom derivation path `”m/44'/60’/1’/0/0”` (note the 1 in the third position),
yielding address `0x68eF4e5660620976a5968c7d7925753D3Cc40809`.


## Transaction Signing

In general, when creating a new blockchain transaction, a wallet has to:

1. Put together a transaction with relevant fields (source, target, amount, etc.)
2. Sign the transaction, using the account private key.  This is done by Wallet Core.
3. Send to a node for broadcasting to the blockchain network.

The exact fields needed for a transaction are different for each blockchain.
In Wallet Core, signing input and output parameters are typically represented in a protobuf message
(internally needed for serialization for passing through different language runtimes).

A generic, coin-independent signer also exists (*AnySigner*), but its usage is recommended only in browser-based applications.

### Ethereum Transaction Signing

A simple Ethereum send transaction needs the following fields:

Field | Sample value | Description
---|---|---
chainID | 1 | Network selector, use 1 for mainnet (see https://chainid.network for more)
nonce | 1 | The count of the number of outgoing transactions, starting with 0
gasPrice | 3600000000 | The price to determine the amount of ether the transaction will cost
gasLimit | 21000 | The maximum gas that is allowed to be spent to process the transaction
to | &lt;address&gt; | The account the transaction is sent to, if empty, the transaction will create a contract
value | 100000000 | The amount of ether to send
data | | Could be an arbitrary message or function call to a contract or code to create a contract

Several parameters, like the current nonce and gasPrice values can be obtained from Ethereum node RPC calls (see https://github.com/ethereum/wiki/wiki/JSON-RPC, e.g., *eth_gasPrice*).

Code example to fill in the signer input parameters:

```swift
let signerInput = EthereumSigningInput.with {
    $0.chainID = Data(hexString: "01")!
    $0.gasPrice = Data(hexString: "d693a400")! // decimal 3600000000
    $0.gasLimit = Data(hexString: "5208")! // decimal 21000
    $0.toAddress = "0xC37054b3b48C3317082E7ba872d7753D13da4986"
    $0.amount = Data(hexString: "0348bca5a16000")!
    $0.privateKey = wallet.getKeyForCoin(coin: .ethereum).data
}
```

Then Signer is invoked, and the signed and encoded output retrieved:

```swift
let signerOutput = EthereumSigner.sign(input: signerInput)
print(" data:   ", signerOutput.encoded.hexString)
```

For more details on Ethereum transactions, check the Ethereum documentation.  A few resources are here:

* https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f
* https://kauri.io/article/7e79b6932f8a41a4bcbbd194fd2fcc3a/v2/ethereum-101-part-4-accounts-transactions-and-messages
* https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc

### Binance Chain (BNB) Transaction Signing

Binance Chain is built upon [cosmos-sdk](https://github.com/cosmos/cosmos-sdk), instead of `Message`, transaction in Binance Chain is called `Order`, [Binance.proto](https://github.com/trustwallet/wallet-core/blob/master/src/proto/Binance.proto#L144) shows all the orders that Wallet Core currently supports.

To sign a order, you need to use `BinanceSigningInput`: 

Field | Sample value | Description
---|---|---
chainID | "Binance-Chain-Nile" | Network id, use "Binance-Chain-Tigris" for mainnet (see [node-info](https://dex.binance.org/api/v1/node-info) api)
accountNumber | 51 | On chain account number. (see [account](https://dex.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m) api)
sequence | 437412 | Order sequence starting from 0, always plus 1 for new order from [account](https://dex.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m) api
source | 0 | [BEP10](https://github.com/binance-chain/BEPs/blob/master/BEP10.md) source id
sendOrder | &lt;sendOrder&gt; | SendOrder contains `inputs` and `outputs`, see below sample code for more details

Several parameters, like the current nonce and gasPrice values can be obtained from Ethereum node RPC calls (see https://github.com/ethereum/wiki/wiki/JSON-RPC, e.g., *eth_gasPrice*).

A Swift sample code send order is shown below:

```swift
let privateKey = PrivateKey(data: Data(hexString: "95949f757db1f57ca94a5dff23314accbe7abee89597bf6a3c7382c84d7eb832")!)!
let publicKey = privateKey.getPublicKeySecp256k1(compressed: true)

let token = BinanceSendOrder.Token.with {
    $0.denom = "BNB" // BNB or BEP2 token symbol
    $0.amount = 1    // Amount, 1 BNB
}

// A.k.a from / sender
let input = BinanceSendOrder.Input.with {
    $0.address = CosmosAddress(hrp: .binance, publicKey: publicKey)!.keyHash
    $0.coins = [token]
}

// A.k.a to / recipient
let output = BinanceSendOrder.Output.with {
    $0.address = CosmosAddress(string: "bnb1hlly02l6ahjsgxw9wlcswnlwdhg4xhx38yxpd5")!.keyHash
    $0.coins = [token]
}

let signingInput = BinanceSigningInput.with {
    $0.chainID = "Binance-Chain-Nile" // Testnet Chain id
    $0.accountNumber = 0              // On chain account number
    $0.sequence = 0                   // Sequence number
    $0.source = 0                     // BEP10 source id
    $0.privateKey = privateKey.data
    $0.memo = ""
    $0.sendOrder = BinanceSendOrder.with {
        $0.inputs = [input]
        $0.outputs = [output]
    }
}

let data = BinanceSigner.sign(input: signingInput)
// encoded order to broadcast
print(data.encoded)
```

For more details please check the Binance Chain documentation:

* https://docs.binance.org/encoding.html
* https://docs.binance.org/api-reference/dex-api/paths.html#http-api

### Coin-Independent Signing ('AnySigner')

Wallet Core also has a generic, coin-independent signer.  The transaction fields are provided in a JSON string, with the same content.  Since this is not strongly typed, its usage is not recommended.  We reproduce here one example (with Ethereum) nonetheless.

```swift
let transaction =  "{\"chainId\":\"AQ==\",\"gasPrice\":\"1pOkAA==\",\"gasLimit\":\"Ugg=\",\"toAddress\":\"" + dummyReceiverAddress + "\",\"amount\":\"A0i8paFgAA==\"}"
let anySignerInput = AnySigningInput.with {
    $0.coinType = coin.rawValue
    $0.transaction = transaction
    $0.privateKey = secretPrivateKey.data.hexString
}
let anySignerOutput = AnySigner.sign(input: anySignerInput)
if (anySignerOutput.success) {
    print("Signed transaction data:", anySignerOutput.output)
}
```

Consult the complete sample applications for more details.
