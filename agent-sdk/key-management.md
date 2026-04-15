# Key Management

## How Keys Are Stored

TWAK generates and stores private keys locally on the host machine. Keys never leave the device — not to Trust Wallet servers, not to the AI model provider, not anywhere.

When the agent wallet is initialized, a BIP39 HD wallet is generated via Trust Wallet Core. The mnemonic is encrypted immediately with AES-256-GCM, using a key derived from the user's password via PBKDF2, and written to `~/.twak/wallet.json`. The mnemonic is never stored in plaintext.

**What's stored on disk (`~/.twak/wallet.json`):**

| Field | Type | Description |
| --- | --- | --- |
| `encryptedMnemonic` | hex string | AES-256-GCM ciphertext of the mnemonic |
| `iv` | hex string | Random initialization vector |
| `authTag` | hex string | GCM authentication tag (detects tampering) |
| `salt` | hex string | Random PBKDF2 salt |
| `createdAt` | ISO 8601 | Wallet creation timestamp |
| `chains` | string[] | List of supported chain keys |

No plaintext keys, no plaintext mnemonic, no password on disk.

## What the Agent Can and Cannot Do

TWAK enforces a strict boundary between read-only queries and signing operations.

**Without the wallet password, the agent can:**

- Query any address balance
- Search tokens and fetch prices
- Get swap quotes
- Validate addresses and check token risk
- View transaction history

**The following operations require the wallet password:**

- Derive or reveal wallet addresses
- Sign or send transactions
- Execute swaps
- Approve token spending (ERC-20)
- Sign messages

The AI model never has direct access to the mnemonic or private keys. It interacts through TWAK's action layer, which gates all signing operations behind password authentication.

## Password Resolution

When a signing operation is requested, TWAK tries each source in order and uses the first one available:

| Source | Notes |
| --- | --- |
| `--password` flag | Checked first. Visible in shell history — avoid in production. |
| `TWAK_WALLET_PASSWORD` env var | Suitable for CI/CD and containerized environments. |
| OS keychain | macOS Keychain, Linux Secret Service. Most secure option. |

If none are available, the operation fails with an authentication error.

## Multi-Chain Key Derivation

A single wallet derives keys for 25+ supported chains using standard BIP-44 derivation paths. All key derivation and transaction signing is handled by Trust Wallet Core:

- **Ethereum and other EVM-compatible chains**: shared address across all EVM networks
- **Bitcoin**: Legacy, SegWit, and Taproot derivation paths
- **Solana**: Ed25519 key derivation
- **Cosmos, TON, SUI, NEAR, Aptos, Tron**: chain-specific derivation

## Password Requirements

Wallet creation enforces password strength:

- Minimum 8 characters
- At least one uppercase letter, one lowercase letter, and one number

These can be bypassed with `--skip-password-check` for test environments. See [CLI Reference](cli-reference.md) for the full `wallet create` command.
