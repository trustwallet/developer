# Block Atlas Developer Guide

## Overview

Block Atlas provides access to blockchain data.
It is used by Trust Wallet to query transaction information.

A list of supported coins can be found [here](TODO://readme.md).

## Integration

While we are happy about any new coin integrations we cannot immediately accept every request. To keep our high security and reliability standards, every integration must be approved by the Trust Wallet team first.

Pull requests other than coin integrations are always welcome. You can contact the Trust Wallet team over [TODO].

To integrate an approved coin with Block Atlas, please follow this guide.

### Requirements

Before starting development on Block Atlas integration, make sure that _all_ of the following requirements are met:

 - Your coin is based on the accounts-model and transactions have a single input & output (excluding fees). Integrate UTXO-based coins with BlockBook instead.
 - You are _NOT_ integrating a _token_ that runs on top of another blockchain (ERC-20, TRX10, ...)
 - Your coin is either
    1) supported by [_wallet-core_](https://github.com/TrustWallet/wallet-core) OR
    2) a ready-for-review PR for wallet-core has been submitted
 - Your coin has a public JSON-RPC or HTTP API.
 - Said API supports querying a list of transactions by address.
 - Your coin is registered with SLIP-0044 (TODO Link)
 - Your coin is not supported by Block Atlas yet ;) Check [TODO] if uncertain.

### Development

#### Structure

This project is powered by Go, Gin Gonic and Viper.

Try to use existing code of other coins as an example.

Avoid adding additional dependencies for security and performance reasons. `go.mod` contains a list of available third-party packages.

#### Metadata

Add your coin to the these files.
Place it at the end unless noted otherwise.

 - `/config.yml`: Default config
 - `/config.go`: Default config (hardcoded)
 - `/README.md`: Icon 
 - `/coin/coins.json`: SLIP-0044 metadata _(Ordered by Index)_
 - `/coin/slip44.go`: _Auto-generated from coins.json_
 - `/loaders.go`: Registration of Gin route

#### Coin-specific models

`/platform/<yourcoin>/model.go` contains coin-specific data models. No logic in here!

Take care when unmarshalling (Go's term for deserializing) currency amounts. We never do floating point operations on currencies but operate on base 10 string representations instead. Use any of these data types in your model:
 - `json.Number`: Decimal with an _unknown_ number of digits right to the decimal separator.
 - `models.Amount`: Integer of smallest units (e.g. Satoshi, Wei)
 - `models.Amount`: Decimal that gets converted to the amount in smallest units by removing the decimal separator and truncating leading zeros. The number of digits right to the decimal separator must be static. (`012.300` (coins) => `12300` (smallest unit), `0.001` => `1`)
 - `string`: Custom non-decimal format.

Side notes:
 - `models.Amount` carries an integer string of smallest units.
 - `json.Number` and `models.Amount` do not care if your decimal is wrapped in a string or not. (`12.23` vs `"12.23"`)

#### Getting chain data

`/platform/<yourcoin>/client.go` defines a `Client` with a `GetTxsOfAddress` method. It returns a slice of transactions in the native coin model

#### Normalizing chain data

`/platform/<yourcoin>/api.go` contains a `Normalize` function where coin-specific data gets normalized to the universal Block Atlas model found in `/models/api.go`.

 - Normalize currency amounts to `models.Amount` if needed
   - Use `util.DecimalExp` to compute `x * 10 ^ n`
 
TODO

#### Config & Route

TODO

#### Unit Test

`/platform/<yourcoin>/api_test.go` contains tests to ensure correct normalization.
Define a sample API response ... TODO

### Submitting your code

As soon as you are done, file a pull request from your fork to `TrustWallet:master`.
Our devs will get a notification and review your code soon.
In case of design problems or bugs, we will request changes via GitHub code review.

You can speed up integration and merge approval by making sure that:

 - the Git history is relatively clean (`git rebase -i` to squash your commits)
 - only one pull request is filed (`git push -f` to overwrite the commit history of your PR)
 - no merge conflicts with `TrustWallet:master` exist
 - all unit tests pass
 - the integration test passes
 - `go lint` has no complaints about your code

After having your code merged, our Continous Delivery will deploy it in a matter of seconds and you are done.
