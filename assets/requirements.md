# Prerequisites
Before submitting an asset to this repository, we recommend you have the following information handy:
 - Asset details
    - Token Name
    - Symbol
    - Contract Address
    - Decimals
 - BNB or TWT to cover the non-refundable [processing fee](pr-fee.md)
 - Logo
    - File Extension:  `png` (Uppercase  PNG  is considered invalid)
    - File Name: logo.png
    - Size:  256px by 256px
    - Background: Preferably transparent
 - Token information file
    - File Extension:  `json` (Uppercase  JSON  is considered invalid)
    - File Name: `info.json`
    - Sample:
```
{
    "name": "BUSD Token",
    "website": "https://paxos.com/busd",
    "description": "BUSD is a stablecoin issued by Paxos in partnership with Binance.",
    "explorer": "https://bscscan.com/token/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    "type": "BEP20",
    "symbol": "BUSD",
    "decimals": 18,
    "status": "active",
    "id": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    "links": [
        {
            "name": "github",
            "url": "https://github.com/binance-chain/"
        },
        {
            "name": "twitter",
            "url": "https://twitter.com/binance_dex"
        },
        {
            "name": "blog",
            "url": "https://binance.org/en/blog/"
        },
        {
            "name": "telegram",
            "url": "https://t.me/BinanceDEXchange"
        },
        {
            "name": "coinmarketcap",
            "url": "https://coinmarketcap.com/currencies/binance-usd/"
        },
        {
            "name": "coingecko",
            "url": "https://coingecko.com/en/coins/binance-usd/"
        }
    ]
}
```
 - Checksum address (for ERC20 and BEP20 tokens)
   - Checksum addresses can be found on [Etherescan](https://etherscan.io) or by using [this tool](https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js)

## Supported Blockchains
Presently, Trust Wallet supports assets running on the following blockchains
This guide is for adding a logo for  Trust Wallet 646 supported blockchains:

 - [Ethereum ERC20 token](assets/blockchains/ethereum/assets)
 - [Binance BEP2 token](assets/blockchains/binance/assets)
 - [Smart Chain BEP20 token](assets/blockchains/smartchain/assets)
 - [TRON TRC10, TRC20 token](assets/blockchains/tron/assets)

## Listing Acceptance Guidelines
The following criteria will be considered before an asset is accepted into the repository. Note that meeting all these criteria does not guarantee a submission will be accepted, the team reserves the right to reject projects deemed spammy, fraudulent, or otherwise low value.
 - Project has a website and a detailed white paper. A clear roadmap, tokenomics and use case is a must.
 - Has a social media presence and support team. No fake followers or bots.
 - A full token audit is completed by reputable security audit groups. Partial audits are subject for review.
 - No plagiarized content from other projects or companies. Copying names or logos are strictly prohibited.
 - Token should be listed on price tracking sites like CoinmarketCap
 - Detailed Token Information
 - Minimum 5,000 token holders and 10,000 transactions (**Airdrop tokens excluded**). This requirement is subject for review based on the project.
