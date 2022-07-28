# Pull Request Fee -- FAQ

**Someone is asking for cypto payment for processing my Pull Request.  Is this a scam?**

This is a legitimate request from Trust Wallet team, but always be cautious when someone asks you for payment!
Check that there is a description about it under Trust Wallet Developers' doucmentation (this page).
Check that the app is under the *trustwallet* github account, or that its owner belong to the trustwallet group.

**Why?**

Trust Wallet supports an insane number of tokens and coins.
We are committed to supporting the tokens used by our users.
But supporting so many assets has a high cost, in terms of running the infrastructure, ensuring continuous integrations,
handling a massive number of requests to the assets info, etc. A lot of spam/scam coins also find us.

We have introduced this crypto contribution in order to filter requests, so we have more time to handle genuine ones.

We were partly insipred by [Token Curated Registry](https://medium.com/@tokencuratedregistry/a-simple-overview-of-token-curated-registries-84e2b7b19a06).

**What do I have to pay attention to?**

* Double check the [contribution guidelines](assets/new-asset.md), to minimize the risk of your PR being rejected.
* Make sure to set the correct memo on your transfer.

**How does a Fee fit with Open Source?**

We believe in the power of open-source software, and essential parts of Trust Wallet are open source to contribute to the community
([Wallet-Core](https://developer.trustwallet.com/wallet-core)).
But Trust Wallet is a branded product, and running its backend infrastructure, support, marketing, etc. 
has costs (done by a non-volunteer based team).

The `assets` repository is open source. You are free to use it and free to create your version (fork it and change it).
But if you want to get into our app, you have to accept our rules, and we've chosen to ask for a contribution to include/change the information in the Trust Wallet product.
See also *Why* question.

**What is Trust Wallet Token TWT?**

TWT the token of Trust Wallet, with uses such as our Referral Program.
TWT lives in multiple chains and can be obtained on several exchanges ([TWT Community page](https://community.trustwallet.com/t/trust-wallet-token-twt/4187)).

**When is my payment evaluated?**

Payment is handled automatically by out bot.
The fee payment should be detected automatically (within a minute).

**What happens after I pay? Is merging automatic?**

When the bot detects payment, it automatically places an Accept review on the PR.
This is a precondition for merge.
But merging is currently not automatic, it is done by the maintainers.

**I have forgot to set a memo in my transfer, do I have to send another payment?**

Yes. Crypto transactions are final and irreversible.  As such, payments with missing memos or mistyped addresses cannot be recovered. Please verify all transaction details carefully before sending payment.

**If you decide not to merge my PR, do I get my payment back?**

The pull request fee is non-refundable and covers the processing only; payment is not a guarantee that your pull request will be merged. Please consult the contribution guidelines prior to paying the fee.

**Do I need to pay the PR fee again to make updates to my submission?**

If your asset is already accepted into the repository, subsequent updates will require payment of the fee to cover processing your changes. This includes changes made for name changes, logo changes, rebranding etc.

**Can the fee be waived?**

Not really.
Inclusions decided and performed by our team are done without fee, but for external-triggered changes we require the fee.
