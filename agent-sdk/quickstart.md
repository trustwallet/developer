# Quickstart

Get from zero to your first API call in under 5 minutes using the `twak` CLI.

## Step 1 — Install the CLI

```bash
npm install -g @twak/cli
```

Verify the install:

```bash
twak --version
```

The CLI exposes two aliases: `twak` and `tw-agent`.

## Step 2 — Configure credentials

Get your API key and HMAC secret from the [developer portal](https://developer.trustwallet.com/dashboard/keys), then run:

```bash
twak init --api-key twk_live_your_access_id \
          --api-secret your_hmac_secret
```

Credentials are stored in `~/.tw-agent/credentials.json`.

Alternatively, export environment variables (useful in CI/CD):

```bash
export TWAK_ACCESS_ID=twk_live_your_access_id
export TWAK_HMAC_SECRET=your_hmac_secret
```

Confirm the setup:

```bash
twak auth status
```

> **Never commit your HMAC secret to version control.** If using a `.env` file, add it to `.gitignore`.

## Step 3 — Make your first request

Fetch the current ETH price — no wallet required:

```bash
twak price ETH
```

Add `--json` for machine-readable output:

```bash
twak price ETH --json
# {"token":"ETH","chain":"ethereum","priceUsd":3241.87}
```

List all supported chains:

```bash
twak chains
```

## Step 4 — Explore more commands

```bash
# ETH balance for any address (coin 60 = Ethereum)
twak balance --address <addr> --coin 60

# All token holdings for an address
twak holdings --address <addr> --coin 60

# Top 5 trending tokens right now
twak trending --limit 5

# Search for tokens by name or symbol
twak search uniswap

# Transaction history for an address
twak history --address <addr> --chain ethereum

# Security / rug-risk check for a token
twak risk c60_t0x1f9840a85d5af5bf1d1762f925bdaddc4201f984

# Create an embedded agent wallet
twak wallet create --password <pw>

# Execute a token swap
twak swap 0.1 ETH USDC --chain ethereum

# Start an MCP server for AI agent integrations
twak serve
```

Run any command with `--help` to see all options.

## Next steps

- [CLI Reference](cli-reference.md) — full command reference
- [Authentication](authentication.md) — how HMAC signing works
