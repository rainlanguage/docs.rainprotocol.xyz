---
sidebar_position: 4
---

# Security model

> Rain's security model relies on Lindy, no admin keys and the readability of expressions. This allows users to make informed choices about the contracts they interact with, without needing to delegate their trust to a 3rd party.

### What you'll learn
* Embracing the chaos
* User choice
* Lindy
* Readability

### Why it matters
> If you're unsure how Rain can truly provide both flexiblity and security, this article will explain how the Rain security model deeply informs the design of the framework.

## Embracing the chaos

As we saw in Architecture, the Rain ecosystem is modular and permissionlesss. Anybody can write a Rain-aware contract, and anybody can write an interpreter. It's reasonable to wonder, given that this is an extremely chaotic system that will be full of bugs and hacks, how can we possibly hope to surface anything useful?

The answer is "we won't, you will". 

It can be tempting to place trust in an authority - smart people with big budgets who make bigger promises. The problem is that this a system risk, and will always encourage perverse incentives. Rain's goal is to create a system that is **anti-fragile**.

![](https://i.imgur.com/9Tlp1gw.jpg)

An anti-fragile system isn't damaged by disorder, but instead actually becomes stronger.

## User choice

We mentioned earlier that placing trust in 3rd parties is a threat to decentralisation. This is why user choice is one of the most important aspects of the Rain security model. This is a different kind of social contract, one that emphasises transparency and curation over permission.

We want users to be able to make informed decisions about the contracts they interact with. Again, this could be a Rain-aware contract, or could be an interpreter being used to execute an expression.

The user needs to always be in control and have access to multiple layers of curation, each focused on a specific outcome and degree of decentralization. For this we can lean on a model pioneered in the space by sites such as Token Lists and Chainlist. If a user encounters an expression using an unknown interpreter, they can cross-reference their trusted lists, or make a decision based on their own understanding of the interpreter. This decision-making process applies to all participants, both human and bot, on a per-expression basis.

For the whole system to work, everyone needs the option be a full particpant in the infrastructure. This is why all of the Rain contracts and tooling libraries are open source and fully open for participation.

## Lindy

Key to Rain's security model is the concept of Lindy, a term that represents the security of a contract based on its length of time in use and the value it holds or has handled. To put it simply, the longer a contract has been in use without bugs or exploit, and the more valuable it is, the higher its Lindy score and the more secure it is deemed to be.

A "contract" in this context could be an interpreter or a Rain-aware contract. Imagine an interpreter has been used 1000s of times without issue. This interpreter would accrue a significant amount of Lindy, and users can take that into account when deciding whether to use it. A brand new interpreter may elicit more caution for users, who would be less likely to trust it.

Or, a "contract" could be a Factory contract. Factory contracts are a well established pattern, creating newly cloned children without any new bytecode being deployed. If the factory contract and their children are all immutable, the children can all share Lindy.

Again take our example of a new ERC20 token. Users could deploy new tokens via the factory, and all the children would accrue Lindy the longer they are used without bug or exploit.

This is where using Rain becomes incredibly powerful. Someone who wants a new token can make a new clone, but still customise its behaviour using an expression. Someone who wants to trade or mint the token can take into the account the Lindy score of *all* tokens from the factory whilst carefully self-auditing the expression.

For this to work there cannot be admin keys for contracts. As soon as somebody modfies the behaviour of a contract via an admin key, the Lindy is reset.

Even better, when the bytecode is known, a contract can share its Lindy score with the same deployed bytecode on any other EVM-compatible chain. This helps to mitigate the risk of malicious code being used, and reduces the need for users to trust developers to manage deployments.

## Readability

We've covered this already, but its important to emphasise again. Another important aspect of Rain's security model is the requirement for scripts to be readable and writeable by the average spreadsheet user. This makes it easy for users to self-audit the functionality of the contracts that they interact with.

## Key takeaways

* Rain's security model is based on the concept of Lindy, which represents the security of a contract based on its length of time in use and the value it holds or has handled.
* The security model also emphasizes user choice, enabling users to make informed decisions about the contracts they interact with by accessing open-source dashboards, an open-source JavaScript simulator, and multiple layers of curation.
* The readability of scripts is also important for the security model, as it makes it easier for users to self-audit the functionality of the contracts they interact with.
* The Rain ecosystem is designed to be fully participatory, with all contracts and tooling libraries being open source.