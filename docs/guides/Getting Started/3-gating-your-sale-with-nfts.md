---
layout: single
title:  "Gating Your Sale with NFTs"
date:   2022-04-14 14:00:23 +0000
categories: various
---

## Intro

We will now begin to combine knowledge gathered from previous tutorials in order to show how composability works with the Rain ecosystem.

In a previous tutorial, we created a Sale which allowed users to buy custom Digital Objects (rTKN), in exchange for other Digital Objects (a Digital Currency).

If you remember, the Sale was configured using a pre existing Tier contract even though we didn't specify any configuration for this. We will now deploy another Sale, but this time use a custom Tier system.


## Overview

As an overview, this tutorial will show you how to do the following in this order: 

1. Create an Asset (Digital Object/NFT) which the User is required to own in order to take part in the Sale.
2. Create a Tier 'barrier' which connects with the Asset and is responsible for allowing (or not) access to the Sale based on ownership.
3. Create the Sale and connect the Tier system (which is connected to the Asset). The Sale will then be using this system when users want to take part.

Finally:
* We will demonstrate the Sale failing if the User (you) do not have the required access token.
* We will mint an Asset for the User (i.e. we will send you one of these NFTs).
* We will demonstrate the Sale passing after the User is given an access token (i.e. we will allow you to buy from the Sale).

As always, you will need Polygon Mumbai Testnet Matic tokens for this tutorial, for both network fees AND for buying from the Sale. 

## Creating the Asset for use with Tier Gating the Sale

If you followed the GatedNFT tutorial, we created a custom NFT and specified parameters for how it should work. We will now create another NFT for token gating a Sale.



## 


[full-example]: https://github.com/unegma/sdk-tutorial-sale
[sale]: https://docs.rainprotocol.xyz/smart-contracts/sale/
[previous-tutorial]: https://docs.rainprotocol.xyz/guides/SDK/using-the-rain-sdk-to-deploy-your-first-rain-contract
[token-gating]: https://medium.com/@jshanks21/nft-meaning-token-gating-ad83aef7cccd
[discord]: https://discord.gg/dzYS3JSwDP
[docs]: https://docs.rainprotocol.xyz
[react-example]: https://github.com/beehive-innovation/examples.rainprotocol.xyz/blob/master/src/examples/DeploySaleExample/DeploySaleExample.tsx
[react-example-live]:  https://examples.rainprotocol.xyz/deploy-sale-example
[unpkg]: https://unpkg.com/
[mumbai]: https://faucet.polygon.technology/
[metamask-tutorial]: https://www.youtube.com/watch?v=6h_liI6atEk
[system-js]: https://www.digitalocean.com/community/tutorials/how-to-dynamically-import-javascript-with-import-maps
[npx]: https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm
[rain-sdk]: https://github.com/beehive-innovation/rain-sdk
[ethers]: https://github.com/ethers-io/ethers.js/
[full-example]: https://github.com/unegma/sdk-tutorial-sale
[opcodes]: https://en.wikipedia.org/wiki/Opcode
