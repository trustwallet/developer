# Server-Side Guide

If your server application (most likely on Linux) language supports [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface) to C, it is possible to call wallet core.

## Go

Here is a step by step example using [cgo](https://golang.org/cmd/cgo/), with the Wallet Core docker image.

1. Run `docker run -it trustwallet/wallet-core`
   The library is already built in this image (Build instructions [here](building.md)). Note: may not be the most recent version.

2. Install Go: `apt-get update && apt-get install golang-go`

3. A complete Go sample application is available at [`samples/go`](https://github.com/trustwallet/wallet-core/tree/master/samples/go) in the repository. It uses a `tw/core` wrapper package over the CGo bindings. Build and run it:

```shell
cd samples/go && go build -o main && ./main
```

4. You might want to copy and run `main` outside of the docker container; make sure you have `libstdc++6` and `libc++abi1` installed on your host Ubuntu.

## Node.js

1. Install the package from NPM:

```shell
npm install @trustwallet/wallet-core
```

2. A TypeScript sample application is available at [`samples/node`](https://github.com/trustwallet/wallet-core/tree/master/samples/node) in the repository. Check [wasm/tests](https://github.com/trustwallet/wallet-core/tree/master/wasm/tests) for further API usage examples.
