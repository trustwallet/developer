---
title: iOS Integration Guide
---

# iOS Integration Guide

Wallet Core is available on the iOS platform, it comes with _Swift_ bindings.
In this guide we show how to use it.

A sample application is available at: https://github.com/trustwallet/wallet-core/tree/master/samples/osx .

## Prerequisites

- [_CocoaPods_](https://cocoapods.org/). If you don't have it, install it by
  `gem install cocoapods`.
- _Xcode_ toolchain
- Wallet Core library

## Adding Library Dependency

An easy way to add Wallet Core dependency to an iOS project is through _CocoaPods_, like this (the exact version may change in the future):

```
  pod 'TrustWalletCore'
```

The dependency can be installed simply by `pod install`:

```shell
pod install
```

SPM is also supported, download latest `Package.swift` from [GitHub Releases](https://github.com/trustwallet/wallet-core/releases) and put it in a local `WalletCore` folder.

Add this line to the `dependencies` parameter in your `Package.swift`:

```swift
.package(name: "WalletCore", path: "../WalletCore"),
```

Or add remote url + `master` branch, it points to recent (not always latest) binary release.

```swift
.package(name: "WalletCore", url: "https://github.com/trustwallet/wallet-core", .branchItem("master")),
```

Then add libraries to target's `dependencies`:

```swift
.product(name: "WalletCore", package: "WalletCore"),
.product(name: "SwiftProtobuf", package: "WalletCore"),
```

## Code Examples

In the following sections we show code examples for some common funcions.
Please refer to the [Wallet Usage Guide](wallet-core-usage) for detailed explanations.

Accessing Wallet Core functionality requires one import statement:

```swift
import WalletCore
```

### Wallet Management

Creating or Importing a Multi-Coin HD Wallet

```swift
let wallet = HDWallet(strength: 128, passphrase: "")
```

```swift
let wallet = HDWallet(mnemonic: "ripple scissors kick mammal hire column oak again sun offer wealth tomorrow wagon turn fatal", passphrase: "")!
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
2. Sign the transaction, using the account private key. This is done by Wallet Core.
3. Send to a node for broadcasting to the blockchain network.

Ethereum Transaction Signing

Code example to fill in signer input parameters, perform signing, and retrieve encoded result:

```swift
let signerInput = EthereumSigningInput.with {
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
let output: EthereumSigningOutput = AnySigner.sign(input: signerInput, coin: .ethereum)
print(" data:   ", output.encoded.hexString)
```
