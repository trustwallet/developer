# Wallet Core

![](/media/wallet-core-banner.png)

## Introduction

Trust Wallet Core is a cross-platform library that implements low-level cryptographic wallet functionality for many blockchains. Most of the code is C++ with a set of strict exported C interfaces. The library provides idiomatic interfaces for all supported languages \(currently Swift for iOS and Java for Android\).

## Usage

If you want to use wallet core in your project follow these instructions:

- For building locally, or using Docker image, see the [Build Instructions](building.md).
- For trying out, e.g. testing key management and address derivation, see the [WalletConsole utility](walletconsole.md).
- If you want to include Wallet Core in your project, see the [Integration Guides](integration-guide.md).
  Start with the overview of the most common wallet operations ([Usage Guide](wallet-core-usage.md)),
  and see the platform-specifc guides for
  [iOS](ios-guide.md) and
  [Android](android-guide.md).
- We have a [FAQ](faq.md) list may already answer some of your questions.

## Projects using Wallet Core -- Add yours here too!

- [Trust Wallet](https://trustwallet.com)
- [coinpaprika](https://coinpaprika.com/)
- [IFWallet](https://www.ifwallet.com/)
- [Alice](https://www.alicedapp.com/)
- [Crypto.com](https://crypto.com)
- [Frontier](https://frontier.xyz/)
- [Belco](https://www.belcobtm.com/)
- [Pumapay](https://pumapay.io/)

## Contributing

The best way to submit feedback and report bugs is to [open a GitHub issue](https://github.com/trustwallet/wallet-core/issues/new).
If you want to contribute code please see [Contributing](contributing.md).
If you want to add support for a new blockchain also see [Adding Support for a New Blockchain](newblockchain.md).

Thanks to all the people who contribute.
<a href="graphs/contributors"><img src="https://opencollective.com/wallet-core/contributors.svg?width=890&button=false" /></a>

## License

Trust Wallet Core is available under the MIT license. See the [LICENSE](https://github.com/trustwallet/wallet-core/blob/master/LICENSE) file for more info.
