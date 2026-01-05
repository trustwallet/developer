---
title: Mobile (WalletConnect)
---

# Mobile (WalletConnect)

Trust Wallet supports WalletConnect v2.0 with multi-chain capabilities. You can connect to multiple blockchains simultaneously and sign transactions.

<a href="https://walletconnect.org/" target="_blank">WalletConnect</a> is an open source protocol for connecting dApps to mobile wallets with QR code scanning or deep linking.

**Supported Networks**

- Ethereum and all EVM chains
- Solana

> **Note:** We are currently working on adding more network support.

## Dapp Integration

There are two common ways to integrate WalletConnect: you can use the low-level library <a href="https://specs.walletconnect.com/2.0/specs/clients/sign/" target="_blank">Sign API</a> directly for more control, or use a higher-level library like <a href="https://wagmi.sh/" target="_blank">Wagmi</a> that simplifies the integration.

## Wagmi

<a href="https://wagmi.sh/" target="_blank">Wagmi</a> provides React Hooks for WalletConnect with built-in Trust Wallet support, it also supports Vue and vanilla JavaScript. See their <a href="https://wagmi.sh/" target="_blank">documentation</a> for integration guides.

## Sign API

### Installation

```bash
npm install --save-exact @walletconnect/sign-client
```

### Initiate Connection

WalletConnect v2 uses the Sign API. You'll need to initialize the client with your project ID from <a href="https://cloud.walletconnect.com" target="_blank">WalletConnect Cloud</a>:

```typescript
import { SignClient } from "@walletconnect/sign-client";

// Initialize Sign Client
const signClient = await SignClient.init({
  projectId: "YOUR_PROJECT_ID", // Get from https://cloud.walletconnect.com
  metadata: {
    name: "Your dApp Name",
    description: "Your dApp Description",
    url: "https://yourdapp.com",
    icons: ["https://yourdapp.com/icon.png"],
  },
});

// Subscribe to session events
signClient.on("session_event", ({ event }) => {
  // Handle session events
  console.log("Session event:", event);
});

signClient.on("session_update", ({ topic, params }) => {
  const { namespaces } = params;
  const session = signClient.session.get(topic);
  // Update session state
  console.log("Session updated:", session);
});

signClient.on("session_delete", () => {
  // Session was deleted, reset dApp state
  console.log("Session disconnected");
});
```

WalletConnect v2 follows the <a href="https://chainagnostic.org/CAIPs/caip-25" target="_blank">CAIP-25</a> protocol for establishing sessions. To connect with different networks, refer to the <a href="https://specs.walletconnect.com/2.0/specs/clients/sign/namespaces#example-of-a-proposal-namespace" target="_blank">WalletConnect namespaces specification</a>.

```typescript
// Request session
try {
  const { uri, approval } = await signClient.connect({
    optionalNamespaces: {
      eip155: {
        methods: [
          "eth_sendTransaction",
          "personal_sign",
          "eth_signTypedData",
        ],
        chains: ["eip155:1"],
        events: ["chainChanged", "accountsChanged"],
      },
    },
  });
// ...
}
```

The connect function will return two variables:

- `uri`: A string used to establish the session. You can use it to generate a QR Code that wallets can scan, or pass it via deep link to connect from a mobile browser or mobile dApp to the Trust Wallet mobile app.

- `approval`: A function that returns a promise which resolves once the session proposal has been either accepted or rejected by the wallet.

> **Important:** On iOS Safari, `window.open()` must be called synchronously in response to a user action (like a button click). Calling it inside an async function or after an `await` will be blocked by the popup blocker.

```typescript
function openMobileWallet(){
	const deepLink = `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`
	window.open(deepLink, '_blank', 'noreferrer noopener')
}
```

or

```tsx
import { Cuer } from 'cuer'

export function QRCodeComponent() {
  return uri && <Cuer arena={uri} />
}
```

Finally, we wait for the user's approval

```typescript
try {
  // ...
  // Await session approval from the wallet
  const session = await approval();

  console.log("Session established:", session);
} catch (error) {
  console.error("Connection error:", error);
}
```

For more details, check the <a href="https://specs.walletconnect.com/2.0/specs/clients/sign" target="_blank">WalletConnect v2 Sign API specs</a>.