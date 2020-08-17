# Universal Asset ID

UAI unique identifier of the asset, it's blockchain agnostic and provides ability to easily distinguish asset across blockchains. 

## Params:

- `c` - coin (required), [slip 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) conventions
- `t` - token (optional), following standard of unique identifier on the blockhain as smart contract address or asset ID

## Examples:

### Coins:

- Bitcoin: `c0`
- Ethereum: `c60`
- Binance Chain `c714`

### Tokens:

- DAI (Ethereum): `c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F`
- BUSD (Binance Chain): `c714_tBUSD-BD1`
- USDT (Tron): `c195_tTR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`
