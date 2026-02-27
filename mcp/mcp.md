# MCP Server

Trust Wallet publishes a [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server powered by GitBook, giving AI coding assistants direct access to the Trust Wallet developer documentation.

**MCP endpoint:**

```
https://developer.trustwallet.com/developer/~gitbook/mcp
```

## What is MCP?

MCP is an open standard that lets AI tools (Claude, Cursor, VS Code Copilot, etc.) connect to external knowledge sources and services. When an MCP server is configured, the AI can query it in real time rather than relying solely on its training data.

## Configuration

### Claude Desktop

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "trust-wallet-docs": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://developer.trustwallet.com/developer/~gitbook/mcp"
      ]
    }
  }
}
```

### Claude Code

```
claude mcp add --transport http trust-wallet-docs https://developer.trustwallet.com/developer/~gitbook/mcp
```

### Cursor

Add to `.cursor/mcp.json` in your project (or the global `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "trust-wallet-docs": {
      "url": "https://developer.trustwallet.com/developer/~gitbook/mcp"
    }
  }
}
```

## What the server exposes

Once connected, your AI assistant can search and retrieve content from the full Trust Wallet developer documentation, including:

- Browser Extension and WalletConnect integration guides
- Deep linking reference
- Asset listing requirements and PR process
- Wallet Core API usage, building, and blockchain support
- Barz smart wallet documentation
- Claude Code Skills for Trust Wallet

## Usage example

After configuring the MCP server, you can ask your AI assistant questions like:

> "How do I detect the Trust Wallet browser extension?"

> "What are the asset listing requirements for a new token?"

> "Show me how to sign a transaction with Wallet Core in Swift."

The assistant will query the Trust Wallet docs in real time and return accurate, up-to-date answers.
