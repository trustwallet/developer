# Android Integration Guide

Wallet Core is available on the Android platform, through Java/JNI bindings.
In this guide we show how to use it.

A sample application is available at: https://github.com/trustwallet/wallet-core/tree/master/samples/android .

## Prerequisites

* *Android Studio*
* *Android NDK Support plugin*

## Adding Library Dependency

Android releases are hosted on [GitHub packages](https://github.com/trustwallet/wallet-core/packages/700258), please checkout [this installation guide](https://docs.github.com/en/packages/guides/configuring-gradle-for-use-with-github-packages#installing-a-package), you need to add GitHub access token to install it.

Add this dependency to build.gradle:

```groovy
dependencies {
    implementation "com.trustwallet:wallet-core:<latest_tag>"
}
```

Add `maven` and `credentials` (local properties or system environment variables)

```groovy
allprojects {
    repositories {
        maven {
            url = uri("https://maven.pkg.github.com/trustwallet/wallet-core")
            credentials {
                username = project.findProperty("gpr.user") as String?: System.getenv("GITHUB_USER")
                password = project.findProperty("gpr.key") as String?: System.getenv("GITHUB_TOKEN")
            }
        }
    }
}
```

## Code Examples

In the following sections we show code examples for some common funcions.
Please refer to the [Wallet Usage Guide](wallet-core-usage.md) for detailed explanations.

### Wallet Management

First thing we need is to load JNI library

```kotlin
init {
    System.loadLibrary("TrustWalletCore")
}
```

Creating or Importing a Multi-Coin HD Wallet

```kotlin
val wallet = HDWallet(128, "")
```

```kotlin
val wallet = HDWallet("ripple scissors kick mammal hire column oak again sun offer wealth tomorrow wagon turn fatal", "")
```


### Account Address Derivation

Generating the Default Address for a Coin

```kotlin
val addressBTC = wallet.getAddressForCoin(CoinType.BITCOIN)
val addressETH = wallet.getAddressForCoin(CoinType.ETHEREUM)
val addressBNB = wallet.getAddressForCoin(CoinType.BINANCE)
```

Generating an Address Using a Custom Derivation Path (Expert)

```kotlin
val key = wallet.getKey("m/44\'/60\'/1\'/0/0")   // m/44'/60'/1'/0/0
val address = CoinType.ETHEREUM.deriveAddress(key)
```


### Transaction Signing

In general, when creating a new blockchain transaction, a wallet has to:

1. Put together a transaction with relevant fields (source, target, amount, etc.)
2. Sign the transaction, using the account private key.  This is done by Wallet Core.
3. Send to a node for broadcasting to the blockchain network.

Ethereum Transaction Signing

Code example to fill in signer input parameters, perform signing, and retrieve encoded result:

```kotlin
val signerInput = Ethereum.SigningInput.newBuilder().apply {
    chainId = ByteString.copyFrom(BigInteger("01").toByteArray())
    gasPrice = BigInteger("d693a400", 16).toByteString() // decimal 3600000000
    gasLimit = BigInteger("5208", 16).toByteString()     // decimal 21000
    toAddress = dummyReceiverAddress
    transaction = Ethereum.Transaction.newBuilder().apply {
       transfer = Ethereum.Transaction.Transfer.newBuilder().apply {
           amount = BigInteger("0348bca5a16000", 16).toByteString()
       }.build()
    }.build()
    privateKey = ByteString.copyFrom(secretPrivateKey.data())
}.build()
val output = AnySigner.sign(signerInput, CoinType.ETHEREUM, Ethereum.SigningOutput.parser())
println("Signed transaction: \n${signerOutput.encoded.toByteArray().toHexString()}")
```
