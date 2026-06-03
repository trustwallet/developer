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
twak wallet create --password <pw> [--no-keychain] [--skip-password-check] [--json]
```

### wallet address

```bash
twak wallet address --chain <chain> [--password <pw>] [--json]
```

Password falls back to the OS keychain or `TWAK_WALLET_PASSWORD` environment variable. See [Key Management](key-management.md) for full details on key storage, password resolution, and signing permissions.

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

## automate

Create and manage dollar-cost averaging (DCA) and limit-order automations. Both run as scheduled swaps under your stored wallet.

### automate add

Create a DCA automation by passing `--interval`; create a limit order by passing `--price` (and optional `--condition`). The two flags are mutually exclusive — exactly one must be supplied.

```bash
twak automate add --from <token> --to <token> --amount <amount> \
                  [--chain <chain>] \
                  (--interval <duration> | --price <usd> [--condition above|below]) \
                  [--max-runs <n>] [--expires <date>] [--json]
```

| Flag | Description |
|------|-------------|
| `--from` | Source asset ID, e.g. `c60_t0xA0b8...` for USDC on Ethereum |
| `--to` | Destination asset ID, e.g. `c60` for ETH |
| `--amount` | Amount of source token per run |
| `--chain` | Source chain (default: `ethereum`) |
| `--interval` | DCA interval — accepts `30s`, `5m`, `1h`, `7d`, etc. Creates a recurring swap. |
| `--price` | Target USD price for a limit order (mutually exclusive with `--interval`) |
| `--condition` | Limit-order trigger: `above` or `below` (default: `below`) |
| `--max-runs` | Stop after N executions |
| `--expires` | Expiry date in ISO 8601, e.g. `2026-04-01` |

### automate list

```bash
twak automate list [--json]
```

### automate pause / resume / delete

```bash
twak automate pause <id> [--json]
twak automate resume <id> [--json]
twak automate delete <id> [--json]
```

Use the `id` returned by `automate list`. Paused automations stop executing but stay in storage; deleted ones are removed.

---

## onramp

Buy crypto with fiat (onramp) or sell crypto for fiat (offramp) through third-party providers. Quotes are aggregated; the user completes KYC and payment in the provider's hosted browser flow. Available providers depend on the user's region.

### onramp quote

Get fiat-to-crypto quotes from multiple providers.

```bash
twak onramp quote --amount <fiat> --asset <id> [--currency <code>] \
                  [--wallet <address>] [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--amount` | Fiat amount, e.g. `100` |
| `--asset` | Asset ID, e.g. `c60` for ETH |
| `--currency` | Fiat currency (default: `USD`) |
| `--wallet` | Override the destination address (defaults to your stored wallet's address on the asset's chain) |

Quotes are sorted lowest-spread-first; the top row is the provider giving the most crypto for the same fiat input.

### onramp buy

Open the provider checkout URL for a chosen quote.

```bash
twak onramp buy --quote-id <id> [--asset <id>] [--wallet <address>] \
                [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--quote-id` | Quote ID from `twak onramp quote` |
| `--asset` | Crypto asset ID — required when `--wallet` is omitted (used to derive your destination address) |
| `--wallet` | Override the destination address |

### onramp sell-quote

Get crypto-to-fiat quotes.

```bash
twak onramp sell-quote --amount <crypto> --asset <id> [--currency <code>] \
                       [--method <method>] [--wallet <address>] \
                       [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--amount` | Crypto amount to sell, e.g. `0.1` |
| `--asset` | Asset ID being sold |
| `--currency` | Fiat currency for the payout (default: `USD`) |
| `--method` | Payout method: `ANY`, `card`, `bank_transfer` (default: `ANY`) |
| `--wallet` | Override the source address (defaults to your stored wallet's address on the asset's chain) |

Sorted lowest-spread-first; the top row is the provider returning the most fiat for the same crypto input.

### onramp sell

Open the provider checkout URL to complete KYC and reveal the deposit address.

```bash
twak onramp sell --quote-id <id> [--asset <id>] [--wallet <address>] \
                 [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--quote-id` | Quote ID from `twak onramp sell-quote` |
| `--asset` | Crypto asset ID — required when `--wallet` is omitted (used to derive your source address) |
| `--wallet` | Override the source address |

### onramp sell-confirm

Broadcast the on-chain payout to the provider's deposit address. Run this **after** completing KYC in the browser and copying the deposit address and exact amount the provider displayed.

```bash
twak onramp sell-confirm --asset <id> --to <deposit-address> --amount <n> \
                         [--memo <tag>] [--quote-id <id>] \
                         [--max-usd <n>] [--skip-safety-check] \
                         [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--asset` | Asset being sold |
| `--to` | Provider's deposit address (shown after KYC) |
| `--amount` | Exact amount the provider displays — must match |
| `--memo` | Memo / destination tag (Cosmos, XRP, Stellar, BNB Beacon) — funds can be unrecoverable without it when the chain requires one |
| `--quote-id` | Optional. Recorded in the output for traceability; the on-chain tx is built from `--to` / `--amount`, not from this ID |
| `--max-usd` | USD safety cap (default: 10000) |
| `--skip-safety-check` | Bypass the USD cap |

The deposit address is **not under your control** — verify it byte-for-byte against what the provider displayed before broadcasting. Signing always happens locally; the browser flow has no access to your keys.

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

## x402

Pay for HTTP endpoints that respond with `402 Payment Required`. The client signs an on-chain payment authorization (EIP-3009 gasless preferred over Permit2) and retries the request with the proof attached as a `PAYMENT-SIGNATURE` header.

### x402 quote

Preview the payment options an endpoint offers. Read-only — no wallet password required.

```bash
twak x402 quote <url> [--method <method>] [--body <json>] [--json]
```

Renders a table of available routes (chain + asset + amount + transfer method) sorted preferred-first, plus a `Next:` line with the exact `twak x402 request` command to run. Use the same `--method`/`--body` you plan to pay with — the server may emit a different challenge per verb.

### x402 request

Pay and fetch the resource.

```bash
twak x402 request <url> --max-payment <atomic> \
                  [--method <method>] [--body <json>] \
                  [--prefer-network <chain>] [--prefer-method eip3009|permit2-exact] \
                  [--prefer-asset <addr-or-name>] \
                  [--yes] [--auto-approve] [--password <pw>] [--json]
```

| Flag | Description |
|------|-------------|
| `--max-payment` | Required. Max payment to auto-approve, in atomic units of the chosen asset (e.g. `10000` = 0.01 USDC at 6dp). |
| `--method` | HTTP method (default: `GET`). Body is stripped on `GET`/`HEAD`. |
| `--body` | Raw request body. Sent with `Content-Type: application/json`. |
| `--prefer-network` | Restrict route to a chain — TWAK key (`base`, `bsc`, …) or CAIP-2 (`eip155:8453`). |
| `--prefer-method` | Restrict to `eip3009` (gasless) or `permit2-exact`. |
| `--prefer-asset` | Restrict to a contract address or a token-name substring (e.g. `Tether`, `USDC`). |
| `--yes` | Skip the per-payment confirmation prompt. Still capped by `--max-payment`. |
| `--auto-approve` | Skip the one-time Permit2 `approve(Permit2, MAX)` prompt (you pay gas). Independent of `--yes`. |

Only `https://` URLs are accepted; loopback/private IPs are rejected before any network call. EIP-3009 wins by default whenever offered with valid `extra.name`/`extra.version` metadata. Common live routes: USDC on `base` (recommended), USDC/USDT on `bsc`.

### x402 info

```bash
twak x402 info
```

Prints inline help for the x402 subcommands.

### Server side

To gate your own REST endpoints behind x402, see `twak serve --x402` below.

---

## serve

Start an MCP server (stdio) or REST API server for AI agent integrations.

```bash
twak serve [--rest] [--port <port>] [--host <host>] \
           [--auto-lock <minutes>] [--password <pw>]
```

| Flag | Description |
|------|-------------|
| `--rest` | Start REST HTTP server instead of MCP stdio |
| `--port` | Port for REST server (default: 3000) |
| `--auto-lock` | Auto-lock wallet after N minutes of inactivity |

The REST server authenticates requests via `Authorization: Bearer <HMAC_SECRET>`. This is separate from the HMAC signing used by `tws.trustwallet.com` — the REST server runs locally and uses the raw secret as a shared token for simplicity.

### Running automations in the background

DCA and limit-order automations you set up with `twak automate` are saved, but they only run while a watcher is active. When running the MCP server for an AI agent, start it with `twak serve --watch` so those automations execute in the background. Tune how often it checks with `--watch-interval` (for example, `--watch-interval 5m`; the default is every 60 seconds). Without `--watch`, your automations are saved but never run.

The background runner uses your local agent wallet. If you've connected through WalletConnect instead, the runner stays idle, since those transactions need manual approval.
