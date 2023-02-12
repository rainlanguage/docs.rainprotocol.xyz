---
sidebar_position: 5
---

# Rainlang

> Rainlang is a simple on-chain language for writing Rain expressions.

### What you'll learn
* A simple language for writing expressions
* How to read Rainlang
* Words

### Why it matters
> Learning Rainlang is important for two reasons: first, it allows you to self-audit contracts you are interacting with. Second, it makes you a smart contract developer by enabling you to write expressions.

## A simple language for writing expressions

Rainlang is a human-readable way to write Rain expressions. It's designed to be easy to read and write - if you can write spreadsheet formulas, you can write Rainlang.

An expression is a sequence of **words** that can be executed by the on-chain interpreter to instruct a smart contract to do something. An expression can include a combination of words and values, as well as logical and mathematical operations, to perform a specific task or calculation.

Here's an example of an expression that uses the standard Rain interpeter:

```
_: if(greater-than(erc20-balance-of(0x123456 0xabcdef) 999) 10 5);
```

> If you'd like to learn to write Rainlang expressions, you can take the [Rainlang course](https://studio.rainprotocol.xyz/docs) on Rain Studio.

## How to read Rainlang

Rainlang is **2-way readable/writable**. What does this mean?

Let's start by auditing the above example. This expression gets the balance of the ERC20 token `0x123456` for the address `0xabcdef`. It  uses the `if` word to check if that balance is greater than 999. If it is, `if` returns 10. If the balance is 999 or less, `if` returns 5.

Imagine that this expression was used by a Rain-aware contract to determine the price for a token sale. When somebody goes to buy tokens, this contract will evaluate its "price" expression, take the final result and use it as a price per token.

If you were buying tokens from this contract, you may want to know how the price is calculated. Rainlang allows you to read the logic permissionlessly, without needing to trust the author or a 3rd party verification tool like Etherscan.

In other lanuages (e.g. Solidity) the programming language is an abstraction which is compiled to opcodes. But in Rain, the word `erc20-balance-of` is the same on-chain as it is off-chain. If you took the opcodes that you found on-chain and reformatted them, you would see `erc-20-balance-of`.

No need for a 3rd party, you can flip between Rainlang words and on-chain opcodes without any intermediary. *This is what we mean by 2-way readable and writable*.

Looking again at the example, there's probably an even more readable way to write this expression.

```
mybalance: erc20-balance-of(0x123456 0xabcdef),
high: 10,
low: 5,
result: if(greater-than(mybalance 999) high low);
```

Definitely more legible! We've used something that looks alot like a variable. However it's even simpler than that. We'll see in the next guide that the interpreter maintains its own internal **stack**. Every word takes can some items from the stack, and put some results back on the stack. In this version of the expression, we've given certain stack positions names so they can be referred to later.

Those names are part of the **expression metadata**. They are useful, but not essential for reading the expression and understanding it. Let's assume the expression author (or anybody else) has submitted some metadata for the above expression. You could then rebuild the expression the way the author wrote it by taking the on-chain opcodes and the metadata. However, if you wanted to audit the expression, but didn't trust the metadata, you would be able to parse the on-chain opcodes and still get the original form:

```
_: if(greater-than(erc20-balance-of(0x123456 0xabcdef) 999) 10 5);
```

Again, *Rain is designed for user choice and permissionless decentralisation*. Every participant should have the tools to read the important logic for a smart contract, without having to trust a 3rd party.

## Words

Words are the fundamental building blocks of Rainlang expressions. Every word in Rainlang performs a specific operation or function, and words are combined together to perform calculations or execute specific tasks. 

Unlike other programming languages, in Rainlang, everything is a word and there is no distinction between literals, functions, operators, etc. Any element in Rainlang that doesn't look like a word is just sugar for one or more words.

Every word can add and remove values from the running stack, but cannot directly modify the program counter, i.e. there is no GOTO like behaviour (unlike the EVM).

Rainlang is intentionally vague in its definition of words, which allows developers the freedom to come up with new intepreters, with new words. This flexibility in the language design provides a constantly evolving word list and provides developers with the ability to tailor the language to their or their users' specific needs.

The base of the interpreter provides zero words, but a standard interpreter contract ships with many words. Unlike EVM opcodes, which are relatively static and require blockchain-level hard forks to add or remove, the Rainlang word list provides more flexibility, allowing for the evolution of the language without the constraints of a fixed set of instructions.

### Example words

Here's some examples of words from the standard Rain interpreter:

* The “add” word, which performs addition on its inputs
* The “mul” word, which performs multiplication on its inputs
* The “if” word, which performs conditional branching based on its inputs
* The “set” word, which puts a value in storage for future use
* The "context" word, which retrieves values from context for use in the expression (read on for how context and storage work in Rain)

### Words for common interfaces

The above are examples of words related to arithmetic, logic, expressions and the interpreter. But as we saw in the example, it's also possible to pull other data that's on-chain - `erc20-balance-of` allows us to get the balance of any ERC20 token for any account.

In the standard interpreter there are words for all of the token standard interfaces - ERC20, ERC721 and ERC1155. There is also a word for the Chainlink interface, which means an expression author can use the real-time result of any Chainlink oracle.

There is no limit - developers can write new interpreters with new words that support additional interfaces, providing authors with new ways to write expressions.

## Key takeaways

* Expressions in Rainlang are sequences of words that can perform a specific task or calculation.
* Rainlang is 2-way readable/writable, meaning it can be audited without relying on a 3rd party or compiler.
* Words in Rainlang are the fundamental building blocks that perform specific operations or functions.
* Rainlang is intentionally vague in its definition of words, allowing for flexible interpretation and evolution.