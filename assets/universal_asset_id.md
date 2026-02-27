# Universal Asset ID

A `UAI` is a unique identifier for assets. It is blockchain-agnostic and provides the ability to easily distinguish assets across blockchains.

## Params:

- `c` - coin (required), for most coins it uses [slip 44 index](https://github.com/trustwallet/wallet-core/blob/master/docs/registry.md) conventions. There are some exceptions that use [coinId](https://github.com/trustwallet/wallet-core/blob/master/registry.json#L1472) based on Wallet Core config
- `t` - token (optional), following standard of unique identifier on the blockchain as smart contract address or asset ID

## Examples:

### Coins:

- Bitcoin: `c0`
- Ethereum: `c60`
- BNB Chain (BSC): `c20000714`

### Tokens:

- DAI (Ethereum): `c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F`
- USDT (Tron): `c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
- DAI (BSC): `c20000714_t0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3`

Template: `c{coin}_t{token_id}`
