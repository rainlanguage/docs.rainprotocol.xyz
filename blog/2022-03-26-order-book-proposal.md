---
slug: order-book-proposal
title: "Order Book proposal"
authors: thedavidmeister
tags: [order-book, proposal]
---

# Rain Orderbook proposal

## Goals

- Mechanism by which users can trade tokens with each other
- Optimised for long term distributions as well as general trading
- Be very clear why this isn't just another curve based AMM
- Works for ERC20 but has a clear path to NFT trading as a future upgrade

## Current situation

We have a finite Sale contract where a sale can start, facilitating one-way buys where the seller defines a curve and a buyer accepts it. The sale ends and at this point is judged "success" or "fail". In the failure case all the purchases can be rolled back by buyers, in the success case all the proceeds are forwarded to the seller in a single transaction.

<!--truncate-->

At a high level the Sale has some limitations:

- It must end for the seller to receive funds so it is not suitable for long term distributions
- It has a single fixed definition so the curve is set once for the sale
- Selling is non-interactive but Buying is fully interactive, requiring buyers to monitor the price curve and place orders as transactions themselves
- The sale sells rTKN not TKN which is important for the failure rollback mechanism but adds a lot of complexity if TKN is intended to be pushed out via. Trades unconditionally

We also have an emissions contract that has a PR up to support long term vesting. The vesting component (WIP) works exactly as an emissions curve but forwards one or more third party tokens rather than minting and sending itself.

Emissions contract is great for long term distributions as it implements a scalable curve based "pull" claim model and handles TKN directly (not rTKN) but has some limitations:

- The tokens cannot have an associated price, they may be throttled by an emissions curve but are still minted/transferred freely according to the schedule
- Setting the emissions curve is non-interactive but claiming is fully interactive, every claim requires a transaction and in the vesting case it is entirely possible for the vesting contract to run out of stock, causing vesting claims to be a race/run on available stock, putting bots and power users at a distinct advantage
- Only a single fixed curve is associated with an emissions contract which means that once stock is deposited and locked in the contract it is subject to risk in the forms of bugs in the curve or changing market conditions etc.

We also have escrows that allow for conditional payment in one direction or another based on the state of some reference contract, which is crucial for TKN distributions based on rTKN, and could in theory be used for more general distribution logic, but this current implementation also has limitations:

- Currently escrow only knows about ISale so it would require awkward adapters to be built for other contexts
- There's no escrow-like functionality available as opcodes so it's all very tied to the concrete implementation of the current contract

There's also the ability to distribute TKN by sending it directly to rTKN after a sale and users can burn their rTKN (one time) to receive the TKN pro rata according to their burn. It's a simple mechanism and supports multiple assets for a single burn but has sharp edges:

- As with any burn based mechanism, it's irreversible and so mistakes can be very expensive for the user
- As a burn mechanism it is inflexible for projects who may want to distribute over time according to rTKN or some other condition, the optimal strategy for a user who suspects future TKN deposits is to never burn so it's difficult or impossible for projects to plan a long term campaign with new ideas over time

## Prior art

Really there's so so many DEXes and most are garbage…

I was very resistant to even the idea of writing a DEX because the landscape for general consumption looks like one of two options:

- Order book based exchange, much like is near ubiquitous across centralised exchanges, where users post bids/asks and any time the price matches a trade completed, e.g. loopring, IDEX, etc.
- LP pool based exchange where a curve sets prices for buyers and LPs provide liquidity by staking tokens to be sold at whatever price the curve dictates, e.g. uniswap, curve, etc.

Both of these suffer problems that are largely unsolved.

The order book model results in users (bots) placing many transactions to modify their trades as the market moves, which is completely beyond the scale that L1 ethereum could handle years ago, let alone years in the future. The only working order book based DEXes that I know of are L2 solutions like loopring or semi-centralized to handle indexing and batching orders, perhaps with only the final trade being fully onchain.

The AMM/pool model works well for tokens that are highly correlated such as stablecoins but for everything else there is serious "divergence loss" that causes LPs to lose money. Typically LPs can only provide liquidity profitably for AMMs as long as they are subsidised somehow from external fees/mints/etc. Which leads to mercenary capital and unsustainable liquidity. For many projects the LM rewards cause too much inflation for their token to handle and ultimately result in market fragility/collapse, and then return to illiquidity.

Further, AMMs generally are highly commoditized to the point of mostly being direct bytecode clones (forks) of each other. They often compete not on innovation or features but on branding and a race to the bottom for fees.

For these reasons, it seems at first glance to make no sense to overlay rain logic:

- Rain opcodes are moderately expensive, so cannot ever compete on gas with ultra-optimized assembly routinely used by leading DEXes
- Price curves for AMMs are subtle and sharp requiring teams of highly educated individuals and millions of $ to innovate on even a tiny amount, not the realm of retail experimenting with opcodes (e.g. major hacks, losses for LPs, or drained pools)
- Everything that makes order books expensive would be even worse with opcodes as opcodes cost more than raw solidity/yul
- There's already hundreds if not thousands of AMM projects, with billions of TVL, so it's hard to see how this is a high-value space to try to move into as a small player with different goals/ideals entirely to e.g. uniswap

## Proposal

Create an orderbook contract.

Users can place both bids and asks in the form of rain scripts. Additionally users can specify an associated rain script that defines the conditions under which a given bid/ask that they deployed can be removed/modified. Users can also specify whether they can withdraw tokens sent as a result of their curve (trade) or whether the curve simply moves tokens in/out of the orderbook contract (tokens moving in are trapped, similar to a burn).

Each user deposits (not just approves) token balances to back the curves, thus each curve can be consumed when the deposited tokens clear, much like orders on a regular orderbook.

Further, the curve can throttle/limit the tokens that can clear much like an emissions schedule, so in addition to the stock limit of deposited tokens, the curve can control how quickly these tokens can be distributed.

This allows trades to complete non-interactively long after the bids/asks were placed and so mitigates the scalability problem of needing a new transaction for every new price.

As a simple illustration of how this is possible, consider a curve that wants to sell TKN at $100 USDT and will decrease the asking price dutch auction style by $1 per block, and a curve that will pay $80 USDT for TKN and increase the bidding price by $1 per block. Clearly the curves will intersect after 10 blocks at $90, and this intersection occurs merely by the curve definitions without further interaction from the users, it's entirely deterministic once the curves are submitted onchain.

Of course, it doesn't entirely remove the second, third, Nth order games that can lead to gas intensive behaviours, as a third participant can see both curves and know they will intersect at $90 and put in a static bid at $91, thus securing the cheapest possible winning bid for themselves.

This is a fundamental problem of information and typically the exact algorithms bots are using to place orders are a closely guarded secret because the games bots play can often themselves be gamed.

For this reason alone it's not possible for this kind of order book to be a general purpose solution as this kind of public algorithm listing is an absolute dealbreaker.

However, a public algorithmic based bid/ask system can be a generalised way to express things like:

- Vesting schedules (0 or infinite price depending on eligibility and throttle)
    - This needs extra state probably, equivalent to emissions, see below
- Token buyback schemes (project deposits some $ stock with a slowly increasing bid until $ are exhausted for TKN)
- Escrow logic (project deposits TKN, if fail ask is infinite and order can be cancelled, if success ask is 0 or finite/reasonable and order cannot be cancelled)
- Single token redeem style rewards (rTKN locked in orderbook contract for supply ratio pTKN release)
- Direct dutch auction or other sale types with no windback (TKN sold direct according to price curve)
- Private liquidity provisioning (Spread asks/bids tracking an external price oracle +/- X% with a capped trade size, with trading restricted to ITier based members)
- Limited price peg management (algorithmically buy/sell around some fixed price point for as long as $/TKN is in stock to do so)
- "Stop loss order" style trades where a bid/ask is placed when the market price (from an oracle) passes some threshold, either on an absolute or relative basis
- Lots of other stuff… probably…


In all these cases, the ability for one or both parties to publicly announce and trustlessly (permanently) commit themselves to offer/take a trade at some price is a feature not a bug. Here the focus is a trust/ecosystem building exercise for some entity, not attempting to extract value directly from being a trader (as a trader with a private off chain algorithm will always have a huge advantage over one that announces a public commitment).

## Executing trades

First obvious question is, how do trades happen?

Consider our simple example of a ask curve from $100 - $1 per block and bid curve of $80 + $1 per block. At this rate the two curves will intersect at $90 but so what? All we have at this point is two curves that evaluate to some number. To actually execute the trade some TKN needs to move from the ask and some $ needs to move to the bid.

In the case that either of the traders are willing to interact this problem is simple, either can submit a transaction that references both curves, the rainVM calculates the prices and sees that they are equal and so clears the funds in each direction.

In the case that both traders are non-interactive we see that 1 block later the ask is $89 and the bid is $91. At this point there's a negative $2 spread, that is to say, both traders would accept trades that leave some money on the table. The orderbook contract could send 1 TKN to the bidder for $91 and send $89 to the asker, keeping $2 set aside and everyone still gets exactly what they asked for. This $2 now becomes our budget to put a bounty up for anon third parties to clear trades. Every block that the negative spread deepens the budget increases by another $2, it's clear that at some point the discrepancy is enough to cover gas fees and net anyone who is paying attention some profit.

In the case that we have a javascript (or even rust) VM, many many bids and asks  curves can be processed (thousands? Millions? billions?) per second off chain, so simple bots should be able to be written to watch orderbook and race to execute profitable bid/ask crossovers. This is NOT good for the chain, to have a bunch of bots race to submit every trade, let's be honest, but it's also exactly how major protocols like maker DAO have always worked for liquidations, so we know it can be effective. The "solution" to both the MEV and spamming is projects like flashbots and similar that have come after it, private mempools and mining consortiums that handle all the racing at the mempool level, so we don't have to fix that.

## Statefulness

This I am not so sure about. How much storage state, if any, should be added to the order book in addition to curve and stock tracking?

At first I would say none, but then it's not clear if/how we could achieve the following:

Throttling on a claims-made basis like we do with emissions/vesting, rather than on a stock level basis. We'd need to track at least the most recent trade like we track claims on emissions to achieve this.

Historical price data to create external-facing oracles. This one sounds nice but is a huge rabbit hole as without something like a uniswap price curve, it's near impossible to see how it wouldn't just be constantly exploited by wash trading.

As usual, everything stateful adds a lot of complexity and gas costs, so I think as much as i'd like to replicate everything emissions can do on the orderbook, a phased approach where we start with a stateless model and gradually add storage would work best.

## Opcodes

I can see some additional opcodes that would be useful for defining trading curves:

- One-way escrow switches that cannot change pass/fail once observed
- Other TOFU (trust on first use) wrappers around interfaces like ISale to consistently observe external reserve/TKN pairings over time, even if the underlying contract is inconsistent
- Chainlink/uniswap oracle interfaces to pull in external price data
- Read from the interface of the proposed staking contract - https://docs.google.com/document/d/1iRQBC1wC3fi2Bh5IRwCeCVSl_uQLLAwmTKH8OQfFBNE/edit#heading=h.4cfzhfuhz9iu

## Impact to codebase

### Contracts

Ideally if everything goes amazingly I'd like to be able to remove all of:

- Burn-to-redeem functionality on rTKN, so it's purely a distribute-then-freeze token
- Standalone escrow contracts that only work with ISale, replaced with orders that can work with anything that can express pass/fail
- Vesting as a function of emissions, moving to vesting as a function of orderbook
