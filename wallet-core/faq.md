# Frequently Asked Questions

## General

### Does Wallet Core support Windows?

A: We don't support Windows officially, the community has a fork for Windows, you can find it [here](https://github.com/kaetemi/wallet-core-windows).

### Does Wallet Core support Dart / Flutter?

A: We don't support it officially, the community has a fork for Dart / Flutter, you can find it [here](https://github.com/weishirongzhen/flutter_trust_wallet_core)

### Does Wallet Core support React Native?

A: Not now, but you can try to wrap it using [Native Module](https://reactnative.dev/docs/native-modules-intro) or [JavaScript Interfaces (JSI)](https://reactnative.dev/architecture/glossary#javascript-interfaces-jsi), one example is [here](https://github.com/Liamandrew/react-native-wallet-core).

### I can't install Wallet Core for my Android project!

A: Take a look at `Adding Library Dependency` section in [Android Integration Guide](android-guide.md), we have detailed instructions for installing the package.

### Is there any HTTP API to use Trust Wallet service?

A: Nope.

## API

### Does Wallet Core support WIF?

A: No, Here are some reasons:

- WIF (Wallet Import Format) is just a private key encoded in Base58-check format, you can decode it using `Base58` class.
- It's cumbersome to support different prefix byte for all networks (mainly Bitcoin and forks)
- Hex string encoding is a more widely used format.

### Does Wallet Core have a method to verify an address format?

A: Yes, There is a generic `AnyAddress` class to represent an address for any blockchain you can use `AnyAddress.isValid()` to validate if an address is valid.

### How to create `HDWallet` from private key?

A: `HDWallet` class is short for `Hierarchical Deterministic Wallet`, which is a way to deterministically generate a tree of keys from a single seed (aka bip39 recovery phrase). If you only have a private key, you can use `PrivateKey` class directly, no way to create `HDWallet`.

You can read [bip32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki), [bip39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki), [bip44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) for more information.

### Where do I find transaction signing examples?

A: You can find some on [Usage Guide](wallet-core-usage.md), the comprehensive and up-to-date examples are in tests folder:

- C++ tests: <https://github.com/trustwallet/wallet-core/tree/master/tests>
- Swift tests: <https://github.com/trustwallet/wallet-core/tree/master/swift/Tests>
- Kotlin tests: <https://github.com/trustwallet/wallet-core/tree/master/android/app/src/androidTest/java/com/trustwallet/core/app>
- TypeScript tests: <https://github.com/trustwallet/wallet-core/tree/master/wasm/tests>

## Blockchain

### How to query the balance / tokens of an address?

A: Wallet Core doesn't provide this feature yet, it also differs from chain to chain, you should check out the blockchain's official RPC or API to see how to query the balance.

For instance, you can use [`eth_getbalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance) and [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call) to query the balance (and token balance) of an Ethereum or EVM compatible address.

### How to send signed transaction?

A: Wallet Core doesn't provide this feature yet, it also differs from chain to chain, you should check out the blockchain's official RPC or API to see how to send a signed transaction.

For instance, you can use [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction) to send a signed raw transaction to Ethereum or EVM compatible chain.

### Bitcoin signing error :Invalid transaction. Error: bad-txns-inputs-missingorspent

A: Usually this error means the node can't find the unspent transaction (UTXO) you are trying to spend, you can check if the transaction hash is correct, Bitcoin implementation in Wallet Core expects the transaction id is network byte order (big endian), you can try to reverse the bytes of the transaction hash.

### Does it support Bitcoin / Ethereum testnet?

A: Wallet Core doesn't support any testnet in general:

- no testnet network entry in `registry.json`
- no method to generate testnet address for Bitcoin etc.
- extra maintenance effort and we always require mainnet transaction signing test.

But for some networks like Ethereum, the testnet just has a different chain id, you can specify chain id when you signing a transaction.

### How to generate legacy Bitcoin address?

A: `AnyAddress` generates SegWit address by default for Bitcoin, Wallet Core offers another class `BitcoinAddress` for legacy address, you can see all the methods [here](https://github.com/trustwallet/wallet-core/blob/master/include/TrustWalletCore/TWBitcoinAddress.h).

### Does it support ERC20 / BEP20?

A: Yes

### Different Polkadot address derived from same secret phrase.

A: Polkadot supports multiple elliptic curve and signature schemes:

- The vanilla `ed25519` implementation using Schnorr signatures.
- The Schnorrkel/Ristretto `sr25519` variant using Schnorr signatures.
- ECDSA signatures on `secp256k1`

It's might be incompatible with other wallets because Wallet Core currently only supports `ed25519`.

For more information, please refer to [Polkadot Wiki](https://wiki.polkadot.network/docs/learn-keys#account-keys).
