# Formats

## Transactions

All types of the transaction have the same [base](#base) format, and we can differ the actions using the [meta](#meta) object.

### Base

- `id` - Transaction hash.
- `from` - Transaction original sender.
- `to` - Transaction original recipient.
- `fee` - Transaction fee.
- `coin` - Coin index from [SLIP-44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md).
- `date` - Time in Unix format at which a transaction is mined.
- `block` - Block number at which transaction is included.
- `memo` - Message included with a transaction.
- `status` - [Transaction status](#transaction-status).
- `direction` - [Transaction direction](#transaction-direction).

##### Transaction Status:
- `completed` - Completed and settled in the ledger.
- `pending` - Pending in the mempool.
- `error` - Smart contract failed to execute transaction or failed for any reason in the ledger.

##### Transaction Direction:
- `outgoing` - The address owner is the sender of the transaction.
- `incoming` - The address owner is the receiver of the transaction.
- `yourself` - The address owner sends a transaction to yourself.


e.g:

```
{
   "id": "12345678"
   "from": "123",
   "to": "123",
   "fee": "1234"
   "coin": 60,
   "date": 1562256431,
   "block": 123,
   "memo": "",
   "status": "completed"
}

```


## Meta

### Types 
Meta actions to specify a type of transfer.

- [`transfer`](#transfer) - Basic transaction transfer from native currency platform.
- [`token_transfer`](#token_transfer) - Transfer of native tokens (Stellar Tokens/TRC10).
- [`native_token_transfer`](#native_token_transfer) - Transfer of non-native tokens (ERC20/TRC20).
- [`collectible_transfer`](#collectible_transfer) - NFT tokens transfer (ERC721/ERC1155).
- [`token_swap`](#token_swap) - Exchange of two different tokens.
- [`contract_call`](#contract_call) - Transaction from a contract execution/call.
- [`any_action`](#any_action) - Generic action, can be used for stake like delegate, undeelegate and claim rewards action.


### Examples:
#### Transfer

Type: `transfer`

```
{
   "type": "transfer",
   "metadata: {
       "name": "Viktor Coin",
       "symbol": "VIK",
       "decimals": 18,
       "value": "12312312"
   }
}
```

####  Token Transfer

Type: `token_transfer`

```
{
   "type": "token_transfer",
   "metadata: {
       "name": "Viktor Coin",
       "symbol": "VIK",
       "token_id" : "0x123",
       "decimals": 18,
       "value": "12312312",
       "from": "123",
       "to": "123",
   }
}
```

####  Native Token Transfer

Type: `native_token_transfer`

```
{
   "type": "native_token_transfer",
   "metadata: {
       "name": "Bittorent",
       "symbol": "BTT",
       "token_id" : "1002000",
       "decimals": 8,
       "value": "12312312"
   }
}
```

####  Collectible Transfer

Type: `collectible_transfer`

```
{
   "type": "collectible_transfer",
   "metadata: {
       "name": "Viktor Kittie",
       "contract" : "0x123",
       "image_url": "https://google.com/img.png",
       "from": "0x123",
       "to": "0x123",
   }
}
```

####  Token Swap

Type: `token_swap`

```
{
   "type": "token_swap"
   "metadata: {
       "input" : {
           "coin": 60,
           "token_id": "0x123" - optional
           "symbol": "BNB",
           "value": "123",
           "decimals": 8,
       },
       "output": {
           "coin": 60,
           "token_id": "0x123" - optional
           "symbol": "BTT",
           "value": "123",
           "decimals": 8,
       }
   }
}
```

####  Contract Call

Type: `contract_call`

```
{
    "type": "contract_call",
    "metadata": {
       "input": "0xfffdefefed",  
       "value": "1800000000000000000"
    }
}
```


####  Any Action

Type: `any_action`

```
{
    "type": "any_action",
    "metadata": {
       "coin": 60,  
       "title": "Place Order",
       "key":  "place_order",     
       "token_id": "0x123" - optional
       "name": "Viktor Coin",
       "symbol": "VIK",
       "decimals": 18,
       "value": "12312312"
    }
}
```

##### Keys and Titles
Keys mostly used to provide localized version on the clients by key.

- `place_order`: Placer Order.
- `cancel_order`: Cancel Order.
- `issue_token`: Issue Token.
- `burn_token`: Burn Token.
- `mint_token`: Mint Token.
- `approve_token`: Approve Token.
- `stake_delegate`: Stake Delegate.
- `stake_claim_rewards`: Stake Claim Rewards.


## Staking

### Validators

- `id` - Validator address.
- `status` - [Validator status](#validator-status).
- `info` - Details about the validator.
	- `name` - Validator name.
	- `description` - Validator description.
	- `image` - Validator image to show on the client.
	- `website` - Validator website. 
- `details` - Stake details.
	- `reward` - Estimate percent reward.
		- `annual` - Estimate percent reward per year.
	- `locktime` - Estimate percent reward.
	- `minimum_amount ` - Estimate percent reward.
	- `type ` - [Validator status](#validator-status).

##### Validator Status:
- `active` - Validator is active for stake.
- `pending` - Validator is pending for stake.

##### Validator Type:
- `auto` - The address owner is staking only holding the coin.
- `delegate` - The owner needs to delegate your balance.
	
e.g:

```json
{
  "id": "cosmosvaloper1fhr7e04ct0zslmkzqt9smakg3sxrdve6ulclj2",
  "status": true,
  "info": {
    "name": "POS Bakerz",
    "description": "POS Bakerz is a staking company operating secure and efficient nodes for different Proof-of-Stake cryptocurrencies such as Cosmos Network, Tezos, IRISnet, Terra Money and others.",
    "image": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/validators/assets/cosmosvaloper1fhr7e04ct0zslmkzqt9smakg3sxrdve6ulclj2/logo.png",
    "website": "https://posbakerz.com/"
  },
  "details": {
    "reward": {
      "annual": 7.318467221273478
    },
    "locktime": 1814400,
    "minimum_amount": "0",
    "type": "delegate"
  }
}
```

## Token


- `name` - Token name
- `symbol` - Token symbol
- `decimals` - Number of decimal places
- `tokenID` - Token unique id on the chain. e.g. (Dai token id on Ethereum - 0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359)
- `coin` - Coin index from [SLIP-44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- `type` - [Token type](#token-type).

##### Token Type:
- `ERC20` - ERC20 token.
- `BEP2` - BEP2 token.
- `TRC10` - TRC10 token.
- `ETC20` - ETC20 token.
- `POA20` - POA20 token.
- `TRC20` - TRC20 token.
- `CLO20` - CLO20 token.
- `G020` - G020 token.
- `WAN20` - WAN20 token.
- `TT20` - TT20 token.


e.g:

```json
{
   "name": "Givly Coin",
   "symbol": "GIV",
   "decimals": 8,
   "tokenID": "GIV-94E",
   "coin": 714,
   "type": "BEP2"
}
```

