---
layout: single
title:  "Using the SDK to Create a Gated NFT"
date:   2022-04-12 14:00:23 +0000
categories: various
---

# Set Up

In this tutorial, we will take you through an example of using the sdk to deploy a gatedNFT.

Set up a new React Typescript project using `npx create-react-app my-app --template typescript`.

We will now add a few default parameters to a file called `defaults.json`

```
{
  "gatedNFT": {
    "config": {},
    "name": "My Gated NFT",
    "symbol": "myGNFT",
    "description": "My Gated NFT can be used to token gate things",
    "animationUrl": "",
    "animationHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "imageUrl": "https://thumbs.dreamstime.com/b/gold-badge-5392868.jpg",
    "imageHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "tier": "0xcd953b94999808ee07a33860dd46689580c90cf4",
    "minimumStatus": 2,
    "maxPerAddress": 2,
    "transferrable": 0,
    "maxMintable": 10,
    "royaltyRecipient": "",
    "royaltyBPS": 10
  }
}
```
Which we will include in our `App.tsx` like so: `import defaults from "./defaults.json";`

# Adding the SDK

We will now need to install the SDK and import it as well. Run `npm install @unegma/rain-sdk` (please note, this is a temporary package whilst we fix a few issues with `rain-sdk`). Import `GatedNFT` like so: `import { GatedNFT } from "@unegma/rain-sdk";`

We will also need to install the `ethers` library for making common blockchain based calls. `npm install ethers` and then include: `import {BigNumber, ethers} from "ethers";`

# Tying it together

Lets now create a provider object using the `ethers` library, which we will connect to the Polygon Mumbai network:

```
// todo deal with this tsignore
// @ts-ignore
const { provider } = window;
const provider = new ethers.providers.Web3Provider(provider, {
    name: 'Mumbai',
    chainId: 8001,
});
```

This provider will use your default Wallet installed in your browser (if you want to create a version which uses a non-browser-based wallet, there are plenty of other options, including WalletConnect)


[//]: # (todo the example can be found here:)