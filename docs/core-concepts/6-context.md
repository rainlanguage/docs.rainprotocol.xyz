---
sidebar_position: 7
---

# Context

> Sometimes we'll want our expressions to be aware of some information outside of what can be fetched by the Interpreter. In Rain, this information is provided as part of **context**.

### What you'll learn
* A spreadsheet of data for expressions
* Contract context
* Caller context
* Signed context

### Why it matters
> Understanding context will help you design contracts that give expression authors the ability to make decisions or perform computations based on the information provided by the calling contract or the caller.

## A spreadsheet of data for expressions

As we've seen, expressions can use interfaces to get information from other on-chain contracts. However sometimes we may need other information from the Rain-aware contract, or from the user calling the contract's method. In Rain, this information is provided as part of **context**, i.e. the context in which the expression is being evaluated. Context is used to make certain information available to the expression that's being evaluated by the interpreter.

It takes the form of a matrix of values that the Rain-aware contract can pass to the interpreter. Think of context as a spreadsheet with columns and rows, where each cell contains a specific value. The context can then be referenced within the expression, much like a cell reference in a spreadsheet.

The structure and content of the context matrix is entirely defined by the calling contract. It should include any values that are expected to be useful to the author of the expression. That said, there are few common patterns.

## Contract context

Contract context is provided by the Rain-aware contract and are values that are expected to be useful to the author, but are not directly modified or provided by the caller.

The address of the caller and the address of the Rain-aware contract are two obvious examples that we'd expect to see in context for just about any calling contract, because both of these values may be changed by the EVM by the time the interpreter evaluates the expression.

Other examples could include values derived from domain specific logic that is specific to the calling contract. Orderbook is an on-chain order book that uses expressions as trading strategies for moving tokens between user vaults. This contract provides the current vault balance of the caller to the expression as part of the context. In this case, we couldn't allow the caller to provide this value, because they could lie about their vault balance. It's much better that the contract provides this information from its current state.

## Caller context

Caller context refers to values that are directly provided or modified by the caller. These values are added to the context of an expression by the calling contract, to be referenced by the expression author.

The interpreter or calling contract is responsible for populating the context with the relevant caller context values, which are often taken directly from the calldata. The caller context values can then be used by the expression to make decisions or perform computations.

It's important to note that caller context values are only as trustworthy as the caller themselves. The expression author should assume that the values may be arbitrarily manipulated or set by the caller to get the best outcome for themselves, and are not necessarily true or fair representations of reality.

## Signed context

Signed context is a type of context data that is accompanied by a signature from a third party. In this pattern, both the data and signature is again taken from calldata, then passed to the interpreter by the calling contract, allowing the expression to make use of the signed data as part of its evaluation.

This allows the expression to only trust data signed by a specific, or set, of public keys. However, it's important to note that whilst the expression author may trust the third party that signed the data, the end user may not. They can decide whether they accept the trust relationship between the author and the third party, and choose to interact with the expression that uses that data.

A real-world example of signed context could be where the price of an asset is needed to evaluate an expression. The calling contract *could* allow the caller to provide the asset price, but it would be better if the price came from a source that the expression author trusts.

In this case:
1. The third party would sign the price data. 
2. The user would provide the signed data to the contract when calling the method that required the expression evaluation.
3. The contract would provide it to the interpreter as signed context. 
4. The expression could then reference the signed context in its evaluation, first checking that data had been signed by a trusted source.

## Key takeaways
* Context in Rain allows expression authors to make decisions or perform computations based on information from the calling contract or caller
* Context takes the form of a matrix of values passed to the interpreter by the calling contract, with the structure and content defined by the calling contract
* Contract context: provided by the calling contract, values expected to be useful to expression author but not directly modified/provided by the caller
* Caller context: added to expression context by the calling contract, directly provided/modified by the caller, used by the expression but not necessarily trustworthy
* Signed context: context data accompanied by a signature from a third party, allows expression to trust data signed by specific public keys, but end user may or may not accept the trust relationship between the expression author and the third party.