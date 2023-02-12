---
sidebar_position: 3
---

# Architecture

> Rain provides a new way to design smart contracts, using the software design pattern "inversion of control". It decouples some of the logic for a smart contract into a Rain interpreter, allowing users to read and write the logic in Rainlang.
> 
> The primary concern of the main contract becomes enforcing security and economic constraints while the expression handles the logic. This allows contracts to remain immutable while still being flexible, and users can self-audit the logic in Rainlang.

### What you'll learn
* A new way to design smart contracts
* The Rain stack

### Why it matters
Having a good understanding of the components of Rain will enable you to design a contract that is secure and future-proof. To take full advantage of what Rain has to offer, it's important to start adjusting your thinking early, as it may differ from what you're used to.

## A new way to design smart contracts

Rain follows a software framework design pattern that goes as far back as the 1970's, called **[inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control)**.

> Inversion of control serves the following design purposes:
>
> * To decouple the execution of a task from implementation.
> * To focus a module on the task it is designed for.
> * To free modules from assumptions about how other systems do what they do and instead rely on defined interfaces.
> * To prevent side effects when replacing a module.

The concept of inversion of control emphasizes the separation of the reusable and problem-specific code in the development process, despite their interdependence in the final application.

Here's a simpler way to explain the concept:

Imagine you're hosting a big party at your house and you need to make sure everything runs smoothly. You have a list of tasks, like setting the table, preparing the food, and cleaning up after the guests leave. Normally, you would do all these tasks yourself. But with the inversion of control principle, instead of doing everything yourself, you delegate tasks to different people. You hire a catering service to prepare the food, a cleaning service to take care of the cleanup, and so on. You invert the control from yourself to these service providers, so you can focus on the more important tasks like greeting the guests and making sure they have a good time.

Rain follows the same pattern, but for smart contract design. Here's how it works:
1. Part of the logic for a Rain-aware contract is decoupled from the basic functionality and security concerns.
2. Users can read and write that logic in a language called **Rainlang**, which is executed by an on-chain **interpreter**
2. All of the pieces of the system remain **immutable** (contract and interpreter)

This allows for the creation of immutable contracts that can build trust over time, yet remain flexible and upgradable.

A developer doesn't need to predict all possible futures when designing a new contract; they can focus on the most generalised functionality and lift the rest to Rainlang.

Likewise, someone who wants to interact with variations of the hyperstructure only needs to read and understand the Rainlang component.


## The Rain stack

Let's introduce the primary components of Rain so you're familiar. We'll go into more detail on these components later in the guides.

### Rain-aware contracts

A Rain-aware contract is one that decouples some of its logic to be executed by a Rain interpreter. That logic is called an **expression**.

We can call the place where a Rain-aware contract hands-off some logic an **extension point**. Specific examples of extension points that utilise the evaluation of an expression could include:

* Calculating prices for a token sale
* Access gating exclusive events with complex rules
* Defining trades in an order book
* Establishing conditions under which tokens can move in/out of escrow

Any Solidity dev faced with the prospect of deploying an immutable smart contract knows the temptation to bake in admin key to respond to the messy real world. Life moves fast and predicting the future of what will be needed by a contract is chaotic and often impossible.

However, when using Rain we take a different approach to contract design. The focus is on identifying the archetype of some contract like "escrow", "vault", "token" or "tournament" and formalising the security and economic guarantees in Solidity, but then handing the incidental details off to the interpreter.

This means the expression is where experimentation and evolution can happen, e.g. a new contract deployed via a factory, using a rapidly scripted expression.

A Rain-aware contract can have multiple extension points, each with their own expressions. A single contract could have expressions for "can transfer", "can mint", "calculate price", etc.

The Rain team already maintains a growing library of contracts for various archetypes. If one of these fits your needs, you can start experimenting with expressions today. Or, if you are interested in seeing how you can integrate the interpreter into your project, you can read through the code.

### Rain expressions

Rain expressions are written in Rainlang, a simple syntax for writing logic to be executed by a Rain interpreter. We'll see later that Rainlang, while simple, is very powerful and is itself customisable.

Each **word** in a Rainlang expression maps immutably 1:1 to some function pointer in a specific interpreter. Therefore the meaning and functionality of any given word is tightly coupled to the interpreter that it is run by.

Unlike a compiled language, a Rain expression is 2-way writeable/readable. When an expression author deploys a Rain expression, it can be read back from the expression bytecode into something for a reader that accurately represents what the author wrote. This requires no additional input/verification step from the author and is permissionless for the reader.

### Rain interpreter

There is no single "Rain interpreter". In fact, anybody can create a contract that implements the Interpreter interface. A Rain-aware contract can use this interface to execute logic written in Rainlang.

Rain-aware contracts allow a user to choose the interpreter they want to use when writing and deploying a new expression. This is a powerful idea, because different interpreters can support different sets of words, and one interpreter can even use other interpreters' words. This means a Rain-aware contract can be upgraded in the future as new interpreters and words become available.

Any relevant security concerns for each word supported by the interpreter can be handled within the interpreter, such as overflow, nuances of external interface, etc. And associated tooling can provide simulation, documentation and explanation of the expression for end users who are interested.

## Key takeaways

* Rain provides a new approach to designing smart contracts, following the software design pattern "inversion of control".
* In Rain, part of the logic is decoupled from a Rain-aware contract, written in Rainlang and evaluated by a Rain interpreter.
* The main contract focuses on enforcing security and economic constraints while the Rain interpreter handles the logic, allowing for flexibility and self-auditability.
* Rain-aware contracts can be deployed with multiple expressions, each written in Rainlang, a simple syntax for writing logic.
* Rainlang is 2-way writeable and readable, maps immutably to a specific interpreter, and is customisable.
* A Rain interpreter exposes an interface for Rain-aware contracts to execute Rainlang logic, and different interpreters can support different words.
* Anyone can create a contract that implements the Interpreter interface