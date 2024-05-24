---
sidebar_position: 5
---
# Basic examples

You'll find examples of strategies that you can try deploying, modifying and simulating on Github.

https://github.com/rainlanguage/raindex.pubstrats

Here are some of the strategies we've created so far. Most of these use the [Flare Time Series Oracle (FTSO)](https://flare.network/ftso/), a decentralized oracle available only on Flare. To allow users to access the FTSO price feeds in their strategies, there is a Flare-only subparser which extends the standard set of words available.

Note that these aren't necessarily fit for production use, as they are meant primarily as educational examples. Please be careful and always DYOR.

Note: These examples use Wrapped Flare (WFLR) instead of FLR, as Raindex works with ERC20 tokens only. To wrap some Flare head to the [Flare Portal](https://portal.flare.network/).

## DCA Order

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/flr-dca-cooldown.rain)

This strategy will buy some token based on the price of an Flare Time Series Oracle (FTSO) pair.

The strategy has a cooldown specified in seconds, e.g. 300 = 5 minutes. It will not buy while the cooldown is active, so overall the strategy functions like a dollar cost averaging process.

<div style={{ position: 'relative', paddingBottom: '64.63%', height: 0 }}>
    <iframe
      src="https://www.loom.com/embed/0fefdaa232b545939ce4167f7d8aaaac?sid=ac750cb4-1960-44e7-b0d0-7dce25a61cbd"
      frameborder="0"
      allowFullScreen
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    ></iframe>
  </div>

## Dutch Order

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/flr-dutch-order.rain)

This strategy will sell a token based on the price of an FTSO pair.

It is designed as an auction and will only trade once.

From the start time, the strategy will offer to sell a token at a percentage of the FTSO price. Each second, some percentage will be deducted from the price. For example, if that percentage per second is 0.1% and 10 seconds have elapsed, the strategy will make an offer at 99% of the FTSO price.

## Market order

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/flr-ftso-market-order.rain)

This strategy will offer an amount at a price that is just below the market price coming from the FTSO.

<div style={{ position: 'relative', paddingBottom: '64.63%', height: 0 }}>
    <iframe
      src="https://www.loom.com/embed/ad96c2fb0490407ca55ee237181d7320?sid=52021bb9-238f-4e13-9cb0-efd11a69fcca"
      frameborder="0"
      allowFullScreen
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    ></iframe>
  </div>

## Stop limit

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/flr-stop-limit.rain)

This is a simple stop-limit order that will sell at the limit price if the FTSO oracle price drops below a stop price.

The order has a internal switch to check that it only runs once.

<div style={{ position: 'relative', paddingBottom: '64.63%', height: 0 }}>
    <iframe
      src="https://www.loom.com/embed/b384e166b6ba40218c2c1576db3b06b5?sid=106c773d-eef7-4f57-a433-20975623bf76"
      frameborder="0"
      allowFullScreen
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    ></iframe>
</div>

## FTSO spread

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/ftso-spread.rain)

This strategy is intended to be deployed as two separate orders.

One order represents selling WFLR for WETH (i.e. the output is WFLR). One order represents buying WFLR for WETH (i.e. the input is WFLR).

Both orders read from the onchain FTSOs to get the pair price and then offer a spread either side of the oracle price. The spread is calculated by multiplying the io-ratio by a number larger than 1e18.

E.g. a 1% spread means the multiplier should be 101e16.

The concept of "buying" and "selling" is represented by the input and output tokens being reversed, and the FTSO base/quote being set accordingly.

## Oracle sampler

[Get the strategy](https://raw.githubusercontent.com/rainlanguage/raindex.pubstrats/main/src/learning/flare/ftso-sampler.rain)

Saves up to N most recent values from an FTSO oracle with a cooldown between each sample.

The strat takes 0 input and offers an auction as a bounty, paying more the longer the strat has been off cooldown for. This mitigates unpredictable gas costs without significantly overpaying the counterparty for the service of sampling the FTSO.

The strat intentionally does no trading itself, it merely samples data and stores it under a predictable set of keys. Other strats can then be written that are read-only over these keys, keeping the overall system decoupled and easy to manage. As long as the sampler vault has enough WFLR in it to cover gas, there is an incentive for solvers to keep sampling indefinitely every time the strat comes off cooldown.
