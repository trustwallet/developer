# Deeplinking

## DApp Browser

Open dapp browser with a specific url and network (Android Only).

> Due to Apple restrictions, browser was removed from the iOS app.

- `coin` slip44 index
- `url` website url

https://link.trustwallet.com/open_url?coin_id=60&url=https://compound.finance

## Assets

### Activate coin

- `coin` slip44 index

https://link.trustwallet.com/activate_coin?coin=60
	
### Open coin

- `asset` asset in [UAI format](/assets/universal_asset_id.md)

https://link.trustwallet.com/open_coin?asset=c60


### Add asset

- `asset` asset in [UAI format](/assets/universal_asset_id.md) 

https://link.trustwallet.com/add_asset?asset=c60_t0x514910771af9ca656af840dff83e8264ecf986ca

## Payment

### Redeem Code:

- `code` unique code
- `provider` provider url

https://link.trustwallet.com/redeem?code=abc123

### Send Payment:

- `asset` asset in [UAI format](/assets/universal_asset_id.md)
- `address` Recipient address
- `amount` Optional. Payment amount
- `memo` Optional. Memo
- `data` Optional. Data

https://link.trustwallet.com/send?asset=c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F&address=0x650b5e446edabad7eba7fa7bb2f6119b2630bfbb&amount=1&memo=test

### Referral:

https://link.trustwallet.com/referral

## Staking

### Stake details:

- `coin` slip44 index

https://link.trustwallet.com/stake?coin=118

### Stake / Delegate:

- `coin` slip44 index
- `id` validator / delegator to be selected. Optional

https://link.trustwallet.com/stake_delegate?coin=118&id=cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf

### Unstake / Undelegate:

- `coin` slip44 index

https://link.trustwallet.com/stake_undelegate?coin=118

### Claim Rewards:

- `coin` slip44 index

https://link.trustwallet.com/stake_claim_rewards?coin=118

## Exchange

### Open Swap:

- `from` asset in [UAI format](/assets/universal_asset_id.md)
- `to` asset in [UAI format](/assets/universal_asset_id.md)

https://link.trustwallet.com/swap?from=c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F&to=c60

### Open Exchange:

- `from` asset in [UAI format](/assets/universal_asset_id.md)
- `to` asset in [UAI format](/assets/universal_asset_id.md)

https://link.trustwallet.com/exchange?from=c714_tRUNE-B1A&to=c714

### Open Buy Crypto

- `asset` asset in [UAI format](/assets/universal_asset_id.md)

https://link.trustwallet.com/buy?asset=c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F

### Open Market Info

- `asset` asset in [UAI format](/assets/universal_asset_id.md)

https://link.trustwallet.com/market?asset=c60_t0x6B175474E89094C44Da98b954EedeAC495271d0F

### Open Notifications

https://link.trustwallet.com/notifications

#### Available domains links:

- `https://link.trustwallet.com`
- `trust://`

#### Definition

slip44 index - https://github.com/satoshilabs/slips/blob/master/slip-0044.md


## WalletConnect

### Connect to a WalletConnect session

https://link.trustwallet.com/wc?uri=wc%3Aca1fccc0-f4d1-46c2-90b7-c07fce1c0cae%401%3Fbridge%3Dhttps%253A%252F%252Fbridge.walletconnect.org%26key%3Da413d90751839c7628873557c718fd73fcedc5e8e8c07cfecaefc0d3a178b1d8

#### Available domains links:

- `https://link.trustwallet.com`
- `trust://`
