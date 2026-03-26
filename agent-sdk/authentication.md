# Authentication

All requests to the Trust Wallet API are authenticated with an **API access ID** and an **HMAC-SHA256 signature** derived from your HMAC secret.

## Getting credentials

1. Sign in at [portal.trustwallet.com](https://portal.trustwallet.com)
2. Create an app, then create an API key inside it
3. Copy your **Access ID** and **HMAC Secret** — the secret is shown only once

## Configuring the CLI

The recommended approach is `twak init`, which stores credentials in `~/.twak/credentials.json` with `0600` permissions:

```bash
twak init --api-key your_access_id \
          --api-secret your_hmac_secret
```

For CI/CD pipelines, use environment variables:

```bash
export TWAK_ACCESS_ID=your_access_id
export TWAK_HMAC_SECRET=your_hmac_secret
```

> **Do not add these exports to shell config files** (`~/.zshrc`, `~/.bashrc`). Use `twak init` for persistent local credentials. Env vars are intended for ephemeral CI/CD environments where secrets are injected at runtime.

## How HMAC signing works

Every API request is signed with HMAC-SHA256 over six fields concatenated together:

```
METHOD + PATH + QUERY + ACCESS_ID + NONCE + DATE
```

| Field | Description |
|-------|-------------|
| `METHOD` | HTTP method in uppercase — `GET`, `POST`, `DELETE` |
| `PATH` | URL path without query string — `/v1/wallet/balance` |
| `QUERY` | Query string (without leading `?`), or empty string |
| `ACCESS_ID` | Your API access ID |
| `NONCE` | Unique random string — prevents replay attacks |
| `DATE` | ISO 8601 timestamp — validated within a ±5 min window |

The resulting base64 signature is sent in the `Authorization` header. Four headers are required on every request:

| Header | Value |
|--------|-------|
| `X-TW-Credential` | Your API access ID |
| `X-TW-Nonce` | The nonce used in signing |
| `X-TW-Date` | The timestamp used in signing |
| `Authorization` | Base64-encoded HMAC-SHA256 signature |

The CLI and TypeScript SDK handle signing automatically — you only need to understand this if you are making raw HTTP calls.

## Raw HTTP example

```bash
ACCESS_ID="$TWAK_ACCESS_ID"
NONCE=$(uuidgen | tr -d '-')
DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
METHOD="GET"
REQ_PATH="/v1/search/assets"
QUERY="query=ethereum&limit=5"
SIGNATURE=$(printf '%s' "${METHOD}${REQ_PATH}${QUERY}${ACCESS_ID}${NONCE}${DATE}" \
  | openssl dgst -sha256 -hmac "$TWAK_HMAC_SECRET" -binary \
  | base64)

curl -X GET "https://tws.trustwallet.com${REQ_PATH}?${QUERY}" \
  -H "X-TW-Credential: $ACCESS_ID" \
  -H "X-TW-Nonce: $NONCE" \
  -H "X-TW-Date: $DATE" \
  -H "Authorization: $SIGNATURE"
```

## Security best practices

- Use `twak init` for local credentials — stores in `~/.twak/credentials.json` with restricted permissions
- Use `twak wallet keychain save` to store the wallet password in the OS keychain (macOS Keychain / Linux Secret Service)
- Never commit your HMAC secret to version control — add `.env` to `.gitignore`
- Never add credentials to shell config files (`~/.zshrc`, `~/.bashrc`) — use `twak init` instead
- Rotate keys regularly from the developer portal
- Use separate keys for development and production
