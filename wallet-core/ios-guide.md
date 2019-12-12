# iOS Integration Guide

Wallet Core is available on the iOS platform, it comes with *Swift* bindings.
In this guide we show how to use it.

A sample application is available at: https://github.com/catenocrypt/sample-wallet-core .

## Prerequisites

* [*CocoaPods*](https://cocoapods.org/).  If you don't have it, install it by
`gem install cocoapods`.
* *Xcode* toolchain
* Wallet Core library

## Adding Library Dependency

An easy way to add Wallet Core dependency to an iOS project is through *CocoaPods*, like this (the exact version may change in the future):

```
  pod 'TrustWalletCore', '~> 0.12.30'
```

The dependency can be installed simply by `pod install`:

```shell
pod install
```

## Code Examples

In the following sections we show code examples for some common funcions.
Please refer to the [Wallet Usage Guide](wallet-core-usage.md) for detailed explanations.

Accessing Wallet Core functionality requires one import statement:

```swift
import TrustWalletCore
```

### Wallet Management

Creating or Importing a Multi-Coin HD Wallet

```swift
let wallet = HDWallet(strength: 128, passphrase: "")
```

```swift
let wallet = HDWallet(mnemonic: "ripple scissors kick mammal hire column oak again sun offer wealth tomorrow wagon turn fatal", passphrase: "")
```


### Account Address Derivation

Generating the Default Address for a Coin

```swift
let addressBTC = wallet.getAddressForCoin(coin: .bitcoin)
let addressETH = wallet.getAddressForCoin(coin: .ethereum)
let addressBNB = wallet.getAddressForCoin(coin: .binance)
```

Generating an Address Using a Custom Derivation Path (Expert)

```swift
let key = wallet.getKey(derivationPath: "m/44\'/60\'/1\'/0/0")   // m/44'/60'/1'/0/0
let address = CoinType.ethereum.deriveAddress(privateKey: key)
```


### Transaction Signing

In general, when creating a new blockchain transaction, a wallet has to:

1. Put together a transaction with relevant fields (source, target, amount, etc.)
2. Sign the transaction, using the account private key.  This is done by Wallet Core.
3. Send to a node for broadcasting to the blockchain network.

Ethereum Transaction Signing

Code example to fill in signer input parameters, perform signing, and retrieve encoded result:

```swift
let signerInput = EthereumSigningInput.with {
    $0.chainID = Data(hexString: "01")!
    $0.gasPrice = Data(hexString: "d693a400")! // decimal 3600000000
    $0.gasLimit = Data(hexString: "5208")! // decimal 21000
    $0.toAddress = "0xC37054b3b48C3317082E7ba872d7753D13da4986"
    $0.amount = Data(hexString: "0348bca5a16000")!
    $0.privateKey = wallet.getKeyForCoin(coin: .ethereum).data
}
let signerOutput = EthereumSigner.sign(input: signerInput)
print(" data:   ", signerOutput.encoded.hexString)
```

Coin-Independent Signing ('AnySigner')

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
