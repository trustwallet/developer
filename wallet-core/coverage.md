# Coverage Measurement

Wallet-core is a stable project, we value stability and safety over new features.

Test coverage is one important facet of assuring code quality, and we are strict about high test coverage.

## Checking Coverage Summary in CI build

The `Linux CI` CI build (executed on PRs and commits) contains coverage measurement, and summary is available in the build output:

```
Summary coverage rate:
  lines......: 94.5% (14576 of 15426 lines)
  functions..: 95.0% (2688 of 2830 functions)
```

## Detailed Coverage Report

Detailed coverage report can be generated locally.  It includes file and line-level info on coverage.

Steps:

- Run `cmake`, to enable coverage measurement

```shell
cmake -H. -Bbuild -DCMAKE_BUILD_TYPE=Debug
```

- Build tests

```shell
make -Cbuild -j12 tests TrezorCryptoTests
```


- Cleanup any old coverage files, and run unit tests

```shell
find . -name "*.gcda" -exec rm \{\} \;
./build/trezor-crypto/crypto/tests/TrezorCryptoTests
./build/tests/tests tests --gtest_output=xml
```

- Generate coverage info (slow).  With the `html` argument the script will generate HTML report as well:

```shell
./tools/coverage html
```

Open the generated `coverage/index.html` to view the report.
