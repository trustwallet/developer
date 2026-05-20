# Quickstart

Get from zero to a working wallet connection in your React app.

## Step 1 — Install packages

Install the core package, at least one network package, and WalletConnect:

```bash
pnpm add @trustwallet/connect-react \
         @trustwallet/connect-eip155-react \
         @trustwallet/connect-walletconnect
```

EIP-155 requires these peer dependencies:

```bash
pnpm add @tanstack/react-query viem
```

> **Other chains?** Add `@trustwallet/connect-solana-react` for Solana or `@trustwallet/connect-bip122-react` for Bitcoin. See [Solana](solana.md) and [Bitcoin](bitcoin.md) for details.

## Step 2 — Configure the provider

Wrap your app with `TrustConnectProvider` and configure the namespaces and services:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet, polygon } from 'viem/chains'
import { createEIP155 } from '@trustwallet/connect-eip155-react'
import { createWalletConnect } from '@trustwallet/connect-walletconnect'
import { TrustConnectProvider } from '@trustwallet/connect-react'

const queryClient = new QueryClient()
const projectId = import.meta.env.VITE_WALLETCONNECT_ID

const eip155 = createEIP155({
    chains: [mainnet, polygon],
})

const walletConnect = createWalletConnect({
    projectId,
    metadata: {
        name: 'My dApp',
        url: 'https://example.com',
        description: 'My awesome dApp',
        icons: ['https://example.com/icon.png'],
    },
})

function App() {
    return (
        <TrustConnectProvider
            config={{
                namespaces: [eip155],
                services: [walletConnect],
            }}
        >
            <QueryClientProvider client={queryClient}>
                <YourApp />
            </QueryClientProvider>
        </TrustConnectProvider>
    )
}
```

> **WalletConnect project ID** — get yours at [cloud.walletconnect.com](https://cloud.walletconnect.com/).

## Step 3 — Open the connection modal

Use the `useTrustModal` hook to open the wallet selection modal:

```tsx
import { useTrustModal } from '@trustwallet/connect-react'

function ConnectButton() {
    const { open } = useTrustModal()

    return <button onClick={() => open()}>Connect Wallet</button>
}
```

## Step 4 — Read connection state

Use `useConnection` to check if a wallet is connected and read its details:

```tsx
import { useConnection } from '@trustwallet/connect-react'

function WalletInfo() {
    const { isConnected, address, wallet, chain } = useConnection({
        namespaceId: 'eip155',
    })

    if (!isConnected) return <p>Not connected</p>

    return (
        <div>
            <p>Wallet: {wallet?.name}</p>
            <p>Address: {address}</p>
            <p>Chain: {chain?.reference}</p>
        </div>
    )
}
```

## Next steps

- [Modal & Connection Management](modal-and-connections.md) — fine-grained modal and connection control
- [EVM (EIP-155)](evm.md) — sign messages, write contracts, and send transactions
- [Solana](solana.md) — Solana wallet interactions
- [Bitcoin (BIP-122)](bitcoin.md) — Bitcoin wallet interactions
- [Theming & Customization](theming.md) — match the modal to your brand
