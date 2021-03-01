# Optimizing Your Dapp for the Trust Wallet DApp Browser

Users of the Trust Wallet app enjoy the ease and experience of accessing their wallets, assets, and DApps all at the same time. This is made possible through the Trust Wallet DApp browser. Without needing to swap between apps, users can trade and browse in a fluid, uninterrupted experience.

Optimizing your DApp for the Trust Wallet browser is an integral part of making sure your project is up to scratch for listing. We recommend that you take a considerable amount of time to ensure fully that your app has at least the basic levels of optimization laid out below.

## Preparing your DApp for Trust Wallet

The Trust Wallet App currently offers the following functionality:

- A Web3 browser for interacting with decentralized applications
- A range of tools to provide a seamless connection between the DApps and the user on the Binance Smart Chain,  Ethereum network, ETC, CLO, Thunder, Tomo, and POA
- A fully optimized, integrated interface experience for mobile users

There are simple steps for blockchain developers to implement to take full advantage of these key features. Most are basic tips but none can be missed out.

## Metamask is a good place to start

Familiarity with MetaMask puts you off to a good start in terms of optimizing or developing Ethereum DApps for Trust Wallet. The web3 development process is the same when using MetaMask as a dev tool. It’s our recommended choice for DApp development and gives you a quick, golden rule to use: if it works well with MetaMask, it works well with Trust Wallet.

## Create a UI that Is mobile-friendly

It can’t be forgotten that Trust Wallet is accessed by two groups of people: those using the app on [Android](https://trustwallet.com/referral) and those using an iOS device (in [TestFlight](https://community.trustwallet.com/t/how-to-use-the-dapp-browser-on-ios/69390)). Your project must be developed to have a mobile-friendly UI as the Trust Wallet inbuilt browser is the primary point of access for the majority of our users.

iOS users require the latest build of any DApp to be uploaded to TestFlight before they can access it. UI/UX design needs to also be considered in your mobile design to provide the best in-wallet experience.

## Master Web3

Web3 is incredibly powerful for developing DApps and outlining their interactions with Ethereum nodes. The most up-to-date Web3 open-source [JavaScript library](https://github.com/ethers-io/ethers.js/) needs to be implemented for your DApp to be well optimized for the Trust Wallet browser.

All DApps should be [EIP1193](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md) (Ethereum Improvement Protocol 1193) compatible. This allows for a high degree of wallet interoperability when exposing an API through JavaScript objects in the Ethereum DApp.

If you have decided upon using MetaMask as your dev tool, do not forget their [decision](https://medium.com/metamask/no-longer-injecting-web3-js-4a899ad6e59e) to stop injecting the web.js API. This will seriously affect the degree of compatibility between your DApp and the Trust Wallet browser without proper planning.

## Test your DApp on both iOS and Android

Trust Wallet users access their wallets on both Android and iOS devices, so your app must be thoroughly tested for both operating systems. Issues may occur on one operating system but not on the other. 

This is one of the most important areas to optimize for but is often brushed over. Just open up your DApp with the Trust Wallet browser on both an iOS and Android device, then test the DApps functionalities such as sending or depositing tokens.

## Flag issues in the trust-web3-provider repo

It may be that you have issues with the TrustWeb3Provider while optimizing your DApp. The web3 javascript wrapper provider allows you to directly file any issues through GitHub. The Trust Wallet team will then provide support for any queries you have in due time.

## Implement deep links

There is no native support for Web3 in iOS or Android mobile browsers. Your DApp’s links must be [deep links](deeplinking/deeplinking.md) that combine numerous steps into one simple, easy click. Without them, users will need to follow tedious and long chains of links that greatly impact the user experience.
