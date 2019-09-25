# RPC / API Requirements

Trust Wallet is a light client wallet, which means it needs to get data / information from remote nodes (either light nodes or full nodes). In order to integrate your blockchain into Trust Wallet smoothly, you must also fulfill RPC / API requirements. We list all needed APIs or RPCs plus an example below for your reference.

## for Trust Wallet: 

We need API or RPC to: 

- [ ] query account / address balance
- [ ] query transaction details
- [ ] query fee / nonce for sending transaction
- [ ] query blockchain status (block height etc)
- [ ] send raw transaction

## for Block Atlas: 

At first, please read [Block Atlas Developer Guide](https://developer.trustwallet.com/blockatlas/newblockchain), We need API or RPC to: 

- [ ] query sent / received list of transactions for an account / address
- [ ] query transactions in a block

## Example

We will take XRP as an example here, it supports WebSocket, JSON-RPC (including over HTTP)

- [x] query account / address balance
- - JSON RPC method: `account_info` (https://xrpl.org/account_info.html)
- [x] query transaction details
- - JSON RPC method: `tx` (https://xrpl.org/tx.html)
- [x] query fee / nonce for sending transaction
- - fee: JSON RPC method: `fee` (https://xrpl.org/fee.html)
- - nonce: same as `account_info`, you can find `Sequence` in response.
- [x] query blockchain status (block height etc)
- - JSON RPC method: `server_state` (https://xrpl.org/server_state.html)
- [x] send raw transaction
- - JSON RPC method: `submit` (https://xrpl.org/submit.html)
- [x] query sent / received transactions for an account / address
- - REST API: https://xrpl.org/data-api.html#get-account-transaction-history
- [x] query transactions in a block
- - REST API: https://xrpl.org/data-api.html#get-ledger
