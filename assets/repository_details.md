## Repository Details

### Collections

The token repository contains the following collections:

1. [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) tokens on Ethereum-compatible networks, including:
   - [Ethereum (ETH)](https://ethereum.org/)
   - [BNB Chain (BSC)](https://www.bnbchain.org)
   - [Base](https://www.base.org/)
   - [Arbitrum](https://arbitrum.io/)
   - [Avalanche C-Chain](https://www.avax.network/)
   - [Optimism](https://www.optimism.io/)
   - [Polygon](https://polygon.technology/)
   - [Celo](https://celo.org/)
   - [Gnosis](https://www.gnosis.io/)
   - [Monad](https://www.monad.xyz/)
   - [Plasma](https://www.plasma.to/)
   - [Sonic](https://www.soniclabs.com/)
   - [Linea](https://linea.build)
   - [MegaETH](https://www.megaeth.com/)
   - [Moonbeam](https://moonbeam.network/)
   - [Ronin](https://roninchain.com/)
   - [Mantle](https://mantle.xyz/)
   - [Manta Pacific](https://manta.network/)
   - [Acala EVM](https://acala.network/)
   - [Blast](https://blast.io/)
   - [Ethereum Classic (ETC)](https://ethereumclassic.org/)
   - [POA Network (POA)](https://poa.network/)
   - [TomoChain (TOMO)](https://tomochain.com/)
   - [GoChain (GO)](https://gochain.io/)
   - [Wanchain (WAN)](https://wanchain.org/)
   - [Callisto Network (CLO)](https://callisto.network/)
   - [Thunder Token (TT)](https://thundercore.com/)
   - and other EVM-compatible networks
2. Tokens on TRON blockchain [(TRC10, TRC20)](https://developers.tron.network/docs/trc10-token)
3. Tokens on Solana blockchain [(SPL)](https://solana.com/)
4. Tokens on TON blockchain [(JETTONS)](https://ton.org/)
5. Other information for coins/tokens
6. DApp logos displayed in `Browser` section of the Trust Wallet app, and bookmarks icons
   - [Image naming requirements](#dapp-image-naming-requirements)
   - [Request listing in Trust Wallet DApp Browser](#dapp-submission-and-listing-requirements)
7. Staking validators information, such as name: `image`, `validator_id`, `website_url`
   - [Supported staking coins](https://trustwallet.com/staking/)
   - [Read requirements](#staking-validators-requirements).
8. Smart contract deprecation/upgrade. [Read more](#update-and-remove-an-existing-asset)

### Repository structure

The `blockchains` folder contains several subfolders corresponding to blockchain networks, such as
`ethereum`, `smartchain`, etc.

The `assets` subfolder contains token folders named by smart contract address,
in [checksum format](#checksum-format) for Ethereum-like networks.  
This folder should contain the `logo.png` image file, and the `info.json` file.

For other networks the address must be specified as it was originated on the chain, e.g. TRON TRC10: `1002000`, TRON TRC20: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` etc.

The `info` folder contains a `logo.png` that represents the coin image.

The `validators` folder contains folders: `assets` same structure as above and `list.json` information about validators.

#### Checksum format

For Ethereum-like networks, contract folders must be named according to the **Checksum Format**, with mixed lowercase and uppercase letters, such as `0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359`.
Non-checksum addresses (e.g. all lowercase) are considered invalid.

You can find the checksum address by searching on [etherscan.io](https://etherscan.io), for example stablecoin [DAI](https://etherscan.io/address/0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359) the checksum address is located at the top left corner of the page and has both uppercase and lowercase characters.

#### Layout

```
.
├── blockchains
│   └──ethereum
│   │   └──assets
│   │   │  └──0x0a2D9370cF74Da3FD3dF5d764e394Ca8205C50B6 // address folder
│   │   │     └──logo.png  // token logo
|   |   |     └──info.json  // token info
│   │   └──info
│   │      └──logo.png   // chain coin logo
|   |      └──info.json  // chain coin info
|   |
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

1. Prepare asset, look at [image requirements](#image-requirements), [dapp requirements](#dapp-image-naming-requirements), [staking validator requirements](./staking-validator.md).
2. Get familiar with our [folder structure](#repository-structure), it will give you an understanding where assets should be placed
3. [Add asset guide](#how-to-add-files)
4. Pay the merge [fee](#fee)

#### Update and remove an existing asset

When updating or deprecating an asset — whether on behalf of the asset owner or because you found outdated information — please provide a link to a source confirming the changes. This helps speed up the review process.

This instruction applies if you want to [deprecate](#what-is-smart-contract-deprecation) an asset:

1. Create a new branch, navigate to the old contract's folder, and update the `status` field in `info.json` to `abandoned`:

```
{
    "name": "Sample Token",
    "website": "https://sample.website",
    "description": "This is an example",
    "explorer": "https://etherscan.io/token/<OLD_CONTRACT_ADDRESS>",
    "type": "ERC20",
    "symbol": "SAMPLE",
    "decimals": 18,
    "status": "abandoned",
    "id": "<OLD_CONTRACT_ADDRESS>"
}
```

2. Remove the logo file from the old contract's folder: 

```
rm ./blockchains/<COIN>/assets/<OLD_CONTRACT_ADDRESS>/logo.png
```

3. Create a new directory for the new contract address with its `info.json` and `logo`:

```
./blockchains/<COIN>/assets/<NEW_CONTRACT_ADDRESS>/info.json
./blockchains/<COIN>/assets/<NEW_CONTRACT_ADDRESS>/logo.png
```

4. Commit your changes and submit a Pull Request

Here are some examples:
- [Ethereum](https://github.com/trustwallet/assets/blob/67d328b3d1ba646f402baf46c4cd254a048fb7f0/blockchains/ethereum/assets/0x57e299eE8F1C5A92A9Ed54F934ACC7FF5F159699/info.json#L8)
- [BNB Chain (BSC)](https://github.com/trustwallet/assets/blob/67d328b3d1ba646f402baf46c4cd254a048fb7f0/blockchains/smartchain/assets/0x611DFe661C82B858087AB5b16e3Cb082552df4F3/info.json#L8)
- [Solana](https://github.com/trustwallet/assets/blob/67d328b3d1ba646f402baf46c4cd254a048fb7f0/blockchains/solana/assets/zebeczgi5fSEtbpfQKVZKCJ3WgYXxjkMUkNNx7fLKAF/info.json#L9)
- [Tron](https://github.com/trustwallet/assets/blob/67d328b3d1ba646f402baf46c4cd254a048fb7f0/blockchains/tron/assets/1001411/info.json#L8)

### Image Requirements

- **File location**: must be placed in the correct folder and subfolder within the [folder structure](#repository-structure).
- **File name**: `logo.png`, all lowercase. Extension: `png` (uppercase `PNG` is considered invalid).
- **Dimension**: recommended `256 x 256 pixels`, maximum `512 x 512 pixels`, aspect ratio should be 1:1.
- **File size**: maximum 100kB.
- **Edges and background**:
  - Logos are displayed cropped to a circular mask, a circle fitting in the square shape. Thus the corners of the logo image will not be visible. The logo should fit in the circle, but also fill it as much as possible, i.e. there should not be unused spaces on the sides/top/bottom.
  - Logos should look OK with white/lightgray background as well as on black/darkgray background (night mode). For dark themed logos use white contour lines to make sure they stand out on dark background as well.
  - Avoid using transparency inside the logo, as the color beneath the transparent layer is changing (light or dark). Use transparency only outside of the logo.
  - It is recommended to use the [Assets web app](https://assets.trustwallet.com) ([guide](https://community.trustwallet.com/t/how-to-submit-a-token-logo-using-assets-app/82957)), as it shows a preview of the logo with both light and dark background and circular cropping.

### Info.json Contents

The `info.json` file contains basic information about the token/project.

It has the following required fields:

- `name`: name of the token
- `type`: such as ERC20, BEP2, BEP20, TRC20, TRC10, ...
- `symbol`: the token symbol
- `decimals`: number of decimal digits used in the amounts (e.g. 18 for ETH)
- `description`: a few sentence summary of the token/project
- `website`: project web site
- `explorer`: URL of the token explorer page
- `status`: `"active"`
- `id`: the id/contract/address of the token, same as the subfolder name
- `links`: Array with `name`/`url` pairs, for social media links, documentation, etc.
  List of currently supported types:
  `github`, `whitepaper`, `x`, `telegram`, `telegram_news`, `medium`, `discord`, `reddit`, `facebook`, `youtube`, `coinmarketcap`, `coingecko`, `blog`, `forum`, `docs`, `source_code`.
- `tags`: Assigning these tags to tokens helps place them on appropriate token menus and ensures your token is evaluated correctly in conditions.
  List of currently supported tags:
  `stablecoin`, `wrapped`, `synthetics`, `nft`, `governance`, `defi`, `staking`, `staking-native`, `privacy`, `nsfw`, `binance-peg`, `deflationary`, `memes`, `gamefi`.

If in doubt about fields, look around / search in existing info.json files.

Sample `info.json`:

```json
{
    "name": "Trust Wallet",
    "website": "https://trustwallet.com",
    "description": "Utility token to increase adoption of cryptocurrency.",
    "explorer": "https://bscscan.com/token/0x4B0F1812e5Df2A09796481Ff14017e6005508003",
    "research": "https://research.binance.com/en/projects/trustwallet",
    "type": "BEP20",
    "symbol": "TWT",
    "decimals": 18,
    "status": "active",
    "id": "0x4B0F1812e5Df2A09796481Ff14017e6005508003",
    "links": [
        {
            "name": "github",
            "url": "https://github.com/trustwallet/"
        },
        {
            "name": "x",
            "url": "https://x.com/TrustWalletApp"
        },
        {
            "name": "reddit",
            "url": "https://reddit.com/r/trustapp"
        }
    ],
    "tags": [
        "governance"
    ]
}
```

### dApp image naming requirements

- [Folder for upload](https://github.com/trustwallet/assets/tree/master/dapps)
- `<subdomain>.<domain_name>.png` e.g:
  https://app.compound.finance/ => `app.compound.finance.png`
  https://kyberswap.com/ => `kyberswap.com.png`

### dApp submission and listing requirements

- Please refer to and follow our [dApp listing guide](../dapps/listing-guide.md).

### Common Uploads

1. Ethereum ERC20 [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/assets)
2. TRON TRC10, TRC20 token [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/tron/assets)
3. [Add Cosmos validator image](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos/validators)
4. [Add Tezos validator info](https://github.com/trustwallet/assets/tree/master/blockchains/tezos/validators/list.json)

### How To Add Files

If you are not familiar with GitHub or Git, the process of adding new tokens may look complicated at first glance, but it consists of only a few steps, and is not very complicated.

#### Basics, Prerequisites

The assets repository is maintained in [GitHub](https://github.com), the largest hosting for open source projects.
You need a GitHub account to interact with it.

To do changes in the assets repository, you need to create a personal copy called a _fork_.

Once the changes are prepared inside the fork, you need to create a _pull request_ to the main repository.
Upon review the maintainers will accept your pull request, and the changes will be incorporated.

#### Adding files using Assets App

A new token can be submitted using the Assets application.
See also: https://community.trustwallet.com/t/how-to-submit-a-token-logo-using-assets-app/82957

1. Open the assets web app: [https://assets.trustwallet.com](https://assets.trustwallet.com)
2. Press the Log in with GitHub button. If not yet logged in (in the current browser session), you need to log in to GitHub
3. First time you will need to authorize the Assets app to access your GitHub account.
4. Upload the logo file.
5. Fill in the token contract. For some tokens (ERC20) some fields are auto-filled (symbol, decimals, etc.).
6. Fill in additional fields, symbol, decimals, description, links, etc.
7. Press the Check button.
8. If all is OK, press the Create Pull Request button. A PR will be created.

## Token Status

| Status | Description |
|--------|-------------|
| `active` | Token meets the standard requirements in circulation (number of holders and transactions). |
| `spam` | Token that is distributed to a large number of recipients that have no inherent value or has been verified as a dishonest scheme or fraud. |
| `abandoned` | Token with very low activity (below 100 token transfers a year), migrated to mainnet or to a new contract. |