# Staking Validators

Trust Wallet displays staking validator information sourced directly from the [Trust Wallet Assets repository](https://github.com/trustwallet/assets). Validators are listed per supported blockchain, allowing users to discover and delegate to them directly within the Trust Wallet app.

> **Note:** Submission and payment of a Pull Request does not guarantee it will be merged and displayed in Trust Wallet. All entries are subject to review, and the team reserves the right to reject entries that do not meet quality standards.

---

## Supported Chains

Validator listings are currently supported for **52 blockchains**, including:

Agoric, Akash, Aptos, Axelar, Band, Binance, Cardano, Comdex, Coreum, Cosmos, Crescent, Crypto.org, Elrond, Ethereum, Fetch.ai, Harmony, IoTeX, IRISnet, Juno, Kava, Kujira, Kusama, Loom, Mars, Canto, Evmos, Injective, NEAR, Ontology, Osmosis, Persistence, Polkadot, Quasar, Secret Network, Sei, BNB Smart Chain, Solana, Sommelier, Stargaze, Stride, Sui, Teritori, Terra Classic, Terra v2, Tezos, Celestia, TRON, Umee, VeChain, Wanchain, Waves, ZetaChain

See all [supported staking coins](https://trustwallet.com/staking/) on the Trust Wallet website.

---

## Repository Structure

Validator data follows a consistent structure across all chains:

```
blockchains/<chain>/validators/
├── list.json                    (metadata for all validators on this chain)
└── assets/
    └── <validator_id>/
        └── logo.png             (validator logo image)
```

**Examples by chain:**

```
blockchains/cosmos/validators/assets/cosmosvaloper1k6e7l0lz497l8njqjxpd3g4wlkdfwe93uqf03k/logo.png
blockchains/solana/validators/assets/FiijvR2ibXEHaFqB127CxrL3vSj19K2Kx1jf2RbK4BWS/logo.png
blockchains/tezos/validators/assets/tz1hAYfexyzPGG6RhZZMpDvAHifubsbb6kgn/logo.png
blockchains/ethereum/validators/assets/0x2401c39d7ba9E283668a53fcC7B8F5FD9e716fdf/logo.png
```

---

## How to Add a Validator

1. **Add validator metadata** — append your entry to the bottom of `blockchains/<chain>/validators/list.json`
2. **Add a logo** — place `logo.png` at `blockchains/<chain>/validators/assets/<validator_id>/logo.png`
3. **Open a pull request** — submit your changes and [pay the processing fee](pr-fee.md)

> **Tip:** Review the existing entries in the chain's `list.json` before adding yours to understand the expected ID format and any chain-specific fields.

---

## list.json Schema

Each entry in `list.json` is a JSON object within a top-level array.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The validator's unique identifier on-chain (address, operator address, or public key — format varies by chain) |
| `name` | `string` | Display name shown in the Trust Wallet app |
| `description` | `string` | A brief description of the validator or service |
| `website` | `string` | The validator's official website URL |

### Optional Fields

#### `payout` object

| Field | Type | Description |
|-------|------|-------------|
| `commission` | `integer` | Fee charged by the validator as a percentage (e.g. `10` = 10%) |
| `payoutDelay` | `integer` | Number of cycles/periods before rewards are distributed |
| `payoutPeriod` | `integer` | Frequency of reward payouts (in cycles/periods) |

#### `staking` object

| Field | Type | Description |
|-------|------|-------------|
| `minDelegation` | `number` | Minimum amount required to delegate to this validator |

#### `status` object

| Field | Type | Description |
|-------|------|-------------|
| `disabled` | `boolean` | Set to `true` to mark the validator as inactive |
| `note` | `string` | Optional note explaining the status (e.g. reason for disabling) |

---

## Examples

### Basic entry (Cosmos)

```json
{
    "id": "cosmosvaloper1k6e7l0lz497l8njqjxpd3g4wlkdfwe93uqf03k",
    "name": "Trust Nodes",
    "description": "The most trusted & secure crypto wallet",
    "website": "https://trustwallet.com"
}
```

### Entry with payout and staking details (Tezos)

```json
{
    "id": "tz1hAYfexyzPGG6RhZZMpDvAHifubsbb6kgn",
    "name": "Swiss Staking",
    "description": "Experienced validator based in Switzerland. We offer a highly secure and stable staking infrastructure.",
    "website": "https://swiss-staking.ch",
    "payout": {
        "commission": 10,
        "payoutDelay": 6,
        "payoutPeriod": 1
    },
    "staking": {
        "minDelegation": 100
    }
}
```

### Disabled validator

```json
{
    "id": "tz1...",
    "name": "Example Validator",
    "description": "...",
    "website": "https://example.com",
    "status": {
        "disabled": true,
        "note": "This validator has ceased operations."
    }
}
```

---

## Logo Requirements

Place the logo at: `blockchains/<chain>/validators/assets/<validator_id>/logo.png`

| Property | Requirement |
|----------|-------------|
| File name | `logo.png` (all lowercase — `PNG` is invalid) |
| Format | `png` |
| Dimensions | `256 x 256 px` recommended, `512 x 512 px` maximum |
| File size | Maximum `100 kB` |
| Aspect ratio | `1:1` |

For full logo design guidelines — including circular cropping, background handling, and dark mode compatibility — see [Image Requirements](repository_details.md#image-requirements).

---

## Chain-Specific Requirements

The `id` format and available metadata fields vary by chain. Before submitting, review the existing `list.json` for your target chain to confirm the correct ID format.

Reference validator lists for commonly supported chains:

- [Cosmos](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos/validators/list.json)
- [Kava](https://github.com/trustwallet/assets/tree/master/blockchains/kava/validators/list.json)
- [Solana](https://github.com/trustwallet/assets/tree/master/blockchains/solana/validators/list.json)
- [Polkadot](https://github.com/trustwallet/assets/tree/master/blockchains/polkadot/validators/list.json)
- [Tezos](https://github.com/trustwallet/assets/tree/master/blockchains/tezos/validators/list.json)
- [TRON](https://github.com/trustwallet/assets/tree/master/blockchains/tron/validators/list.json)
- [Harmony](https://github.com/trustwallet/assets/tree/master/blockchains/harmony/validators/list.json)
