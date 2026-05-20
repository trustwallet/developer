# Bitcoin (BIP-122)

TrustConnect provides React hooks for Bitcoin wallet interactions using the BIP-122 CAIP namespace.

## Installation

```bash
pnpm add @trustwallet/connect-bip122-react
```

## Setup

Configure Bitcoin using `createBIP122`:

```tsx
import { createBIP122, mainnet as bip122Mainnet } from '@trustwallet/connect-bip122-react'

const bip122 = createBIP122({
    chain: bip122Mainnet,
})
```

Then add it to the `namespaces` array in your `TrustConnectProvider` configuration. See [Quickstart](quickstart.md) for the full setup.

## Sign messages

### useSignMessage

Sign a message with the connected Bitcoin wallet. Supports both ECDSA and BIP-322 signing protocols:

```tsx
import { useSignMessage } from '@trustwallet/connect-bip122-react'
import { useConnection } from '@trustwallet/connect-react'

function BitcoinSignMessage() {
    const { isConnected } = useConnection({ namespaceId: 'bip122' })

    const {
        mutate: sign,
        data: signature,
        isPending,
        isSuccess,
        error,
    } = useSignMessage()

    const handleSign = () => {
        if (!isConnected) return
        sign({
            message: 'Hello from TrustConnect SDK!',
            protocol: 'ecdsa', // or 'bip322'
        })
    }

    return (
        <div>
            <button onClick={handleSign} disabled={isPending || !isConnected}>
                {isPending ? 'Signing...' : 'Sign Message'}
            </button>
            {isSuccess && signature && (
                <div>
                    <p>Message signed!</p>
                    <code>{signature.signature}</code>
                </div>
            )}
            {error && <p>Error: {error.message}</p>}
        </div>
    )
}
```

## Sign PSBTs

### useSignPsbt

Sign a Partially Signed Bitcoin Transaction (PSBT):

```tsx
import { useSignPsbt } from '@trustwallet/connect-bip122-react'

function BitcoinSignPsbt() {
    const { mutate: signPsbt, isPending } = useSignPsbt({})

    const handleSignPsbt = () => {
        signPsbt({
            psbt: 'cHNidP8BA...', // Base64 encoded PSBT
            signInputs: [
                { index: 0, sighashType: 1 },
            ],
            finalize: false,
        })
    }

    return (
        <button onClick={handleSignPsbt} disabled={isPending}>
            {isPending ? 'Signing...' : 'Sign PSBT'}
        </button>
    )
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `psbt` | `string` | Base64-encoded PSBT |
| `signInputs` | `array` | Array of input objects with `index`, optional `address`, `publicKey`, and `sighashType` |
| `finalize` | `boolean` | Whether the wallet should finalize and broadcast the PSBT |

## Send transfers

### useSendTransfer

Send a simple BTC transfer:

```tsx
import { useSendTransfer } from '@trustwallet/connect-bip122-react'

function BitcoinTransfer() {
    const { mutateAsync: sendTransfer, isPending } = useSendTransfer({})

    const handleTransfer = async () => {
        try {
            const result = await sendTransfer({
                toAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                satoshis: 10000,
            })
            console.log('Transaction ID:', result.txid)
        } catch (error) {
            console.error('Transfer failed:', error)
        }
    }

    return (
        <button onClick={handleTransfer} disabled={isPending}>
            {isPending ? 'Sending...' : 'Send BTC'}
        </button>
    )
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `toAddress` | `string` | Destination Bitcoin address |
| `satoshis` | `number` | Amount in satoshis |
