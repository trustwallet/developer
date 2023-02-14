# Optimizing Your Dapp for the Trust Wallet

Users of the Trust Wallet app enjoy the ease and experience of accessing their wallets, assets, and DApps all at the same time. This is made possible through the Trust Wallet DApp browser and WalletConnect. Without needing to swap between apps, users can trade and browse in a fluid, uninterrupted experience.

Optimizing your DApp for the Trust Wallet is an integral part of making sure your project is up to scratch for listing. We recommend that you take a considerable amount of time to ensure fully that your app has at least the basic levels of optimization laid out below.

## Preparing your DApp for Trust Wallet

The Trust Wallet App currently offers the following functionality:

- A Web3 browser for interacting with decentralized applications
- A range of tools to provide a seamless connection between the DApps and the user on the Ethereum, Solana, Cosmos, BNB Smart Chain, Polygon, Osmosis, EVMOS, Aptos and many more EVM and Cosmos compatible networks.
- A fully optimized, integrated interface experience for mobile users

There are simple steps for blockchain developers to implement to take full advantage of these key features. Most are basic tips but none can be missed out.

## Metamask/Phantom/Keplr/Petra is a good place to start

Familiarity with MetaMask interaction for Ethereum DApps, Phantom for Solana, Keplr for Cosmos or Petra for Aptos puts you off to a good start in terms of optimizing or developing a DApps for Trust Wallet. The web3 development process is the same when using MetaMask/Phantom/Keplr/Petra as a dev tool. It’s our recommended choice for DApp development and gives you a quick, golden rule to use: if it works well with MetaMask, Phantom, Keplr or Petra it works well with Trust Wallet.

## Create a UI that Is mobile-friendly

It can’t be forgotten that Trust Wallet is accessed by two groups of people: those using the app on [Android](https://trustwallet.com/referral) and those using an iOS device. Your project must be developed to have a mobile-friendly UI as the Trust Wallet inbuilt browser is the primary point of access for the majority of our users.

iOS users require the latest build from Apple App Store. UI/UX design needs to also be considered in your mobile design to provide the best in-wallet experience.

## Master Web3

All Ethereum DApps should be [EIP1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md) (Ethereum Improvement Protocol 1193) compatible. This allows for a high degree of wallet interoperability when exposing an API through JavaScript objects in the Ethereum DApp.

If you have decided upon using MetaMask as your dev tool, do not forget their [Provider Migration Guide](https://docs.metamask.io/guide/provider-migration.html). This will seriously affect the degree of compatibility between your DApp and the Trust Wallet browser without proper planning.

For Solana integration the best way would be to use the official [Wallet Adapter](https://github.com/solana-labs/wallet-adapter) which supports Trust Wallet and include it as the connection point to your DApp.

For Cosmos you can refer to the official [Keplr guide](https://docs.keplr.app/api/), just make sure to use `window.trustwallet.cosmos` instead of `window.keplr`.

For Aptos please follow the official [Petra guide](https://petra.app/docs/sending-a-transaction). `window.trustwallet.aptos` is also preferred over `window.aptos`, although both will work.

Consider including an explicit Trust Wallet icon or button in your DApp. This will help Trust Wallet users connect to your DApp for the first time.

Recommended steps to improve the user experience when a user clicks or taps the Trust Wallet icon:

1. Check [How to Identify Trust Provider](https://github.com/trustwallet/trust-web3-provider#how-to-identify-trust-provider) guide.
2. Verify that the DApp is open in desktop browsers or no `window.trustwallet.(ethereum/solana/cosmos/aptos)` -> Display the WalletConnect pairing popup
3. Verify that the DApp is open in the Trust Wallet DApp browser -> Access the `window.trustwallet.(ethereum/solana/cosmos/aptos)` directly.

## Test your DApp on both iOS and Android

Trust Wallet users access their wallets on both Android and iOS devices, so your app must be thoroughly tested for both operating systems. Issues may occur on one operating system but not on the other.

This is one of the most important areas to optimize for but is often brushed over. Just open up your DApp with the Trust Wallet browser on both an iOS and Android device, then test the DApps functionalities such as sending or depositing tokens.

## Flag issues in the trust-web3-provider repo

It may be that you have issues with the TrustWeb3Provider while optimizing your DApp. The web3 javascript wrapper provider allows you to directly file any issues through [GitHub](https://github.com/trustwallet/trust-web3-provider). The Trust Wallet team will then provide support for any queries you have in due time.

## Implement deep links

There is no native support for Web3 in iOS or Android mobile browsers. Your DApp’s links must be [deep links](deeplinking/deeplinking.md) that combine numerous steps into one simple, easy click. Without them, users will need to follow tedious and long chains of links that greatly impact the user experience.

## References

Web3 is incredibly powerful for developing DApps and outlining their interactions with Ethereum or Solana nodes. The most up-to-date Web3 open-source [Ethereum JavaScript library](https://github.com/ethers-io/ethers.js/) or [Solana JavaScript library](https://solana-labs.github.io/solana-web3.js/modules.html) needs to be implemented for your DApp to be well optimized for the Trust Wallet browser.
