# Pull Request Fee -- FAQ

Trust Wallet supports an insane number of assets/tokens requests.
We are committed to supporting the tokens used by our users, but supporting millions of assets comes at a high cost. In terms of running the infrastructure, ensuring continuous integrations, handling a massive number of requests to the assets info, etc., and also avoiding a lot of spam/scam coins.
We have introduced this crypto contribution in order to filter requests, so we have more time to handle genuine ones.
We were partly inspired by Token Curated Registry.

A fee of 500TWT or 5BNB is required for each Pull Request, you will see the message from the merge-fee-bot with details about the payment. Make sure to double-check the https://developer.trustwallet.com/assets/requirements to minimize the risk of your PR being rejected.

## Why the payment?\*\*

- Due to a high number of pull requests, this led to a high cost of running infrastructure. A modest fee is required for processing a pull request, which is payable in cryptocurrency.
- Cost is used to run the infrastructure that powers millions of Assets/tokens
- Reducing spam/scam coins/tokens request
- Ensuring smooth integration and handling of a massive number of assets request

**How does this Fee fit with Open Source?**

We believe in the power of open-source software, and essential parts of Trust Wallet are open-source to contribute to the community(Wallet-Core). But Trust Wallet is a branded product, and running its backend infrastructure, support, marketing, etc. has costs (done by a non-volunteer-based team).
The assets repository is open source. You are free to use it and free to create your version (fork it and change it). But if you want to get into our app, you have to accept our rules, and we've chosen to ask for a contribution to include/change the information in the Trust Wallet product.

**What do I have to pay attention to?**

- Double-check the contribution guidelines, to minimize the risk of your PR being rejected.
- Make sure to set the correct memo on your transfer.

## See FAQs question:

**Is crypto payment for processing my Pull Request a scam?**

No, it's not a scam!
This is a legitimate request from the Trust Wallet team, but always be cautious when someone asks you for payment! Check that there is a description about it under Trust Wallet Developers' documentation (this page). Check that the app is under the trust wallet GitHub account, or that its owner belongs to the Trust Wallet group, and finally check thoroughly that you are using the correct URL: https://assets.trustwallet.com/

**When is my payment evaluated?**

Payment is handled automatically by our bot. The fee payment should be detected automatically (mostly within a minute).

**What happens after I pay? Is merging automatically?**

When the bot detects payment, it automatically places an “Accept Review” on the PR. This is a precondition for merging. But merging is currently not automatic, it is done by the maintainers.

**I forgot to set a memo in my transfer, do I have to send another payment?**

Yes. Crypto transactions are final and irreversible. As such, payments with missing memos or mistyped addresses cannot be recovered. Please verify all transaction details carefully before sending payment.

**If you decide not to merge my PR, do I get my payment back?**

The pull request fee is non-refundable and covers the processing only; payment is not a guarantee that your pull request will be merged. Please consult the contribution guidelines before paying the fee.

**Do I need to pay the PR fee again to make updates to my submission?**

If your asset is already accepted into the repository, subsequent updates will require payment of the fee to cover processing your changes. This includes changes made for name changes, logo changes, rebranding, etc.

**Can the fee be waived?**

Not really. Inclusions decided and performed by our team are done without fee, but for external-triggered changes, we require the fee.

**What is Trust Wallet Token TWT?**

TWT is the token of Trust Wallet, with uses such as our Referral Program. TWT lives in multiple chains and can be obtained on several exchanges (TWT Community page).
