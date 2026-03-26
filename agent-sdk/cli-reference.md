# CLI Reference

The `twak` CLI provides full access to the Trust Wallet Agent SDK from the command line.

**Run:** `npx @trustwallet/cli <command>` or install globally with `npm install -g @trustwallet/cli`

---

## init

Initialize configuration and save credentials.

```bash
twak init --api-key <key> --api-secret <secret>
```

| Flag | Required | Description |
|------|----------|-------------|
| `--api-key` | Yes | TWAK API access ID |
| `--api-secret` | Yes | HMAC secret |

Credentials are saved to `~/.twak/credentials.json`.

---

## auth

### auth setup

```bash
twak auth setup --api-key <key> --api-secret <secret>
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
twak wallet balance [--chain <chain>] [--all] [--no-tokens] [--password <pw>] [--json]
```

Use `--all` to show balances across all chains with funds. Use `--no-tokens` to skip token balance lookup.

### wallet portfolio

Full portfolio across all chains — native balances, token holdings, and USD values.

```bash
twak wallet portfolio [--chains <list>] [--password <pw>] [--json]
```

Default chains include all major EVM chains plus Solana and TRON.

### wallet sign-message

Sign an arbitrary message with the agent wallet key.

```bash
twak wallet sign-message --chain <chain> --message <text> [--password <pw>] [--json]
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

### wallet status

```bash
twak wallet status [--json]
```

---

## transfer

```bash
twak transfer --to <address> --amount <amount> --token <token> \
              [--confirm-to <address>] [--max-usd <n>] [--skip-safety-check] \
              [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--to` | Destination address or ENS name (e.g., `vitalik.eth`) |
| `--amount` | Amount in human-readable format |
| `--token` | Asset ID (e.g., `c60` for ETH, `c60_t0xA0b8...` for ERC-20) |
| `--max-usd` | Maximum allowed transfer value in USD (default: 10000) |
| `--skip-safety-check` | Skip the USD-value safety check |
| `--confirm-to` | Pin expected resolved address — rejects if ENS resolves differently |

---

## swap

```bash
twak swap <amount> <from> <to> [--chain <chain>] [--to-chain <chain>] \
          [--slippage <pct>] [--quote-only] [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--chain` | Source chain (default: ethereum) |
| `--to-chain` | Destination chain for cross-chain swaps |
| `--slippage` | Slippage tolerance % (default: 1, max: 50) |
| `--quote-only` | Preview quote without executing |

Use `--quote-only` to preview without executing.

---

## price

```bash
twak price <token> [--chain <chain>] [--json]
```

Chain is auto-detected from native token symbols (ETH, BNB, SOL, etc.).

---

## balance

Get the native balance for any address using a SLIP44 coin ID.

```bash
twak balance --address <address> --coin <coinId> [--json]
```

Common coin IDs: `60` (Ethereum), `0` (Bitcoin), `501` (Solana).

---

## search

```bash
twak search <query> [--networks <ids>] [--limit <n>] [--json]
```

---

## trending

```bash
twak trending [--category <cat>] [--sort <field>] [--limit <n>] [--json]
```

Categories: `ai`, `rwa`, `memes`, `defi`, `dex`, `bnb`, `eth`, `sol`, `pumpfun`, `bonk`, `launchpad`, `launchpool`, `layer1`.

Sort fields: `price_change` (default), `market_cap`, `volume`.

---

## dapps

Browse featured DApps and protocols.

```bash
twak dapps [--category <cat>] [--search <query>] [--categories] [--limit <n>] [--json]
```

Categories: `defi`, `dex`, `lending`, `nft`, `gaming`, `social`. Use `--categories` to list all available.

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
                   [--confirm-unlimited] --password <pw> [--json]
```

Token uses the Trust Wallet asset ID format (e.g., `c60_t0xA0b8...`).

### erc20 revoke

```bash
twak erc20 revoke --token <assetId> --spender <address> --password <pw> [--json]
```

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

## serve

Start an MCP server (stdio) or REST API server for AI agent integrations.

```bash
twak serve [--rest] [--port <port>] [--host <host>] \
           [--auto-lock <minutes>] [--password <pw>] \
           [--x402] [--payment-amount <amount>] [--payment-asset <asset>] \
           [--payment-chain <chain>] [--payment-recipient <address>]
```

| Flag | Description |
|------|-------------|
| `--rest` | Start REST HTTP server instead of MCP stdio |
| `--port` | Port for REST server (default: 3000) |
| `--auto-lock` | Auto-lock wallet after N minutes of inactivity |
| `--x402` | Require x402 micropayment for REST endpoints |

The REST server authenticates requests via `Authorization: Bearer <HMAC_SECRET>`. This is separate from the HMAC signing used by `tws.trustwallet.com` — the REST server runs locally and uses the raw secret as a shared token for simplicity.
