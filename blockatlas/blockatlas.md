# Block Atlas by Trust Wallet

Clean explorer API for crypto currencies.

__Supported Coins__

<a href="https://binance.com" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png" width="32" /></a>
<a href="https://nimiq.com" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/nimiq/info/logo.png" width="32" /></a>
<a href="https://ripple.com" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png" width="32" /></a>
<a href="https://stellar.org" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png" width="32" /></a>
<a href="https://kin.org" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kin/info/logo.png" width="32" /></a>
<a href="https://tezos.com" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tezos/info/logo.png" width="32" /></a>
<a href="https://aion.network" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/aion/info/logo.png" width="32" /></a>
<a href="https://ethereum.org" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" width="32" /></a>
<a href="https://ethereumclassic.github.io" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/classic/info/logo.png" width="32" /></a>
<a href="https://poa.network" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/info/logo.png" width="32" /></a>
<a href="https://callisto.network" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/callisto/info/logo.png" width="32" /></a>
<a href="https://gochain.io" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/gochain/info/logo.png" width="32" /></a>
<a href="https://wanchain.org" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/wanchain/info/logo.png" width="32" /></a>
<a href="https://thundercore.com" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/thundertoken/info/logo.png" width="32" /></a>
<a href="https://icon.foundation" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/icon/info/logo.png" width="32" /></a>
<a href="https://tron.network" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/info/logo.png" width="32" /></a>
<a href="https://vechain.org/" target="_blank"><img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/vechain/info/logo.png" width="32" /></a>

## Setup

#### Quick start

Deploy it in less than 30 seconds!

__From Source__ (Go Toolchain required)

```shell
go get -u github.com/trustwallet/blockatlas
~/go/bin/blockatlas
```

__With Docker__

`docker run -it -p 8420:8420 trustwallet/blockatlas`

## Deploy

#### Supported platforms

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy/?template=https://github.com/trustwallet/blockatlas)

[![Docker](https://img.shields.io/docker/cloud/build/trustwallet/blockatlas.svg?style=for-the-badge)](https://hub.docker.com/r/trustwallet/blockatlas)


Block Atlas can run just fine without configuration.

If you want to use custom RPC endpoints, or enable coins without public RPC (like Nimiq),
you can configure Block Atlas over `config.yml` or environment variables.

__Config File__

By default, `config.yml` is loaded from the working directory.
Live reload is supported across the app.

Example (`config.yml`):
```yaml
nimiq:
  api: http://localhost:8648
#...
```

__Environment__

The rest gets loaded from the environment variables.
Every config option is available under the `ATLAS_` prefix.

Example:
```shell
ATLAS_NIMIQ_API=http://localhost:8648 \
blockatlas
```

## Authors

* [Richard Patel](https://github.com/terorie)

## Contributing

If you'd like to add support for a new blockchain, feel free to file a pull request.
Note that most tokens that run on top of other chains are already supported and
don't require code changes (e.g. ERC-20).

The best way to submit feedback and report bugs is to open a GitHub issue.
Please be sure to include your operating system, version number, and
steps to reproduce reported bugs.