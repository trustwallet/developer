# CLI Reference

The `twak` CLI (also aliased as `tw-agent`) provides full access to the Trust Wallet Agent SDK from the command line.

**Install:** `npm install -g @twak/cli`

---

## init

Initialize configuration and save credentials.

```bash
twak init --api-key <key> --api-secret <secret> [--wc-project-id <id>]
```

| Flag | Required | Description |
|------|----------|-------------|
| `--api-key` | Yes | TWAK API access ID |
| `--api-secret` | Yes | HMAC secret |
| `--wc-project-id` | No | WalletConnect project ID |

Credentials are saved to `~/.tw-agent/credentials.json`.

---

## auth

### auth setup

```bash
twak auth setup --api-key <key> --api-secret <secret> [--wc-project-id <id>]
```

### auth status

```bash
twak auth status [--json]
```

---

## wallet

### wallet create

```bash
twak wallet create --password <pw> [--no-keychain] [--json]
```

### wallet address

```bash
twak wallet address --chain <chain> [--password <pw>] [--json]
```

Password falls back to the OS keychain or `TWAK_WALLET_PASSWORD` environment variable.

### wallet addresses

```bash
twak wallet addresses [--password <pw>] [--json]
```

### wallet balance

```bash
twak wallet balance --chain <chain> [--password <pw>] [--json]
```

### wallet export

```bash
twak wallet export [--password <pw>]
```

### wallet keychain save

Save the wallet password to the OS keychain for passwordless usage.

```bash
twak wallet keychain save --password <pw>
```

### wallet keychain delete

```bash
twak wallet keychain delete
```

### wallet keychain check

```bash
twak wallet keychain check
```

### wallet connect

Connect an external wallet via WalletConnect.

```bash
twak wallet connect [--json]
```

### wallet status

```bash
twak wallet status [--json]
```

---

## transfer

```bash
twak transfer --to <address> --amount <amount> --token <token> --password <pw> [--json]
```

---

## swap

```bash
twak swap <amount> <from> <to> [--chain <chain>] [--to-chain <chain>] \
          [--slippage <pct>] [--quote-only] [--password <pw>] [--json]
```

Use `--quote-only` to preview without executing.

---

## price

```bash
twak price <token> [--chain <chain>] [--json]
```

Default chain is `ethereum`.

---

## balance

Get the native balance for any address using a SLIP44 coin ID.

```bash
twak balance --address <address> --coin <coinId> [--json]
```

Common coin IDs: `60` (Ethereum), `0` (Bitcoin), `501` (Solana).

---

## holdings

```bash
twak holdings --address <address> --coin <coinId> [--json]
```

---

## search

```bash
twak search <query> [--networks <ids>] [--limit <n>] [--json]
```

---

## trending

```bash
twak trending [--limit <n>] [--json]
```

---

## history

```bash
twak history --address <address> [--chain <chain>] [--from <date>] \
             [--to <date>] [--limit <n>] [--json]
```

---

## tx

```bash
twak tx <hash> --chain <chain> [--json]
```

---

## chains

```bash
twak chains [--json]
```

---

## asset

```bash
twak asset <assetId> [--json]
```

---

## validate

```bash
twak validate --address <address> [--asset-id <id>] [--json]
```

---

## risk

Check token security and rug-risk info.

```bash
twak risk <assetId> [--json]
```

---

## erc20

### erc20 approve

```bash
twak erc20 approve --token <assetId> --spender <address> --amount <amount> \
                   --password <pw> [--json]
```

Token uses the Trust Wallet asset ID format (e.g., `c60_t0xA0b8...`).

### erc20 allowance

```bash
twak erc20 allowance --token <assetId> --owner <address> --spender <address> [--json]
```

---

## alert

### alert create

```bash
twak alert create --token <token> --chain <chain> (--above <price> | --below <price>) [--json]
```

### alert list

```bash
twak alert list [--active] [--json]
```

### alert check

```bash
twak alert check [--json]
```

### alert delete

```bash
twak alert delete <id> [--json]
```

---

## onramp

### onramp quote

```bash
twak onramp quote --amount <amount> --asset <asset> --wallet <address> \
                  [--currency <fiat>] [--json]
```

### onramp buy

```bash
twak onramp buy --quote-id <id> --wallet <address> [--json]
```

### onramp sell-quote

```bash
twak onramp sell-quote --amount <amount> --asset <asset> --wallet <address> \
                       [--currency <fiat>] [--method <method>] [--json]
```

### onramp sell

```bash
twak onramp sell --quote-id <id> --wallet <address> [--json]
```

---

## automate

### automate add

Create a DCA or limit order automation.

```bash
twak automate add --from <token> --to <token> --amount <amount> \
                  [--chain <chain>] [--interval <interval>] \
                  [--price <price>] [--condition above|below] [--json]
```

### automate list

```bash
twak automate list [--all] [--json]
```

### automate delete

```bash
twak automate delete <id> [--json]
```

---

## serve

Start an MCP server (stdio) or REST API server for AI agent integrations.

```bash
twak serve [--rest] [--port <port>] [--x402] \
           [--payment-amount <amount>] [--payment-asset <asset>] \
           [--payment-chain <chain>] [--payment-recipient <address>]
```

Use `--rest` to start an HTTP server instead of stdio MCP.
