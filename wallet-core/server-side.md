# Server-Side Guide

If your server application (most likely on Linux) language supports [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) to C, it is possible to call wallet core.

## Golang

Here is a step by step example of [cgo](https://golang.org/cmd/cgo/), using Wallet Core docker image.

1. Run `docker run -it trustwallet/wallet-core`
The librabry is already built in this image  (Build instructions [here](building.md))  Note: may not be the most recent version.

2. Install go: `apt-get update && apt-get install golang` 
(or download from here [go1.13.3](https://dl.google.com/go/go1.13.3.linux-amd64.tar.gz), configure `GOROOT` and append `GOROOT/bin` to `PATH`).
3. Save the sample code below to file called `main.go`

```go
package main

// #cgo CFLAGS: -I/wallet-core/include
// #cgo LDFLAGS: -L/wallet-core/build -L/wallet-core/build/trezor-crypto -lTrustWalletCore -lprotobuf -lTrezorCrypto -lc++ -lm
// #include <TrustWalletCore/TWHDWallet.h>
// #include <TrustWalletCore/TWString.h>
// #include <TrustWalletCore/TWData.h>
// #include <TrustWalletCore/TWPrivateKey.h>
// #include <TrustWalletCore/TWPublicKey.h>
import "C"

import "fmt"
import "unsafe"
import "encoding/hex"

// C.TWString -> Go string
func TWStringGoString(s unsafe.Pointer) string {
	return C.GoString(C.TWStringUTF8Bytes(s))
}

// Go string -> C.TWString
func TWStringCreateWithGoString(s string) unsafe.Pointer {
	cStr := C.CString(s)
	defer C.free(unsafe.Pointer(cStr))
	str := C.TWStringCreateWithUTF8Bytes(cStr)
	return str
}

// C.TWData -> Go byte[]
func TWDataGoBytes(d unsafe.Pointer) []byte {
	cBytes := C.TWDataBytes(d)
	cSize := C.TWDataSize(d)
	return C.GoBytes(unsafe.Pointer(cBytes), C.int(cSize))
}

// Go byte[] -> C.TWData
func TWDataCreateWithGoBytes(d []byte) unsafe.Pointer {
	cBytes := C.CBytes(d)
	data := C.TWDataCreateWithBytes((*C.uchar)(cBytes), C.ulong(len(d)))
	return data
}

func main() {
	fmt.Println("==> calling wallet core from go")
	str := TWStringCreateWithGoString("confirm bleak useless tail chalk destroy horn step bulb genuine attract split")
	emtpy := TWStringCreateWithGoString("")
	defer C.TWStringDelete(str)
	defer C.TWStringDelete(emtpy)

	fmt.Println("<== mnemonic is valid: ", C.TWHDWalletIsValid(str))

	wallet := C.TWHDWalletCreateWithMnemonic(str, emtpy)
	defer C.TWHDWalletDelete(wallet)

	key := C.TWHDWalletGetKeyForCoin(wallet, C.TWCoinTypeBitcoin)
	keyData := C.TWPrivateKeyData(key)
	keyHex := hex.EncodeToString(TWDataGoBytes(keyData))
	fmt.Println("<== bitcoin private key: ", keyHex)

	pubKey, _ := hex.DecodeString("0288be7586c41a0498c1f931a0aaf08c15811ee2651a5fe0fa213167dcaba59ae8")
	pubKeyData := TWDataCreateWithGoBytes(pubKey)
	defer C.TWDataDelete(pubKeyData)

	fmt.Println("<== bitcoin public key is valid: ", C.TWPublicKeyIsValid(pubKeyData, C.TWPublicKeyTypeSECP256k1))

	address := C.TWHDWalletGetAddressForCoin(wallet, C.TWCoinTypeBitcoin)
	fmt.Println("<== bitcoin address: ", TWStringGoString(address))
}
```

4. Compile it by `go build -o main`
5. Run `./main` and you will see the output below: 

```shell
==> calling wallet core from go
<== mnemonic is valid:  true
<== bitcoin private key:  945f423798858e24aa1ab490648013db63ad1f539ebbb8cb1399edd1d0b59716
<== bitcoin public key is valid:  true
<== bitcoin address:  bc1qw29x4hrt6tahz4jvuhzrq6y5el3spqt499zuay
```
6. You might want to copy and run `main` outside of the docker container, make sure you have `libc++1` and `libc++abi1` installed in your host Ubuntu.
