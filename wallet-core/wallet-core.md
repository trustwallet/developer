# Wallet Core

![](/media/wallet-core-banner.png)

## Introduction

Trust Wallet Core is a cross-platform library that implements low-level cryptographic wallet functionality for many blockchains. Most of the code is C++ with a set of strict exported C interfaces. The library provides idiomatic interfaces for all supported languages \(currently Swift for iOS and Java for Android\).

## Usage

If you want to use wallet core in your project follow these instructions.

For building, see [Build Instructions](building.md).

#### Android

Add this dependency to build.gradle:

```groovy
dependencies {
    implementation 'com.trustwallet.walletcore:walletcore:0.10.0'
}
```

#### iOS

Add this line to your Podfile and run `pod install`:

```ruby
pod 'TrustWalletCore'
```

## WalletConsole utility

An interactive command-line utility in included, called *WalletConsole*, for accessing key- and address management functionality of the library. 
See [more details](walletconsole.md).

## Projects using Wallet Core -- Add yours too!

- [Trust Wallet](https://trustwallet.com)
- [coinpaprika](https://coinpaprika.com/)
- [IFWallet](https://www.ifwallet.com/)

## Contributing

The best way to submit feedback and report bugs is to [open a GitHub issue](https://github.com/trustwallet/wallet-core/issues/new). If you want to contribute code please see [Contributing](https://developer.trustwallet.com/wallet-core/contributing). If you want to add support for a new blockchain also see [Adding Support for a New Blockchain](newblockchain.md).

Thanks to all the people who contribute. 
<a href="graphs/contributors"><img src="https://opencollective.com/wallet-core/contributors.svg?width=890&button=false" /></a>

## License

Trust Wallet Core is available under the MIT license. See the [LICENSE](https://github.com/trustwallet/wallet-core/blob/master/LICENSE) file for more info.
