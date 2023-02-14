# Trust Wallet Assets Info

<center><img src='https://trustwallet.com/assets/images/media/assets/horizontal_blue.png' height="200"></center>

## Overview

The [Trust Wallet Token Repository](https://github.com/trustwallet/assets)
is a comprehensive, up-to-date collection of information about several thousands of crypto tokens.
[Trust Wallet](https://trustwallet.com) uses token logos from this source, alongside a number of third-party projects.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _additions are welcome_,
primarily from token projects.

<table width="100%">
  <thead>
    <tr>
      <th align="center">
        ⚠️ NOTE
      </th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <td>
        <ul>
          <li>All assets are <a href="#disclaimer">subject to review before</a> being approved; so-called "meme tokens", spammy, or assets identified as fradulent in nature will not be merged into the repository</li>
          <li>Payment of the <a href="pr-fee.md">Pull Request Fee</a> does not guarantee your asset will be approved. Fee is non-refundable</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Contribution Checklist

This guide is for adding a logo for the following Trust Wallet supported blockchains:

- [Ethereum ERC20 token](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/assets)
- [Binance BEP2 token](https://github.com/trustwallet/assets/tree/master/blockchains/binance/assets)
- [Smart Chain BEP20 token](https://github.com/trustwallet/assets/tree/master/blockchains/smartchain/assets)
- [TRON TRC10, TRC20 token](https://github.com/trustwallet/assets/tree/master/blockchains/tron/assets)

For **adding an token**:

- [ ] Ensure your asset meets our [reqirements](requirements.md)
- [ ] Visit the [Assets web app](https://assets.trustwallet.com) (GitHub account required), and fill out the requested information
- [ ] Pay the [processing fee](pr-fee.md)

Adding a DApp logo or other type of asset? Check the [DApps](../dapps/listing-guide.md) section or [contribution guidelines](repository_details.md#contribution-guidelines).

### Adding new Assets using Asset App

This is a quick walkthrough on how to add your token using our Asset Web App.

Every Trust Wallet user can submit his token using our Web App. Before initiating a Pull Request or going further, please take a look at the requirements in our documentation: https://developer.trustwallet.com/assets/requirements and make sure you follow the requirements!

The steps for adding a new token through Asset App.

- Access the **assets web app** via this link: https://assets.trustwallet.com
  ![](/media/assetapp.png)

- Log in to your **GitHub account**. If you have not yet logged in (using the current browser), it is compulsory to log in to your GitHub account.
  ![](/media/gitassetapp.png)

- If you are logging in for the first time you will need to authorize the Assets app to access your GitHub account
- Upload the logo file.
- Fill out the token contract.
  Note: For some tokens like (ERC20) some fields are auto-filled (symbol, decimals, etc.).
- Fill in additional fields, symbols, decimals, descriptions, links, etc.
- Press the \*\*Check button.
- If all is **OK**, press the Create Pull Request button. A PR will be created.

### Fee

Due to an increasing number of pull request (and proportional checking & merging effort),
a modest fee is required for processing a pull request, payable in cryptocurrency.
Follow the instructions in the pull request for completing the fee payment.

A fee of **500TWT or 5BNB** is required for each Pull Request, you will see the message from the merge-fee-bot with details about the payment. \*\*Make sure to double-check the https://developer.trustwallet.com/assets/requirements, to minimize the risk of your PR being rejected.

For more details about the payment fee for your assets, see https://developer.trustwallet.com/assets/pr-fee
See also the [fee FAQ](pr-fee.md)

## Disclaimer

Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Trust Wallet team will reject projects that are deemed as scam or fraudulent after careful review.
Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.

Additionally, spam-like behavior, including but not limited to mass distribution of tokens to random addresses will result in the asset being flagged as spam and possible removal from the repository.
