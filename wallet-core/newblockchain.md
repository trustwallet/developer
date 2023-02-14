# Adding Support for a New Blockchain

If you haven't, first read the [guide to contributing](contributing.md). It contains important information about the library and how to contribute.

## Blockchains, Coins and Tokens

- If you are interested in adding a new Token, e.g. ERC20, in this case no code changes are needed, see the [Assets](../assets/new-asset.md) section for more details.
- If you are adding an EVM-compatible chain, that is much simpler, see [EVM Chain docs](newevmchain.md).
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
- **C++ implementation** of **address** handling and **signing** functionality. Optionally protobuf definitions might be needed for more complex parameters.
- **Unit tests** for coin definitions, and address and signing functionality
- **C interface** (basis for mobile integration)
- **Java/JNI** and **Swift** bindings -- these are generated
- **Integration tests** for testing through C interface, and through JN and Swift interfaces.

It helps to pick an existing coin, and refer to its implementation. Try to pick an existing coin that is similar to the new one, and check how/where is it implemented, tested, etc.

Note that unit **tests** are crucial in ensuring quality needed for multi-coin support. Functionality here can be well unit-tested, so don't ignore them.
Coverage must not decrease! This is enforced automatically in the valiation of the pull requests.

## Blockchain definition

The first step to add a blockchain is to define its coin configuration. Add the definition to the `registry.json` file.
Consult a similar blockchain (or simply copy & modify).

The fields are documented here: https://github.com/trustwallet/wallet-core/blob/master/docs/registry-fields.md.

## Skeleton generation

Execute the command `codegen/bin/newcoin <coinid>`, where `newcoin <coinid>` is the ID of the new coin from `registry.json`. This will generate skeleton `Address`, `Signer`, `Entry` classes, proto file, C interface for Signer and corresponding tests.

Run `tools/generate-files` to generate message proto files.

Run `cmake` to include the new files in the build (`cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug`), and build the project.

## Definition tests, first commit

Review tests in `tests/X/TWCoinTypeTests.cpp` (where `X` is the name of the blockchain), exactly as in other blockchains.
Run the tests and make sure everything is passing before moving on to the next step.
You should reate a commit with this change, \(but don't create a pull request yet\).

_Note:_ don't forget to add new files to git.
_Note:_ don't forget to re-run `cmake` before building, to include new files in the build.

## C++ Implementation

Implement the required functionality in C++. The code should be placed in the `src/X` folder where `X` is the name of the blockchain.

Don't just dump an existing codebase in the repo. The code needs to follow the code style and use existing hashing and cryptographic functionality if possible.
Adding new dependencies is something we want to avoid at all costs. We want to keep the codebase and the binary library as small as possible.

If you do need to add a new cryptographic function or other building block please do so as a separate PR from the blockchain implementation.

### Entry point for coin functionality

The `Entry` class should be kept minimal, it should have no logic, just call into relevant Address, Signer, etc. classes.

Include the new coin Entry class in the list of coin dispatchers, in `src/Coin.cpp` (an include, a new instance in the list of dispatcher instances).

### Address encoding/decoding

The first step is to support the address format specific to the blockchain. Start with the generated source files `src/X/Address.h` and `src/X/Address.cpp` (where `X` is the blockchain name).

At minimum the address needs a string validation static method, a string constructor, a constructor from a public key, and a method to convert back to a string. Make sure you can parse a string representation of an address and detect invalid addresses. Write unit tests for this. Also make sure that you can derive an address string from a private key. Write unit tests for this as well.

For an example of this have a look at Cosmos [Address.h](https://github.com/trustwallet/wallet-core/blob/master/src/Cosmos/Address.h) and [Address.cpp](https://github.com/trustwallet/wallet-core/blob/master/src/Cosmos/Address.cpp).

Make sure the dispatcher of address validation and derivation in `src/Coin.cpp` is also extended.

### Transaction signing

The second step is supporting signing of transactions. Work on the `src/X/Signer.h` and `src/X/Signer.cpp` source files.
Make sure you can generate a valid signature and a valid signed and encoded transaction. Write a unit tests for this.

For an example of this have a look at Binance's [Signer.h](https://github.com/trustwallet/wallet-core/blob/master/src/Binance/Signer.h) and [Signer.cpp](https://github.com/trustwallet/wallet-core/blob/master/src/Binance/Signer.cpp).

### Tests

The tests should be put in `tests/X` where `X` is the name of the blockchain. All C++ code needs to be unit tested.

The C++ implementation with tests should be a separate commit.

## C Interface

Once you are satisfied with your C++ implementation, time to write some tests for C interface, usually you don't need to change the generated C interfaces, those C interfaces are made as small as possible so that clients don't need to worry about implementation details. If you are implementing blockchain `Xxx`, handle and implement it first in `TWAnyAddress.h` and `TWAnySigner.h` before writing tests.

Please make sure you catch all C++ exceptions in C implementation.

If possible test the interface on Android, iOS. Optionally add integration test to each platform. This is required only if the interface is significantly different than the interface used for other blockchains.

The C interface, any Protobuf models, and integration tests should be a separate commit.

## Blockchain checklist

The above steps are summarized below as a checklist:

- [ ] Coin Definition:
  - [ ] Add the coin definition to `registry.json`.
  - [ ] Execute `codegen/bin/newcoin <coinid>`.
  - [ ] Execute `tools/generate-files`.
  - [ ] Add coin dispatcher to `src/Coin.cpp`.
  - [ ] Create tests in `tests/Xxx/TWCoinTypeTests.cpp`.
- [ ] Implement functionality in C++. Put it in a subfolder of `src/`.
  - [ ] Entry.
  - [ ] Address.
  - [ ] Transaction \(if necessary\).
  - [ ] Signer.
- [ ] Write unit tests. Put them in a subfolder of `tests/`.
  - [ ] `Mnemonic phrase - > Address` derivation test. Put this test in the `CoinTests.cpp` file.
  - [ ] Transaction signing tests, at least one mainnet transaction test.
  - [ ] Add stake, unstake, get rewards tests if the blockchain is PoS like.
- [ ] Add relevant constants in `TWEthereumChainID`, `TWCurve`, etc., as necessary.
- [ ] Implement C interface in `src/interface`.
  - [ ] Add tests for `TWAnyAddress` and `TWAnySigner`
- [ ] Validate generated code in Android an iOS projects. Write integration tests for each.
- [ ] Extend central derivation and validation tests: make sure the following tests are extended with the new coin: `CoinAddressDerivationTests.cpp` and
      `CoinAddressValidationTests.cpp`,
      `TWHRPTests.cpp`,
      `CoinAddressDerivationTests.kt`,
      `CoinAddressDerivationTests.swift`.

- [ ] Upload coin icon to [trustwallet/assets](https://github.com/trustwallet/assets/#how-to-add-asset) if necessary.

### Bitcoin forks checklist

If you're adding a Bitcoin fork, you might not neeed to implement new Address or Signer class, please complete this checklist before you submit a pull request:

- [ ] Derive address according to definition in `registry.json`, `p2pkh` address for `bip44` or native `bech32` segwit address for `bip84`.
- [ ] Check [SLIP-0132 :Registered HD version bytes](https://github.com/satoshilabs/slips/blob/master/slip-0132.md).
- [ ] Check fee preference, use static fee or not, Trust will use fee that can be confirmed with in 2 blocks.
- [ ] Add tests to validate all possible addresses, `p2pkh`, `p2sh` and `bech32`.
- [ ] Add tests to derive `xpub` / `xprv` and cross check the values with other wallets, like ledger or trezor.
- [ ] Add tests to derive address from `xpub` at random index.
- [ ] Add tests to cover lock scripts for all addresses.
- [ ] Add tests to make sure transaction detail url in block explorer is correct.
- [ ] Add a mainnet transaction test, you can construct it by using wallet core and validate it by broadcasting it.
