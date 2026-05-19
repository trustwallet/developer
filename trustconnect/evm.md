# EVM (EIP-155)

TrustConnect provides React hooks for interacting with Ethereum and EVM-compatible chains. The EIP-155 package is built on top of [Viem](https://viem.sh) and uses Viem actions for read and write operations.

## Installation

```bash
pnpm add @trustwallet/connect-eip155-react
```

Peer dependencies:

```bash
pnpm add @tanstack/react-query viem
```

## Setup

Configure EVM chains using `createEIP155`:

```tsx
import { mainnet, polygon } from 'viem/chains'
import { createEIP155 } from '@trustwallet/connect-eip155-react'

const eip155 = createEIP155({
    chains: [mainnet, polygon],
})
```

### Custom RPC URLs

You can configure custom RPC endpoints per chain. Since Viem doesn't follow CAIP-2, use `formatChainId` to convert chain IDs:

```tsx
import { mainnet } from 'viem/chains'
import { formatChainId, createEIP155 } from '@trustwallet/connect-eip155-react'

const caipMainnetId = formatChainId(mainnet.id)

const eip155 = createEIP155({
    chains: [mainnet],
    rpcUrls: {
        [caipMainnetId]: ['https://rpc-node.com'],
    },
})
```

## Read operations

### useEIP155Query

Use `useEIP155Query` for read-only operations with any Viem public action:

```tsx
import { useEIP155Query } from '@trustwallet/connect-eip155-react'
import { getBalance } from 'viem/actions'
import { mainnet } from 'viem/chains'
import { useConnection } from '@trustwallet/connect-react'

function Balance() {
    const { address, isConnected } = useConnection({ namespaceId: 'eip155' })

    const { data } = useEIP155Query({
        chain: mainnet,
        action: getBalance,
        request: { address },
        queryOptions: {
            enabled: isConnected,
            queryKey: [address],
        },
    })

    return <p>Balance: {data?.toString()}</p>
}
```

> **Important:** Always pass `queryOptions.enabled: isConnected` to prevent the query from running before a wallet is connected. Without this, the query will fail with a "Transport is undefined" error because no RPC client exists yet.

## Write operations

### useSignMessage

Sign messages with the connected EVM wallet:

```tsx
import { useSignMessage } from '@trustwallet/connect-eip155-react'
import { useConnection } from '@trustwallet/connect-react'

function SignMessage() {
    const { isConnected } = useConnection({ namespaceId: 'eip155' })
    const { mutate: sign, data, isPending, isSuccess, isError, error } = useSignMessage()

    return (
        <div>
            <button onClick={() => sign({ message: 'Hello World' })} disabled={!isConnected || isPending}>
                Sign Message
            </button>
            {isPending && <p>Signing...</p>}
            {isSuccess && <p>Signature: {data}</p>}
            {isError && <p>Error: {error?.message}</p>}
        </div>
    )
}
```

### useWriteContract

Call smart contract functions that modify state. This hook handles chain switching automatically and waits for transaction confirmation via [`waitForTransactionReceipt`](https://viem.sh/docs/actions/public/waitForTransactionReceipt).

> **Note:** You can disable automatic chain switching by setting `autoSwitchChain` to `false`.

```tsx
import { useWriteContract } from '@trustwallet/connect-eip155-react'
import { mainnet } from 'viem/chains'
import { parseEther } from 'viem'

function WriteContract() {
    const { mutate, hash, receipt, isLoading, isConfirming, isConfirmed } = useWriteContract()

    const handleWrite = () => {
        mutate({
            chain: mainnet,
            address: '0x...',
            abi: [...],
            functionName: 'transfer',
            args: ['0x...', parseEther('0.01')],
        })
    }

    return (
        <div>
            <button onClick={handleWrite} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
            </button>
            {hash && <p>Hash: {hash}</p>}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && receipt && <p>Confirmed in block {receipt.blockNumber}</p>}
        </div>
    )
}
```

### useSendTransaction

Send native token transfers. Like `useWriteContract`, this hook handles chain switching and waits for confirmation automatically.

```tsx
import { useSendTransaction } from '@trustwallet/connect-eip155-react'
import { mainnet } from 'viem/chains'
import { parseEther } from 'viem'

function SendTransaction() {
    const { mutateAsync, isPending, hash, receipt, isConfirming, isConfirmed } = useSendTransaction()

    const handleSend = async () => {
        try {
            await mutateAsync({
                chain: mainnet,
                to: '0x...',
                value: parseEther('0.01'),
            })
        } catch (error) {
            console.error('Failed:', error)
        }
    }

    return (
        <div>
            <button onClick={handleSend} disabled={isPending}>
                {isPending ? 'Sending...' : 'Send 0.01 ETH'}
            </button>
            {hash && <p>Hash: {hash}</p>}
            {isConfirming && <p>Waiting for confirmation...</p>}
            {isConfirmed && receipt && <p>Confirmed in block {receipt.blockNumber}</p>}
        </div>
    )
}
```

### useEIP155Mutation

Use `useEIP155Mutation` for any Viem wallet action not covered by the higher-level hooks:

```tsx
import { useEIP155Mutation } from '@trustwallet/connect-eip155-react'
import { switchChain } from 'viem/actions'
import { mainnet } from 'viem/chains'

function CustomAction() {
    const { mutateAsync, isPending } = useEIP155Mutation({
        chain: mainnet,
        action: switchChain,
    })

    return (
        <button onClick={() => mutateAsync({ id: mainnet.id })} disabled={isPending}>
            {isPending ? 'Switching...' : 'Switch Chain'}
        </button>
    )
}
```
