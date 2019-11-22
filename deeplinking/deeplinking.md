# Deep Linking

## Usage 
### Open dapp browser with a specific url and network

- `coin_id` - slip44 index
- `url` - website url

https://link.trustwallet.com/open_url?coin_id=60&url=https://compound.finance

### Activate coin

- `coin_id` - slip44 index

https://link.trustwallet.com/activate_coin?coin_id=60

### Stake coin:

- `coin` slip44 index

https://link.trustwallet.com/stake?coin=18

### Redeem Code:

- `code` unique code

https://link.trustwallet.com/redeem?code=abc123


### Send Payment:

- `coin` slip44 index
- `token_id` token identifier. leave it empty string if not applicable 
- `address` recepient address
- `amount` payment amount
- `memo` memo
- `data` data

https://link.trustwallet.com/send?coin=60&token_id= 0x6B175474E89094C44Da98b954EedeAC495271d0F&address=0x650b5e446edabad7eba7fa7bb2f6119b2630bfbb&amount=1&memo=test

### Add custom token:

- `token_id` token identifier on the blockchain. 

https://link.trustwallet.com/add_token?token_id=0x514910771af9ca656af840dff83e8264ecf986ca

#### Available domains links:

- `https://link.trustwallet.com`
- `trust://`

#### Definition

slip44 index - https://github.com/satoshilabs/slips/blob/master/slip-0044.md


