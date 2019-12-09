# Wallet Operations Guide

We present here an overview of the basic wallet operations.  More detailed, language-specific samples are provided in step-by-step [guides](wallet-core/integration-guide.md).

The covered basic operations are:

* Wallet management
  * Creating a new multi-coin wallet
  * Importing a multi-coin wallet
* Account address derivation (receiving)
  * Generating the default address for a specific coin
  * Generating an address using a custom derivation path
  * Generating an address step-by-step, through private key and public key 
* Transaction signing (sending)
  * Coin-specific transaction signing
  * Coin-independent method ('AnySigner')

For the examples we use *Bitcoin*, *Ethereum* and *Binance Coin* as sample coins/blockchains.

Note: Wallet Core does not cover communication with blockchain networks (nodes): 
address derivation is covered, but address balance retrieval not; 
transaction signing is convered, but broadcasting transactions to the network not.

## Wallet Management

### Multi-Coin Wallet

The Multi-Coin Wallet is a structure allowing accounts for many coins, all controlled by a single recovery phrase.  It is a standard HD Wallet (Hierarchically Derived), employing the standard derivation schemes, interoperable with many other wallets (BIP39, BIP44).

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
*passphrase* | Optional passphrase, used to encrypt the seed.  If specified, the wallet can be imported and opened only with the passphrase (Not to be confused with recovery phrase).

### Importing a New Multi-Coin Wallet

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

---------------------------
TODO: fill operations guide
