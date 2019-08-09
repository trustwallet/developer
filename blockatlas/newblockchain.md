# Block Atlas Developer Guide

## Overview

Block Atlas provides access to blockchain data.
It is used by Trust Wallet to query transaction information and stream new transactions.

A list of supported coins can be found in the config file.

## Integration

While we are happy about any new coin integrations we cannot immediately accept every request. To keep our high security and reliability standards, every integration must be approved by the Trust Wallet team first.

Pull requests other than coin integrations are always welcome. You can contact the Trust Wallet team over [TODO].

To integrate an approved coin with Block Atlas, please follow this guide.

### Requirements

Before starting development on Block Atlas integration, make sure that _all_ of the following requirements are met:

 - Your coin is based on the accounts-model and transactions have a single input & output (excluding fees).
   Integrate UTXO-based coins with BlockBook instead.
 - You are _NOT_ integrating a _token_ that runs on top of another blockchain (ERC-20, TRX10, ...)
 - Your coin is either
    1) supported by [_wallet-core_](https://github.com/trustwallet/wallet-core) OR
    2) a ready-for-review PR for wallet-core has been submitted
 - Your coin has a public JSON-RPC or HTTP API.
 - Said API supports querying a list of transactions by address
 - Your coin is registered with [SLIP-0044](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
 - Your coin is not already supported

### Structure

This project is powered by Go, Gin Gonic and Viper.

Try to use existing code of other coins as an example.

Avoid adding additional dependencies for security and performance reasons.
`go.mod` contains a list of available third-party packages.
If you think adding a dependency is necessary, please provide an explanation in the respective pull request.
A library specific to your chain is not a necessary dependency.

### Setup

#### Metadata

Add your coin to the end of `/coins.yml`.
 - Field `trust` is the Trust Wallet coin handle
 - Field `sample` is an arbitrary address holding coins.
   It is used to test the API.

Then, run `go generate` inside the `/coin` directory.

(Optional) Add your coin icon to the end at `/README.md`.

#### Config

The config specifies how to reach your blockchain.
All coins have a `<coin>.api` key pointing to the URL that provides your blockchain API.

Add your default config at `/cmd/config.go` and `/config.yml`.

### API client

Create a `platform/<coin>/client.go` file with a `Client` struct.
The only exported properties are "constructor"-like parameters.

For example, a client using JSON-RPC might look like this:

```
type Client struct {
	BaseURL   string
	rpcClient jsonrpc.RPCClient
}

func (c *Client) Init() {
	c.rpcClient = jsonrpc.NewClient(c.BaseURL)
}
```

Depending on your required feature set you'll need to expose these methods:
 - `Client.GetTxsOfAddress()`
 - `Client.CurrentBlockNumber()` & `Client.GetBlockByNumber()`

They will be used in `api.go` later.

#### Coin-specific models

`/platform/<yourcoin>/model.go` contains the data models returned by `client.go` above.

Take care when unmarshalling (Go's term for deserializing) currency amounts. We never do floating point operations on currencies but operate on base 10 string representations instead. Use any of these data types in your model:
 - `json.Number`: Decimal with an _unknown_ number of digits right to the decimal separator.
 - `models.Amount`: Integer of smallest units (e.g. Satoshi, Wei)
 - `models.Amount`: Decimal that gets converted to the amount in smallest units by removing the decimal separator and truncating leading zeros. The number of digits right to the decimal separator must be static. (`012.300` (coins) => `12300` (smallest unit), `0.001` => `1`)
 - `string`: Custom non-decimal format.

Side notes:
 - `models.Amount` internally carries an integer string of smallest units.
 - `json.Number` and `models.Amount` do not care if your decimal is wrapped in a string or not. (`12.23` vs `"12.23"`)

#### Normalizing chain data

The models above are not ready to be used yet and
need to be converted to the BlockAtlas generic model.

Define `Normalize*` functions in `api.go` that convert from `model.go` types to `blockatlas` transactions (lists).

##### Transaction metadata types

`Tx` can express different transaction types:

 - __Transfer__: A transfer of the currency native to the chain.
   e.g. BTC on Bitcoin, ETH on Ethereum
 - __NativeTokenTransfer__: A transfer of a token defined in a native contract.
   e.g. TRC10 tokens on Tron
 - __TokenTransfer__: A transfer of a token expressed by a smart contract.
   e.g. ERC-20 tokens on Ethereum
 - __ContractCall__: A smart contract call with unspecified effects.

### Base integration

#### `Platform` implementation

Every coin implements the `blockatlas.Platform` and some `blockatlas.*API` interfaces.

Create a `/platform/<coin>/api.go` file and implement `Init() & Coin()` like this:

```
type Platform struct {
	client Client
}

func (p *Platform) Init() error {
	p.client.BaseURL = viper.GetString("nimiq.api")
	p.client.Init()
	return nil
}

func (p *Platform) Coin() coin.Coin {
	return coin.Coins[coin.NIM]
}
```

Then, link your platform at `/platform/registry.go`.

#### `TxAPI`

`TxAPI` can query transactions of an address.
Method signature:

 - `func (p *Platform) GetTxsByAddress(address string) (blockatlas.TxPage, error)`

After implementation, a `GET /v1/<coin>/<address>` route gets created.

#### `BlockAPI` 

`BlockAPI` can tell the chain height and get blocks by their number.
Method signatures:

 - `func (p *Platform) CurrentBlockNumber() (int64, error)`
 - `func (p *Platform) GetBlockByNumber(num int64) (*blockatlas.Block, error)`

After implementation the observer API gets enabled (required for tx push notifications).

### Submitting the code

#### Unit Test

Write a test at `/platform/<yourcoin>/api_test.go` to ensure correct normalization.
Try reading and normalizing a sample API response (copy paste output of REST client).

Where there's a need to access the `coin.Coins` map in tests context, the map has to be initialized 
by loading coins and their configuration from the yml file. 
That's to make sure the map won't be empty when running tests.

```go
func initCoins() {
	coin.Load("../../coins.yml")
}
```

### Pull Request

As soon as you are done, file a pull request from your fork to `trustwallet:master`.
Our devs will get a notification and review your code soon.
In case of design problems or bugs, we will request changes via GitHub code review.

You can speed up integration and merge approval by making sure that:

 - the Git history is relatively clean (`git rebase -i` to squash your commits)
 - only one pull request is filed (`git push -f` to overwrite the commit history of your PR).
   Please don't close and open PRs too often, our mail inboxes will be thankful.
 - no merge conflicts with `trustwallet:master` exist
 - all tests pass, your build gets a green tick
 - `go lint` has no complaints about your code

After your code is merged, our Continous Delivery will deploy it to our servers and your part is done.

Thanks for contributing to Trust Wallet!
