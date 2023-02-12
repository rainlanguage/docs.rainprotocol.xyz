---
sidebar_position: 6
---

# Interpreter

> The Rain framework uses a combination of three contracts — Deployer, Interpreter, and Store — that work together to allow the deployment and execution of expressions in a secure and efficient manner. 

### What you'll learn
* How the interpreter works
* Deployer
* Interpreter
* Store

### Why it matters
> Having a thorough understanding of the interplay between the Deployer, Interpreter, and Store is important for both designing Rain-aware contracts and writing effective expressions for them.

## How the interpreter works

So far in these guides, we've referred only to an "interpreter", however there are actually three contracts that work together to allow the deployment and execution of expressions, and store state between executions. These are called the **Deployer**, **Interpreter** and **Store**.

### Deployer

The Deployer in the Rain framework is responsible for the static code analysis and deployment of Rain expressions. A Deployer is tightly coupled with a specific Interpreter, as the analysis it performs is highly sensitive to the specific implementation of the Interpreter.

Expressions in Rain are deployed on-chain as immutable contract code with a first-class address like any other contract or account. This allows for efficient gas use in loading and storing binary data, ensures immutability between the time of deployment and runtime evaluation, and is more cost-effective in terms of gas consumption than passing an entire expression through every time.

Generally an end-user won't interact directly with the Deployer. Here's the order of an events for how the Deployer deploys an expression:
1. The end-user writes their expression in rainlang, which is converted into a format the deployer can read.
2. This contract passes the expression to the Deployer and asks it to deploy the expression on-chain.
3. The Deployer performs checks to ensure the expression is valid, and that it will run.
4. The Deployer replaces each word in the expression with a pointer to a function in the interpreter and deploys it to a new address.
5. The Deployer returns the address of the newly deployed expression to the Rain-aware contract
6. Later, when the contract needs to make some decision, it will pass the expression address to the Interpreter


### Interpreter

A Rain interpreter is a contract that executes deployed expressions and maintains an internal stack. This can seem daunting at first, but it's deceptively simple.

Let's assume that a user has passed an expression to a contract, and that contract has used a Deployer to deploy it on-chain. Now, the calling contract needs to use that expression to make a decision. For example, somebody created a new ERC20 token using a `mint` expression to handle the logic for minting. Now, let's imagine somebody has called the `mintToken` function on that ERC20 token. The contract needs to know how much to mint, so it takes the address for the deployed `mint` expression and passes it to the interpreter.

First, the interpreter instantiates a stack. The stack is a First-In-Last-Out (FILO) data structure that is used to store numeric constants and the results of calculations.
 
Now the interpter proceeds with the main evaluation loop. It loops over each function pointer in the expression and runs it, passing the stack each time. Let's say the first part of the expression is `add(2 5)`. The first two pointed to functions will push the constants 2 and 5 onto the stack. Then the third function will be `add`, this function will pop `2` and `5` from the stack, add them together and put the result, `7`, back onto the stack.

If this was all the expression did, it would then return the whole stack back to the calling contract. The calling contract would use the value on the top of the stack, `7` and mint 7 tokens for the caller of `mintTokens`.

### Store

The Store allows for secure storage of state between expression executions. Users can access this functionality by using words in their expression for "set" and "get", i.e. storing or retrieving values against a key that they choose.

This allows expressions to track values between transactions. For example, you might use “set” and “get” to keep track of the total number of a particular token that has been created over multiple executions of an expression. Or, you could determine if a wallet address has previously interacted with the expression.

This is powerful, but how do we make it secure so that storage isn't shared between expressions when its unintended?

To combat this, the Store uses a **namespace**. The default namespace is always the address of the Rain-aware contract. In other words, values stored in the execution of an expression from one contract cannot collide with values from another contract, even if they use the same key.

Beyond that, its up to the contract. Some contracts may actually want to allow users to set and retrieve against keys shared between expressions. For example, you may want to impose global token mint/transfer limits across several independent methods of minting/transferring.

Here's the order of events for storing and retrieving values from the Store.

1. A Rain-aware contract has a method that requires the evaluation of an expression to make some internal decision.
2. The Rain-aware contract passes the expression to the interpreter.
3. The interpreter parses the expression and evaluates it, line by line.
4. If the expression contains a "set" statement, the interpreter adds the key and value to a running list of state changes.
5. If the expression contains a "get" statement, the interpreter requests the value associated with the specified key from the Store.
8. The Interpreter returns the final result of the expression to the calling contract, along with the list of state changes.
9. The Rain-aware contract uses the Store to store the state changes, associating them with the namespace.
10. The state changes stored in the Store will now persist across transactions, allowing values to be retrieved later in subsequent executions of expressions in the same namespace.

## Key takeaways

* To deploy and evaluate expressions, the Rain framework uses three contracts: Deployer, Interpreter, and Store
* The Deployer performs code analysis and deploys Rain expressions on-chain as immutable contract code
* The Interpreter executes deployed expressions, maintains an internal stack and produces a final result for the calling contract
* The Store allows secure storage of state between expression executions using namespaces