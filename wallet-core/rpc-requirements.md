# RPC / API Requirements

Trust Wallet is a light client wallet, which means it needs to get data / information from remote nodes (either light nodes or full nodes). In order to integrate your blockchain into Trust Wallet smoothly, you must also fulfill RPC / API requirements. We list all needed APIs or RPCs plus an example below for your reference.

## for Trust Wallet:

We need API or RPC to:

- [ ] query account / address balance
- [ ] query transaction details
- [ ] query fee / nonce for sending transaction
- [ ] query blockchain status (block height etc)
- [ ] send raw transaction

## for Backend:

Used to create transaction list index and notify users about incoming/outgoing transactions.

- [ ] query transactions in a block

## Example

We will take XRP as an example here, it supports WebSocket, JSON-RPC (including over HTTP)

### Query account / address balance:

- [x] JSON RPC method: `account_info` (https://xrpl.org/account_info.html)

### Query transaction details:

- [x] JSON RPC method: `tx` (https://xrpl.org/tx.html)

### Query fee / nonce for sending transaction:

- [x] fee: JSON RPC method: `fee` (https://xrpl.org/fee.html)
- [x] nonce: same as `account_info`, you can find `Sequence` in response.

### Query blockchain status (block height etc):

- [x] JSON RPC method: `server_state` (https://xrpl.org/server_state.html)

### Send raw transaction:

- [x] JSON RPC method: `submit` (https://xrpl.org/submit.html)

### Query sent / received transactions for an account / address:

- [x] REST API: https://xrpl.org/data-api.html#get-account-transaction-history

### Query transactions in a block:

- [x] REST API: https://xrpl.org/data-api.html#get-ledger
