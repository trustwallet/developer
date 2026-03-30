# Agent Skills

**Agent Skills** give AI coding agents domain-specific knowledge about Trust Wallet libraries and APIs. When a skill is active, the agent understands architecture, endpoints, and conventions without you having to paste documentation into every conversation.

Skills are published in an open-source marketplace on GitHub: [`trustwallet/tw-agent-skills`](https://github.com/trustwallet/tw-agent-skills).

## Installation

Install all skills with a single command:

```
npx skills add trustwallet/tw-agent-skills
```

The installer auto-detects your agent. To target a specific agent:

```
npx skills add trustwallet/tw-agent-skills -a claude-code
npx skills add trustwallet/tw-agent-skills -a cursor
npx skills add trustwallet/tw-agent-skills -a windsurf
npx skills add trustwallet/tw-agent-skills -a codex
npx skills add trustwallet/tw-agent-skills -a github-copilot
npx skills add trustwallet/tw-agent-skills -a cline
npx skills add trustwallet/tw-agent-skills -a opencode
npx skills add trustwallet/tw-agent-skills -a roo
```

To install a single skill:

```
npx skills add trustwallet/tw-agent-skills -s swap-quote
```

## Prerequisites

API skills require credentials from [portal.trustwallet.com](https://portal.trustwallet.com). Set the following environment variables:

```
TWAK_ACCESS_ID=<your-access-id>
TWAK_HMAC_SECRET=<your-hmac-secret>
```

- **Base URL**: `https://tws.trustwallet.com`
- **Authentication**: HMAC-SHA256
- **Rate limit**: 1 request/second (free tier)

## API Skills

5 skills, 14 actions.

| Skill | Actions | Description |
|-------|---------|-------------|
| `setup` | — | Authentication (HMAC-SHA256), base URLs, 100+ supported chains |
| `token-info` | 3 | Token search, asset details, and coin status |
| `swap-quote` | 6 | Swap quotes, step transactions, providers, domains via Amber |
| `market-data` | 3 | Token prices, trending tokens across 16+ categories |
| `security` | 2 | Address validation and token risk analysis |

## CLI Skills

The `trust-wallet-cli` skill gives agents access to `twak`, the Trust Wallet CLI for multichain wallet operations.

| Skill | Actions | Description |
|-------|---------|-------------|
| `trust-wallet-cli` | 12 | Wallet management, balances, transfers, swaps, alerts, DCA, limit orders, ERC-20, token risk, x402 |

Key capabilities:
- **Wallet**: Create HD wallets, derive addresses for 110+ chains, export keys, keychain integration
- **Transfers**: Send native tokens and ERC-20s with ENS support and safety limits
- **Swaps**: Same-chain and cross-chain swaps via Amber/Rango with inline approval
- **Alerts**: Price alerts with continuous monitoring via `twak watch`
- **Automations**: DCA (recurring swaps) and limit orders (conditional swaps) executed by `twak watch`
- **ERC-20**: Token approvals, allowance checks, revocations
- **MCP Server**: `twak serve` exposes all operations as MCP tools for AI agents



| Skill | Description |
|-------|-------------|
| `wallet-core` | HD wallet creation, address derivation, tx signing across 140+ blockchains |
| `trust-web3-provider` | Web3 provider for Ethereum, Solana, Cosmos, Bitcoin, Aptos, TON, Tron |
| `trust-developer` | Deep links, browser extension detection, WalletConnect |
| `assets` | Token logos and metadata across 180+ blockchains |
| `barz` | Modular ERC-4337 smart contract wallet |

## Usage

After installing, mention the skill by name in your request:

```
Use the swap-quote skill to get a quote for swapping 1 ETH to USDC
```

```
Use the wallet-core skill to implement transaction signing in Swift
```

```
Use the market-data skill to find trending tokens on Ethereum
```

## Contributing

Skills are markdown files. To add or improve a skill, open a PR on [`trustwallet/tw-agent-skills`](https://github.com/trustwallet/tw-agent-skills).
