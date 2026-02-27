# Developing for Trust Wallet

Trust Wallet supports web3 integrations across mobile and desktop. Whether you're building a dApp that connects to the mobile app, integrating with the browser extension, or using deep links to route users into specific in-app flows, this section covers what you need.

## Guides

### [Browser Extension](browser-extension/browser-extension.md)

Integrate with the Trust Wallet browser extension to let users connect their wallets, sign transactions, and interact with your dApp from their desktop browser. Supports Ethereum, EVM-compatible chains, Bitcoin, Solana, Tron, TON, and other major networks.

### [Mobile (WalletConnect)](mobile/mobile.md)

Connect your dApp to the Trust Wallet mobile app using WalletConnect v2. Covers session setup, supported networks, and integration using the Sign API or higher-level libraries like Wagmi.

### [Deep Linking](deeplinking/deeplinking.md)

Use deep links to route users directly into specific pages within the Trust Wallet app — open a dApp browser, initiate a swap, send a payment, stake, buy crypto, and more. Works with both `https://link.trustwallet.com` and the `trust://` URI scheme.

---

**Prerequisites:** The examples in these guides assume familiarity with the JavaScript ecosystem. No prior web3 experience is required — you won't have to relearn anything, just understand a few new building blocks.
