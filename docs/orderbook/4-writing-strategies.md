---
sidebar_position: 5
---
# Writing strategies
Raindex strategies are written in Rainlang.

Rainlang is an extensible, stack-based, domain specific language (DSL) that is interpreted onchain. It is 1-1 readable from deployed bytecode, so no code verification is needed to read a strategy (unlike EVM bytecode).

There is more information and tutorials on writing Rainlang here.

The standard Rain interpreter has words for arithmetic, block specific information (e.g. timestamps), common interfaces (token interfaces, Uniswap, Chainlink etc) and the ability to store and retrieve state across executions.

This means that it's relatively simple to create a extremely wide range of sophisticated strategies.

### Simple strategy
Every strategy must return a max amount and a price ratio, input tokens/output tokens.

The strategy is evaluated at the time of transaction and these values are used to govern movements of tokens between the vaults in the order.
```
max-amount: 100e18,
price: 2e18
```
Note that the max amount is _per execution_. Also, it's a maximum amount. However, enforcing a maximum over the lifetime of the order is possible by tracking state (see below).

### Orders with expiry
An expiry can be added to an order by using the ensure word, for example:
```
:ensure(lt(now(), expiry-timestamp)
```
In this example, `lt` is the word for "less than", `now()` puts the current timestamp on the stack, and `ensure` is a word that will cause the to transaction revert unless the contents is true.

### Dutch order
Strategies can use arbitrarily complex calculations to arrive at a price ratio. However, a simple example is dutch order.
```
start-time: 160000, // timestamp in seconds
end-time: 160600, // 10 minutes later
start-price: 100e18,
rate: 1e16 // 0.01,

:ensure(
    every(
        gt(now() start-time))
        lt(now() end-time)),
    )
), // ensuring we're within the time bounds of the order

elapsed: sub(now() start-time), // get seconds elapsed

max-amount: 1000e18,
price: sub(start-price mul(rate elapsed)) // calculate the price now
```

### Tracking state
Strategies can track state using `set` and `get`. For example, adding these lines to your strategy would ensure it could only clear 5 times.
```
num-of-clears: get(order-hash()), // the order's unique hash is used as a storage key
:ensure(lt(num-of-clears 5)),
:set(add(num-of-clears 1))
```

### Referencing onchain prices
Strategies can reference anything onchain, including price oracles or the swap price from a Uniswap pool. 

The standard Rainterpreter supports the `price` word, which will use the return from some Chainlink oracle.

For example, here's a DCA strategy for purchasing 1000 dollars a month worth of ETH at the current oracle price.
```
seconds-in-month: mul(60 60 24 30),
dollars-per-month: 1000,
dollars-per-second: div(1000 seconds-in-month),
start-timestamp: 1668780839,

/* Create a unique storage key using the order author and order hash */
storage-key: order-hash(),

total-sendable-by-now: mul(dollars-per-second sub(block-timestamp() start-timestamp)),

total-sent: get(storage-key),
sendable-in-this-order: sub(total-sendable-by-now total-sent),

arb-bounty-factor: 999e15,

/* Get the USDT-ETH price from the Chainlink oracle */
usdt-eth: chainlinkprice(0x00 0x00),

/* Calculate the amount and price of the order */
amount price: sendable-in-this-order scale-18-mul(usdt-eth arb-bounty-factor),

/* Update the total amount of dollars sent using the storage key */
:set(storage-key add(total-sent amount);
```


