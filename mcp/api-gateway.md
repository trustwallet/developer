# API Gateway MCP

The Trust Wallet API Gateway MCP server gives AI agents programmatic access to live blockchain data — token prices, swap quotes, trending tokens, address security, and more — through the [Model Context Protocol](https://modelcontextprotocol.io).

**MCP endpoint:**

```
https://mcp.trustwallet.com/tws
```


## Get API credentials

Register at [portal.trustwallet.com](https://portal.trustwallet.com) to obtain your **Access ID** and **HMAC Secret Key**.

## Authentication

Every request to the gateway must include two headers:

| Header | Value |
|--------|-------|
| `X-TW-CREDENTIAL` | Your Access ID |
| `X-TW-SECRET-KEY` | Your HMAC Secret Key |

The gateway handles HMAC-SHA256 signing of all upstream requests automatically — you only need to pass your credentials as headers. The connection must use HTTPS; credentials travel as plaintext headers and depend on TLS for protection in transit.

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "trust-wallet": {
      "url": "https://mcp.trustwallet.com/tws",
      "headers": {
        "X-TW-CREDENTIAL": "your-access-id",
        "X-TW-SECRET-KEY": "your-hmac-secret"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add --transport http trust-wallet https://mcp.trustwallet.com/tws \
  --header "X-TW-CREDENTIAL: <your-access-id>" \
  --header "X-TW-SECRET-KEY: <your-hmac-secret>"
```

### Cursor

Add to `.cursor/mcp.json` in your project (or the global `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "trust-wallet": {
      "url": "https://mcp.trustwallet.com/tws",
      "headers": {
        "X-TW-CREDENTIAL": "your-access-id",
        "X-TW-SECRET-KEY": "your-hmac-secret"
      }
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "trust-wallet": {
      "url": "https://mcp.trustwallet.com/tws",
      "headers": {
        "X-TW-CREDENTIAL": "your-access-id",
        "X-TW-SECRET-KEY": "your-hmac-secret"
      }
    }
  }
}
```

## Available tools

### Token Information

| Tool | Description |
|------|-------------|
| `search_assets` | Search tokens by name, symbol, or contract address across 100+ blockchains |
| `get_asset_details` | Get detailed info about a specific asset by ID or SLIP-44 coin number |
| `get_coin_status` | Get coin status, feature flags, staking info, and optional security data |

### Swap and Bridge

| Tool | Description |
|------|-------------|
| `get_swap_domains` | List supported blockchain domains with available DEX providers |
| `get_swap_providers` | List all available swap and bridge providers |
| `get_provider_details` | Get details about a specific swap/bridge provider |
| `get_swap_quote` | Get optimal swap/bridge routes for token swaps across chains |
| `get_swap_route_step` | Get executable transaction data for a swap route step |

### Market Data

| Tool | Description |
|------|-------------|
| `get_token_prices` | Get current market prices for up to 50 tokens at once |
| `get_trending_tokens` | Get trending/categorized token listings with multi-timeframe price data |
| `get_listing_categories` | Get available categories (DeFi, NFT, Layer 2, AI, Memes, etc.) |

### Security

| Tool | Description |
|------|-------------|
| `validate_address` | Validate a wallet address for a given chain; returns `{"status":"ok"}` on success |
| `check_token_security` | Analyze token risks: honeypot detection, audit status, freeze authority |

## Usage examples

| Prompt | Tools used |
|--------|------------|
| "What's the current price of ETH, SOL, and BNB?" | `get_token_prices` |
| "Find me trending meme tokens right now" | `get_trending_tokens` with category filter |
| "Is this token safe? `c60_t0xdAC17F...`" | `check_token_security` |
| "Is this a valid Ethereum address? `0x...`" | `validate_address` |
| "Get a swap quote for 1 ETH to USDC on Base" | `get_swap_quote` |
| "Search for Arbitrum DeFi tokens" | `search_assets` with network filter |

## Asset ID format

Trust Wallet uses SLIP-44 based asset identifiers:

- **Native coins**: `c{coinId}` — e.g., `c0` (Bitcoin), `c60` (Ethereum), `c714` (BNB)
- **Tokens**: `c{coinId}_t{contractAddress}` — e.g., `c60_t0xdAC17F958D2ee523a2206206994597C13D831ec7` (USDT on Ethereum)

Common coin IDs:

| Coin ID | Blockchain |
|---------|------------|
| 0 | Bitcoin |
| 60 | Ethereum |
| 714 | BNB Smart Chain |
| 501 | Solana |
| 137 | Polygon |
| 43114 | Avalanche |
| 42161 | Arbitrum |
| 10 | Optimism |
| 8453 | Base |

