# Prerequisites

Before submitting an asset to this repository, we recommend you have the following information handy:

- Asset details
  - Token Name
  - Symbol
  - Contract Address
  - Decimals
- BNB or TWT to cover the non-refundable [processing fee](pr-fee.md)
- Logo
  - File Extension: `png` (Uppercase PNG is considered invalid)
  - File Name: logo.png
  - Size: 256px by 256px
  - Background: Preferably transparent
- Token information file
  - File Extension: `json` (Uppercase JSON is considered invalid)
  - File Name: `info.json`
  - Required fields:
    - `name`: name of the token
    - `type`: such as ERC20, BEP2, BEP20, TRC20, TRC10, ...
    - `symbol`: the token symbol
    - `decimals`: number of decimal digits used in the amounts (e.g. 18 for ETH)
    - `description`: a few sentence summary of the token/project
    - `website`: project web site
    - `explorer`: URL of the token explorer page
    - `id`: the id/contract/address of the token, same as the subfolder name
    - `links`: array with name/url pairs, for social media links, documentation, etc.
    - `tags`: Assigning these tags to tokens helps place them on appropriate token menus and ensures your token is evaluated correctly in conditions.
- Checksum address (for ERC20 and BEP20 tokens)
  - Checksum addresses can be found on [Etherscan](https://etherscan.io) or by using [this tool](https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js)

## Listing Acceptance Guidelines

The following criteria will be considered before an asset is accepted into the repository. Note that meeting all these criteria does not guarantee a submission will be accepted, the team reserves the right to reject projects deemed spammy, fraudulent, or otherwise low value.

- Project has a website and a detailed white paper. A clear roadmap, tokenomics and use case is a must.
- Has a social media presence and support team. No fake followers or bots.
- A full token audit is completed by reputable security audit groups. Partial audits are subject for review.
- No plagiarized content from other projects or companies. Copying names or logos are strictly prohibited.
- Token should be listed on price tracking sites like CoinmarketCap
- Detailed Token Information
- Minimum 10,000 token holders and 15,000 transactions (**Airdrop tokens excluded**). This requirement is subject for review based on the project.
