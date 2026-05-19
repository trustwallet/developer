# Solana

TrustConnect provides React hooks for Solana wallet interactions.

## Installation

```bash
pnpm add @trustwallet/connect-solana-react
```

## Setup

Configure Solana using `createSolana`:

```tsx
import { createSolana, mainnet as solanaMainnet } from '@trustwallet/connect-solana-react'

const solana = createSolana({
    chain: solanaMainnet,
})
```

Then add it to the `namespaces` array in your `TrustConnectProvider` configuration. See [Quickstart](quickstart.md) for the full setup.

## Sign messages

### useSignMessage

Sign an arbitrary message with the connected Solana wallet:

```tsx
import { useSignMessage } from '@trustwallet/connect-solana-react'
import { useConnection } from '@trustwallet/connect-react'
import bs58 from 'bs58'

function SolanaSignMessage() {
    const { isConnected } = useConnection({ namespaceId: 'solana' })
    const { mutate, data, isPending, isSuccess, error } = useSignMessage()

    const handleSign = () => {
        if (!isConnected) return
        mutate({ message: 'Hello Solana!' })
    }

    // Signature is returned as Uint8Array
    const signatureBase58 = data ? bs58.encode(data.signature) : null

    return (
        <div>
            <button onClick={handleSign} disabled={isPending || !isConnected}>
                {isPending ? 'Signing...' : 'Sign Message'}
            </button>
            {isSuccess && signatureBase58 && (
                <div>
                    <p>Message signed successfully!</p>
                    <code>{signatureBase58}</code>
                </div>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    )
}
```

## Send transactions

### useSignSendTransaction

Sign and broadcast a Solana transaction:

```tsx
import { useSignSendTransaction } from '@trustwallet/connect-solana-react'
import { Transaction, SystemProgram, PublicKey } from '@solana/web3.js'

function SolanaSendTransaction() {
    const { mutateAsync, isPending } = useSignSendTransaction()

    const handleSend = async () => {
        try {
            const tx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey('...'),
                    toPubkey: new PublicKey('...'),
                    lamports: 1000000, // 0.001 SOL
                })
            )

            const serialized = tx.serialize({ requireAllSignatures: false })
            const result = await mutateAsync({
                transaction: serialized,
                options: {
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
                },
            })

            console.log('Transaction signature:', result.signature)
        } catch (error) {
            console.error('Transaction failed:', error)
        }
    }

    return (
        <button onClick={handleSend} disabled={isPending}>
            {isPending ? 'Sending...' : 'Send SOL'}
        </button>
    )
}
```

#### Transaction options

| Option | Type | Description |
|--------|------|-------------|
| `skipPreflight` | `boolean` | Disable transaction verification at the RPC |
| `preflightCommitment` | `'processed' \| 'confirmed' \| 'finalized'` | Commitment level for preflight |
| `commitment` | `'processed' \| 'confirmed' \| 'finalized'` | If provided, confirm the transaction after sending |
| `maxRetries` | `number` | Maximum number of times to retry sending the transaction |
| `minContextSlot` | `number` | Minimum slot to include the transaction |
