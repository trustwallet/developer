# Adding a new token and coin image

## Image Requirements
- format: `png`. Format `PNG` considered not valid.
- name：name of the file in lowercase fromat
- - For tokens: `contract_address.png`. Ex: `0xd26114cd6ee289accf82350c8d8487fedb8a0c07.png`
- - For coins: `slip44.png`. Ex: Bitcoin is `0.png`
- size: `256px by 256px`
- background: preferably transparant
- use simple drag and drop online servise [tinypng](https://tinypng.com/) to optimize image size

## How To Add a Token
1. Go to https://github.com/TrustWallet/tokens
2. Press on `Fork` in the top right corner, wait for process to complite
3. Navigate to `tokens` (or `coins`, if you're adding a coin icon) folder on your own fork.
4. Press on `Upload File` in the top right corner.
5. Choose file, make sure it follows requirments above
6. Press on `Commitchanges`
7. Press on `New pull request` on your own fork page and submit it by pressing on `Create pull request`!
8. Add short description including name and token symbol in a header field
9. Press on `Create pull request`
10. Once tests complited and verifies your image follows requirments maintainer will merge it and in 5-10 minutes token became searchable and will have image insted of plain logo in Trust Wallet

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
- [Trust Wallet](https://trustwallet.com) - iOS and Android 
- [0x Tracker](https://0xtracker.com) - The 0x Protocol Trade Explorer and news aggregator.
