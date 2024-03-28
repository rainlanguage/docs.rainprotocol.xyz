---
sidebar_position: 2
---
# Order lifecycle
Understanding the lifecycle of an order within the Raindex is crucial for both users looking to place orders and those aiming to interact with them.

As yet there is no generic web based GUI front end for the Raindex protocol. Active users of the orderbook currently use scripts or bespoke front ends developed for a specific project.

However, regardless of how a user interacts with orderbook, the flow is the same. Here's a step-by-step breakdown of an order's journey:

### Order Lifecycle

**Strategy writing**: A user formulates a strategy using Rainlang and decides on the tokens they want to trade.

**Order Deployment**: Once the strategy is ready and tokens are deposited, the user deploys the order onchain. At this point, the order is live on the network but has not yet been executed.

**Token Depositing**: They deposit the necessary tokens into a vault within the Raindex. Vaults act like virtual accounts for the order.

**Order Discovery**: Other participants can discover live orders. They can evaluate the strategy's conditions, price ratios, and potential profits.

**Order Execution**: When a participant (often referred to as a "filler") finds an order they want to interact with and the strategy's conditions are met, they execute the order. This involves the specified tokens moving between the designated input and output vaults as per the order's strategy.

**Order Completion**: After successful execution and settlement, the order's lifecycle concludes. Depending on the strategy's design, an order might be a one-time event or could remain live, waiting for the next execution that meets its conditions.

**Order Removal**: If an order placer decides they no longer want their strategy to be live, they can remove the order from the orderbook. This action might be due to changing market conditions, or simply a change in strategy.

**Token Withdrawal**: At any point, if the user decides to retrieve their tokens, they can initiate a withdrawal from their vault, transferring the tokens back to their EOA or smart contract wallet.