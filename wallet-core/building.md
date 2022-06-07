# Building and Testing

Find here instructions for building the Wallet Core library locally.

## Platforms

The following *target platforms* are supported:

* **iOS** (Swift language is used)
* **Android**
* **Wasm** (Emscripten)

The following *development platforms* are supported:

* **macOS**: is the *primary* development platform, as it supports compiling for both target platforms.
* **Linux**: is partially supported as a development platform.

## Build Methods

Wallet Core can be build inside a Docker image, or natively.

* Inside **Docker** image:  This way is easier to get the prerequisites, as they are all inside a Docker image. However, all building has to be done inside the Docker image.
* Natively, in your dev OS (macOS, Linux).

## Prerequisites

Here is the list of required prerequisites.

### Prerequisites on macOS

* CMake `brew install cmake`
* Boost `brew install boost`
* Xcode
* Xcode command line tools: `xcode-select --install`
* Other tools: `brew install git ninja autoconf automake libtool xcodegen clang-format ccache cocoapods`
* [Android Studio](https://developer.android.com/studio/index.html)
* [Android NDK](https://developer.android.com/ndk/guides/)

### Prerequisites on Linux

* Various packages `sudo apt-get install autoconf git libcurl4-openssl-dev libicu-dev libssl-dev libtool ninja-build nodejs pkg-config unzip ccache`
* CLang
* Ruby 2.6 (`rbenv` from https://github.com/rbenv/ruby-build, then `rbenv install 2.6.3`)
* Boost (from https://dl.bintray.com/boostorg/release/1.66.0/source/boost_1_66_0.tar.gz)
* CMake (from https://github.com/Kitware/CMake/releases)
* [Android Studio](https://developer.android.com/studio/index.html)

### Managed Prerequisites

Additionally, the following prerequisites are also needed, but they are managed by Wallet Core.  The script `tools/install-dependencies` downloads and compiles them (see below).

* Google test
* Check
* Json
* Protobuf

## Full Build

The full build can be triggered with one top-level script:

```shell
./bootstrap.sh
```

Or, broken up in smaller steps:

```shell
./tools/install-dependencies
```

This script downloads and compiles some prerequisites.

```shell
./tools/generate-files
```

This script generates source files, coin- and protobuf files.  Needs to be re-run whenever `registry.json` or protobuf files are changed.

```shell
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug
make -Cbuild
```

Standard CMake and make commands for building the library.  The `cmake` command needs to be re-run whenever a new source file is added.

After build, *unit tests* can be executed:

```shell
./build/tests/tests tests --gtest_filter=*
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
./tools/generate-files
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug
make -Cbuild
```

## Executing inside Docker image

The Docker image also contains a pre-built, runnable version of the library, so it is possible to run it, 'toy around' with it without any building.
*Note:* this may not be the most recent version!

Unit tests and [wallet console utility](walletconsole.md) can be executed straight from this Docker image:

```shell
docker run -i -t trustwallet/wallet-core
cd wallet-core
./build/tests/tests tests
./build/walletconsole/walletconsole
exit
```

## Linux

Building on Linux is possible, but not fully supported, it requires some extra work. If you have access to macOS we highly recommend developing on that platform.  Using the Docker image is also recommended.
Otherwise, the prerequisites have to be installed manually.

## Unit tests with Coverage

Coverage info can be seen in the GitHub [CI builds](https://codecov.io/gh/trustwallet/wallet-core),
but can be generated locally as well.

Steps for running unit tests with coverage measurement, and creating report locally:

```bash
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug -DCODE_COVERAGE=ON
make -Cbuild -j12 tests
find . -name "*.gcda" -exec rm {} \;
rm -rf coverage.info coverage/
./build/tests/tests tests --gtest_filter=*
tools/coverage html
```

See also 
[tools/coverage](https://github.com/trustwallet/wallet-core/blob/master/tools/coverage) and
[linux-ci.yml](https://github.com/trustwallet/wallet-core/blob/master/.github/workflows/linux-ci.yml).
