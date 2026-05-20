# Modal & Connection Management

TrustConnect provides React hooks for controlling the wallet connection modal and reading connection state across all supported chains.

## Modal control

### useTrustModal

Use `useTrustModal` to open and control the connection modal:

```tsx
import { useTrustModal } from '@trustwallet/connect-react'

function ConnectButton() {
    const { open } = useTrustModal()

    return (
        <>
            {/* Open wallet selection */}
            <button onClick={() => open()}>Connect Wallet</button>

            {/* Prompt the user to connect to a specific namespace */}
            <button onClick={() => open({ type: 'namespace', namespaceId: 'eip155' })}>
                Connect EVM Wallet
            </button>
        </>
    )
}
```

The `open` function accepts an optional parameter to target a specific namespace:

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `'namespace'` | Specifies that the modal should filter by namespace |
| `namespaceId` | `string` | The CAIP-2 namespace to filter wallets by (`'eip155'`, `'solana'`, `'bip122'`) |

## Connection state

### useConnections

Use `useConnections` to read all active connections across every namespace:

```tsx
import { useConnections } from '@trustwallet/connect-react'

function AllConnections() {
    const { connections } = useConnections()

    return (
        <ul>
            {connections.map((conn) => (
                <li key={conn.address}>
                    {conn.wallet?.name} — {conn.address}
                </li>
            ))}
        </ul>
    )
}
```

### useConnection

Use `useConnection` to read the connection for a single namespace:

```tsx
import { useConnection } from '@trustwallet/connect-react'

function WalletInfo() {
    const { isConnected, address, wallet, chain, status } = useConnection({
        namespaceId: 'eip155',
    })

    if (!isConnected) return <p>Not connected</p>

    return (
        <div>
            <p>Wallet: {wallet?.name}</p>
            <p>Address: {address}</p>
            <p>Chain: {chain?.reference}</p>
            <p>Status: {status}</p>
        </div>
    )
}
```

**Returned properties:**

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | `boolean` | Whether a wallet is connected for this namespace |
| `address` | `string \| undefined` | The connected wallet address |
| `wallet` | `object \| undefined` | Wallet metadata (name, icon, etc.) |
| `chain` | `object \| undefined` | The active chain for this connection |
| `status` | `string` | Connection status |
