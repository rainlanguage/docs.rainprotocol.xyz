---
sidebar_position: 5
---
# Recharging Grid Strategy

## Introduction
The Recharging Grid Strategy offers a firm price for batches of tokens via a publicly visible and continual spread backed with real liquidity.

This strategy shares similarities with a traditional [grid strategy](https://www.investopedia.com/terms/g/grid-trading.asp), which involves placing a series of buy and sell orders at predefined intervals above and below a set price.

> Example: in the traditional forex market, a trader decides to use a grid strategy for EUR/USD, with the current price at 1.2000. The trader sets up buy orders at 1.1950, 1.1900, and 1.1850, and sell orders at 1.2050, 1.2100, and 1.2150. Each order size is 1,000 units. As the market moves, these orders get filled, allowing the trader to profit from price movements.

For the purposes of this document, the batch of tokens available at a specific price can also be referred to as a "tranche". Aggregated, these tranches form a stepped price curve:

- A sell curve can be used to liquidate treasury or to help even out spikes in the market price by offering additional liquidity.
- A buy curve can be used to "buy the dip" or become a buyer of last resort at decreasing prices.

When the market price moves into or past a tranche, an arbitrage opportunity is created, causing tokens in the tranche to clear. Each time a batch of tokens fully clears, a new batch is made available in the next tranche. Tranches can partially or fully clear, and multiple tranches can clear in a single trade.

<figure> 
    
<img src="https://hackmd.io/_uploads/BkIQdhif0.png" />

<figcaption>Tranche-Space Strategy: Visual representation of the tranche curve where the y-axis indicates the price and the x-axis indicates the tranche number. The curve demonstrates how the recharging tranche strategy functions for both buying and selling.</figcaption>
    
</figure>

## What does it mean to "recharge"?

The key addition to this strategy vs traditional grid strategies (apart from the fact it's onchain and completely algorithmic) is that it "recharges". This means instead of each order being filled only once, the strategy will continually make more tokens available over time.

Importantly, the tranches recharge in order back to the starting point, ie if a higher sell tranche continues to clear out as it recharges, the lower priced tranches will not offer any tokens. This allows the strategy to "track" and dynamically respond to the market.

## When would you use this strategy?
#### As a trader
- Trading in a volatile market within a range.
- Increasing TKN holdings by offering a spread that cycles through peaks and troughs.

> Example: A trader notices that Bitcoin (WBTC) experiences significant price volatility within a range of $45,000 to $50,000. Using the recharging tranche strategy, the trader sets the highest buy tranche at $47,000 and the lowest sell tranche at $48,000. Each tranche contains 0.1 WBTC, and the price of each subsequent tranche increases by $500 for sells and decreases by $500 for buys. As the market fluctuates, these tranches allow the trader to buy WBTC when the price drops to $47,000 or lower and sell WBTC when the price rises to $48,000 or higher, continually capitalizing on market movements within this range.

#### As a market maker
- Liquidate tokens above a target price, provide buy support below.
- Continuously offer liquidity within a specific price band.
- Adjust liquidity based on price movements.
- Cease liquidity provision within a specified price range.

> Example: A market maker wants to provide liquidity for a Gold-backed token (GLD) within the $1,800 to $1,900 range. The highest buy tranche is set at $1,820 and the lowest sell tranche at $1,880. Each tranche contains 10 GLD, with the price of subsequent sell tranches increasing by $10 and buy tranches decreasing by $10. This setup allows the market maker to buy GLD when the price drops to $1,820 or lower and sell GLD when the price rises to $1,880 or higher, providing continuous liquidity and profiting from the spread.

#### As a token issuer
- Build treasury by liquidating tokens above a target range.
- Act as a buyer of last resort below a specific range.
- Buy or sell tokens in varying amounts as the price fluctuates.

> Example: A new decentralized finance (DeFi) project issues its own token (DFT) and wants to manage its treasury. The issuer sets the highest buy tranche at $1.80 and the lowest sell tranche at $2.20, with each tranche containing 1,000 DFT. The price of each subsequent sell tranche increases by $0.10 and each buy tranche decreases by $0.10. This allows the project to sell tokens when the price exceeds $2.20 and buy tokens back when the price drops below $1.80, ensuring continuous market participation and maintaining token liquidity.

## Variants and control levers

Almost everything about the strat is parameterized and chartable, e.g.
* The algorithms that determine the price and amount of each tranche
* The recharge rate and delay before the passive recharge starts to kick in
* Whether the amounts per tranche are denominated in the input or output token
* Whether the strategy is buying or selling TKN
* An optional conversion between the input/output token and some external price, e.g. converting WETH in a vault to USD equivalent.

You'll see these options in the strategy YAML frontmatter.

### Growth curve
The growth curves can govern the amount of tokens in each tranche as well as the price jump between each tranche. 

These can be:
- **Linear** - same differential between tranches
- **Exponential** - differential grows each tranche. 

### Start price
Every tranche curve has a price for the first tranche, either:
- The lowest price in a sell curve, where subsequent tranches will be at ever higher prices
- The highest price in a buy curve, where subsequent tranches will be at ever lower prices

### Start tranche
Regardless of where the curve starts, when deploying the strategy you may decide to "initialise" at some tranche >1.

Consider a sell curve where the price for the first tranche is $1, and each tranche increases linearly by 10c, e.g. the 5th tranche will be priced at $1.50.

If the market is currently sitting at $1.57, when you deploy the strategy it's likely the first 5 tranches would immediately clear ($1.10, $1.20 etc), as all of those tranches are making an offer below the market and there is a clear arbitrage opportunity.

To deal with this undesirable outcome we can initialise the strategy in the 6th tranche, or in other words, we can initialise the strategy as if tranches 1-5 have already cleared.

### Recharge rate
The recharge rate is defined by how many tranches we move through in a second. For the purposes of the rate, 1e18 is one tranche.

For example, to recharge tranches once per day:

```
seconds in a day = 60 * 60 * 24 = 86400
recharge rate = 1e18 / 86400 = 11574e9
```

What does this mean in practice? Consider the example above, where we have initialised our strategy in tranche 6, which means we have tokens available for $1.60. The market starts at $1.57, and for the first 24 hours it hovers at that value, edging up to just under $1.60.

Tranches always recharge **in order** back to the first tranche, so immediately tranche 5 starts to recharge (ignore the delay for now, explained below).

This means that over the course of the day, as that tranche recharges, there will be arbitrage opportunites and we'll see a full tranche of tokens clear at $1.50.

### Recharge delay
After a tranche is fully cleared, there is a configurable delay before the tranche starts recharging.

This pause enables the strategy to offer the next tranche at a different price, adapting to market conditions. Tokens from two tranches cannot clear in a single trade, so at the tranche boundary we need to provide some time to allow the market to move into the next tranche, before recharging the previous one.

The default delay is set to 5 minutes (300 seconds), which generally provides a good balance between allowing a reaction to the market, and maintaining fluid trading.

### Shy liquidity
When a tranche is fully cleared, the strategy may introduce the next tranche partially, a concept known as "shy liquidity." Here’s how it works:

- Partial Activation: Instead of immediately offering the full amount of the next tranche, a fraction is made available. For example, if tranches are set to be 90% shy (i.e., 9e17), clearing a tranche completely will start the next tranche at 10% of its maximum size. This gradual introduction helps manage liquidity more efficiently.
- Capital Efficiency: By only partially activating the next tranche, the strategy reduces the capital requirements needed to adjust prices as the market moves.

Shyness Setting: The shyness parameter can be adjusted:
- Non-zero Shyness: If set to a value less than 1e18, it ensures that only a portion of the tranche is initially available. For example, with 90% shyness, only 10% of the next tranche is activated upon clearing the previous one.
- Zero Shyness: If set to 0, each tranche will be fully available as soon as it is entered.

It’s important to note that shyness must be less than 1e18 to avoid skipping tranches entirely.

### Minimum trade size
Because clearing a tranche causes a delay, somebody could grief the strategy by clearing the smallest possible trade every time the current tranche started to recharge. To mitigate this, we can set a minimum trade size.

## Parameters

At the time of writing, specific variables that can be configured in [tranche-space.rain](https://github.com/rainlanguage/rain.dex.pubstrats/blob/main/src/tranche-space.rain) are below. 

| **Parameter Name**               | **Description**                                                                                                                                                                                |
|----------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tranche-space-per-second`       | The amount of tranche space that is recharged per second as a normalized 18 decimal fixed point value.                                                                                          |
| `tranche-space-recharge-delay`   | The duration in seconds that no recharging occurs after a trade happens, allowing the market to stabilize and adapt to the recent trade.                                                        |
| `tranche-size-expr`              | The expression to calculate the tranche size for the current tranche space.                                                                                                                     |
| `tranche-size-base`              | The base tranche size, which is the size of the smallest tranche, denominated in the output token.                                                                                              |
| `tranche-size-growth`            | The exponential growth factor of the tranche size, represented as a decimal 18 fixed point number (e.g., 1e16 represents 1% growth per tranche).                                                |
| `io-ratio-expr`                  | The expression to calculate the input/output ratio (IO ratio) for the current tranche space.                                                                                                    |
| `io-ratio-base`                  | The base IO ratio, represented as a decimal 18 fixed point number, which applies at tranche space 0 and grows according to the growth factor per tranche.                                        |
| `io-ratio-growth`                | The exponential growth factor of the IO ratio, represented as a decimal 18 fixed point number (e.g., 1e16 represents 1% growth per tranche).                                                    |
| `reference-stable`               | The stable token used as a reference for the TWAP to offer dollar-equivalent conversions.                                                                                                       |
| `reference-stable-decimals`      | The number of decimals of the reference stable token.                                                                                                                                           |
| `reference-reserve`              | The token used to compare against the reference stable token to calculate the TWAP for dollar-equivalent conversions.                                                                            |
| `reference-reserve-decimals`     | The number of decimals of the reserve token.                                                                                                                                                    |
| `twap-duration`                  | The duration in seconds of the TWAP window for dollar-equivalence conversions.                                                                                                                   |
| `twap-fee`                       | The Uniswap fee tier to use for the TWAP.                                                                                                                                                       |
| `min-tranche-space-diff`         | The minimum tranche space difference allowed per trade, represented as a decimal 18 fixed point number. Prevents dusting the strategy to stop it from recharging.                              |
| `tranche-space-snap-threshold`   | The threshold in tranche space to snap to the nearest tranche, avoiding dust issues at the edges.                                                                                               |
| `initial-tranche-space`          | The initial tranche space when the order is first deployed.                                                                                                                                     |
| `get-last-tranche`               | The binding to get the last tranche space and update time.                                                                                                                                      |
| `set-last-tranche`               | The binding to set the last tranche space and update time.                                                                                                                                      |
| `tranche-space-shyness`          | The shyness of the liquidity in tranches, as a decimal 18 fixed point number. For example, 9e17 represents 90% shyness.                                                                         |
| `test-tranche-space-before`      | The value returned by `get-test-last-tranche` to allow the tranche space before to be bound for testing.                                                                                        |
| `test-last-update-time`          | The value returned by `get-test-last-tranche` to allow the last update time to be bound for testing.                                                                                            |
| `test-now`                       | The value returned by `get-test-last-tranche` to allow the current time to be bound for testing.                                                                                                |
| `io-ratio-multiplier`            | The binding to get the IO ratio multiplier.                                                                                                                                                     |
| `amount-is-output`               | Indicates whether the amount is an output or input amount. Non-zero means output (i.e., normal orderbook behavior), zero means input.                                                           |
| `plottables`                     | The binding for additional items to plot during testing.                                                                                                                                       |
| `uniswap-words`                  | The subparser for the Uniswap words.                                                                                                                                                            |
| `orderbook-subparser`            | The subparser for the orderbook.                                                                                                                                                                |
| `plottables-test`                | Additional plottables for testing scenarios, including amount, IO ratio, input amount, and effective price.                                                                                      |
| `plottables-prod`                | Additional plottables for production scenarios, including amount and IO ratio.                                                                                                                  |
