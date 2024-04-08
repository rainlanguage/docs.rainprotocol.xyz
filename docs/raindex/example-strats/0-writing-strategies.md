---
sidebar_position: 5
---
# Writing strategies
Raindex strategies are written in Rainlang.

Rainlang is an extensible, stack-based, domain specific language (DSL) that is interpreted onchain. It is 1-1 readable from deployed bytecode, so no code verification is needed to read a strategy (unlike EVM bytecode).

The standard Rainterpreter has words for arithmetic, block specific information (e.g. timestamps), common interfaces (token interfaces, Uniswap, Chainlink etc) and the ability to store and retrieve state across executions.

This means that it's relatively simple to create a extremely wide range of sophisticated strategies.

The best way to get started is to tinker with [an example](./1-examples.md). If you need help, [jump into our Telegram group](https://t.me/+w4mJbCT6IfI2YTU0). There'll usually be someone there who can answer your questions.

### Outputs
Every strategy must return a max amount and a price ratio for the input/output tokens.

The strategy is evaluated at the time of transaction and these values are used to govern movements of tokens between the vaults in the order.
```
max-amount: 100e18,
price: 2e18
```
Note that the max amount is _per execution_. Also, it's a maximum amount. However, enforcing a maximum over the lifetime of the order is possible by tracking state (see below).

### Tracking state
Strategies can track state using `set` and `get`. For example, adding these lines to your strategy would ensure it could only clear 5 times.
```
num-of-clears: get(order-hash()), // the order's unique hash is used as a storage key
:ensure(lt(num-of-clears 5)),
:set(add(num-of-clears 1))
```

### Ensure word
An expiry can be added to an order by using the ensure word, for example:
```
:ensure(lt(now(), expiry-timestamp)
```
In this example, `lt` is the word for "less than", `now()` puts the current timestamp on the stack, and `ensure` is a word that will cause the to transaction revert unless the contents is true.

### Other tips for writing 

- Consider whether your amount is a max or is supposed to be exact. If it's exact you may want to add additional checks.
- Use random vault ID's so you don’t get collisions with your other orders’ vaults
- Hash the order-hash into your set/get keys so you don’t get collisions with other orders
- Consider including a bounty into your price so that people are more incentivized to take your order and can cover their own gas etc
- All orders are perpetual and by default can be taken an infinite number of times. Consider including a throttle, budget or a one-way switch if you don’t want the default behaviour.
- Double check all your decimal sizings, e.g. 1e15 etc.
- Double check all the addresses you are using and ensure they are correct for the network.
- Consider quote binding out certain stack items if you want to fuzz and chart.