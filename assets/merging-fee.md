# Merge Fee -- FAQ

**Someone is asking for cypto payment for merging my Pull Request.  Is this a scam?**

Always be cautious when someone asks you for payment.
Check that there is a description about it under Trust Wallet Developers' doucmentation (this page).
Check that the app is under the *trustwallet* github account, or that its owner belong to the trustwallet group.
So no, this is not a scam.

**Why?**

Trust Wallet supports an insane number of tokens and coins.
We are committed to support tokens used by our users.
But supporting so many assets has a significant costs, in terms of running the infrastructure, ensuring continuous integrations,
handling a huge number of requests to the assets info, etc.  A lot of spam/scam coins also find us.

We have introduced this crypto contribution in order to filter down requests, so we have more time to handle genuine ones.

**How  dare you ask for money in the case of an Open Source project?**

We believe in the power of open source software, and important parts of Trust Wallet are open source to contribute to the community
(wallet-core, blockatlas).
But Trust Wallet is a branded product, and running its backend infrastructure, support, marketing, etc. 
has costs (done by a non-volunteer based team).

The `assets` repository is open source, you are free to use it, and free to create your own version (fork).  But we choose to ask for a contribution for requests to include/change information in the Trust Wallet product.  See also *Why* question.

**What is Trust Wallet Token TWT?**

TWT is a token used in the
[Referral Program](https://community.trustwallet.com/t/invite-a-friend-earn-trust-wallet-token-twt/4125).
Currently it is only possible to obtain it through referrals.  But if you are a token with serious user base, obtaining referral for 10 new users should not be a problem.

**When is my payment evaluated?**

Payment is handled by [`merge-fee-bot`](https://github.com/settings/apps/merge-fee-bot), a GitHub app by us.
Currently payment is checked only when there is some action on the PR, such as a comment.
So after your transfer, create a comment about it.  The payment should be detected within seconds.
(Technical background: being notified when the payment happens is not a problem, but interacting with a PR
when there is no action on it is difficult for the GitHup app.)

**What happens after I pay?  Is merging automatic?**

When the `merge-fee-bot` detects payment, it automatically places an Accept review on the PR.
This is a precondition for merge.
But merging is not automatic, it is done by the maintainers.

**I just need to make an urgent fix / just change existing info / etc. -- Can you do it without a payment?**

In justified cases, we may waive the payment requirement.
Make sure to communicate the justification clearly in the PR.

**I have forgot to set a memo in my transfer**

We warned you not to forget!
But if you did, don't worry -- write down this fact in a comment in the PR, together with the TX hash, and we will check manually.

**If you decide not to merge my PR, do I get my payment back?**

It depends on the situation.
If the PR has to be repeated for some techical reason, the payment can be reused for the second PR.
If rejection is due to some mutually agreed reason, we send the payment back.

