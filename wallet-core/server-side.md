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
import "C"

import "fmt"

func main() {
	fmt.Println("==> calling wallet core from go")
	str := C.TWStringCreateWithUTF8Bytes(C.CString("confirm bleak useless tail chalk destroy horn step bulb genuine attract split"))
	defer C.TWStringDelete(str)
	valid := C.TWHDWalletIsValid(str)
	fmt.Println("<== mnemonic is valid: ", valid)
}
```

4. Compile it by `go build -o main`
5. Run `./main` and you will see the output below: 

```shell
==> calling wallet core from go
<== mnemonic is valid:  true
```
6. You might want to copy and run `main` outside of the docker container, make sure you have `libc++1` and `libc++abi1` installed in your host Ubuntu.
