# Claude Code Skills

[Claude Code](https://claude.ai/code) is Anthropic's AI coding tool. **Skills** extend Claude Code with domain-specific knowledge — when a skill is active, Claude understands the library's architecture, APIs, and conventions without you having to paste documentation into every conversation.

Trust Wallet publishes an open source skills marketplace on GitHub: [`trustwallet/tw-agent-skills`](https://github.com/trustwallet/tw-agent-skills).

## Installation

Register the Trust Wallet marketplace in Claude Code:

```
/plugin marketplace add trustwallet/tw-agent-skills
```

Then install the `web3-skills` bundle, which includes all 5 skills listed below:

```
/plugin install web3-skills@tw-agent-skills
```

Restart Claude Code after installing.

## Available Skills

| Skill | What it helps with |
|-------|--------------------|
| `trust-web3-provider` | Integrating and extending the Web3 provider — Ethereum (EIP-1193), Solana (Wallet Standard), Cosmos (Keplr), Bitcoin, Aptos, TON, Tron |
| `wallet-core` | HD wallet creation, address derivation, and transaction signing across 140+ blockchains in Swift, Kotlin, TypeScript, and Go |
| `assets` | Looking up token logos and metadata, listing assets by chain, using CDN URLs, and contributing new assets |
| `barz` | Building with and contributing to Barz — Trust Wallet's modular ERC-4337 smart contract wallet |
| `trust-developer` | Deep links, browser extension detection, and WalletConnect integration |

## Usage

After installing, mention the skill by name in your request:

```
Use the trust-web3-provider skill to help me add Solana support to my wallet
```

```
Use the wallet-core skill to implement transaction signing in Swift
```

```
Use the assets skill to add a new token logo
```

## Browse Interactively

```
/plugin browse
```

Select `tw-agent-skills` → `web3-skills` → `Install now`.

## Updating Skills

```
/plugin marketplace update tw-agent-skills
/plugin install web3-skills@tw-agent-skills
```

## Contributing

Skills are markdown files. To add or improve a skill, open a PR on [`trustwallet/tw-agent-skills`](https://github.com/trustwallet/tw-agent-skills).
