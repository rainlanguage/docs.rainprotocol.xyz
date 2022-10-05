---
slug: ecosystem-currency-getting-started
title: "Ecosystem Currency - Getting started"
authors: dcatki
tags: [economy, game, expression, token]
---

# Ecosystem Currency - Getting started

Let’s start with something basic. The first game currency we want to build has just a max supply. We could write that without even using the expression engine. 

<!--truncate-->

### Max supply currency without an expression

> **Design**
> Fixed supply
> Mint immediately
> Single wallet

We enter the details below in configuration and leave the expression empty

> Link: https://toy-token.on.fleek.co/
> Name: 
> Symbol: 
> Address to immediately mint token for: 
> Amount of the token to immediately mint: 

### Max supply currency with an expression

Or you could do this with an expression

> **Design**
> Supply amount
> Mint immediately
> Single wallet

Then create your expression

    Link: https://toy-token.on.fleek.co/
    Expression: eager_if(less_than(ierc20_total_supply(this_address()), 100000), 100000, 0)

You can see below an expression I've deployed using the code above:

https://toy-token.on.fleek.co/#/token/0x046829F2EFCBa6398995F428Df978AD490DF4630 

You can now go ahead and creat your own. You can change the supply amount and amount you can mint (both set at 100,000 at the moment).

### Max supply currency released daily linear single wallet

> **Design**
> Fixed supply
> Mint over period of time
> Mint shared between verified wallets
> Mint amount based on difference between available amount and previous claim
> Minted wallets must belong to relevant list, membership, tier

First I have to set up a list or tier or membership. 

To do that I can go to https://toolkit.rainprotocol.xyz/ and experiment with various tiers. I could use ERC20 balance, ERC20 transfer, ERC721 balance, Verify or Combine Tiers. 

**What is a Tier?**

ITier is a simple interface that contracts can implement to provide membership lists for other contracts. A "membership" can represent many things Exclusive access, participation in some event or process, KYC completion, combination of sub-memberships. Read more here - https://docs.rainprotocol.xyz/developer-tools/smart-contracts/tier/ITier

In this case we want to limit activity to all validated wallets. So we load the Rain Protocol Toolkit and create a Verify Tier

https://toolkit.rainprotocol.xyz/#/verify/deploy

Here is the verify I've created

Verify: 0xDE5b95Dd290cEE7bfddd5c9eFAC7fD042a0eDea5 

We then manage the Verify to add / remove validated wallets.

Administering the verify: https://toolkit.rainprotocol.xyz/#/verify/administer/0xDE5b95Dd290cEE7bfddd5c9eFAC7fD042a0eDea5 

And then we create a VerifyTier from the Verify contract.

VerifyTier: 0x38ecA941B8c139C2Ed995Be5CACdD9c855c1eC28 

The VerifyTier simply takes the Verify contracts and makes the interface tier consistent.

**Writing the expression**

```
    eager_if(
        iszero(report(verifyTierAddress context(0))) 
        0 
        sub(
            min(mul(sub(current-timestamp() deployTimestamp) amountChangePerTimestampPerWallet) 
           div(1000000000 numberOfVerifiedWallets)) 
           min(mul(saturating-sub(single-report(this-address() context(0) 1) deployTimestamp) 
           amountChangePerTimestampPerWallet) div(1000000000 numberOfVerifiedWallets))
        )
    )
```

**Variables**

verifyTierAddress = 0x38ecA941B8c139C2Ed995Be5CACdD9c855c1eC28 in my example; or the address of the VerifyTier you've created

MaxUint256 = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff; this checks whether the wallet is part of the VerifyTier

current-timestamp = [Creating a timestamp](https://www.unixtimestamp.com)

deployTimestamp = [Creating the deploy timestamp](https://www.unixtimestamp.com)

amountChangePerTimestampPerWallet = We get the current timestamp and subtract it by deploy timestamp , which gives us how many timestamp has passed since deploy time, and then multuply it by that amountChange to get how much token should be released at this point in time

numberOfVerifiedWallets = Number of wallets that are eligible to mint

**Explanations**

```
    iszero(report(verifyTierAddress context(0)))
```

Requires the recipient addresses be approved in a verify tier contract for control over who can and cannot mint. 

The expression above checks the report of the verify tier contract to see if the address interacting is on the verify tier or not

```
    min(mul(sub(current-timestamp() deployTimestamp) amountChangePerTimestampPerWallet) 
       div(1000000000 numberOfVerifiedWallets)) 
```

This expression calculates the mintable amount for a verified address, there are some variables here such as “amountChangePerTimestampPerWallet” which needs to be calculated before hand, or it can be written as expression itself, but the less expressions the lower the gas fee, so we try to do any calculations before hand if we can as much as possible, to calculate “amountChangePerTimestampPerWallet” we do:

10 years in timestamp = 10 * 365 * 24 * 60 * 60 = 315360000
amountChangePerTimestamp = 1000000000 / 315360000
amountChangePerTimestampPerWallet = amountChangePerTimestamp / numberOfVerfiedWallets

Other calculations might be

1 hour in timestamp = 1 * 60 * 60 = 3600
1 day in timestamp = 1 * 24 * 60 * 60 = 86400
1 month in timestamp = 365 / 12 * 24 * 60 * 60 = 2628000
1 years in timestamp = 1 * 365 * 24 * 60 * 60 = 31536000

So now we know by each timestamp passing how many tokens can a wallet mint. The min() opcode makes sure that we don't go above the 1B token cap.

Now we need to calculate the amount that was previously minted by the wallet and subtract it by the amount that the wallet can mint (number 2)

```
    min(mul(saturating-sub(single-report(this-address() context(0) 1) deployTimestamp)         
    amountChangePerTimestampPerWallet) div(1000000000 numberOfVerifiedWallets))
```

We check the emissions report to see what was the last time that the wallet has minted, then we calculate the minted amount based on that as we know how many tokens can be minted per timestamp per wallet, then we just subtract number 2 from number 3, ie the amount that can be minted by the wallet minus the amount the wallet has already minted. Which gives us the result that we want.

So the whole expression work as if the wallet is verified then it can mint certain amount of tokens at each timestamp over the span of 10 years capped at 1B.

Without variables & ready to be pasted directly 

**Example**

Here's an example without variables & ready to be pasted directly 

```
    eager_if(equal_to(ITIERV2_REPORT(0xDe61D65dBaBC7274f18c747b6243b03E11933feC context(0)) 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff) 0 sub(min(mul(sub(block_timestamp() 1664806958) 5787037037037037037037) div(1000000000000000000000000000 2)) min(mul(saturating_sub(ITIERV2_REPORT_TIME_FOR_TIER(this_address() context(0) 1) 1664806958) 5787037037037037037037) div(1000000000000000000000000000 2))))
```

And, here is a deployed contract on the Toy Token website to play with - https://toy-token.on.fleek.co/#/token/0x0E56abd2906C3e461300D09032C3C55da2840a61

![](https://i.imgur.com/MbQ9ljv.jpg)

You can see my wallet is eligble to claim a lot. What happens when you connect your wallet?
