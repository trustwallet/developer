# TrustConnect SDK

The free, open-source wallet connection SDK for every chain, built by Trust Wallet. TrustConnect is a [CAIP](https://chainagnostic.org/)-compliant, multi-chain SDK that connects your dApp to Trust Wallet and other wallets across EVM, Solana, and Bitcoin — with a React hooks API and fully customizable UI.

## Install

Install the core React package:

```bash
pnpm add @trustwallet/connect-react
```

Then add the network-specific packages for the chains you need:

```bash
# EVM chains (Ethereum, Polygon, etc.)
pnpm add @trustwallet/connect-eip155-react

# Solana
pnpm add @trustwallet/connect-solana-react

# Bitcoin
pnpm add @trustwallet/connect-bip122-react
```

For WalletConnect support (mobile and QR code connections):

```bash
pnpm add @trustwallet/connect-walletconnect
```

EIP-155 peer dependencies (if not already installed):

```bash
pnpm add @tanstack/react-query viem
```

## Get started

- [Quickstart](quickstart.md) — install, configure, and connect your first wallet
- [Modal & Connection Management](modal-and-connections.md) — control the connection modal and read wallet state
- [EVM (EIP-155)](evm.md) — sign messages, send transactions, and call contracts on Ethereum and EVM chains
- [Solana](solana.md) — sign messages and send transactions on Solana
- [Bitcoin (BIP-122)](bitcoin.md) — sign messages, PSBTs, and send transfers on Bitcoin
- [Theming & Customization](theming.md) — customize the UI theme or eject the full component set

## Key features

- **100% free, always** — no usage fees, no freemium tiers, no paywalls
- **Native multi-chain support** — EVM, Solana, and Bitcoin in a single, modular SDK
- **Fully customizable UI** — override any style to match your design system, or eject the entire component set for full control
- **Apache 2.0 licensed** — fork it, extend it, own it. No vendor lock-in
- **Lightweight by design** — minimal dependencies, small bundle size, internally audited
- **CAIP-compliant** — built on [Chain Agnostic](https://chainagnostic.org/) standards for consistent multi-chain addressing

## License

TrustConnect SDK is available under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
