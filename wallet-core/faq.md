# Frequently Asked Questions

## Does Wallet Core support WIF?

A: No, Here are some reasons: 

- WIF (Wallet Import Format) is just a private key encoded in Base58-check format, you can decode it using `Base58` class.
- It's cumbersome to support different prefix byte for all networks (mainly Bitcoin and forks)
- Hex string encoding is a more widely used format.

## How to create `HDWallet` from private key?

## How to query the balance / tokens of an address?

## How to send signed transaction?

## Does Wallet Core support Windows?

## Does Wallet Core support Dart / Flutter?

## Does Wallet Core support React Native?

## I can't install Wallet Core for my Android project!

A: Take a look at `Adding Library Dependency` section in [Android Integration Guide](android-guide.md), we have detailed instructions for installing the package.

## How to generate legacy Bitcoin address?

## Where do I find transaction signing examples?

## Bitcoin signing error :Invalid transaction. Error: bad-txns-inputs-missingorspent

## Does it support ERC20 / BEP20?

## Does it support Bitcoin / Ethereum testnet? 

## Different Polkadot address derived from same secret phrase.

## Is there any HTTP API to use Trust Wallet service?

A: Nope.
