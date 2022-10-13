---
layout: single
title:  "Using the Rain SDK to Deploy Your First Rain Contract"
date:   2022-04-14 14:00:23 +0000
categories: various
---

## Intro

_This example uses version [`rain-sdk@0.0.1-alpha.7`][rain-sdk] of the sdk_

In this tutorial, we will take you through how to deploy a [Gated NFT][token-gating] using [Rain Protocol's SDK][rain-sdk], all in under 100 lines of code ([full example here][full-example]). We will assume you know how to set up a [browser based wallet][metamask]. We will also use the Polygon Mumbai Testnet, so you will need some [Testnet Matic tokens][mumbai] to pay for transaction fees.

You are welcome to use your favourite frontend framework instead of the provided boilerplate code (there is a more complex [example which uses React][react-example] for reference if you want some inspiration, the example for which is deployed at https://examples.rainprotocol.xyz/deploy-gatednft-example).

PLEASE ALSO NOTE, this very minimal example uses [`importmap`][system-js] as part of the boilerplate code, this feature, at the time of writing, is relatively new and we found was only working in the Chrome browser; the [example using React][react-example] should work in all modern browsers.

## Adding the Files

For this very short example, you will only need 3 files: `index.html`, `index.js` and `package.json`.

### package.json

Let's first create `package.json`:

```json
{
  "name": "sdk-tutorial",
  "description": "",
  "type": "module",
  "version": "1.0.0",
  "main": "index.js"
}
```

Let's not talk too much about what is happening here, but with the [`npx serve`][npx] command, you can run the example which will be using this configuration file.

### index.html

Next let's create `index.html`:

```html
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

This is mostly boilerplate code which is pulling in `index.js` and importing the dependencies ([`rain-sdk`][rain-sdk] and [`ethers`][ethers]) using the `importmap` feature.

If you use the code for this tutorial along with a frontend framework, instead of `importmap`, you will use `dependencies` in `package.json` and the `node_modules` folder.

### index.js

Finally lets add `index.js` where we will add the main code for running this example:

```javascript
import * as rainSDK from "rain-sdk";
import { ethers, BigNumber } from "ethers";

export async function gatedNFTExample() {
  try {

  } catch (err) {
    console.log(err);
  }
}

gatedNFTExample();
```

We are able to import the sdk and the classes from `ethers` due to the previous `importmap` which included their code using the [unpkg][unpkg] CDN which is a CDN wrapper around npm.

## Adding the Functionality

Let's first add some defaults and constants to the codebase:

```javascript
const CHAIN_ID = 80001;
const gatedNFTState = {
config: {
  name: 'My Gated NFT',
  symbol: 'myGNFT',
  description: 'My Gated NFT can be used to token gate things',
  animationUrl: '',
  animationHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  imageUrl: 'https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg',
  imageHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
},
tier: '0xcd953b94999808ee07a33860dd46689580c90cf4',
minimumStatus: 2,
maxPerAddress: 2,
transferrable: 0,
maxMintable: 10,
royaltyRecipient: "",
royaltyBPS: 10
}
```

Here we have defined the Chain ID of Polygon's Mumbai Testnet, which we will be using to run the example. As previously mentioned, to deploy you contract, you will need some [Testnet Matic][mumbai].

Next, we create some defaults to be used in the deployment of our contract. Feel free to experiment with changing the parameters. You can check over the [docs for the smart contract][docs] for extra details about the inputs.

Within our `try` block, we will now add the most basic code possible for connecting to your browser wallet, in a production environment, you will want to add proper handling for other scenarios such as switching networks:

```javascript
const {ethereum} = window;

if (!ethereum) {
  console.log("No Web3 Wallet installed");
}

const provider = new ethers.providers.Web3Provider(ethereum, {
  name: 'Mumbai',
  chainId: CHAIN_ID,
});

// Prompt user for account connections
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();
const address = await signer.getAddress(); // your wallet address
console.log(`Signer:`, signer);
console.log(`Address: ${address}`);
```

Next we need to convert a few of the default parameters before deploying:

```javascript
// convert royaltyBPS to BigNumber format
gatedNFTState.royaltyBPS = BigNumber.from(
  Math.floor(gatedNFTState.royaltyBPS * 100)
);

// set YOU to be the recipient
gatedNFTState.royaltyRecipient = address;
```

This will convert one of the parameters to a BigNumber format (see [docs][docs] for more info), and secondly, we will set the `royaltyRecipient` to the Browser wallet address, (i.e. your address).

Finally, we will deploy the contract and `await` the result:

```javascript
const result = await rainSDK.GatedNFT.deploy(
  signer,
  gatedNFTState
);

console.log(result);
```

As we have abstracted away most of the complex functionality into the SDK, deploying is as easy as using these few lines of code.

After approving the transaction and waiting for a very short moment, you should be able to see the result (the deployed contract's address) in the `console` in your browser.

## Conclusion

And that is a wrap on deploying your very first smart contract with Rain! If you are wondering where to go next, [seeing how to integrate this example with React][react-example] would be a great next step ([demo here][react-example-live]).

Any questions, feel free to [reach out to us in our Discord][discord]. Happy buidling!

[token-gating]: https://medium.com/@jshanks21/nft-meaning-token-gating-ad83aef7cccd
[telegram]: https://t.me/+w4mJbCT6IfI2YTU0
[docs]: /
[react-example]: https://github.com/beehive-innovation/examples.rainprotocol.xyz/tree/master/src/examples/DeployGatedNFTExample
[react-example-live]:  https://examples.rainprotocol.xyz/deploy-gatednft-example
[unpkg]: https://unpkg.com/
[mumbai]: https://faucet.polygon.technology/
[metamask]: https://www.youtube.com/watch?v=6h_liI6atEk
[system-js]: https://www.digitalocean.com/community/tutorials/how-to-dynamically-import-javascript-with-import-maps
[npx]: https://stackoverflow.com/questions/50605219/difference-between-npx-and-npm
[rain-sdk]: https://github.com/beehive-innovation/rain-sdk
[ethers]: https://github.com/ethers-io/ethers.js/
[full-example]: https://github.com/unegma/sdk-tutorial