## FAQ

### Why is the build on my pull request red?

> Contributions in a pull request are verified by an automated build.
> The checks fail if something is wrong, like the logo is too large or an Ethereum contract is not in
> [checksum format](repository_details.md#checksum-format).
> Check the exact error message in the build to find out the problem.

### Why is there a merge conflict in my pull request?

> A merge conflict happens if the same file has been modified in the pull request, and also in the master branch since the fork was created. With the assets repo, this is typically caused by using a fork that was created long ago.
> The simplest way to resolve this is to:
>   1. Open your branch locally, fetch the latest changes from the origin, then push your updates.
>   2. If that doesn't resolve the conflict, close your current pull request, fork the latest version of our repository, and submit a new one.

### Why I don't see my token in search after PR was merged?

> After PR was merged, it may take some time, but not longer than one hour, until the search shows the new logo.

### Why do I still see old logo in Trust Wallet after uploading a new one?

> All clients (Android, iOS, and Browser Extension) cache images for a few hours. To see your changes immediately, clear your cache or reinstall Trust Wallet.
>
> **Important**: Back up all your wallets before reinstalling.

### What is smart contract deprecation?

> Smart contract deprecation is the process of removing a token's logo and information from this repository. The deprecated contract address is added to the denylist and will no longer appear in token search results within the Trust Wallet app.
>
> ### When should a contract be deprecated?
>
> A deprecation request is appropriate when a contract is:
> - No longer active or has been abandoned by its organization
> - Upgraded and replaced by a new contract
> - Involved in a scam
> - Mimicking the name or symbol of a legitimate token
>
> **Note**: All deprecation requests must include supporting evidence with links to verifiable sources.

### Why isn't my token's price displaying in the app?

> Trust Wallet sources pricing data from CoinMarketCap (CMC). For your token's price to appear, the following must be in place:
>
>   1. Your token's correct contract address is linked to its CMC listing.
>   2. The token has sufficient transaction volume on CMC.
> 
> If your contract address is missing or incorrect on CMC, you can submit an update through their [online form](https://support.coinmarketcap.com/hc/en-us/requests/new).
>
> Once both conditions are met, pricing data will appear in Trust Wallet automatically.
>
> **Note**: Listing a token in the Trust Wallet repository does not guarantee that CMC will associate pricing data with it. Please review CMC's [listing criteria](https://support.coinmarketcap.com/hc/en-us/articles/360043659351-Listings-Criteria) for more details.