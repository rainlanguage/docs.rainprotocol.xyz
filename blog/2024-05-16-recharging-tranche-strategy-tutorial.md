---
slug: recharging-grid-strategy-tutorial
title: "Deploying a market making strategy with Raindex"
authors: [dcatki, highonhopium]
tags: [market making, strategy, raindex]
---

Efficient market making is crucial for providing liquidity and stabilizing token prices. Raindex offers a powerful toolset for deploying bespoke market making strategies that can dynamically respond to market conditions.

These strategies are:
- 100% onchain and perpetual (trade while you sleep)
- Self custodial (nobody else handles your tokens)
- Don't require any bot infra (the open Raindex solver network actually clears transactions)

One such strategy is the Recharging Grid Strategy, which ensures continuous liquidity and effective price discovery through an innovative recharging mechanism.

## What is the Recharging Grid Strategy?

The Recharging Grid Strategy involves setting firm prices for batches of tokens, known as "tranches." These tranches form a stepped price curve, which can be used to manage buy and sell orders programmatically. The strategy stands out due to its ability to "recharge" tranches, meaning that as each tranche clears, more tokens become available at predefined prices. This recharging mechanism allows the strategy to adapt to market movements and maintain liquidity over time.

Key features of the Recharging Grid Strategy include:

- Continuous Liquidity: By "recharging" the batches of tokens available at each price, the strategy ensures that liquidity is always available, helping to smooth out market fluctuations.
- Dynamic Pricing: The strategy adjusts prices based on market conditions, enabling efficient price discovery.
- Arbitrage Opportunities: When market prices move into or past a tranche, arbitrage opportunities arise, promoting active trading and liquidity.

For a detailed explanation of how the Recharging Grid Strategy works, including its parameters and configuration options, you can refer to the [strategy documentation](/raindex/example-strats/recharging-grid-strategy).

In this blog post, we will guide you through the process of deploying a market making strategy using Raindex, specifically focusing on the Recharging Grid Strategy. Whether you are a trader looking to capitalize on market volatility, a market maker aiming to provide continuous liquidity, or a token issuer managing your treasury, this strategy could be for you.

## Example strategy wFLR / eUSDT
> Use the [recharging grid strategy](https://gist.github.com/thedavidmeister/d1c21bb3a6d6ebedcd44cdc70ce42597).

In this strategy I sell wFLR when it is greater than $0.03 and buy when it is less than $0.03 and I can set increasing sell/buy sizes as the price diverges from the starting point.

This is a great treasury management or token management strategy for believers in Flare.

### Market conditions
The strategy works well while the token price is initially ranging around $0.03 and I've got capital to deploy or tokens to liquidate as it diverges significantly. 

### Network parameters
First I go to Raindex pubstrats and fork the [tranche grid strategy](https://gist.github.com/thedavidmeister/d1c21bb3a6d6ebedcd44cdc70ce42597).

Then I enter the network details, in this case Flare. I label each parameter so these don't conflict with my app settings. 

```
networks: 
  flare-tranche: 
    rpc: https://rpc.ankr.com/flare 
    chain-id: 14
    network-id: 14
    currency: FLR
    
subgraphs:
  flare-tranche: https://subgraphs.h20liquidity.tech/subgraphs/name/flare-0xb06202aA
  
orderbooks:
  flare-tranche:
    address: 0xb06202aA3Fe7d85171fB7aA5f17011d17E63f382
    network: flare-tranche
    subgraph: flare-tranche

deployers:
  flare-tranche:
    address: 0x550878091b2B1506069F61ae59e3A5484Bca9166
    network: flare-tranche

tokens:
  flare-wflr:
    network: flare-tranche
    address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d
  flare-eusdt:
    network: flare-tranche
    address: 0x96B41289D90444B8adD57e6F265DB5aE8651DF29
```


### Token Parameters
Then I enter tokens I want to trade. In this case it's wFLR and eUSDT. I get the contract address either from the Raindex pubstrats or from [Flarescan](https://flarescan.com/). Note I can have a basket of tokens not just a pair.

```
tokens:
  flare-wflr:
    network: flare-tranche
    address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d
  flare-eusdt:
    network: flare-tranche
    address: 0x96B41289D90444B8adD57e6F265DB5aE8651DF29
```

### Orders & Vaults
I put up my buy and sells with the relevant orderbook and my vaults. I can deposit and withdraw tokens into this vault after my order is deployed.

```
orders:
  # vault-id generated with `openssl rand -hex 32`
  flare-tranche-buy:
    orderbook: flare-tranche
    inputs:
      - token: flare-wflr
        vault-id: 0x562bd75e19e548420f9f3da43a7d7d67c6344580256b952c9214192c445d6043
    outputs:
      - token: flare-eusdt
        vault-id: 0x562bd75e19e548420f9f3da43a7d7d67c6344580256b952c9214192c445d6043
  flare-tranche-sell:
    orderbook: flare-tranche   
    inputs:
      - token: flare-eusdt
        vault-id: 0x562bd75e19e548420f9f3da43a7d7d67c6344580256b952c9214192c445d6043
    outputs:
      - token: flare-wflr
        vault-id: 0x562bd75e19e548420f9f3da43a7d7d67c6344580256b952c9214192c445d6043
```

### Scenarios
I set up the parameters that are consistent across both buy and sell scenarios (to learn more about these [read the reference](/raindex/example-strats/recharging-grid-strategy)). These include:
* Subparser details
* How many seconds a tranche space lasts for
* Tranche space recharge delay
* Tranche space shyness
* Minimum trade size (diff)
* Snap threshold
* IO ratio multiplier

```
scenarios:
    flare-tranche-tranches:
        network: flare-tranche
        deployer: flare-tranche
        orderbook: flare-tranche
        bindings:
          uniswap-words: 0xb1d6D10561D4e1792A7c6B336b0529e4bFb5Ea8F

          orderbook-subparser: 0xF836f2746B407136a5bCB515495949B1edB75184

          tranche-space-per-second: 11574074074074

          tranche-space-recharge-delay: 300

          tranche-space-shyness: 9e17

          min-tranche-space-diff: 1e17

          tranche-space-snap-threshold: 1e16

          io-ratio-multiplier: '''io-ratio-multiplier-identity'
```

### Buy scenarios
Specific scenarios for buying wFLR including base price, growth rates for tranche prices, tranche amounts and growth rates. Here we also define the simulations and later the chart details. 

```
        scenarios:
          buy:
            bindings:
             
                amount-is-output: 1
                io-ratio-expr: '''linear-growth'
                io-ratio-base: 33e18
                io-ratio-growth: 3e18
                tranche-size-expr: '''linear-growth'
                tranche-size-base: 10e18
                tranche-size-growth: 1e18
            scenarios:
              initialized:
                bindings:
                  initial-tranche-space: 0
                scenarios:
                  prod:
                    bindings:
                      get-last-tranche: '''get-last-tranche-prod'
                      set-last-tranche: '''set-last-tranche-prod'
                      plottables: '''plottables-prod'
                  test:
                    runs: 100
                    bindings:
                      get-last-tranche: '''get-last-tranche-test-init'
                      set-last-tranche: '''set-last-tranche-test'
                      plottables: '''plottables-test'
                      test-last-update-time: 0
                      test-now: 0
              test:
                  runs: 10000
                  bindings:
                    get-last-tranche: '''get-last-tranche-test'
                    set-last-tranche: '''set-last-tranche-test'
                    plottables: '''plottables-test'
                    max-test-tranche-space: 20e18
                    test-last-update-time: 0
                    test-now: 0
```


### Buy deployment visualisation
The first chart section tells us viusally what our strategy is doing. Here it is showing me that:
1. I will be spending $10 buying FLR in the first tranche
2. With a FLR per USD of 33 (or a Flare price of $0.0303)
3. Which means I buy 330 FLR in the first tranche ($10 tranche with 33 tokens per $1)
4. Strategy will start at the first tranche

![Screenshot 2024-05-06 at 16.35.41](https://hackmd.io/_uploads/BksCudIMA.png)

This aligns with my expectations which means I can move forward.
  
### Buy charts simulation
The second chart section tells us visually what our strategy is doing based on running simulations on my device. We fork the blockchain and then simulate according to the parameters in the strategy. Here we can see we've selected 10,000 simulations with a max tranche space of 20, so we only simulate 20 tranches. 

The first chart shows us that we purchase 330 FLR in the first tranche, and then that we increase the amount of FLR per tranche, purchasing approx 2,500 FLR at tranche 20.

The second chart (io-ratio) shows the number of FLR purchased per USD spent, which also increases in a stepwise fashion as designed. 

The third chart shows that we spend an increasing amount of USD per tranche, which makes sense as we want to buy more FLR as the market drops.

The fourth chart shows the price we are paying for 1 FLR in USD, which shows a decrease in price per FLR as our tranches increase. 

The fifth chart shows our starting tranche:

![Screenshot 2024-05-06 at 16.38.42](https://hackmd.io/_uploads/B1CtKdUzC.png)


### Sell scenarios
Specific scenarios for selling wFLR including base price, growth rates for tranche prices, tranche amounts and growth rates. Here we also define the simulations and later the chart details. 


```
          sell:
            bindings:
                amount-is-output: 0
                io-ratio-expr: '''linear-growth'
                io-ratio-base: 3e16
                io-ratio-growth: 1e16
                tranche-size-expr: '''linear-growth'
                tranche-size-base: 10e18
                tranche-size-growth: 1e14
            scenarios:
              initialized:
                bindings:
                  initial-tranche-space: 1e18
                scenarios:
                  prod:
                    bindings:
                      get-last-tranche: '''get-last-tranche-prod'
                      set-last-tranche: '''set-last-tranche-prod'
                      plottables: '''plottables-prod'
                  test:
                    runs: 100
                    bindings:
                      get-last-tranche: '''get-last-tranche-test-init'
                      set-last-tranche: '''set-last-tranche-test'
                      plottables: '''plottables-test'
                      test-last-update-time: 0
                      test-now: 0         
              test:
                runs: 10000
                bindings:
                  get-last-tranche: '''get-last-tranche-test'
                  set-last-tranche: '''set-last-tranche-test'
                  plottables: '''plottables-test'
                  max-test-tranche-space: 20e18
                  test-last-update-time: 0
                  test-now: 0
```


### Sell deployment visualisation
The first chart section tells us viusally what our strategy is doing. Here it is showing me that:
1. I will be selling 333 FLR in the first tranche
2. And I receive $10 USD for the sales
3. Which means my effective sell price is 0.03
4. Strategy will start at the first tranche

![Screenshot 2024-05-06 at 16.45.37](https://hackmd.io/_uploads/BybVjd8z0.png)

Again this lines up with my expectations. 

### Sell charts simulation
The sell chart simulation is the same as the buy chart simulation, except that it covers selling, not buying wFLR.

The first chart shows our starting tranche.

The second chart (io-ratio) shows the number of FLR sold per USD spent which also increases in a stepwise fashion as designed. Here we are selling more FLR per USD as the FLR price increases.

The third chart shows that we spend the same USD per tranche. We may also consider a strategy where we sell more USD per tranche as tranches increase either linearly or exponentially. 

The fourth chart is the same as io-ratio, and shows our effective price per tranche.

The fifth chart shows the number of FLR we sell per tranche. 

![Screenshot 2024-05-06 at 16.47.01](https://hackmd.io/_uploads/ByZti_IGR.png)

### Checking it executes live

Using Raindex I added the orders and then funded the vault.

You can see the orders:

0x5259dd5154f7d8478cb395cd5b7c2e574384ded28872712a185336e2e2f84915
0x8f5fd9e9ea6015d9939818828184ee9811ca10035cf28e71d64b17a79022102c