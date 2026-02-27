# Building and Testing

Find here instructions for building the Wallet Core library locally.

## Platforms

The following _target platforms_ are supported:

- **iOS** (Swift language is used)
- **Android**
- **Wasm** (Emscripten)

The following _development platforms_ are supported:

- **macOS**: is the _primary_ development platform, as it supports compiling for both target platforms.
- **Linux**: is supported as a development platform if you only need to build C++ and Wasm targets.

## Build Methods

Wallet Core can be build inside a Docker image, or natively.

- Inside **Docker** image: This way is easier to get the prerequisites, as they are all inside a Docker image. However, all building has to be done inside the Docker image.
- Natively, in your dev OS (macOS, Linux).

## Prerequisites

Use one top-level script to install all required dependencies and prepare WalletCore for building:

```shell
./bootstrap.sh all
```

Please note that the script configures the environment for all target platforms: Native, Android, iOS (on MacOS), and WASM.
If you intend to use WalletCore on specific platforms only, you can specify those platforms in the arguments:

```shell
./bootstrap.sh android ios
```

Otherwise, consider installing the required prerequisites manually below.

### Prerequisites on macOS

- CMake `brew install cmake`
- Boost `brew install boost`
- Xcode
- Xcode command line tools: `xcode-select --install`
- Ruby `brew install ruby`
- Other tools: `brew install git ninja autoconf automake libtool xcodegen clang-format ccache cocoapods`
- [Android Studio](https://developer.android.com/studio/index.html)
- [Android NDK](https://developer.android.com/ndk/guides/)
- Rust: `brew install rustup && rustup-init`
- [emscripten (for WASM)](https://emscripten.org/docs/introducing_emscripten/about_emscripten.html)

### Prerequisites on Linux

Ubuntu as an example:

- Various essential packages `sudo apt-get install build-essential libtool autoconf pkg-config ninja-build ccache`
- Clang `sudo apt-get install clang-14 llvm-14 libc++-dev libc++abi-dev`
- Ruby `sudo apt-get install ruby-full`
- Boost `sudo apt-get install libboost-all-dev`
- CMake `sudo apt-get install cmake` or (from https://github.com/Kitware/CMake/releases)
- [Android Studio](https://developer.android.com/studio/index.html)
- Rust: `sudo apt-get install rustc`
- [emscripten (for WASM)](https://emscripten.org/docs/introducing_emscripten/about_emscripten.html)

### Managed Prerequisites

Additionally, the following prerequisites are also needed, but they are managed by Wallet Core. The script `tools/install-dependencies` downloads and compiles them (see below).

- Google test (gtest)
- libcheck
- nlohmann json
- Protobuf

## Full Build

WalletCore is ready to be built after installing all prerequisites.
Building for each platform is different.

### Native building and testing

To build and run tests on the native platform (Linux, MacOS), run the following command:

```shell
./tools/build-and-test
```

Or, broken up in smaller steps:

1. This script generates source files, coin- and protobuf files.
Needs to be re-run whenever `registry.json`, or protobuf files, or `./include` interface, or Rust codebase are changed.

```shell
./tools/generate-files
```

2. Standard CMake and make commands for building the library. The `cmake` command needs to be re-run whenever a new C++ source file is added.

```shell
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug
```

3. Build TrezorCrypto and WalletCore C++ tests.

```shell
make -Cbuild -j12 tests TrezorCryptoTests
```

4. Run TrezorCrypto and WalletCore C++ tests.

```shell
./build/tests/tests tests --gtest_filter=*
```

If you'd rather use and IDE for building and debugging you can specify the `-G` option to cmake. For instance to use Xcode call `cmake -Bxcode -GXcode -DCMAKE_BUILD_TYPE=Debug` and use the generated project in the xcode folder.

### Wasm building

Configure WASM environment with either running a bootstrap:

```shell
./bootstrap.sh wasm
```

Or installing [Emscripten SDK](https://emscripten.org/docs/introducing_emscripten/about_emscripten.html) (emsdk) manually:

```shell
`tools/install-wasm-dependencies`
```

Activate `emsdk`:

```shell
`source emsdk/emsdk_env.sh`
```

After WASM environment is configured, build WalletCore for WASM:

```shell
tools/wasm-build
```

Run Wasm tests:

```shell
cd wasm
npm install && npm run copy:wasm && npm run build
npm run test
```

## Testing Rust library

Rust library can be tested separately from the C++ part.

```shell
cd rust
cargo test
```

## Checking Rust lints

We use [rustfmt](https://github.com/rust-lang/rustfmt), [clippy](https://github.com/rust-lang/rust-clippy) to check
if the Rust code is formatted and does not contain common warnings/errors.

Run Rust lints:

```shell
./tools/rust-lints
```

## Building inside Docker image

Here are the instructions to build Wallet Core with the provided `Dockerfile`.

Prerequisite is a working Docker installation.

The command for building the Docker image:

```shell
docker build . --tag wallet-core-dev
```

Then launch the container:

```shell
docker run -i -t wallet-core-dev /bin/bash
```

Inside the container the build commands can be executed (as described above; note that install-dependencies is not necessary):

```shell
cd wallet-core
./tools/build-and-test
```

## Executing inside Docker image

The Docker image also contains a pre-built, runnable version of the library, so it is possible to run it, 'toy around' with it without any building.
_Note:_ this may not be the most recent version!

Unit tests and [wallet console utility](walletconsole.md) can be executed straight from this Docker image:

```shell
docker run -i -t trustwallet/wallet-core
cd wallet-core
./build/tests/tests tests
./build/walletconsole/walletconsole
exit
```

## Linux

Building on Linux is possible, it requires some extra work. If you have access to macOS we highly recommend developing on that platform. Using the Docker image is also recommended.
Otherwise, the prerequisites have to be installed manually. We recommend using Ubuntu 22.04 LTS, same as [Wallet Core CI](https://github.com/trustwallet/wallet-core/blob/master/.github/workflows/linux-ci.yml).

## Unit tests with Coverage

For executing tests locally with coverage measurement, some extra `cmake` settings are needed;
see [section on coverage instructions](coverage.md).

## All CMake options

We enable these options on CI: `-DCMAKE_BUILD_TYPE=Debug -DTW_UNITY_BUILD=ON -DTW_CODE_COVERAGE=ON -DTW_ENABLE_CLANG_TIDY=ON -DTW_CLANG_ASAN=ON`

| Name                  | Description                                                                               | How to enable it           | Notes                                                                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| TW_IDE_CLION          | Specify that your IDE is CLion, way to enable coverage is different on CLion              | -DTW_IDE_CLION=ON          | Do not enable multiple IDE options at the same time<br>Off by default                                                                                              |
| TW_IDE_VSCODE         | Specify that your IDE is vscode, way to use PVS-studio is different on VSCode             | -DTW_IDE_VSCODE=ON         | Do not enable multiple IDE options at the same time<br>Off by default                                                                                              |
| TW_UNITY_BUILD        | Specify that you want to use UNITY BUILD in the project, use it in order to build faster. | -DTW_UNITY_BUILD=ON        | To be used for CI environment.<br>Off by default                                                                                                                   |
| TW_ENABLE_CLANG_TIDY  | Specify that you want to build with clang-tidy static analyzer.                           | -DTW_ENABLE_CLANG_TIDY=ON  | Do not use it at the same time as `TW_ENABLE_PVS_STUDIO`<br>Clang-tidy must be installed<br>Off by default                                                         |
| TW_ENABLE_PVS_STUDIO  | Specify that you want to build with pvs-studio static analyzer                            | -DTW_ENABLE_PVS_STUDIO=ON  | Do not use it at the same time as `TW_ENABLE_CLANG_TIDY`<br>PVS-Studio must be installed and configured.<br>Can be combined with `TW_IDE_VSCODE`<br>Off by default |
| TW_CLANG_ASAN         | Specify that you want to build with ASAN dynamic analyzer.                                | -DTW_CLANG_ASAN=ON         | use it in Debug for optimal result.<br>Do not mix with other runtime analyzer.<br>Off by default                                                                   |
| TW_COMPILE_WASM       | Specify that you are targeting WASM.                                                      | -DTW_COMPILE_WASM=ON       | Off by default                                                                                                                                                     |
| TW_CODE_COVERAGE      | Specify that you want to build with coverage support                                      | -DTW_CODE_COVERAGE=ON      | Can be combined with `TW_IDE_CLION`<br>Off by default                                                                                                              |
| TW_WARNINGS_AS_ERRORS | Specify that you want to treat all the warnings as error                                  | -DTW_WARNINGS_AS_ERRORS=ON | Adviced to be used locally, during development.<br>Off by default                                                                                                  |
| TW_ENABLE_CCACHE      | Specify that you want to use CCACHE                                                       | -DTW_ENABLE_CCACHE=ON      | On by default                                                                                                                                                      |
| TW_UNIT_TESTS         | Specify that you want to enable unit tests in the project                                 | -DTW_UNIT_TESTS=ON         | On by default on native platforms                                                                                                                                  |
| TW_BUILD_EXAMPLES     | Specify that you want to enable examples in the project                                   | -DTW_BUILD_EXAMPLES=ON     | On by default on native platforms                                                                                                                                  |
