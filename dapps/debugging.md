# How to debug your DApp on Trust Wallet

Make sure you have the latest app version, check if there is any new update on Google Play or App Store

## 1. Install a mobile web console

we use [vConsole](https://github.com/Tencent/vConsole) on our test dapp: https://js-eth-sign.surge.sh/, click the bottom green `vConsole` button to see logs.

<img src="../media/js-eth-sign.png" width="45%" /> <img src="../media/js-eth-sign-console.png" width="45%" />

## 2. [Android] Chrome Rmote debugging

Download Trust Wallet apk from [trustwallet.com](https://trustwallet.com) and drag it to your emulator. (app installed from Google Play won't work)

Open the dapp in Trust Wallet (1inch.io as example)

<img src="../media/android-install-apk-emulator.png" width="45%" /> <img src="../media/android-dapp-emulator.png" width="45%" />

Visit `chrome://inspect/#devices` or `edge://inspect/#devices` to inspect the web console

![Edge inspect](../media/edge-inspect.png)
![Edge inspect](../media/edge-inspect2.png)

## 3. [iOS] Safari WebView debugging

iOS doesn't support debugging app built for distribution, you can try to build this iOS demo in [trust-web3-provider](https://github.com/trustwallet/trust-web3-provider) and check if it can connect to your DApp or not, please follow this [guide](https://webkit.org/web-inspector/enabling-web-inspector/) to inspect.

## Contact us

If above doesn't help, please create an issue on [trust-web3-provider](https://github.com/trustwallet/trust-web3-provider) and elaborate your question as detail as possible.

1. What's your app version and OS version?
2. Do you see any js error?
3. How to reproduce? please record a video if possible
4. what's the url of your dapp?
