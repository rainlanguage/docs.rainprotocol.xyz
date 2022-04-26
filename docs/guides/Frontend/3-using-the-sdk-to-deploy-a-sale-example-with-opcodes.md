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

The defaults and constants we will use for the Sale deployment are as follows:

```
const CHAIN_ID = 80001;
const saleState = {
  canStartStateConfig: undefined,
  canEndStateConfig: undefined,
  calculatePriceStateConfig: undefined,
  recipient: "",
  reserve: "0x25a4dd4cd97ed462eb5228de47822e636ec3e31a",
  saleTimeout: 100,
  cooldownDuration: 100,
  minimumRaise: 1000,
  dustSize: 0
};
const redeemableState = {
  erc20Config: {
    name: "Raise token",
    symbol: "rTKN",
    distributor: "0x0000000000000000000000000000000000000000",
    initialSupply: 1000,
  },
  tier: "0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de",
  minimumTier: 0,
  distributionEndForwardingAddress: "0x0000000000000000000000000000000000000000"
}
```

As in the [previous tutorial][previous-tutorial] we have defined the Chain ID of Polygon's Mumbai Testnet, which we will be using to run the example. As previously mentioned, to deploy you contract, you will need some [Testnet Matic][mumbai].

Next, we create some defaults for the states of both the `sale` and the `redeemable` (standard erc20 config) to be used in the deployment of our contract. You can check over the [docs for the smart contract][docs] for extra details about the inputs with which you can experiment.

### Add the Connection

Within our `try` block, we will now add the most basic code possible for connecting to your browser wallet, in a production environment, you will want to add proper handling for other scenarios such as switching networks:

```
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

// v Configuration code below this line
```

### Add the Expected Output

We will now add the deployment and expected output, between which we will next put the rest of the code.

```
// ^ Configuration code above this line

saleState.recipient = address;

console.log(
  "Submitting the following state:",
  saleState,
  redeemableState
);

const result = await rainSDK.Sale.deploy(
  signer,
  saleState,
  redeemableState
);

console.log(result); // the Sale contract and corresponding address
```

### The Configuration

This part is slightly more complex than in the [previous tutorial][previous-tutorial] as it will include the use of Opcodes. Rain makes it easy to create very bespoke configurations for our Virtual Machine.

We won't go into too much detail about the VM here, but what we will be doing, is passing over a small stack of `uint256` values that will be feeding into the wrapping solidity code. This will enable us to configure the parameters for buying these contract's tokens.

#### canStartStateConfig and canEndStateConfig

Let's pass the first two sets of configuration needed (see the [React Example][react-example] for a more complex example of passing opcodes to detect can start/end is after now or not).

```
saleState.canStartStateConfig = {
  sources: [
    ethers.utils.concat([
      rainSDK.VM.op(rainSDK.Sale.Opcodes.VAL, 0),
    ]),
  ],
  constants: [1],
  stackLength: 1,
  argumentsLength: 0,
};

saleState.canEndStateConfig = {
  sources: [
    ethers.utils.concat([
      rainSDK.VM.op(rainSDK.Sale.Opcodes.VAL, 0),
    ]),
  ],
  constants: [1],
  stackLength: 1,
  argumentsLength: 0,
};
```

We won't go into too much depth as to what is happening here, the next section will cover a more configurable example, but if you are working with Rain Opcodes, this is the standard 'Opcodes block' format you will see and work with regularly.

#### calculatePriceStateConfig

```
// current buy units: amount want to buy, put into stack
// token address
// returns current token balance

// define the parameters for the VM which will be used whenever the price is calculated, for example, when a user wants to buy a number of units
// the order is important
//
saleState.calculatePriceStateConfig = {
  sources: [
    ethers.utils.concat([
      // put onto the stack, the amount the current user wants to buy
      rainSDK.VM.op(rainSDK.Sale.Opcodes.CURRENT_BUY_UNITS), //

      // put onto the stack, the current token balance of the user (the Sale's rTKN represented in the smart contract)
      rainSDK.VM.op(rainSDK.Sale.Opcodes.TOKEN_ADDRESS),
      rainSDK.VM.op(rainSDK.Sale.Opcodes.SENDER),
      rainSDK.VM.op(rainSDK.Sale.Opcodes.IERC20_BALANCE_OF),

      // add the first two elements of the stack (current buy units and balance of that user)
      rainSDK.VM.op(rainSDK.Sale.Opcodes.ADD, 2),

      // here we have a potential new value which we will compare to walletCap

      // and then check if it exceeds the walletCap (ie the amount allowed)
      rainSDK.VM.op(rainSDK.Sale.Opcodes.VAL, 1),// walletCap ()
      rainSDK.VM.op(rainSDK.Sale.Opcodes.GREATER_THAN), // this will put a boolean on the stack (true: 1, false: 0)

      // this will behave like a minimum wallet cap, so you cant buy below this amount
      // rainSDK.VM.op(rainSDK.Sale.Opcodes.LESS_THAN), // this will put a boolean on the stack (true: 1, false: 0)

      // eager if will get the 1st (result of greater than) and 3rd value
      rainSDK.VM.op(rainSDK.Sale.Opcodes.VAL, 2), // `MaxUint256` this will be executed if the check above is true (this is an infinity price so it can't be bought)
      rainSDK.VM.op(rainSDK.Sale.Opcodes.VAL, 0), // `staticPrice` this will be executed if the check above is false (staticPrice is the price that the user wants to exchange the tokens for)
      rainSDK.VM.op(rainSDK.Sale.Opcodes.EAGER_IF),
    ]),
  ],
  constants: [100, 10, ethers.constants.MaxUint256], // staticPrice, walletCap, MaxUint256 (ffff..) todo check if staticPrice/walletCap needs to be parsed (divide by 18 0s?)
  stackLength: 10,
  argumentsLength: 0,
};
```

#### Final Configuration

Now to add the final configuration (make sure it continues to be above this line: `// ^ Configuration code above this line`.

```
// convert the initial supply into the correct format
redeemableState.erc20Config.initialSupply = ethers.utils.parseUnits(
  redeemableState.erc20Config.initialSupply.toString()
);

// set the recipient to your wallet address
saleState.recipient = address;
```

## Conclusion

And that is a wrap on deploying a Sale contract with Rain! If you are wondering where to go next, [seeing how to integrate this example with React][react-example] would be a great next step ([demo here][react-example-live]).

Any questions, feel free to [reach out to us in our Discord][discord].

[previous-tutorial]: https://example.com
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
[full-example]: https://github.com/unegma/sdk-tutorial-sale