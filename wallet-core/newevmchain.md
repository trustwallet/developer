# Adding an EVM Chain

Adding support for a new fully EVM-compatible chain to Wallet Core requires only a few changes, follow the steps here.
For more complex chain integrations, see [newblockchain.md].

## Prerequisties / Needed information

- ETH `ChainID`.  EVM chains have a unique ChainID, such as `8217`.
- `Derivation path` used.  Most EVM chains use Ethereum derivation path, `"m/44'/60'/0'/0/0"` (but not all).
- `CoinID`.  Most EVM chains do not have a SLIP 44 CoinID, but some do.

## Steps

- Start with an up-to-date workspace (more info: [contributing.md]).
- Add chain information to `registry.json`. Some notable fields:
-- blockchain: "Ethereum",
-- coinId: Should be set to: `10000000 + chainID`, such as `10008217`. If coinID is available, use that.
- Run `codegen/bin/newcoin <chain>` to generate template source files.  
- For EVM chains we will only need the `tests/<Chain>/TWCoinTypeTests.cpp` test file, discard all the other new files.
- Discard changes in `include/TrustWalletCore/TWBlockchain.h` and `src/Coin.cpp`, no need for new blockchain type.
- Check the test file `tests/X/TWCoinTypeTests.cpp` (`X` is the name of the blockchain).
- There are some test cases test derivation for all coins.  Extend these with the new chain.
If the new chain reuses Eth address, it can reuse the Eth case in the switch statements.
```
tests/CoinAddressDerivationTests.cpp
android/app/src/androidTest/java/com/trustwallet/core/app/blockchains/CoinAddressDerivationTests.kt
swift/Tests/CoinAddressDerivationTests.swift
```
- Run `tools/generate-files` to update generated sources.
- Build the project, execute unit tests (see [building.md]).
```
make -Cbuild -j12 tests
./build/tests/tests tests
```
- If all is fine, create a PR with the changes.

## Some Examples:
- https://github.com/trustwallet/wallet-core/pull/2307
- https://github.com/trustwallet/wallet-core/pull/2157
