# Adding Support for a New Blockchain

If you haven't, first read the [guide to contributing](contributing.md). It contains important information about the library and how to contribute.

## Requirements

The Trust Wallet development team is always striving to add more blockchains that will be essential for developers and wallet users. We choose blockchains carefully that will have the biggest impact for our community.

In general: 

- The blockchain has launched mainnet and stably run at least 3 ~ 6 months without any major security incidents.
- The blockchain has extensive public documentation and tools available for developers to use.
- The native coin is listed in the top 100 coins on CoinMarketCap.
- The project needs to provide API/JSON-RPC access to the node with a load balancing setup for private use, see detail requirements [here](rpc-requirements.md).
- The native coin is tradable on major exchanges.

## Blockchain definitions

The first step to adding a blockchain is to define its configuration parameters. Add the definition to the `coins.json` file. Then run `tools/generate-files` to generate the C++ code from that. Add the corresponding definition to `TWCoinType.h`. After doing this add tests to `TWCoinTypeConfigTests.cpp` and `CoinTests.cpp`. Run the tests and make sure everything is passing before moving on to the next step. Create a commit with this change \(don't create a pull request yet\).

## C++ Implementation

Implement the required functionality in C++. The code should be put in the `src/X` folder where `X` is the name of the Blockchain.

Don't just dump an existing codebase in the repo. The code needs to follow the code style and use existing hashing and cryptographic functionality if possible. Adding new dependencies is something we want to avoid at all costs. We want to keep the codebase and the binary library as small as possible.

If you do need to add a new cryptographic function or other building block please do so as a separate PR from the blockchain implementation.

### Address encoding/decoding

The first step is to support the address format specific to the blockchain. Create `src/Blockchain/Address.h` and `src/Blockchain/Address.cpp` where `Blockchain` is the blockchain name. Put this in the header file:

```text
// Copyright © 2017-2019 Trust.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

#pragma once

namespace TW::Blockchain {

class Address {
    /// Determines whether a string makes a valid address.
    static bool isValid(const std::string& string);

    /// Initializes an address from a string representation.
    Address(const std::string& string);

    /// Initializes an address from a public key.
    Address(const PublicKey& publicKey);

    /// Returns a string representation of the address.
    std::string string() const;
};

} // namespace TW::Blockchain
```

Replace `Blockchain` with the actual blockchain name.

At minimum the address needs a string validation static method, a string constructor, a constructor from a public key, and a method to convert back to a string. Make sure you can parse a string representation of an address and detect invalid addresses. Write unit tests for this. Also make sure that you can derive an address string from a private key. Write unit tests for this as well.

For an example of this have a look at Cosmos [Address.h](https://github.com/trustwallet/wallet-core/blob/master/src/Cosmos/Address.h) and [Address.cpp](https://github.com/trustwallet/wallet-core/blob/master/src/Cosmos/Address.cpp).

Implement address validation and derivation in `src/Coin.cpp`.

### Transaction signing

The second step is supporting signing of transactions. Create `src/Blockchain/Signer.h` and `src/Blockchain/Signer.cpp` where `Blockchain` is the blockchain name. Make sure you can generate a valid signature and a valid signed and encoded transaction. Write a unit tests for this.

For an example of this have a look at Binance's [Signer.h](https://github.com/trustwallet/wallet-core/blob/master/src/Binance/Signer.h) and [Signer.cpp](https://github.com/trustwallet/wallet-core/blob/master/src/Binance/Signer.cpp).

### Tests

The tests should be put in `tests/X` where `X` is the name of the blockchain. All C++ code needs to be unit tested. This will be enforced automatically when the pull request is created. If you code coverage goes down your pull request will be rejected.

The C++ implementation with tests should be the second commit.

## C Interface

Once you are satisfied with your C++ implementation write a C interface for it. The C interface needs to be as small as possible so that clients don't need to worry about implementation details. If you are implementing blockchain `X` create a `TWXAddress.h` to handle addresses associated to the blockchain and `TWXSigner.h` to handle transaction signing.

Please make sure you catch all C++ exceptions in C implementation.

Generate the idiomatic interface code by running `tools/generate-files`. If possible test the interface on Android, iOS and TypeScript. Optionally add integration test to each platform. This is required only if the interface is significantly different than the interface used for other blockchains.

The C interface, any Protobuf models, and integration tests should be third commit.

## Blockchain checklist

The above steps are summarized below as a checklist:

* [ ] Add the coin definition to `coins.json` and `TWCoinType`.
* [ ] Implement functionality in C++. Put it in a subfolder of `src/`.
  * [ ] Address \(if necessary\).
  * [ ] Transaction \(if necessary\).
  * [ ] Signer.
* [ ] Write unit tests. Put them in a subfolder of `tests/`.
  * [ ] `Mnemonic phrase - > Address` derivation test. Put this test in the `CoinTests.cpp` file.
  * [ ] Transaction signing tests, at least a mainnet transaction test.
  * [ ] Add stake, unstake, get rewards tests if the blockchain is PoS like.
* [ ] Add relevant constants in `TWEthereumChainID`, `TWCurve`, etc., as necessary.
* [ ] Implement address validation and derivation.
  * [ ] Implement validation and derivation in `src/Coin.cpp`.
  * [ ] Add tests for validation in `tests/CoinAddressValidationTests.cpp` and derivation in `tests/CoinAddressDerivationTests.cpp`.
* [ ] Write interface header in `include/TrustWalletCore` and implement the interface in `src/interface`.
  * [ ] Address interface \(if necessary\).
  * [ ] Signing interface.
* [ ] Validate generated code in Android an iOS projects. Write integration tests for each.
* [ ] Upload coin icon to [trustwallet/assets](https://github.com/trustwallet/assets/#how-to-add-asset) if necessary.

### Bitcoin forks checklist

If you're adding a Bitcoin fork, you might not neeed to implement new Address or Signer class, please complete this checklist before you submit a pull request:

- [ ] Derive address according to definition in `coins.json`, `p2pkh` address for `bip44` or native `bech32` segwit address for `bip84`.
- [ ] Check [SLIP-0132 :Registered HD version bytes](https://github.com/satoshilabs/slips/blob/master/slip-0132.md).
- [ ] Check fee preference, use static fee or not, Trust will use fee that can be confirmed with in 2 blocks.
- [ ] Add tests to validate all possible addresses, `p2pkh`, `p2sh` and `bech32`.
- [ ] Add tests to derive `xpub` / `xprv` and cross check the values with other wallets, like ledger or trezor.
- [ ] Add tests to derive address from `xpub` at random index.
- [ ] Add tests to cover lock scripts for all addresses.
- [ ] Add tests to make sure transaction detail url in block explorer is correct.
- [ ] Add a mainnet transaction test, you can construct it by using wallet core and validate it by broadcasting it.
