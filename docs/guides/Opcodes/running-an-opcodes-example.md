---
layout: single
title:  "Rain Protocol: Running an Opcodes examples"
date:   2022-01-21 14:00:23 +0000
categories: development
---

## Intro

This article will take the developer through an example of how to get the Rain Protocol code running on their machine, and then writing a test which handles and processes opcodes for performing a very simple piece of functionality. 

Please be aware, this project is under constant development, and these examples are likely to change. We would love your feedback on this article so please join our [Discord][discord] server in order to discuss with us and other like-minded developers who may also be able to help with any questions.

## Setting Up

In order to begin with this example, the developer should clone the [rain-protocol repo from Github][github]. Next, as a quick overview, the Rain VM Opcodes can be found in `contracts/vm`, The Rain Specific opcodes are then under the `contracts/vm/ops` directory.

Please be aware, whist Opcodes in files under `ops` are zero indexed, e.g. `/// Opcode for addition. uint constant public ADD = 0;` in `MathOps.sol`; when used for creating a DAPP, the user will use a different integer for performing additions. This is because opcodes from the `ops` directory are added to the end of the array of opcodes in RainVM.sol.
                                                                                                                                                                                                                                                            
## Running some code

Now that you have the code on your local machine, you will run an example from the `test/VM` directory, and then write your own test which will perform functionality using the Rain Specific Opcodes.

If you go ahead and open `RainVM.sol.ts`, we can see a set of tests that have been written using Opcodes. Before we are able to run these tests though, we will need to set up the environment for running them.

Setting up the environment has been made incredibly easy by the team, and you should only need to run `curl -L https://nixos.org/nix/install | sh` (to install nix) and then `nix-shell` which will use nix for automatically bootstrapping the required environment (see README.md in case this process has changed). 

PLEASE BE AWARE THAT YOU MAY HAVE TO CLOSE THE TERMINAL AND REOPEN IT AFTER RUNNING `nix-shell`.  Tests can then be run from outside the nix-shell by using the command `nix-shell --run 'hardhat test'`. 

## Writing a test

We will now write our own test which will multiply two numbers, and look at what is going on in the example.

Copy the following code into RainVM.sol.ts:

```
  it("should multiply two numbers", async () => {
    this.timeout(0);

    const constants = [2, 4];

    const source = concat([
      op(Opcode.MUL, 2), // number of things operating on
      op(Opcode.VAL, 1),
      op(Opcode.VAL, 0),
    ]);

    const calculatorFactory = await ethers.getContractFactory("CalculatorTest");
    const calculator = (await calculatorFactory.deploy({
      sources: [source],
      constants,
      argumentsLength: 0,
      stackLength: 6,
    })) as CalculatorTest & Contract;

    const result = await calculator.run();
    const expected = 8;
    assert(result.eq(expected), `wrong maximum ${expected} ${result}`);
  });

```

If you now run the test again, you should see all tests passing.

## Understanding the test

Let's look at what is happening in the test line by line:

`const constants = [2, 4];` First we define an array of two numbers which we will multiply together.

We will now write the source code which will define what the program needs to do. Please be aware that order is important in this part:

```
const source = concat([
  op(Opcode.MUL, 2), // number of items operating on
  op(Opcode.VAL, 1),
  op(Opcode.VAL, 0),
]);
```

`Opcode.MUL` specifies that the user wants to use the Muliplication Opcode, and then the `erand` is set to `2` as there are two numbers being multiplied.
`Opcode.VAL` with erands 1 and 0 define the positions in the `constants` array (so 2 and 4 respectively).

A calculator object is then created and deployed via `calculatorFactory` from `ethers`. This calculator is passed the source code and the constants value, and the length of the stack is set to `6` which is in this instance, the number of ops in the source multiplied by 2 (however this will not always be the case).

Finally, the result is obtained by running the calculator, and the the result checked against the expected value.

## Conclusion

And that is it for writing your first piece of Domain Specific Language using the Rain virtual machine. The possibilities are enormous, whilst the risk to companies using the tooling reduced, due to the limited set of functionality provided by the RainVM.

From here, check out the other Opcodes in the vm directory and see what else you can create. And remember to join our [Discord][discord] to keep up with developments! 

[discord]: https://discord.gg/dzYS3JSwDP
[github]: https://github.com/beehive-innovation/rain-protocol