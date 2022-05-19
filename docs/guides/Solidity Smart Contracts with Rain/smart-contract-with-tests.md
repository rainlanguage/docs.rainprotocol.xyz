---
layout: single
title:  "Rain Protocol: Smart Contract with Tests"
date:   2022-02-21 14:00:23 +0000
categories: development
---

## Setting Up the Environment

For this project, we will use [Hardhat][hardhat], which is a popular tool that describes itself as "A development environment to compile, deploy, test, and debug your Ethereum software". [Click here][hardhat] to read more about the tool.

We will not go into too much detail here about how to set up new `npm` based repositories, but, in order to get started, we will create a new directory and run `npm init` to create a `package.json` file which will contain the list of dependencies which our project will use.

After running the command, and selecting the default options, your `package.json` file should look something like this:

```
{
  "name": "example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

Next we will add hardhat by running `npm install --save-dev hardhat`

## Creating an example

We will now create a basic hardhat project using `npx`. Npx should come bundled with `npm` and is basically [`a CLI tool whose purpose is to make it easy to install and manage dependencies hosted in the npm registry.`][npx]. 

If we run `npx hardhat` we will then create a basic Hardhat project in our project folder (select the `sample project` option for now). You can read more about this process [here][hardhat]. 

Running `npx hardhat` again will give a list of available options which can be used with the tool. You will probably want to select `yes` to the `add .gitignore` option, especially if you are considering creating a git repo of your project. You can do this by running `git init` at this point. Details on how to use git are beyond the scope of this tutorial, but to get started, you can run `git add .` (which will add everything in the current directory EXCEPT everything in `.gitignore` to your repo), and then `git commit --message "My First Commit"`.

## Installing the Rain library

[//]: # (todo might want to add an install for openzepplin too, even though it is a dependency of Rain )

Next we will pull down the Rain Protocol toolset so that we can begin to use the tooling to create our own custom functionality. Run `npm install --save @beehiveinnovation/rain-protocol` in order to add to the dependencies in `package.json`. 

We will now also add a couple more scripts to our `package.json` file for compiling our scripts which use Rain (and running tests for these contracts). Add the following to `package.json`:

```
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test"
  }
```



## Setting the stage for creating a Rain-based Smart Contract

Next we will start to pull in the Rain protocol provided functionality into a contract of our very own. Hardhat will have created a `Greeter.sol` file within the `contracts` directory. This is where we will now add a new contract called `CertifiedAssetConnect.sol`. We can also delete `Greeter.sol`.

We will also need to add `CertifiedAssetConnect` to the `scripts/sample-script.js` file so that running `npm run-script compile` (which runs the command we copied in to our `scripts` in `package.json` above), knows how to compile the `CertifiedAssetConnect.sol` file. We will also do the same for `test/sample-test.js`:

```
  // Replace the Greeter.sol lines with these in scripts/sample-script.js:
  const CertifiedAssetConnect = await hre.ethers.getContractFactory("CertifiedAssetConnect");
  const certifiedAssetConnect = await CertifiedAssetConnect.deploy();

  await certifiedAssetConnect.deployed();

  console.log("CertifiedAssetConnect deployed to:", certifiedAssetConnect.address);
```

```
// Replace all the content in test/sample-test.js with the following:
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertifiedAssetConnect", function () {
  it("Should set the name and deploy the contract", async function () {
    const CertifiedAssetConnect = await ethers.getContractFactory("CertifiedAssetConnect");
    const certifiedAssetConnect = await CertifiedAssetConnect.deploy({name: "myName", symbol: "mySymbol", uri: "myUri"});
    await certifiedAssetConnect.deployed();

    expect(await certifiedAssetConnect.name()).to.equal("myName");
  });
});
```

Running `npm run-script test` or `npm run-script compile` won't yet yeild any results as we have not yet added any content in `contracts/CertifiedAssetConnect.sol`, but if we are doing proper test-driven development, this is what we should expect from the result of adding the code.

## Adding CertifiedAssetConnect.sol

Let us now add the following functionality to `contracts/CertifiedAssetConnect.sol`:

```
// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.12;

// Open Zeppelin imports.
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Rain Imports
import "@beehiveinnovation/rain-protocol/contracts/tier/ITier.sol";
import "@beehiveinnovation/rain-protocol/contracts/tier/libraries/TierReport.sol";

struct CertifiedAssetConnectConfig {
    string name;
    string symbol;
    string uri;
}

contract CertifiedAssetConnect is ERC20 {
    event Construction(address sender, CertifiedAssetConnectConfig config);
    event Certify(address sender, uint256 until, bytes data);
    event Connect(address sender, uint256 id, uint256 amount, bytes data);
    event Disconnect(address sender, uint256 id, uint256 amount, bytes data);

    constructor(CertifiedAssetConnectConfig memory config_)
    ERC20(config_.name, config_.symbol)
    {
        emit Construction(msg.sender, config_);
    }
}
```

This will serve as a base extension of an ERC20 contract before we add Rain based functionality.

Now when we run `npm run-script compile` or `npm run-script test`, our code should still fail. This is because the version of solidity we are using for this is: `pragma solidity ^0.8.12;`, and the hardhat setup will likely have added:

```
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.10",
};
```

To `hardhat.config.js`, so go ahead and change this to `0.8.10` and the compilation and tests should run correctly. (If you get a warning about Solidity 0.8.12 not being fully supported, don't worry about this for now, although things may be very different if you are reading this after February 2022).

You can see the repo with the code up to this point [here][repo-stage-base].

[discord]: https://discord.gg/dzYS3JSwDP
[hardhat]: https://hardhat.org/getting-started/
[npx]: https://www.freecodecamp.org/news/npm-vs-npx-whats-the-difference/
[repo-stage-base]: https://github.com/unegma/rain-examples/releases/tag/stage-base