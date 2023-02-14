# Releasing

Before releasing please update the version numbers in `android/gradle.properties` and `TrustWalletCore.podspec` and commit this change. Then create a new git tag for that number and push \(replace 0.0.0 with the actual version number\):

```text
git tag 0.0.0
git push
git push origin 0.0.0
```

## iOS

Run `bootstrap.sh` then `tools/ios-release`. This will build, archive and upload a Cocoapod. You need to be registered as an owner for the pod.

## Android

Run `bootstrap.sh` then `tools/android-release`. This will build and upload to [Bintray](https://bintray.com/trust/wallet-core/com.trustwallet.wallet-core) and [JFrog](https://oss.jfrog.org/webapp/#/home).

You need to have this credentials as environment variables in order to upload to Bintray

```text
BINTRAY_USER=user
BINTRAY_KEY=key
```

## Docker Hub

We need to release a new prebuilt Docker image every time our dependencies or sources change.
To build the docker image(s), see `tools/docker-build`. Use `docker push` to upload to Docker Hub.
