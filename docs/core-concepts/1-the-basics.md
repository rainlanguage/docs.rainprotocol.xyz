---
sidebar_position: 2
---

# The basics - what is Rain?

> Rain is a framework that aims to simplify smart contracts and make them more accessible to a wider audience.
> 
> The goal of Rain is to further decentralize the industry - make contracts more readable, make centralized solutions more visible, increase developer accessibility and create new applications and business models.

### What you'll learn
* The problem with smart contracts
* Current solutions
* How Rain does things differently

### Why it matters
You'll understand how Rain approaches decentralization and how using Rain can foster trust with users and make your contracts more scalable.

## The problem with smart contracts

The problem with smart contracts is that a **very small group of people can actually read and write them**.

The promise and ethos of crypto, the reason this industry has any value at all is very simple. It is in the title of the original Satoshi whitepaper.

> Bitcoin: A **Peer-to-Peer** Electronic Cash System

If crypto isn't peer to peer it is nothing.

The Ethereum Virtual Machine (EVM) took "cash" one (large) step further to "contracts" with the introduction of general purpose opcodes that could do things like math, reading/writing data from long term storage, manipulating memory and a stack, interacting with other contracts, etc.

Do you know what `PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10` does? A typical defi contract contains 10s of thousands of these.

Would you put your family finances or a multi million dollar business deal on the line based on your level of understanding of the raw opcodes in any contract? How many people do you think there are on the planet who know what these opcodes do?

If any peer in a "peer to peer electronic contract system" doesn't understand what the terms of a contract they are signing are, how can the contracts possibly be used safely by anyone?

7 years in to Ethereum's life and we still see major hacks of smart contract platforms weekly (daily?) and the total value of exploits seems to only be getting larger as adoption increases while security remains elusive.

It's a fairly reasonable layman definition of "being hacked" to say "something unexpected happened with your money".

With that definition, understanding what code does is the same as security.

## Current solutions

### For reading
A partial solution exists in the form of platforms like Etherscan that allow authors to "verify" their contract by uploading some Solidity code. However, the authors may not upload the source, or they may upload it with missing or misleading documentation. Even if they upload everything, Solidity contracts are typically large and subtle, there are many places that something can go wrong.

Generally end users cannot read Solidity, and even if they can it's not at all obvious where a bug or exploit might be. Solidity may be 1000 times easier to read than EVM bytes, but still 1000 times beyond what would be needed for "mainstream" users to read it safely.

### For writing
There are many solutions that exist to make writing smart contracts easier. Libraries like Open Zeppelin provide base contracts that can be extended with custom code. Wizard based code-generators may allow you to pick from a menu of features for a contract. However, these solutions always produce new compiled bytecode, which then requires new audits to build trust with users.

Hyperstructures, immutable contracts with no admin keys, allow for creating new, user-configured versions of a contract, but the options available quickly become limited.

Another "solution" is upgradeability. Since nearly nobody other than the authors and their auditors understand the code, upgradeable contracts have become completely normalized. This means that developers give themselves the ability to unilaterally change deployed code in its entirety at any moment using their private key. There's no real expectation that end users either fully understand any contract, or that their understanding of the contract today is relevant to the functionality tomorrow.

### An example
Consider a new ERC20 token that requires custom logic for who can mint and how much they can mint. This is typically achieved by taking a base ERC20 contract from Open Zeppelin and hiring a developer to write additional Solidity code to incorporate these rules. After compiling and deploying the contract, the community's trust might be established by an audit from a professional auditor. However, most users are unable to independently review and audit the code.

## How Rain does things differently

Rain has two primary goals:
* Making smart contracts easier to read
* Making contracts easier to write (but without sacrificing readability)

This is fundamentally grounded in our belief that accessibility is the difference between theoretical and practical decentralisation. There are many people who would like to participate in authoring and auditing crypto code but currently cannot. When someone wants/needs to do something but cannot, then they delegate to someone who can - this is by definition centralisation.

How does Rain work in practice? This will be explored in greater detail later, but in essence, Rain allows smart contracts to offload some of their internal logic to an on-chain interpreter. This logic is written in a high-level language called Rainlang, which has been designed for ease of readability and writeability.

Take our earlier example. Imagine that instead of requiring a newly compiled contract for every token, instead we could write an expression for our minting rules in Rainlang.

`if(greater-than(erc20-balance-of(token-address user-address) 50) 1000 2000)`

Which means "If the user has more than 50 of some token, 1000 else 2000".

Given that the underlying contract used has built up enough trust (perhaps it's been used 100s or 1000s of times without issue), a reader or developer _only_ needs to think about the logic for when this token can be minted.

Contracts written by developers using Rain can be configured and upgraded without requiring a redeployment of the entire contract, and without giving the developers the ability to unilaterally change the contract's code. This makes it easier for developers to write secure and upgradeable smart contracts, and provides a higher level of trust and transparency for end users.

This serves Rain's goal of decentralization:
* If users can read other people's expressions they don't need auditors.
* If users can write their own expressions they don't need devs.

## Key takeaways
* Rain is a framework aimed at simplifying smart contracts and making them more accessible to a wider audience
* The current state of smart contracts has a problem in that only a small group of people can read and write them
* Rain has two main goals: to make smart contracts easier to read and to make them easier to write (while maintaining readability)
* Rain achieves this by allowing smart contracts to offload internal logic to an on-chain interpreter written in Rainlang, a high-level language designed for readability and writeability
* The goal of Rain is to decentralize the industry by increasing accessibility, creating new applications and business models, making contracts more readable, and making centralized solutions more visible