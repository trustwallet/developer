---
title: Adding Support for a New Blockchain
---

# Adding Support for a New Blockchain

If you haven't, first read the [guide to contributing](contributing). It contains important information about the library and how to contribute.

## Blockchains, Coins and Tokens

- If you are interested in adding a new Token, e.g. ERC20, in this case no code changes are needed, see the [Assets](../assets/new-asset) section for more details.
- If you are adding an EVM-compatible chain, that is much simpler, see [EVM Chain docs](newevmchain).
- For new coins you need to implement address handling and signing functionality in wallet-core (described in this section). For new coins on already supported blockchains, or variations of already supported blockchains, please consider proper reuse of existing implementation.

## Integration Criteria

The Trust Wallet development team is always striving to add more blockchains that will be essential for developers and wallet users. We choose blockchains carefully based on the impact they will have for our community.

Please keep in mind that Wallet Core is open source and used in many other projects besides Trust Wallet, so adding it to Wallet Core is a prerequisite but not a sufficient condition for adding it to Trust Wallet.

The general integration criteria is as follows:

- The blockchain has launched mainnet and has stably run for at least 3 ~ 6 months without major security incidents.
- The blockchain has extensive public documentation and tools available for developers to use.
- The native coin is listed in the top 100 coins on CoinMarketCap and proposal gets approved on [https://governance.trustwallet.com].
- The project needs to provide API/JSON-RPC access to the node with a load balancing setup for private use, see detail requirements [here](https://developer.trustwallet.com/wallet-core/rpc-requirements).
- The native coin is tradable on major exchanges.

After integrating into Trust Wallet projects are expected to provide timely support for any urgent matters.

## Overview

Adding support for a new coin consists of these steps:

- Add **coin definition** -- contains basic parameters of the new coin, several definition source files are generated from the definitions
- Extend a few **central files**. There are a few central source files that need to be extended (some definitions, dispatching logic to coin implementations).
- **Rust implementation** of **address** handling and **signing** functionality. Optionally protobuf definitions might be needed for more complex parameters.
- **Unit tests** for coin definitions, address and signing functionality
- **C interface** (basis for mobile integration)
- **Kotlin** and **Swift** bindings -- these are generated
- **Integration tests** for testing through C interface, and through JN and Swift interfaces.

It helps to pick an existing coin, and refer to its implementation. Try to pick an existing coin that is similar to the new one, and check how/where is it implemented, tested, etc.

Note that unit **tests** are crucial in ensuring quality needed for multi-coin support. Functionality here can be well unit-tested, so don't ignore them.
Coverage must not decrease! This is enforced automatically in the valiation of the pull requests.

## Blockchain definition

The first step to add a blockchain is to define its coin configuration. Add the definition to the `registry.json` file.
Consult a similar blockchain (or simply copy & modify).

The fields are documented here: https://github.com/trustwallet/wallet-core/blob/master/docs/registry-fields.md.

## Skeleton generation

Execute the command `cd codegen-v2 && cargo run -- new-blockchain <coinid>`, where `<coinid>` is the ID of the new coin from `registry.json`.
This will generate the following files, crates and structures:
- `src/proto/<CoinId>.proto` - Blockchain Protobuf interface.
- `rust/chains/tw_<coinid>` - Rust crate that will contain all necessary code related to the new blockchain.
- `rust/tw_any_coin/tests/chains/tw_<coinid>` - Rust integration tests.
- `src/<CoinId>/Entry.h` - Intermediate layer between an end-user app and the Rust codebase.
- `BlockchainType::<CoinId>` - Rust enum variant and its dispatching within the `rust/tw_coin_registry` crate.
- `TWBlockchain<CoinId>` and `TWCoinType<CoinId>` - C++ enum variants.
- `tests/chains/<CoinId>` - C++ integration tests.

Run `tools/generate-files` to generate message proto files.

Run `cmake` to include the new files in the build (`cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug`), and build the project.

## Definition tests, first commit

Review tests in `tests/chains/<CoinId>/TWCoinTypeTests.cpp` (where `X` is the name of the blockchain), exactly as in other blockchains.
Run `cd rust && cargo check --tests` and `make -Cbuild -j12 tests TrezorCryptoTests` to check if Rust and C++ compile successfully.

You should create a commit with this change, \(but don't create a pull request yet\).

_Note:_ don't forget to add new files to git.
_Note:_ don't forget to re-run `cmake` before building, to include new files in the build.

## Rust implementation

Implement the required functionality in Rust. The code should be placed in the `rust/chains/tw_<coinid>` folder.

Don't just dump an existing codebase in the repo. The code needs to follow the code style and use existing hashing and cryptographic functionality if possible.
Adding new dependencies is something we want to avoid as much as possible. We want to keep the codebase and the binary library as small as we can.

If you do need to add a new cryptographic function or other building block please do so as a separate PR from the blockchain implementation.

### Entry point for coin functionality

The Rust's `Entry` structure implements the [CoinEntry](https://github.com/trustwallet/wallet-core/blob/dev/rust/tw_coin_entry/src/coin_entry.rs) trait that is responsible for address management and the transaction signing.
It should be kept minimal, have no logic, just call into relevant Address, Signer, etc. classes.
Ensure that it fits well with the existing infrastructure and conventions.

_Note:_ Do not forget to implement trait methods and declare associated types similar to [tw_ethereum/entry.rs](https://github.com/trustwallet/wallet-core/blob/dev/rust/tw_ethereum/src/entry.rs).

### Address encoding/decoding

The first step is to support the address format specific to the blockchain. Start with the generated source files `rust/chains/X/src/address.rs` (where `X` is the blockchain name).

At minimum the address needs a string validation static method, a string constructor, a constructor from a public key, and a method to convert back to a string.
Make sure you can parse a string representation of an address and detect invalid addresses. Write unit tests for this. Also make sure that you can derive an address string from a private key. Write unit tests for this as well.

For an example of this have a look at Ethereum [address.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_evm/src/address.rs).

Make sure the dispatcher of address validation and derivation in `rust/chains/tw_<coinid>/src/entry.rs` is also extended.

### Transaction signing

The second step is supporting signing of transactions. Work on the `rust/chains/tw_<coinid>/src/signer.rs` source file.
Make sure you can generate a valid signature and a valid signed and encoded transaction. Write a unit tests for this.

For an example of this have a look at Aptos's [signer.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_aptos/src/signer.rs).

### Unit Tests

Unit tests are used to test public and non-public, usually, a single structure, method or function.
Rust allows to test non-public identities straightforward.
Unit tests can be placed in any Rust source file (under the `#[cfg(test)]` attribute) or in a test file under the `rust/chains/tw_<coinid>/tests` directory.
_Note:_ All Rust code needs to be unit tested.

For an example of this have a look at Ethereum's Unit tests: [tw_evm/tests/signer.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_evm/tests/signer.rs) and [tw_evm/src/address.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_evm/src/address.rs).

The Rust implementation with tests should be a separate commit.

### Rust Integration Tests

Integration tests are used to test if the blockchain implementation can be accessed through the `TWAnySigner`, `TWAnyAddress`, ... public interfaces.
They should be placed in the `rust/tw_any_coin/tests/chains/<coinid>` directory.

Usually you don't need to change the generated FFI interfaces, those interfaces are made as small as possible so that clients don't need to worry about implementation details.

For an example of this have a look at Cosmos's Integration tests: [cosmos_address.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_any_coin/tests/chains/cosmos/cosmos_address.rs), [cosmos_sign.rs](https://github.com/trustwallet/wallet-core/blob/master/rust/tw_any_coin/tests/chains/cosmos/cosmos_sign.rs).

## C++ routing

At this moment, every blockchain implemented in Rust must be routed through an intermediate C++ layer.
The `src/X/Entry.h` is generated the way, so it passes requests to sign transactions, generate or validate addresses to Rust through FFI. So it can be considered as a bridge between an end-user app and the Rust codebase.
_Note:_ FFI forwarding is derived from the `src/rust/RustCoinEntry` base class.
_Note:_ Currently, blockchains in Rust do not support JSON signing as it is deprecated and will be removed in the future. Instead, if the blockchain should support JSON signing, consider overriding `RustCoinEntry::signJSON` method as in Ethereum: [src/Ethereum/Entry.h](https://github.com/trustwallet/wallet-core/blob/master/src/Ethereum/Entry.cpp).

### C++ Integration Tests

Once you are satisfied with your Rust implementation, time to write some tests for C interface.
C++ integration tests can help us to ensure if the Rust functionality is routed correctly, and available to be used by end-user apps.

## Mobile Integration Tests

It is also required to test the interface on Android, iOS.
Run `./codegen/bin/newcoin-mobile-tests <coinid>` to generate mobile integration tests:
- `android/app/src/androidTest/java/com/trustwallet/core/app/blockchains/foobar/Test<CoinId>Address.kt` - Address integration tests.
- `android/app/src/androidTest/java/com/trustwallet/core/app/blockchains/foobar/Test<CoinId>Signer.kt` - Signing integration tests.
- `swift/Tests/Blockchains/<CoinId>Tests.swift` - Address, signing and compiling integration tests.

## Blockchain checklist

The above steps are summarized below as a checklist:

- [ ] Coin Definition:
  - [ ] Add the coin definition to `registry.json`.
  - [ ] Execute `pushd codegen-v2 && cargo run -- new-blockchain <coinid> && popd` to generate blockchain skeleton and configure integration tests.
  - [ ] Execute `tools/generate-files`.
  - [ ] Execute `pushd rust && cargo check --tests && popd` to check if Rust codebase compiles successfully.
  - [ ] Execute `make -Cbuild -j12 tests TrezorCryptoTests` to check if C++ codebase compiles successfully.
- [ ] Add relevant constants in `Curve`, `Hasher` etc., in C++ and Rust, as necessary.
- [ ] Implement functionality in Rust.
  - [ ] Entry at `rust/chains/tw_<coinid>/src/entry.rs`.
  - [ ] Address at `rust/chains/tw_<coinid>/src/address.rs`.
  - [ ] Transaction \(if necessary\) at `rust/chains/tw_<coinid>/src/transaction.rs`.
  - [ ] Signer at `rust/chains/tw_<coinid>/src/signer.rs`.
  - [ ] Compiler at `rust/chains/tw_<coinid>/src/compiler.rs`.
  - [ ] Write unit tests. Put them in the `rust/chains/tw_<coinid>/tests` directory.
  - [ ] Write Rust integration tests. Put them in a subfolder of `rust/tw_any_coin/tests/chains/<coinid>`
    - [ ] Transaction signing tests, at least one mainnet transaction test.
    - [ ] Add stake, unstake, get rewards tests if the blockchain is PoS like.
- [ ] Write C++ integration tests. Put them in a subfolder of `tests/chains/<CoinId>`.
- [ ] Validate generated code in Android an iOS projects. Write integration tests for each.
- [ ] Extend central derivation and validation tests: make sure the following tests are extended with the new coin: `CoinAddressDerivationTests.cpp` and
      `coin_address_derivation_test.rs`,
      `CoinAddressValidationTests.cpp`,
      `TWHRPTests.cpp`,
      `CoinAddressDerivationTests.kt`,
      `CoinAddressDerivationTests.swift`.

- [ ] Upload coin icon to [trustwallet/assets](https://github.com/trustwallet/assets/#how-to-add-asset) if necessary.

### Bitcoin forks checklist

If you're adding a Bitcoin fork, you might not neeed to implement new Address or Signer class, please complete this checklist before you submit a pull request:

- [ ] Derive address according to definition in `registry.json`, `p2pkh` address for `bip44` or native `bech32` segwit address for `bip84`.
- [ ] Check [SLIP-0132 :Registered HD version bytes](https://github.com/satoshilabs/slips/blob/master/slip-0132).
- [ ] Check fee preference, use static fee or not, Trust will use fee that can be confirmed with in 2 blocks.
- [ ] Add tests to validate all possible addresses, `p2pkh`, `p2sh` and `bech32`.
- [ ] Add tests to derive `xpub` / `xprv` and cross check the values with other wallets, like ledger or trezor.
- [ ] Add tests to derive address from `xpub` at random index.
- [ ] Add tests to cover lock scripts for all addresses.
- [ ] Add tests to make sure transaction detail url in block explorer is correct.
- [ ] Add a mainnet transaction test, you can construct it by using wallet core and validate it by broadcasting it.
