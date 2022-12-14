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

Here is the list of required prerequisites.

### Prerequisites on macOS

- CMake `brew install cmake`
- Boost `brew install boost`
- Xcode
- Xcode command line tools: `xcode-select --install`
- Ruby `brew install ruby`
- Other tools: `brew install git ninja autoconf automake libtool xcodegen clang-format ccache cocoapods`
- [Android Studio](https://developer.android.com/studio/index.html)
- [Android NDK](https://developer.android.com/ndk/guides/)
- Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

### Prerequisites on Linux

Ubuntu as a example:

- Various essential packages `sudo apt-get install build-essential libtool autoconf pkg-config ninja-build ccache`
- Clang `sudo apt-get install clang-14 llvm-14 libc++-dev libc++abi-dev`
- Ruby `sudo apt-get install ruby-full`
- Boost `sudo apt-get install libboost-all-dev`
- CMake `sudo apt-get install cmake` or (from https://github.com/Kitware/CMake/releases)
- [Android Studio](https://developer.android.com/studio/index.html)
- Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

### Managed Prerequisites

Additionally, the following prerequisites are also needed, but they are managed by Wallet Core. The script `tools/install-dependencies` downloads and compiles them (see below).

- Google test (gtest)
- libcheck
- nolhmann json
- Protobuf

## Full Build

The full build can be triggered with one top-level script:

```shell
./bootstrap.sh
```

Or, broken up in smaller steps:

```shell
## Linux
./tools/install-sys-dependencies-linux

## MacOS
./tools/install-sys-dependencies-mac

./tools/install-dependencies
./tools/install-rust-dependencies
```

This script downloads and compiles some prerequisites.

```shell
./tools/generate-files
```

This script generates source files, coin- and protobuf files. Needs to be re-run whenever `registry.json` or protobuf files are changed.

```shell
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug
make -Cbuild
```

Standard CMake and make commands for building the library. The `cmake` command needs to be re-run whenever a new source file is added.

After build, _unit tests_ can be executed:

```shell
./build/tests/tests tests --gtest_filter=*
```

The generate-cmake-make-test steps are also available together in one script:

```shell
./tools/build-and-test
```

If you'd rather use and IDE for building and debugging you can specify the `-G` option to cmake. For instance to use Xcode call `cmake -Bxcode -GXcode -DCMAKE_BUILD_TYPE=Debug` and use the generated project in the xcode folder.

### Wasm building

Install [Emscripten SDK](https://emscripten.org/docs/introducing_emscripten/about_emscripten.html) (emsdk):

```shell
`tools/install-wasm-dependencies`
```

Activate `emsdk`:

```shell
`source emsdk/emsdk_env.sh`
```

Build Wasm:

```shell
tools/wasm-build
```

Run Wasm tests:

```shell
cd wasm
npm install && npm run copy:wasm && npm run build
npm run test
```

## Building inside Docker image

Here are the instructions to build Wallet Core with the provided `Dockerfile`.

Prerequisite is a working Docker installation.

The command for building the Docker image:

```shell
docker build docker/wallet-core --tag wallet-core-dev
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
