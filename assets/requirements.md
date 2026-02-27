# Prerequisites

Before submitting an asset to this repository, we recommend you have the following information ready:

- Asset details
  - Token Name
  - Symbol
  - Contract Address
  - Decimals
- BNB or TWT to cover the **non-refundable** [processing fee](pr-fee.md)
- Logo
  - File Extension: `png` (Uppercase PNG is considered invalid)
  - File Name: `logo.png`
  - Size: 256px by 256px
  - Background: Preferably transparent
- Token information file
  - File Extension: `json` (Uppercase JSON is considered invalid)
  - File Name: `info.json`
  - Required fields:
    - `name`: name of the token
    - `type`: such as ERC20, BEP20, TRC20, TRC10, ...
    - `symbol`: the token symbol
    - `decimals`: number of decimal digits used in the amounts (e.g. 18 for ETH)
    - `description`: a few sentence summary of the token/project
    - `website`: project website
    - `explorer`: URL of the token explorer page
    - `id`: the id/contract/address of the token, same as the subfolder name
    - `links`: array with name/url pairs, for social media links, documentation, etc.
    - `tags`: assigning these tags to tokens helps place them on appropriate token menus and ensures your token is evaluated correctly in conditions.
- Checksum address (for ERC20 and BEP20 tokens)
  - Checksum addresses can be found on [Etherscan](https://etherscan.io) or by using [this tool](https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js)

---

## Listing Acceptance Guidelines

The following criteria will be considered before an asset is accepted into the repository.

> **Note:** Meeting all these criteria does not guarantee a submission will be accepted. The team reserves the right to reject projects deemed **spammy**, **high-risk**, **fraudulent**, or **otherwise low value**.

- **Website & Documentation** — A live website with a detailed white paper, including a clear roadmap, tokenomics, and use case.
- **Social Media & Support** — An active social media presence and a responsive support team. Accounts with fake followers or bots will be rejected.
- **Security Audit** — A completed full audit by a reputable security firm.
- **Originality** — No plagiarized content, names, or logos from other projects or companies. Tokens that mimic the name, symbol, or branding of established projects and stablecoins (e.g. USDT, USDC, DAI) will be rejected.
- **Price Tracking** — Token must be listed on CoinMarketCap for price tracking with detailed token information.
- **On-Chain Activity** — Minimum of 10,000 holders and 15,000 transactions. **Airdropped tokens are excluded from these counts.** This threshold may be adjusted on a case-by-case basis.
