---
sidebar_position: 1
title: Overview
hide_title: true
---
<img class="inline-logo-light" src="/img/raindex-logo-light.svg" />
<img class="inline-logo-dark" src="/img/raindex-logo-dark.svg" />

Raindex is an onchain orderbook contract that enables users to deploy complex, onchain strategies for managing token trades.

Unlike traditional order books, Raindex orders contain dynamic algorithms that express how tokens should move between vaults.

Strategies are expressed using Rainlang, a domain specific language that is interpreted onchain. Every strategy must evaluate to a maximum amount and a price ratio for a trade; but other than that, strategies are near-infinitely flexible. In addition, Rainlang itself is permissionlessly extensible - the protocol allows for many interpreters supporting many possible versions of the language.

Rather than doing token approvals, users deposit their tokens into **vaults**, which are like virtual accounts within the orderbook. Orders reference input/output vaults. There can be many inputs and many outputs for an order, e.g. a user could accept a numer of different stables for WETH. Different order can also reference the same vaults, which allows for even more sophistication when building meta-strategies.

Once an order placer deploys their strategy onchain, it is live perpetually until removed. It is not expected that an order placer pays the gas to continually execute their strategy. Instead, the protocol naturally encourages an ecosystem where fillers capitalize on arbitrage opportunities, ensuring active strategy execution without burdening the original order placer. Arbitrage may be between two orders on the orderbook, or between an order and some external liquidity.

<figure>
<img src="/img/rain-order.png" />
<figcaption style={{textAlign: 'center'}}>A Raindex order</figcaption>
</figure>

In this way, Raindex supports an intents-like system. Users can deposit their tokens and define their strategies, without being concerned with the specifics of how their order is filled.

<figure>
<img src="/img/orderbook-protocol.png" />
<figcaption style={{textAlign: 'center'}}>How the protocol works for different participants</figcaption>
</figure>

### Benefits
- Flexible - there is no limit to the strategies that can be expressed. Strategies are algorithmic, not parameterized
- Specific - the order strategy will always receive exactly what it asks for
- Non-custodial - users are 100% in control of their assets
- Permissionless - there are no separate mempools or APIs required for using the protocol
- Decentralized - no fees or admin keys - once deployed, the orderbook cannot be upgraded, modified or paused
- Composable - because everything happens onchain, developers are free to build on top of the protocol

### Uses
Although it is called an orderbook, onchain programmable liquidity opens up a range of other uses:
- Vesting schedules (0 or infinite price depending on eligibility and throttle)
- Token buyback schemes (project deposits some $ stock with a slowly increasing bid until $ are exhausted for TKN)
- Escrow logic (project deposits TKN, if fail ask is infinite and order can be cancelled, if success ask is 0 or finite/reasonable and order cannot be cancelled)
- Single token redeem style rewards (using signed data provided at the time of taking an order)
- Direct dutch auction or other sale types
- Private liquidity provisioning (Spread asks/bids tracking an external price oracle +/- X% with a capped trade size)
- Limited price peg management (algorithmically buy/sell around some fixed price point for as long as $/TKN is in stock to do so)
- "Stop loss order" style trades where a bid/ask is placed when the market price (from an oracle) passes some threshold, either on an absolute or relative basis
- Lots of other stuff...

### Why onchain?

The choice to have an orderbook entirely onchain may seem unintuitve at first, but with the maturity of EVM scaling solutions the gas cost for deploying and managing perpetual strategies becomes more feasible. And doing things onchain has some crucial benefits.

#### Transparency
Onchain operations are fully visible to all participants in the network. Every order, every strategy, and every transaction can be audited and verified by any party, ensuring a high degree of trust and accountability.

#### Security
By having Raindex and strategies onchain, we leverage the inherent security of the EVM, ensuring that orders and strategies are tamper-proof and immutable once they're deployed.

#### Decentralization
An onchain orderbook is not controlled by any single entity or centralized server. This means there's no single point of failure, and it's resistant to any potential shutdowns, censorship, or external control.

#### Interoperability
Being onchain allows Raindex to seamlessly interact with other onchain protocols, smart contracts, and decentralized applications. This opens up avenues for enhanced functionality, integrations, and collaborations in the decentralized ecosystem.

#### Zero latency
With onchain operations, strategies are evaluated in the same block as the trade itself. Any onchain data referenced is up to date, and trade calculation and execution is atomic.

#### Custody and Control
Users retain full custody of their assets when interacting with the onchain orderbook. Unlike centralized platforms where funds are often held by the platform, here, assets remain in users' control until the moment a trade is executed, ensuring maximum security and autonomy.

#### Permissionless Innovation
An onchain infrastructure allows for permissionless interactions. Anyone can build upon, integrate with, or propose enhancements to Raindex without seeking approvals or access permissions. This fosters an environment of open innovation and continuous improvement.