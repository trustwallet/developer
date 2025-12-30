# Mobile (WalletConnect)

Trust Wallet supports WalletConnect 2.0 with multi-chain capabilities. You can connect to multiple blockchains simultaneously and sign transactions.

[WalletConnect](https://walletconnect.org/) is an open source protocol for connecting dApps to mobile wallets with QR code scanning or deep linking.

**Supported Networks**

- Ethereum and all EVM chains
- Solana

> **Note:** We are currently working on adding more network support.

## Dapp Integration

There are two common ways to integrate WalletConnect: you can use the low-level library [Sign API](https://specs.walletconnect.com/2.0/specs/clients/sign/) directly for more control, or use a higher-level library like [Wagmi](https://wagmi.sh/) that simplifies the integration.

## Wagmi

[Wagmi](https://wagmi.sh/) provides React Hooks for WalletConnect with built-in Trust Wallet support, it also supports Vue and vanilla JavaScript. See their [documentation](https://wagmi.sh/) for integration guides.

## Sign API

### Installation

```bash
npm install --save-exact @walletconnect/sign-client
```

### Initiate Connection

WalletConnect v2 uses the Sign API. You'll need to initialize the client with your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com):

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

WalletConnect v2 follows the [CAIP-25](https://chainagnostic.org/CAIPs/caip-25) protocol for establishing sessions. To connect with different networks, refer to the [WalletConnect namespaces specification](https://specs.walletconnect.com/2.0/specs/clients/sign/namespaces#example-of-a-proposal-namespace).

```typescript
// Request session
try {
  const { uri, approval } = await signClient.connect({
    requiredNamespaces: {
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

- `uri`: A string used to establish the session. You can use it to generate a QR Code that wallets can scan, or pass it via deep link for mobile-to-mobile connections.

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

For more details, check the [WalletConnect v2 Sign API specs](https://specs.walletconnect.com/2.0/specs/clients/sign).