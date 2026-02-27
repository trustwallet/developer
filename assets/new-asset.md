# Trust Wallet Assets Info

<center><img src='https://trustwallet.com/assets/images/media/assets/horizontal_blue.png' height="200"></center>

## Overview

The [Trust Wallet Token Repository](https://github.com/trustwallet/assets)
is a comprehensive, up-to-date collection of information about several thousand crypto tokens.
[Trust Wallet](https://trustwallet.com) uses token logos from this source, alongside a number of third-party projects.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token, a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _additions are welcome_,
primarily from token projects.

> **⚠️ NOTE**
>
> - All assets are [subject to review before](#disclaimer) being approved; so-called "meme tokens", spammy, or assets identified as fraudulent in nature will not be merged into the repository
> - Payment of the [Pull Request Fee](pr-fee.md) does not guarantee your asset will be approved. **Fee is non-refundable**.

---

## Contribution Checklist

This guide is for adding a logo for the following Trust Wallet supported blockchains:

- [Ethereum ERC20 token](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/assets)
- [BNB Chain (BSC) BEP20 token](https://github.com/trustwallet/assets/tree/master/blockchains/smartchain/assets)
- [Solana SPL token](https://github.com/trustwallet/assets/tree/master/blockchains/solana/assets)
- [TRON TRC10, TRC20 token](https://github.com/trustwallet/assets/tree/master/blockchains/tron/assets)

For **adding a token**:

- [ ] Ensure your asset meets our [requirements](requirements.md)
- [ ] Visit the [Assets web app](https://assets.trustwallet.com) (GitHub account required), and fill out the requested information
- [ ] Pay the [processing fee](pr-fee.md)

Adding a DApp logo or other type of asset? Check the [DApps](../dapps/listing-guide.md) section or [contribution guidelines](repository_details.md#contribution-guidelines).

Adding new chain? Please contact our Business Development team at **partnerships@trustwallet.com** to discuss this further.

---

### Adding new Assets using Asset App

This is a quick walkthrough on how to add your token using our Asset Web App.

Every Trust Wallet user can submit their token using our Web App. Before initiating a Pull Request or going further, please take a look at the requirements in our documentation: https://developer.trustwallet.com/assets/requirements and make sure you follow the requirements!

The steps for adding a new token through Asset App.

1. Access the **assets web app** via this link: [https://assets.trustwallet.com](https://assets.trustwallet.com)

   ![](/media/assetapp.png)

2. Log in to your **GitHub account**.

   ![](/media/gitassetapp.png)

3. If you are logging in for the first time, you will need to authorize the Assets app to access your GitHub account

4. Upload the logo file.

5. Fill out the token contract.
   **Note**: For some tokens like (ERC20) some fields are auto-filled (symbol, decimals, etc.).

6. Fill in additional fields, symbols, decimals, descriptions, links, etc.

7. Press the **Check** button.

8. If all is **OK**, press the Create Pull Request button. A PR will be created.

---

### Pull Request Fee

Due to the increasing number of pull requests and the proportional checking and merging effort, a modest fee is required for processing each pull request, payable in cryptocurrency. Follow the instructions in the pull request to complete the fee payment.

A fee of 500 TWT or 2.5 BNB is required per Pull Request. Payment details will be provided by the merge-fee-bot. Before submitting, please review the [listing requirements](https://developer.trustwallet.com/assets/requirements).

**Important**: The fee is non-refundable and does not guarantee approval. All submissions are subject to due diligence by the maintainers.

For more details, see the [PR fee page](https://developer.trustwallet.com/assets/pr-fee) and the [fee FAQ](pr-fee.md)

---

## Disclaimer

The Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with any of the projects listed.

The Trust Wallet team will reject projects that are deemed to be scams, high risk, stablecoin-mimicking, or fraudulent after careful review. The Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors deemed relevant.

Additionally, spam-like behavior, including but not limited to the mass distribution of tokens to random addresses, will result in the asset being flagged as spam and possible removal from the repository.