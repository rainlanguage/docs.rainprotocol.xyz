---
layout: single
title:  "Gating Your Sale with NFTs"
date:   2022-04-14 14:00:23 +0000
categories: various
---

## Intro

We will now begin to combine knowledge gathered from the previous tutorials in order to show how the composability side of Rain works.

In a previous tutorial, you created a Sale which allowed users to buy a custom Digital Object (in that case, an NFT), in exchange for another Digital Object (in that case a digital currency)

If you remember, this sale was configured using a `tier` contract even though we didn't specifiy any configuration for this. We will now deploy another Sale, but this time use a custom Tiering system.

## Creating the Asset for use with Tier Gating the Sale

If you did the GatedNFT tutorial, we will now begin by using the same code in order to create a custom NFT, send one to our address, then create a Sale with a requirement for 2 of these tokens (so we can see a fail happening). We will then send ourselves a second token so that we can participate in the sale.

Please note, we can tier gate this Sale with any type of digital object, not just a Gated NFT (to which, as with fractals, we can add gating requirements).

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
