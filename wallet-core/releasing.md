# Releasing

Before releasing, update the version numbers in `android/gradle.properties` and `WalletCore.podspec`, then commit the change. Create a new git tag for that version and push (replace 0.0.0 with the actual version number):

```text
git tag 0.0.0
git push
git push origin 0.0.0
```

## iOS

Run `bootstrap.sh` then `tools/ios-xcframework-release`. This will build the xcframework binaries, upload them to GitHub Releases, and auto-generate `Package.swift` with the correct checksums for Swift Package Manager.

You need to be authenticated with the GitHub CLI (`gh auth login`) and registered as a repository collaborator to upload release assets.

## Android

Run `bootstrap.sh` then `tools/android-release`. This will build and publish the Android artifacts to [GitHub Packages](https://github.com/trustwallet/wallet-core/packages).

You need the following credentials as environment variables in order to publish:

```text
GITHUB_USER=user
GITHUB_TOKEN=token
```

## Docker Hub

We need to release a new prebuilt Docker image every time our dependencies or sources change.
To build the docker image(s), see `tools/docker-build`. Use `docker push` to upload to Docker Hub.
