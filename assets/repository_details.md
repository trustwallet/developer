## Repository Details

### Collections

The token repository contains the following collections:

1. [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md), ERC223 tokens on Ethereum compatible networks such as:
   [Ethereum (ETH)](https://ethereum.org/),
   [Ethereum Classic (ETC)](https://ethereumclassic.org/),
   [POA Network (POA)](https://poa.network/),
   [TomoChain (TOMO)](https://tomochain.com/),
   [GoChain (GO)](https://gochain.io/),
   [Wanchain (WAN)](https://wanchain.org/),
   [Callisto Network (CLO)](https://callisto.network/),
   [Thunder Token (TT)](https://thundercore.com/), etc.

2. [BEP2](https://github.com/binance-chain/BEPs/blob/master/BEP2.md) 
   [BEP8](https://github.com/binance-chain/BEPs/blob/master/BEP8.md)
   Binance DEX tokens (native marketplace on Binance Chain)

3. [TRC10, TRC20](https://developers.tron.network/docs/trc10-token) tokens on TRON blockchain

4. dApp images available in `Browser` section in Trust Wallet, and bookmarks icons. [Read requirements](#dapp-image-naming-requirements). Also you can submit dApp to our list [read more](#dapp-submission-and-listing-requirements).

5. Staking validators info, such as name, image, validator id, website url. [Supported staking coins](https://trustwallet.com/staking/). [Read requirements](#staking-validators-requirements).

6. Crypto price providers map: [CoinMarketCap](https://github.com/trustwallet/assets/blob/master/pricing/coinmarketcap/mapping.json)

7. Token and coin info

8. Smart contract deprecation/upgrade. [Read more](#update-and-remove-an-existing-asset).

### Repository structure

The `blockchains` folder contains several subfolders corresponding to blockchain networks, such as
`ethereum`, `binance`, etc.

The `assets` subfolder contains token folders named by smart contract address,
in [checksum format](#checksum-format) for Ethereum like networks.  
This folder should contain the `logo.png` image file, and the `info.json` file.

For other networks the address must be specified as it was originated on the chain, e.g TRON TRC10: `1002000`, TRON TRC20: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` etc. 

The `info` folder contains a `logo.png` that represents the coin image.

The `validators` folder contains folders: `assets` same structure as above and `list.json` information about validators. 

The `denylist.json` and `allowlist.json`, present in some chain folders like `ethereum` and `binance`, contain list of approved tokens and banned tokens.  Trust Wallet will never show denylisted tokens, and only allowlisted tokens are shown in the token search results.

#### Checksum format
For Ethereum like networks, contract folders must be named according to the so-called **Checksum Format**, with mixed lowercase and uppercase letters, such as `0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359`.
Non-checksum addresses (e.g. all lowercase) are considered invalid.

You can find the checksum address by searching on [etherscan.io](https://etherscan.io),
for example stablecoin [DAI](https://etherscan.io/address/0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359)
the checksum address is located at the top left corner of the page and has both uppercase and lowercase characters.
Or [convert Ethereum address to Checksum address](https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js). 

#### Layout

```
.
├── blockchains
│   └──ethereum
│   │   └──assets
│   │   │  └──0x0a2D9370cF74Da3FD3dF5d764e394Ca8205C50B6 // address folder
│   │   │     └──logo.png  // token logo
|   |   |     └──info.json  // optional token info
│   │   └──info
│   │   │  └──logo.png   // chain coin logo
|   |   │  └──info.json  // chain coin info
│   │   └──allowlist.json  // list of accepted tokens
│   │   └──denylist.json  // list of blocked tokens
|   |
|   └──binance
│   │   └──assets
│   │   │  └──ONE-5F9
│   │   │     └──logo.png
|   |   |     └──info.json
│   │   └──info
│   │      └──logo.png
|   └──tron
│   |  └──assets
│   |  │  └──1002000
│   |  │  |   └──logo.png
|   |  |  |   └──info.json
|   |  |  └──TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
|   |  |      └──logo.png
|   |  |      └──info.json
|   |  | 
│   |  └──info
│   |     └──logo.png
|   |     └──info.json 
|   |
|   └──cosmos
│   │   └──info
|   |   |  └──logo.png
|   |   |  └──info.json
|   |   |
│   │   └──validators
│   │   |  └──assets
|   |   |     └──cosmosvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn
|   |   |        └──logo.png
|   |   |
|   |   └──list.json
├── ...
```


## Contribution Guidelines

### Contribution Use Cases

#### Add new asset

1. Prepare asset, look at [image requirements](#image-requirements), [dapp requirements](#dapp-image-naming-requirements). 
2. Get familiar with our [folder structure](#repository-structure), it will give you an understanding where assets should be placed
3. [Add asset guide](#how-to-add-files)
4. Pay the merge [fee](#fee)

#### Update and remove an existing asset

Whenever you updating or deleting an asset on behalf of the asset owner or just found outdated information, please provide a link to the source saying about changes. That will help to speed up the review process.

This instruction wil be helpfull if you want to:

1. Update information about the smart contract

2. [Deprecate](#what-is-smart-contract-deprecation) or update contract address

Smart contract address update procedure:

1. Rename old contract address in coresponding coin folder to new contract e.g.:

1. Remove smart contract e.g.:

```bash
`rm -r ./blockchains/<COIN>/assets/<OLD_CONTRACT_ADDRESS>/`

`rm -r ./blockchains/ethereum/assets/0x19fFfd124CD9089E21026d10dA97f8cD6B442Bff/`
```
2. Commit changes and make a PR (pull request)

### Image Requirements
- File location: must be placed in the correct folder and subfolder within the [folder structure](#repository-structure).
- File extension: `png`. Uppercase `PNG` is considered invalid.
- File name：`logo.png`, all lowercase.
- Dimension: `256 x 256 pixels` or `512 x 512 pixels`.
- Background: Avoid transparency, set background as your brand color or white by default otherwise your token image wont look good on white/dark theme design.
- File size: maximum 100kB.  Tip: optimize image size, e.g. using simple drag-and-drop online service [tinypng](https://tinypng.com/).

### Info.json Contents

The `info.json` file contains basic information about the token/project.

It has following required fields:
- `name`: name of the token
- `type`: such as ERC20, BEP2, BEP20, TRC20, TRC10, ...
- `symbol`: the token symbol
- `decimals`: number of decimal digits used in the amounts (e.g. 18 for ETH)
- `description`: a few sentence summary of the token/project
- `website`: project web site
- `explorer`: URL of the token explorer page
- `id`: the id/contract/address of the token, same as the subfolder name

And optionally:
- `links`: Optional array with `name`/`url` pairs, for social media links, documentation, etc.
List of currently supported types:
`github`, `whitepaper`, `twitter`, `telegram`, `telegram_news`, `medium`, `discord`, `reddit`, `facebook`, `youtube`, `coinmarketcap`, `coingecko`, `blog`, `forum`, `docs`, `source_code`.
Note: the `socials` section is no longer used.

If in doubt about fields, look around / search in existing info.json files.

Sample `info.json`:

```
{
    "name": "Trust Wallet Token",
    "website": "https://trustwallet.com",
    "description": "Utility token to increase adoption of cryptocurrency.",
    "explorer": "https://explorer.binance.org/asset/TWT-8C2",
    "type": "BEP2",
    "symbol": "TWT",
    "decimals": 8,
    "status": "active",
    "id": "TWT-8C2"
    "links": [
        {
            "name": "github",
            "url": "https://github.com/trustwallet/"
        },
        {
            "name": "twitter",
            "url": "https://twitter.com/TrustWalletApp"
        },
        {
            "name": "reddit",
            "url": "https://reddit.com/r/trustapp"
        }
    ]
}
```

### dApp image naming requirements
- [Folder for upload](https://github.com/trustwallet/assets/tree/master/dapps)
- `<subdomain>.<domain_name>.png` e.g:
  https://app.compound.finance/ => `app.compound.finance.png`
  https://kyberswap.com/ => `kyberswap.com.png`

### dApp submission and listing requirements
- Upload [logo](https://github.com/trustwallet/assets/tree/master/dapps)
– Make sure you follow rules for image requirements.
- Integrate [deep linking](https://developer.trustwallet.com/deeplinking)
- Add [logo](https://trustwallet.com/press) as dApp supported wallet
- Test dApp inside Trust Wallet on iOS and Android devices
- [Submit form for review](https://docs.google.com/forms/d/e/1FAIpQLSd5p9L78zKXIiu9E5yFRPf5UkvsLZ7TbUDLFBRIi1qMd8Td4A/viewform)

### Staking validators requirements

1. Add validator basic information to the bottom of the list, see example for: [Kava](https://github.com/trustwallet/assets/tree/master/blockchains/kava/validators/list.json), [Cosmos](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos/validators/list.json), [Tezos](https://github.com/trustwallet/assets/tree/master/blockchains/tezos/validators/list.json), [Tron](https://github.com/trustwallet/assets/tree/master/blockchains/tron/validators/list.json), [Solana](https://github.com/trustwallet/assets/tree/master/blockchains/solana/validators/list.json), [Harmony](https://github.com/trustwallet/assets/tree/master/blockchains/harmony/validators/list.json)
2. Add validator logo image to `blockchains/<chain>/validators/assets/<validator_address>/logo.png` [see images requirements](#image-requirements)
3. Check chain [specific](#validators-specific-requirements) requirements.

### Common uploads

Uploading:
1. Ethereum ERC20 [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/assets)
2. Binance DEX BEP2, BEP8 token [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/binance/assets)
3. TRON TRC10, TRC20 token [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/tron/assets)
4. Add Cosmos validator image [](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos/validators)
5. Add Tezos validator info [](https://github.com/trustwallet/assets/tree/master/blockchains/tezos/validators/list.json)
6. Add Ethereum contract address to denylist [](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/denylist.json)
7. Add TRON TRC10 ID or TRC20 owner contract address to allowlist [](https://github.com/trustwallet/assets/tree/master/blockchains/tron/allowlist.json)


### How To Add Files
If you are not familiar with GitHub or Git, the process of adding new tokens may look complicated at first glance, but it consists of only a few steps, and is not very complicated.

#### Basics, Prerequisites

The assets repository is maintained in [GitHub](https://github.com), the largest hosting for open source projects.
You need a GitHub account to interact with it.

To do changes in the assets repository, you need to create a personal copy called a _fork_.

Once the changes are prepared inside the fork, you need to create a _pull request_ to the main repository.
Upon review the maintainers will accept your pull request, and the changes will be incorporated.

#### Adding files using GitHub web page
1. Proceed to [https://github.com/trustwallet/assets](https://github.com/trustwallet/assets)
2. Press on `Fork` in the top right corner, wait for process to complete.
   Note: if you already have a fork, it should be updated: easiest is to remove the fork and create it afresh.
3. Navigate to desire chain folder you want to add asset
4. Prepare on your local drive a folder corresponding to the token cortact.
5. Copy the logo image as `logo.png` into the folder (and optional info file).
6. Simply drag and drop the folder to active window
7. In `Commit changes` box:
  - `Add files via upload` add meaningfull comment what you adding to the repo
  - optional: In `Add an optional extended description` write a comment about upload
  - optional: adjust fork branch name
8. Click on `Propose changes`
9. Press on `Create pull request`

#### Adding files using GitHub Desktop application
The steps are similar to using the web page, but the desktop app has more control for overwriting the files, branching, pushing.

#### Adding files using command-line
1. Fork the repository to your own GitHub account
2. Clone fork and create new branch:

```bash
git clone git@github.com:YOUR_HANDLE/assets.git
cd assets
git checkout -b <branch_name>
```

3. Add asset to appropriate directory, the [folder strcture](#repository-structure) documentation will help you
4. Commit and push to your fork

```bash
git add -A
git commit -m “Add <token_name>”
git push origin <branch_name>
```

5. From your repo clone page make a new PR (pull request)

## Token Status

`active` - Token meets the standard requirements in circulation (number of holders and transactions).

`spam` - Token that is distribtued to a large number of recepients that have no inherent value or has been verified as a dishonest scheme or fraud.

`abandoned` - Token with very low activity (below 100 token transfers a year), migrated to mainnet or to a new contract.

No longer active
