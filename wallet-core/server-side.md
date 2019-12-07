# Server-side

If your server application (most likely on Linux) language supports [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) to C, it is possible to call wallet core.

## Golang

Here is a step by step example of [cgo](https://golang.org/cmd/cgo/), using Wallet Core docker image.

1. Run `docker run -it trustwallet/wallet-core`
2. The librabry is already built in this image  (Build instructions [here](building.md))  Note: may not be the most recent version.
3. Install go: `apt-get update && apt-get install golang` 
(or download from here [go1.13.3](https://dl.google.com/go/go1.13.3.linux-amd64.tar.gz), configure `GOROOT` and append `GOROOT/bin` to `PATH`).
4. Save the sample code below to file called `main.go`

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

5. Compile it by `go build -o main`
6. Run `./main` and you will see the output: 

```shell
==> calling wallet core from go
<== mnemonic is valid:  true
```
