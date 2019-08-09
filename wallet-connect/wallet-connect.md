# WalletConnect

[WalletConnect](https://walletconnect.org/) Swift SDK, implements 1.0.0 websocket based protocol. 

Demo video: 

[![How to Use WalletConnect to Trade on Binance DEX](https://img.youtube.com/vi/kI6UiqudBng/0.jpg)](https://www.youtube.com/watch?v=kI6UiqudBng)

Features:

- [x] Connect and disconnect
- [x] Approve / Reject / Kill session
- [x] Approve and reject ethereum transactions `eth_sign` / `personal_sign` / `eth_sendTransaction`
- [x] Approve and reject binance dex orders `bnb_sign`
- [x] Sign Transactions `trust_sign` (full documentation [here](/wallet-connect/dapp.md))

## Example

To run the example project, clone the repo, and run `pod install` from the Example directory first.

## Installation

WalletConnect is available through [CocoaPods](https://cocoapods.org). To install
it, simply add the following line to your Podfile:

```ruby
pod 'WalletConnect', git: 'git@github.com:trustwallet/wallet-connect-swift.git', branch: 'master'
```

## Usage

parse session from scanned QR code:

```swift
let string = "wc:..."
guard let session = WCSession.from(string: string) else {
    // invalid session
    return
}
// handle session
```

configure and handle incoming message:

```swift
let interactor = WCInteractor(session: session, meta: clientMeta)
interactor.onSessionRequest = { [weak self] (id, peer) in
    // ask for user consent
}

interactor.onDisconnect = { [weak self] (error) in
    // handle disconnect
}

interactor.onEthSign = { [weak self] (id, params) in
    // handle eth_sign and personal_sign
}

interactor.onEthSendTransaction = { [weak self] (id, transaction) in
    // handle eth_sendTransaction
}

interactor.onBnbSign = { [weak self] (id, order) in
    // handle bnb_sign
}

interactor.onTrustSignTransaction = { [weak self] (id, transaction) in
    // handle trust_signTransaction
}
```

approve session

```swift
interactor.approveSession(accounts: accounts, chainId: chainId).done {
    print("<== approveSession done")
}.cauterize()
```

approve request

```swift
interactor.approveRequest(id: id, result: result.hexString).done {
    print("<== approveRequest done")
}.cauterize()
```

approve binance dex orders

```swift
interactor?.approveBnbOrder(id: id, signed: signed).done({ confirm in
    print("<== approveBnbOrder", confirm)
}).cauterize()
```

## Author

hewigovens

## License

WalletConnect is available under the MIT license. See the LICENSE file for more info.
