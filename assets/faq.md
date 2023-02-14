## FAQ

### Why is the build on my pull request red?

Contributions in a pull request are verified by an automated build.
The checks fail if something is wrong, like to logo is too large or an Ethereum contract is not in
[checksum format](#checksum-format).
Checks the exact error message in the build to find out the problem.

### Why is there a merge conflict in my pull request?

A merge conflict happens if the same file has been modified in the pull request, and also in the master branch since the fork was created. With assets repo, this typically caused by using a fork that was created long ago.
The simplest solution in this case is to delete your pull request, delete your fork, create a new fork, and create a new PR. Alternatively, a merge conflict can be resolved using git command line, but Git skills are required.
A pull request can also happen when overriding an existing logo.

### Why I don't see my token in search after PR was merged?

After PR was merged, it may take some time, but not longer than one hour, until search will show the new logo.

### Why do I still see old logo in Trust Wallet after uploaded new one?

Both clients, Android and iOS keep old image cache for up to a few days. In order to see changes immediately, reinstall Trust Wallet. But as always, make sure you have a backup of all your wallets.

### What is smart contract deprecation?

A process of removing smart contract information such as (token logo and info) from this repository.
Removed contract address will be added to the denylist and, as a result, will no longer be present in token search results inside the TW app.
Why would you want to do this ?.
You are contract owner or just good samaritan who noticed contract to be no longer "active" and was an upgrade and abandoned by owning organization, involved in a scam, mimicking by its name or/and symbol a real contract. All facts must be supported with a link to any resource proving these statements.

### Why isn't my token's price displaying in the app?

Token prices will only show up within Trust Wallet if the CoinMarketCap (CMC) listing has the correct contract address associated with it. You can submit changes to your CMC listing via their [online form](https://support.coinmarketcap.com/hc/en-us/requests/new). Once an asset's contract address has been added to it's CMC listing, and the asset has enough transaction volume, pricing data will automatically appear in Trust Wallet.

Note: submitting an asset to the Trust Wallet repository does not guarantee that can pricing data can or will be associated by CMC. Please review CMC's listing criteria [here](https://support.coinmarketcap.com/hc/en-us/articles/360043659351-Listings-Criteria).
