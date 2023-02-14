# Wallet Core Usage Guide

We present here an overview of the basic wallet operations. Language-specific samples are provided in step-by-step [guides](integration-guide.md).

The covered basic operations are:

- Wallet management
  - Creating a new multi-coin wallet
  - Importing a multi-coin wallet
- Address derivation (receiving)
  - Generating the default address for a coin
  - Generating an address using a custom derivation path (expert)
- Transaction signing (e.g. for sending)

For the examples we use _Bitcoin_, _Ethereum_ and _Binance Coin_ as sample coins/blockchains.

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
_After creation, the user has to be informed and guided to backup the recovery phrase._

The random generation employs secure random generation, as available on the device.

```swift
let wallet = HDWallet(strength: 128, passphrase: "")
```

| Input parameter | Description                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _strength_      | The strength of the secret seed. Higher seed means more information content, longer recovery phrase. Default value is **128**, but 256 is also possible.                |
| _passphrase_    | Optional passphrase, used to scramble the seed. If specified, the wallet can be imported and opened only with the passphrase (Not to be confused with recovery phrase). |

### Importing a Multi-Coin Wallet

A previously created wallet can be imported using the recovery phrase. Typical usecases for import are:

- re-importing a wallet later, into a later installation, or
- importing into another device, or
- importing into another wallet app.

If the wallet was created with a passphrase, it is also required.

```swift
let wallet = HDWallet(mnemonic: "ripple scissors kick mammal hire column oak again sun offer wealth tomorrow wagon turn fatal", passphrase: "")
```

| Input parameter | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| _mnemonic_      | a.k.a. _recovery phrase_. The string of several words that was used to create the wallet. |
| _passphrase_    | Optional passphrase, used to encrypt the seed.                                            |

## Account Address Derivation

Each coin needs a different account, with matching address. Addresses are derived from the multi-coin wallet.
Derivation is based on a _derivation path_, which is unique for each coin, but can have other parameters as well.
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
2. Sign the transaction, using the account private key. This is done by Wallet Core.
3. Send to a node for broadcasting to the blockchain network.

The exact fields needed for a transaction are different for each blockchain.
In Wallet Core, signing input and output parameters are typically represented in a protobuf message
(internally needed for serialization for passing through different language runtimes).

A generic, coin-independent signer also exists (_AnySigner_), but its usage is recommended only in browser-based applications.

### Bitcoin Transaction Signing

Bitcoin is the first `UTXO` (Unspent Transaction Output) based cryptocurrency / blockchain, if you haven't read the documentation about Bitcoin, we highly recommend you to read [developer glossary](https://bitcoin.org/en/developer-glossary) and [raw transaction format](https://bitcoin.org/en/developer-reference#raw-transaction-format), these will help you understand how to sign a Bitcoin transaction. Wallet Core supports _Bitcoin_, _Bitcoin Cash_, _Zcash_, _Decred_ and a few forks.

The most important models in Swift are `BitcoinSigningInput` and `BitcoinUnspentTransaction`

_BitcoinSigningInput_

| Field         | Sample value                               | Description                                                                                                                                  |
| ------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| hash_type     | BitcoinSigHashType.all                     | _Bitcoin Cash_ needs to `or` with `TitcoinSigHashType.fork` (see [Sighash](https://bitcoin.org/en/glossary/signature-hash) for more details) |
| amount        | 10000                                      | Amount (in satoshi) to send (value of new UTXO will be created)                                                                              |
| byteFee       | 1                                          | Transaction fee is `byte_fee x transaction_size`, Wallet Core will calculate the fee for you by default                                      |
| toAddress     | bc1q03h6k5lt6pzfjaanz5mlnmuc7aha2t3nkz7gh0 | Recipient address (Wallet Core will build lock script for you)                                                                               |
| changeAddress | 1AC4gh14wwZPULVPCdxUkgqbtPvC92PQPN         | Address to receive changes, can be empty if you sweep a wallet                                                                               |
| privateKey    | [Data(...), Data(...)]                     | Private keys for all the input UTXOs in this transaction                                                                                     |
| scripts       | [`script_hash`: Data(...)]                 | Redeem scripts indexed by script hash, usually for `P2SH`, `P2WPKH` or `P2WSH`                                                               |
| utxo          | [*BitcoinUnspentTransaction*]              | All the input UTXOs, see below table for more details                                                                                        |
| useMaxAmount  | false                                      | Consume all the input UTXOs, it will affect fee estimation and number of output                                                              |
| coinType      | 145                                        | [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) coin type, default is 0 / Bitcoin                                    |

_BitcoinUnspentTransaction_

| Field    | Sample value                                         | Description                                                                                                                 |
| -------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| outPoint | _BitcoinOutPoint(hash:index:)_                       | Refer to a particular transaction output, consisting of a 32-byte TXID and a 4-byte output index number (vout)              |
| amount   | 10000                                                | A value field for transferring zero or more satoshis                                                                        |
| script   | 0x76a9146cfa0e96c34fce09c0e4e671fcd43338c14812e588ac | A script (ScriptPubKey) included in outputs which sets the conditions that must be fulfilled for those satoshis to be spent |

Here is the Swift sample code for signing a real world Bitcoin Cash [transaction](https://blockchair.com/bitcoin-cash/transaction/96ee20002b34e468f9d3c5ee54f6a8ddaa61c118889c4f35395c2cd93ba5bbb4)

```swift
let utxoTxId = Data(hexString: "050d00e2e18ef13969606f1ceee290d3f49bd940684ce39898159352952b8ce2")! // latest utxo for sender, "txid" field from blockbook utxo api: https://github.com/trezor/blockbook/blob/master/docs/api.md#get-utxo
let privateKey = PrivateKey(data: Data(hexString: "7fdafb9db5bc501f2096e7d13d331dc7a75d9594af3d251313ba8b6200f4e384")!)!
let address = CoinType.bitcoinCash.deriveAddress(privateKey: privateKey)

let utxo = BitcoinUnspentTransaction.with {
    $0.outPoint.hash = Data(utxoTxId.reversed()) // reverse of UTXO tx id, Bitcoin internal expects network byte order
    $0.outPoint.index = 2                        // outpoint index of this this UTXO, "vout" field from blockbook utxo api
    $0.outPoint.sequence = UINT32_MAX
    $0.amount = 5151                             // value of this UTXO, "value" field from blockbook utxo api
    $0.script = BitcoinScript.lockScriptForAddress(address: address, coin: .bitcoinCash).data // Build lock script from address or public key hash
}

let input = BitcoinSigningInput.with {
    $0.hashType = BitcoinScript.hashTypeForCoin(coinType: .bitcoinCash)
    $0.amount = 600
    $0.byteFee = 1
    $0.toAddress = "1Bp9U1ogV3A14FMvKbRJms7ctyso4Z4Tcx"
    $0.changeAddress = "1FQc5LdgGHMHEN9nwkjmz6tWkxhPpxBvBU" // can be same sender address
    $0.utxo = [utxo]
    $0.privateKey = [privateKey.data]
}

let output: BitcoinSigningOutput = AnySigner.sign(input: input, coin: .bitcoinCash)
guard output.error.isEmpty else { return }
// encoded transaction to broadcast
print(output.encoded)
```

It's worth to note that you can also calcuate fee and change manually (by using a `BitcoinTransactionPlan` struct)  
Below is another real world Zcash [transparent transaction](https://explorer.zcha.in/transactions/ec9033381c1cc53ada837ef9981c03ead1c7c41700ff3a954389cfaddc949256) demonstrate this

```swift
let utxos = [
    BitcoinUnspentTransaction.with {
        $0.outPoint.hash = Data(hexString: "53685b8809efc50dd7d5cb0906b307a1b8aa5157baa5fc1bd6fe2d0344dd193a")!
        $0.outPoint.index = 0
        $0.outPoint.sequence = UINT32_MAX
        $0.amount = 494000
        $0.script = Data(hexString: "76a914f84c7f4dd3c3dc311676444fdead6e6d290d50e388ac")!
    }
]

let input = BitcoinSigningInput.with {
    $0.hashType = BitcoinSigHashType.all.rawValue
    $0.amount = 488000
    $0.toAddress = "t1QahNjDdibyE4EdYkawUSKBBcVTSqv64CS"
    $0.coinType = CoinType.zcash.rawValue
    $0.privateKey = [Data(hexString: "a9684f5bebd0e1208aae2e02bc9e9163bd1965ad23d8538644e1df8b99b99559")!]
    $0.plan = BitcoinTransactionPlan.with {
        $0.amount = 488000
        $0.fee = 6000
        $0.change = 0
        // Sapling branch id
        $0.branchID = Data(hexString: "0xbb09b876")!
        $0.utxos = utxos
    }
}

let output: BitcoinSigningOutput = AnySigner.sign(input: input, coin: .zcash)

// encoded transaction to broadcast
print(output.encoded)
```

Besides [orignal Bitcoin RPC](https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_calls_list), there are many other APIs / block explorer can get UTXO and broadcast raw transaction, like: insight api, trezor blockbook, blockchain com, blockchair api.

### Ethereum Transaction Signing

A simple Ethereum send transaction needs the following fields:

| Field    | Sample value    | Description                                                                               |
| -------- | --------------- | ----------------------------------------------------------------------------------------- |
| chainID  | 1               | Network selector, use 1 for mainnet (see https://chainid.network for more)                |
| nonce    | 1               | The count of the number of outgoing transactions, starting with 0                         |
| gasPrice | 3600000000      | The price to determine the amount of ether the transaction will cost                      |
| gasLimit | 21000           | The maximum gas that is allowed to be spent to process the transaction                    |
| to       | &lt;address&gt; | The account the transaction is sent to, if empty, the transaction will create a contract  |
| value    | 100000000       | The amount of ether to send                                                               |
| data     |                 | Could be an arbitrary message or function call to a contract or code to create a contract |

Several parameters, like the current nonce and gasPrice values can be obtained from Ethereum node RPC calls (see https://github.com/ethereum/wiki/wiki/JSON-RPC, e.g., _eth_gasPrice_).

Code example to fill in the signer input parameters:

```swift
let input = EthereumSigningInput.with {
    $0.chainID = Data(hexString: "01")!
    $0.gasPrice = Data(hexString: "d693a400")! // decimal 3600000000
    $0.gasLimit = Data(hexString: "5208")! // decimal 21000
    $0.toAddress = "0xC37054b3b48C3317082E7ba872d7753D13da4986"
    $0.transaction = EthereumTransaction.with {
       $0.transfer = EthereumTransaction.Transfer.with {
           $0.amount = Data(hexString: "0348bca5a16000")!
       }
    }
    $0.privateKey = wallet.getKeyForCoin(coin: .ethereum).data
}
```

Then Signer is invoked, and the signed and encoded output retrieved:

```swift
let output: EthereumSigningOutput = AnySigner.sign(input: input, coin: .ethereum)
print(" data:   ", output.encoded.hexString)
```

For more details on Ethereum transactions, check the Ethereum documentation. A few resources are here:

- https://medium.com/@codetractio/inside-an-ethereum-transaction-fa94ffca912f
- https://kauri.io/article/7e79b6932f8a41a4bcbbd194fd2fcc3a/v2/ethereum-101-part-4-accounts-transactions-and-messages
- https://github.com/ethereumbook/ethereumbook/blob/develop/06transactions.asciidoc

### Binance Chain (BNB) Transaction Signing

Binance Chain is built upon [cosmos-sdk](https://github.com/cosmos/cosmos-sdk), instead of `Message`, transaction in Binance Chain is called `Order`, [Binance.proto](https://github.com/trustwallet/wallet-core/blob/master/src/proto/Binance.proto#L144) shows all the orders that Wallet Core currently supports.

To sign a order, you need to use `BinanceSigningInput`:

| Field         | Sample value       | Description                                                                                                                                                       |
| ------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chainID       | Binance-Chain-Nile | Network id, use Binance-Chain-Tigris for mainnet (see [node-info](https://dex.binance.org/api/v1/node-info) api)                                                  |
| accountNumber | 51                 | On chain account number. (see [account](https://dex.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m) api)                                   |
| sequence      | 437412             | Order sequence starting from 0, always plus 1 for new order from [account](https://dex.binance.org/api/v1/account/bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m) api |
| source        | 0                  | [BEP10](https://github.com/binance-chain/BEPs/blob/master/BEP10.md) source id                                                                                     |
| sendOrder     | &lt;sendOrder&gt;  | SendOrder contains `inputs` and `outputs`, see below sample code for more details                                                                                 |

A Swift sample code send order is shown below:

```swift
let privateKey = PrivateKey(data: Data(hexString: "95949f757db1f57ca94a5dff23314accbe7abee89597bf6a3c7382c84d7eb832")!)!
let publicKey = privateKey.getPublicKeySecp256k1(compressed: true)

let token = BinanceSendOrder.Token.with {
    $0.denom = "BNB" // BNB or BEP2 token symbol
    $0.amount = 1    // Amount, 1 BNB
}

// A.k.a from / sender
let orderInput = BinanceSendOrder.Input.with {
    $0.address = CosmosAddress(hrp: .binance, publicKey: publicKey)!.keyHash
    $0.coins = [token]
}

// A.k.a to / recipient
let orderOutput = BinanceSendOrder.Output.with {
    $0.address = CosmosAddress(string: "bnb1hlly02l6ahjsgxw9wlcswnlwdhg4xhx38yxpd5")!.keyHash
    $0.coins = [token]
}

let input = BinanceSigningInput.with {
    $0.chainID = "Binance-Chain-Nile" // Testnet Chain id
    $0.accountNumber = 0              // On chain account number
    $0.sequence = 0                   // Sequence number
    $0.source = 0                     // BEP10 source id
    $0.privateKey = privateKey.data
    $0.memo = ""
    $0.sendOrder = BinanceSendOrder.with {
        $0.inputs = [orderInput]
        $0.outputs = [orderOutput]
    }
}

let output: BinanceSigningOutput = AnySigner.sign(input: input, coin: .binance)
// encoded order to broadcast
print(output.encoded)
```

For more details please check the Binance Chain documentation:

- https://docs.binance.org/encoding.html
- https://docs.binance.org/api-reference/dex-api/paths.html#http-api

Consult the complete sample applications for more details.
