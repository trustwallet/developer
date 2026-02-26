# Authentication

All requests to the Trust Wallet API are authenticated with an **API access ID** and an **HMAC-SHA256 signature** derived from your HMAC secret.

## Getting credentials

1. Sign in at [developer.trustwallet.com](https://developer.trustwallet.com)
2. Create an app, then create an API key inside it
3. Copy your **Access ID** (`twk_live_...`) and **HMAC Secret** — the secret is shown only once

## Configuring the CLI

```bash
twak init --api-key twk_live_your_access_id \
          --api-secret your_hmac_secret
```

Or via environment variables:

```bash
export TWAK_ACCESS_ID=twk_live_your_access_id
export TWAK_HMAC_SECRET=your_hmac_secret
```

## How HMAC signing works

Every API request is signed with HMAC-SHA256 over four fields joined by newlines:

```
METHOD\nPATH\nNONCE\nBODY
```

| Field | Description |
|-------|-------------|
| `METHOD` | HTTP method in uppercase — `GET`, `POST`, `DELETE` |
| `PATH` | URL path without query string — `/v1/wallet/balance` |
| `NONCE` | Unix timestamp in milliseconds — prevents replay attacks |
| `BODY` | JSON-encoded request body, or empty string for GET |

The resulting base64 signature is sent in the `X-TW-Signature` header alongside `X-TW-Access-Id` and `X-TW-Nonce`.

The CLI and TypeScript SDK handle signing automatically — you only need to understand this if you are making raw HTTP calls.

## Raw HTTP example

```bash
NONCE=$(date +%s%3N)
METHOD="GET"
PATH="/v1/wallet/balance"
BODY=""
SIGNATURE=$(echo -n "$METHOD\n$PATH\n$NONCE\n$BODY" \
  | openssl dgst -sha256 -hmac "$TWAK_HMAC_SECRET" -binary \
  | base64)

curl -X GET "https://api.trustwallet.com/v1/wallet/balance?\
  address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&chain=ethereum" \
  -H "X-TW-Access-Id: $TWAK_ACCESS_ID" \
  -H "X-TW-Nonce: $NONCE" \
  -H "X-TW-Signature: $SIGNATURE"
```

## Security best practices

- Never commit your HMAC secret to version control
- Add `.env` to `.gitignore`
- Rotate keys regularly from the developer portal
- Use separate keys for development and production
