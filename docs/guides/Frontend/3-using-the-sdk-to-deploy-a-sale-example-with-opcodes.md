---
layout: single
title:  "Using the SDK to Deploy a Sale Example with Opcodes"
date:   2022-04-14 14:00:23 +0000
categories: various
---

## Intro

In this tutorial, we will take you through how to deploy a [Sale][sale] using [Rain Protocol's SDK][rain-sdk]. We will assume you have already completed the [previous tutorial][previous-tutorial] and are therefore familiar with using the Polygon testnet. This tutorial will follow a similar configuration.

PLEASE AGAIN NOTE, this very minimal example uses [`importmap`][system-js] as part of the boilerplate code, this feature, at the time of writing, is relatively new and we found was only working in the Chrome browser; the [example using React][react-example] should work in all modern browsers.

## Adding the Files

For this very short example, you will only need 3 files: `index.html`, `index.js` and `package.json`.

### package.json

Let's first create `package.json`:

```
{
  "name": "sdk-tutorial-sale",
  "description": "",
  "type": "module",
  "version": "1.0.0",
  "main": "index.js"
}
```

Let's not talk too much about what is happening here, but with the [`npx serve`][npx] command, you can run the example which will be using this configuration file.

### index.html

Next let's create `index.html`:

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
    <script type="importmap">
      {
        "imports": {
          "rain-sdk": "https://unpkg.com/rain-sdk@0.0.1-alpha.7/dist/rain-sdk.esm.js",
          "ethers": "https://unpkg.com/ethers@5.6.2/dist/ethers.esm.js"
        }
      }
    </script>
    <script type="module" src="./index.js"></script>
</body>
</html>
```

This boilerplate code is slightly different to the example in the previous tutorial, so please make sure you copy exactly. 

### index.js

Finally lets add `index.js` where we will add the main code for running this example:

```
import * as rainSDK from "rain-sdk";
import { ethers, BigNumber, utils } from "ethers";

export async function saleExample() {
  try {
  
  } catch (err) {
    console.log(err);
  }
}

saleExample();
```

## Adding the Functionality



[token-gating]: https://medium.com/@jshanks21/nft-meaning-token-gating-ad83aef7cccd
[discord]: https://discord.gg/dzYS3JSwDP
[docs]: https://docs.rainprotocol.xyz
[react-example]: https://github.com/beehive-innovation/examples.rainprotocol.xyz/tree/master/src/examples/DeployGatedNFTExample
[react-example-live]:  https://examples.rainprotocol.xyz/deploy-gatednft-example
[unpkg]: https://unpkg.com/
[mumbai]: https://faucet.polygon.technology/
[metamask]: https://www.youtube.com/watch?v=6h_liI6atEk
[system-js]: https://www.digitalocean.com/community/tutorials/how-to-dynamically-import-javascript-with-import-maps
[npx]: https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm
[rain-sdk]: https://github.com/unegma/rain-sdk
[ethers]: https://github.com/ethers-io/ethers.js/