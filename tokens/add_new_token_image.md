# Trust Wallet Token Images

Token repository [https://github.com/TrustWallet/tokens](https://github.com/TrustWallet/tokens) (repo) source of images for:

1. [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) tokens on Ethereum compatible networks supported by Trust Wallet such as:
  - [Ethereum (ETH)](https://ethereum.org/)
  - [Ethereum Classic (ETC)](https://ethereumclassic.org/)
  - [POA Network (POA)](https://poa.network/)
  - [TomoChain (TOMO)](https://tomochain.com/)
  - [GoChain (GO)](https://gochain.io/)
  - [Wanchain (WAN)](https://wanchain.org/)
  - [Callisto Network (CLO)](https://callisto.network/)
  - [Thunder Token (TT)](https://thundercore.com/)

2. [BEP2](https://github.com/binance-chain/BEPs/blob/master/BEP2.md) tokens on Binance Chain

3. [TRC10](https://developer.trustwallet.com/add_new_token_image#how-to-generate-address-for-trc10-tron-based-token) tokens on TRON blockchain

4. [coins](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) integrated in [Wallet Core](https://developer.trustwallet.com/wallet-core). [Folder for upload](https://github.com/TrustWallet/tokens/tree/master/coins)

5. dApp images available in `Browser` section in Trust Wallet and at https://dapps.trustwallet.com. [Folder for upload](https://github.com/TrustWallet/tokens/tree/master/dapps) 

<center><img src='https://raw.githubusercontent.com/TrustWallet/tokens/master/tutorial/trust-wallet.png'></center>

# Add custom image:
## Image Requirements
- file extension: `png`. Uppercase `PNG` considered invalid.
- name：file name requirements for: 
  - **ERC20**:
    - `contract_address.png` in lowercase register. Ex: `0xd26114cd6ee289accf82350c8d8487fedb8a0c07.png`
  - **BEP2**: Read how to generate a BEP2 compatible address with Trust Wallet [here](https://developer.trustwallet.com/add_new_token_image#how-to-generate-address-for-bep2-binance-dex-based-token)
  - **TRC10**: Read how to generate a TRC10 compatible address with Trust Wallet [here](https://developer.trustwallet.com/add_new_token_image#how-to-generate-address-for-trc10-tron-based-token)
  - **coin**: `slip44Index.png` from [SLIP44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) list. Ex: Bitcoin is `0.png`
- size: `256px by 256px`
- background: preferably transparent
- use simple drag and drop online service [tinypng](https://tinypng.com/) to optimize image size


## How To Add Image
1. [Follow image requirements](https://developer.trustwallet.com/add_new_token_image#image-requirements)
2. Proceed to [https://github.com/TrustWallet/tokens](https://github.com/TrustWallet/tokens)
3. Press on `Fork` in the top right corner, wait for process to complete
4. Navigate to `tokens` (or `coins`, if you're adding a coin icon) folder on your own fork
5. Press on `Upload File` in the top right corner
6. Choose file, make sure it follows requirements above
7. Press on `Commit changes`
8. Press on `New pull request` on your own fork page and submit it by pressing on `Create pull request`!
9. Add short description including name and token symbol in a header field
10. Press on `Create pull request`
11. Once tests have completed and verified that your image follows all requirements, a maintainer will merge it. In 5-10 minutes your token will have the updated image instead of plain logo in Trust Wallet

## How to generate address for BEP2 (Binance DEX based) token
1. Grab `symbol` property for desired token https://dex.binance.org/api/v1/tokens?limit=1000
2. [Generate address based on BEP2 token symbol](https://repl.it/@TrustWallet/generatetrustwalletaddressforbep2token)
3. You can use images from here https://explorer.binance.org/assets
4. Use generated address and [upload](https://developer.trustwallet.com/add_new_token_image#how-to-add) an image

## How to generate address for TRC10 (TRON based) token
1. Grab `ID` for desired TRC10 token from the list https://tronscan.org/#/tokens/list (sort by TRC10)
2. [Generate address based on TRC10 token ID](https://repl.it/@TrustWallet/generatetrustwalletaddressfortrc10token) for TRC10 token ID
3. Use generated address and [upload](https://developer.trustwallet.com/add_new_token_image#how-to-add) an image

### YouTube: Upload ERC20 Token Image to Trust Wallet:

<center>
<video alignwidth="720" height="480" controls>
  <source src="./tutorial/upload-token-image.mov" type="video/mp4">
</video>
</center>

[![Upload ERC20 Token Image to Trust Wallet](https://img.youtube.com/vi/EFrJT_b11m4/0.jpg)](https://www.youtube.com/watch?v=EFrJT_b11m4)


## FAQ
### Why do I still see old logo in Trust Wallet after uploaded new one  
Both clients, Android and iOS keep old image cache for up to 7 days. In order to see changes immediately, reinstall Trust Wallet. But as always, make sure you have a backup of all your wallets.

## How to use it? (For Developers)
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

