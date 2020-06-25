# Deep Linking

# Usage 

## DApp Browser

### Open dapp browser with a specific url and network

- `coin` - slip44 index
- `url` - website url

https://link.trustwallet.com/open_url?coin_id=60&url=https://compound.finance

## Payments

### Activate coin

- `coin_id` - slip44 index

https://link.trustwallet.com/activate_coin?coin_id=60


### Redeem Code:

- `code` unique code
- `provider` provider url

https://link.trustwallet.com/redeem?code=abc123

### Send Payment:

- `coin` slip44 index
- `token_id` Optional. Token identifier (as smart contrtact address or unique token ID)
- `address` Recipient address
- `amount` Optional. Payment amount
- `memo` Optional. Memo
- `data` Optional. Data

https://link.trustwallet.com/send?coin=60&token_id=0x6B175474E89094C44Da98b954EedeAC495271d0F&address=0x650b5e446edabad7eba7fa7bb2f6119b2630bfbb&amount=1&memo=test

### Add custom token:

- `token_id` token identifier on the blockchain. 

https://link.trustwallet.com/add_token?token_id=0x514910771af9ca656af840dff83e8264ecf986ca

### Referral:

https://link.trustwallet.com/referral

## Staking

### Stake details:

- `coin` slip44 index

https://link.trustwallet.com/stake?coin=118

### Stake / Delegate:

- `coin` slip44 index

https://link.trustwallet.com/stake_delegate?coin=118

### Unstake / Undelegate:

- `coin` slip44 index

https://link.trustwallet.com/stake_undelegate?coin=118

### Claim Rewards:

- `coin` slip44 index

https://link.trustwallet.com/stake_claim_rewards?coin=118

## Exchange

### Open Swap:

- `pair` trading pair

https://link.trustwallet.com/swap?pair=ETH_DAI

### Open Exchange:

- `pair` trading pair

https://link.trustwallet.com/exchange?pair=RUNE-B1A_BNB

### Open Buy Crypto

- `coin` slip44 index
- `token_id` Optional. Token identifier (as smart contrtact address or unique token ID)

https://link.trustwallet.com/buy?coin=60&token_id=0x6B175474E89094C44Da98b954EedeAC495271d0F

### Open Market Info

- `coin` slip44 index
- `token_id` Optional. Token identifier (as smart contrtact address or unique token ID)

https://link.trustwallet.com/market?coin=60&token_id=0x6B175474E89094C44Da98b954EedeAC495271d0F

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
