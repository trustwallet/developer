# Frequently Asked Questions

## General

### Does Wallet Core support Windows?

We don't support Windows officially, the community has a fork for Windows, you can find it [here](https://github.com/kaetemi/wallet-core-windows).

### Does Wallet Core support Dart / Flutter?

We don't support it officially, the community has a fork for Dart / Flutter, you can find it [here](https://github.com/weishirongzhen/flutter_trust_wallet_core)

### Does Wallet Core support React Native?

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

### How to create `HDWallet` from private key?

### Where do I find transaction signing examples?

## Blockchain

### How to query the balance / tokens of an address?

### How to send signed transaction? 

### Bitcoin signing error :Invalid transaction. Error: bad-txns-inputs-missingorspent

### Does it support Bitcoin / Ethereum testnet? 

Wallet Core doesn't support any testnet in general:

- no testnet network entry in `registry.json`
- no method to generate testnet address for Bitcoin etc.
- extra maintenance effort and we always require mainnet transaction signing test.

But for some networks like Ethereum, the testnet just has a different chain id, you can specify chain id when you signing a transaction.

### How to generate legacy Bitcoin address?

### Does it support ERC20 / BEP20?

### Different Polkadot address derived from same secret phrase.
