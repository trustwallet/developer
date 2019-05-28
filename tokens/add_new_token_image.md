# Trust Wallet Token Images

This repository (repo) source of images for ERC20 tokens on Ethreum compatible networks supported by Trust Wallet such as [Ethreum (ETC)](https://www.ethereum.org/), [Ethereum Classic (ETC)](https://ethereumclassic.org/), [POA Network (POA)](https://poa.network/), [TomoChain (TOMO)](https://tomochain.com/), [GoChain (GO)](https://gochain.io/), [Wanchain (WAN)](https://wanchain.org/), [Callisto Network (CLO)](https://callisto.network/), [Thunder Token (TT)](https://www.thundercore.com/), [coins](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) integrated in [Wallet Core](https://developer.trustwallet.com/wallet-core) and dApp images available in Browser section with in Trust Wallet and at https://dapps.trustwallet.com

<center><img src='https://raw.githubusercontent.com/TrustWallet/tokens/master/tutorial/trust-wallet.png'></center>

Directory of token images for ERC20 contracts

# Add custom image:
## Image Requirements
- format: `png`. Format `PNG` considered not valid.
- name：name of the file in lowercase fromat
- - For tokens: `contract_address.png`. Ex: `0xd26114cd6ee289accf82350c8d8487fedb8a0c07.png`
- - For coins: `slip44.png`. Ex: Bitcoin is `0.png`
- size: `256px by 256px`
- background: preferably transparant
- use simple drag and drop online servise [tinypng](https://tinypng.com/) to optimize image size


## How To Add
1) Press on `Fork` in the top right corner, wait for process to complite
2) Navigate to `tokens` (or `coins`, if you're adding a coin icon) folder on your own fork
3) Press on `Upload File` in the top right corner
4) Choose file, make sure it follows requirments above
5) Press on `Commitchanges`
6) Press on `New pull request` on your own fork page and submit it by pressing on `Create pull request`!
7) Add short description including name and token symbol in a header field
8) Press on `Create pull request`
9) Once tests complited and verifies your image follows requirments maintainer will merge it and in 5-10 minutes token became searchable and will have image insted of plain logo in Trust Wallet

## How to generate address for BEP2 (Binance DEX based) token
1) Grap `symbol` property for desired token https://dex.binance.org/api/v1/tokens?limit=1000
2) [Generate address based on BEP2 token symbol](https://repl.it/@TrustWallet/generatetrustwalletaddressforbep2token)
3) Use generated address and uplaod an image

## How to generate address for TRC10 (TRON based) token
1) Grap `ID` for desired TRC10 token from the list https://tronscan.org/#/tokens/list (sort by TRC10)
2) [Generate address based on TRC10 token ID](https://repl.it/@TrustWallet/generatetrustwalletaddressforbep2token) for TRC10 token ID
3) Use generated address and uplaod an image

### Youtube: Upload ERC20 Token Image to Trust Wallet:

<center>
<video alignwidth="720" height="480" controls>
  <source src="./tutorial/upload-token-image.mov" type="video/mp4">
</video>
</center>

[![Upload ERC20 Token Image to Trust Wallet](https://img.youtube.com/vi/EFrJT_b11m4/0.jpg)](https://www.youtube.com/watch?v=EFrJT_b11m4)


## FAQ
### Why do I still see old logo in Trust Wallet after uploaded new one  
Both clients, Android and iOS keep old image cache for up to 7 days, in order to reflect changes immediately, reinstall Trust Wallet application. But as always, make sure you have backup to all your wallets.

## How to Use It? (For Developers)
Base URL:
```js
https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/<contract_address>.png
```
Example:
```js
https://trustwalletapp.com/images/tokens/0x006bea43baa3f7a6f765f14f10a1a1b08334ef45.png
https://raw.githubusercontent.com/TrustWallet/tokens/master/tokens/0x006bea43baa3f7a6f765f14f10a1a1b08334ef45.png
```

## Used in Applications
- [Trust Wallet](https://trustwallet.com) - [iOS](https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409) and [Android](https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp)
- [0x Tracker](https://0xtracker.com) - The 0x Protocol Trade Explorer and news aggregator.

