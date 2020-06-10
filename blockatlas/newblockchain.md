# Block Atlas Developer Guide

## Overview

Block Atlas provides access to blockchain data.
It is used by Trust Wallet to query transaction information and stream new transactions.

A list of supported coins can be found in the config file.

## Integration

While we are happy about any new coin integrations we cannot immediately accept every request. To keep our high security and reliability standards, every integration must be approved by the Trust Wallet team first.

Pull requests other than coin integrations are always welcome. You can contact the Trust Wallet team through our [community site](http://community.trustwallet.com/).

To integrate an approved coin with Block Atlas, please follow this guide:

### Requirements

Before starting development on Block Atlas integration, make sure that _all_ of the following requirements are met:

 - Your coin is based on the accounts-model and transactions have a single input & output (excluding fees).
   Integrate UTXO-based coins with BlockBook instead.
 - You are _NOT_ integrating a _token_ that runs on top of another blockchain (ERC-20, TRX10, ...)
 - Your coin is either
	- supported by [_wallet-core_](https://github.com/trustwallet/wallet-core) 
 	- OR a ready-for-review PR for wallet-core has been submitted
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

Add your coin to the end of `/coin/coins.yml`.

- `id` - Coin ID.
- `symbol` - Coin symbol.
- `handle` - Coin handle, this is going to be your coin path, eg: `ethereum`:  `v1/ethereum/...`.
- `name` - The coin name.
- `decimals` - How many decimals your coin has.
- `blockTime` - Time between two blocks.
- `sampleAddress` - Arbitrary address holding coins.
   It is used to test the API.

Then, run `make gen-coins` to re-generate the coin file.

(Optional) Add your coin icon to the end at `/README.md`.

#### Config

The config specifies how to reach your blockchain.
All coins have a `<coin>.api` key pointing to the URL that provides your blockchain API.

Add your default config, like hosts and api keys, at `/config.yml`.

### API client

For each Blockchain implementation, we have one platform, some platforms can be useful for other blockchains, like BTC, LTC, BHC, DASH, DOGE. You can find these implementations inside the `platform` package.

Create a `platform/<coin>/client.go` file with a `Client` struct.
The only exported properties are "constructor"-like parameters.

For example, a client using JSON-RPC might look like this:

```
type Client struct {
	blockatlas.Request
}

func (c *Client) Init() {
	p.client = Client{blockatlas.InitClient(viper.GetString("ethereum.api"))}
}
```

Depending on your required feature set you'll need to expose these methods:

 - `client.GetTxsOfAddress(address string)`
 - `client.CurrentBlockNumber(num int64)` & `client.GetBlockByNumber()`

They will be used in other files later.

#### Coin-specific models

`/platform/<your_coin>/model.go` contains the data models returned by `client.go` above.

Take care when unmarshalling (Go's term for deserializing) currency amounts. We never do floating point operations on currencies but operate on base 10 string representations instead. Use any of these data types in your model. 

To make conversions from decimals numbers to satoshi/wei you can use the numbers package inside `pkg/numbers`.

The Blockatlas use `blockatlas.Amount` object to return value, this object is a type string. Internally, it carries an integer string of smallest units.


#### Normalizing chain data

The models above are not ready to be used yet and
need to be converted to the BlockAtlas generic model.

Define `Normalize*` functions in `api.go` that convert from `model.go` types to `blockatlas` transactions (lists).

##### Transaction metadata types

`Tx` can express different transaction types, for my details see the [Transaction Format guide](transaction-format.md)

### Base integration

#### `Platform` implementation

Every coin implements the `blockatlas.Platform` and some `blockatlas.*API` interfaces.

Create a `/platform/<coin>/base.go` file and implement the `blockatlas.Platform` methods, `Init() & Coin()` like this:

```
type Platform struct {
	client Client
}

func (p *Platform) Init() error {
	p.client = Client{blockatlas.InitClient(viper.GetString("ethereum.api"))}
	p.client.Headers["X-APIKEY"] = viper.GetString("ethereum.key")
}


func (p *Platform) Coin() coin.Coin {
	return coin.Coins[coin.ETH]
}
```

Then, link your platform at `/platform/registry.go`.

#### `TxAPI`

`TxAPI` can query transactions of an address. Needs to be implemented inside `/platform/<coin>/transaction.go`.

_Method signatures_:

 - `func (p *Platform) GetTxsByAddress(address string) (blockatlas.TxPage, error)`

After implementation, a `GET /v1/<coin>/<address>` route gets created.

#### `BlockAPI` 

`BlockAPI` can tell the chain height and get blocks by their number. Needs to be implemented inside `/platform/<coin>/block.go`.

_Method signatures_:

 - `func (p *Platform) CurrentBlockNumber() (int64, error)`
 - `func (p *Platform) GetBlockByNumber(num int64) (*blockatlas.Block, error)`

After implementation the observer API gets enabled (required for tx push notifications).

#### `TokenTxAPI` 
`TokenTxAPI` provides token transaction lookups. Needs to be implemented inside `/platform/<coin>/transaction.go`. 

_Method signatures_:

- `GetTokenTxsByAddress(address, token string) (TxPage, error)`

#### `TokenAPI` 
`TokenAPI` provides token lookups. Needs to be implemented inside `/platform/<coin>/token`.

_Method signatures_:

- `GetTokenListByAddress(address string) (TokenPage, error)`

#### `AddressAPI ` 
`AddressAPI ` provides an AddressAPI to fetch addresses for an account.  Needs to be implemented inside `/platform/<coin>/base.go`.

_Method signatures_:

- `	GetAddressesFromXpub(xpub string) ([]string, error)`

#### `CollectionAPI ` 
`AddressAPI ` provides custom HTTP routes.  Needs to be implemented inside `/platform/<coin>/collection.go`.

_Method signatures_:

- `GetCollections(owner string) (CollectionPage, error)`
- `GetCollectibles(owner, collectibleID string) (CollectiblePage, error)`

#### `NamingServiceAPI ` 
`NamingServiceAPI ` provides public name service domains HTTP routes. Needs to be implemented inside `/platform/<coin>/domain.go`.

_Method signatures_:

- `	Lookup(coins []uint64, name string) ([]Resolved, error)`

#### `CustomAPI ` 
`CustomAPI ` provides a custom public name service domains HTTP. Needs to be implemented inside `/platform/<coin>/custom.go`.

_Method signatures_:

- `	RegisterRoutes(router gin.IRouter)`


### Stake integration

#### `Platform` implementation

To provider stake implementation, create a `/platform/<coin>/stake.go` file and implement the stake API methods:

```
// StakingAPI provides staking information
type StakeAPI interface {
	Platform
	UndelegatedBalance(address string) (string, error)
	GetDetails() StakingDetails
	GetValidators() (ValidatorPage, error)
	GetDelegations(address string) (DelegationsPage, error)
}
```

#### `StakeAPI`

`StakeAPI` can provider informations about delegation, validators, stake balance and staking detail, like annual reward and the minimum amount:

 - `func (p *Platform) UndelegatedBalance(address string) (string, error)`
 - `func (p *Platform) GetDetails() StakingDetails`
 - `func (p *Platform) GetValidators() (ValidatorPage, error)`
 - `func (p *Platform) GetDelegations(address string) (DelegationsPage, error)`


### Submitting the code

#### Unit Test

Write a test at `/platform/<your_coin>/<api>_test.go` to ensure correct normalization.
Try reading and normalizing a sample API response (copy paste output of REST client).


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
