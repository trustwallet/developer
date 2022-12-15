# Adding an EVM Chain

Adding support for a new fully EVM-compatible chain to Wallet Core requires only a few changes, follow the steps here.
For more complex chain integrations, see [general new blockchain docs](newblockchain.md).

## Prerequisties / Needed information

- `ChainID`.  EVM chains have a unique ChainID, such as `8217`.
- `Derivation path` used.  Most EVM chains use Ethereum derivation path, `"m/44'/60'/0'/0/0"` (but not all).
- `CoinID`.  Most EVM chains do not have a SLIP 44 CoinID, but some do. We'll see below what to use if one is not available.

## Steps

- Start with an up-to-date workspace ([more info](contributing.md)).
- Add chain information to `registry.json`. Some notable fields:
  - blockchain: "Ethereum",
  - coinId: If own coinID is available, use that. Otherwise, use: `10000000 + chainID`, such as `10008217`.
- Run `codegen/bin/newevmchain <chain>` to generate template source files, where <chain> is the chain `id` from registry.
- The result will be a new line in `TWCoinType.h` and a new test file `tests/<Chain>/TWCoinTypeTests.cpp`.
- There are some test cases test derivation for all coins.  Extend these with the new chain.
If the new chain reuses Ethereum address, it can reuse the Ethereum case in the switch statements.

```
tests/CoinAddressDerivationTests.cpp
android/app/src/androidTest/java/com/trustwallet/core/app/blockchains/CoinAddressDerivationTests.kt
swift/Tests/CoinAddressDerivationTests.swift
```

- Update generated sources, build the project, execute unit tests (see [building](building.md)):

```
./tools/build-and-test
```

- If all is fine, create a PR with the changes.

## Some Sample PRs:
- [github.com/trustwallet/wallet-core/pull/2307](https://github.com/trustwallet/wallet-core/pull/2307)
- [github.com/trustwallet/wallet-core/pull/2157](https://github.com/trustwallet/wallet-core/pull/2157)
