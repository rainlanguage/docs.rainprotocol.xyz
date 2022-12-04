# The interpreter interface

One option for integrating with Rainlang is to write a Solidity contract that
uses the interface of an existing interpreter onchain.

The interface `IInterpreterV1` is split into a read only `eval` function and an
optional state changing `stateChanges` function.

The interpreter contract therefore has two jobs:

- Given an expression, run it and return a result without changing state
- Given a list of state changes, apply them to its own storage that can be read later

The list of state changes are opaque/decoupled from the calling contract. Their
meaning is known only to the expression writer, and are returned alongside the
expression result.

The reason for the two step process is to allow the calling contract to apply its
own calculations and state changes on the result of `eval` first before calling
back to the interpreter with the external writes.

## Advantages to the calling contract implementation

### Decentralised extension points

Ethereum.org lists [5 possible upgrade methods](https://ethereum.org/fr/developers/docs/smart-contracts/upgrading/).

1. Creating multiple versions of a smart contract and migrating users/state
2. Separate logic/state contracts
3. Proxy pattern to delegate calls
4. Immutable main contract that reads from "satellite" contracts
5. Diamond pattern to delegate calls

Of these 3 and 5 are examples of delegate call, wherein the callee can modify the
state of the caller. Upgrades that rely on this mechanism also force a trust
relationship between the state and logic contracts, where the logic contract can
arbitrarily manipulate/corrupt the state contract. This trust relationship extends
to whoever (some admin key) can decide which logic contract is used.

Option 2 also requires "you" (read: centralised admin key) to authorize changes
and prevent malicious/buggy code modifying state. It also elevates the admin key
to a single point of failure/manipulation for the contract.

Option 1 is a hardcore decentralised option, a high profile successful historical
example is the SAI to DAI migration where the ability to support collateral other
than ETH was added to the DAI ecosystem. These migrations tend to be very simple
at the technical layer and very messy at the social layer.

Rain interpreters are an example of option 4:

> The main contract in this case contains the core business logic, but interfaces
> with other smart contracts ("satellite contracts") to execute certain functions.
> This main contract also stores the address for each satellite contract and can
> switch between different implementations of the satellite contract.
>
> You can build a new satellite contract and configure the main contract with
> the new address. This allows you to change strategies
> (i.e., implement new logic) for a smart contract.
>
> Although similar to the proxy pattern discussed earlier, the strategy pattern
> is different because the main contract, which users interact with, holds the
> business logic. Using this pattern affords you the opportunity to introduce
> limited changes to a smart contract without affecting the core infrastructure.

The combination of a deployed expression and the interpreter it is intended for
allows end users to write their own satellites, with the main contract providing
a high level intent and safety rails for users.

By allowing end users to specify their own interpreters and expressions the main
contract can remain immutable and benefit from new words and other features as
they become available in newer interpreters, or users can benefit from sticking
with battletested interpreter versions when they can achieve what they need with
an older version.

So far we have identified 2 patterns where end users can self-select interpreters:

- Upon creation of a child contract from a factory the interpreter and expression
    can be set as initialization parameters
- When the calculations and state changes can ONLY damage the interpreter-selector
    they are free to select any interpreter they want, as by definition a bad choice
    cannot harm anyone else

The `Flow` contract is an example of the former and `Orderbook` the latter.

### Less up-front planning

Any Solidity dev faced with the prospect of deploying an immutable smart contract
knows the temptation to bake in admin keys to respond to the messy real world.

Life moves fast and predicting the future of what will be needed by a contract is
chaotic and often impossible.

That said, if we look at the state of defi today there may be many instances of
ideas like "lending" and "AMM" but relatively few structural differences between
contracts in each family.

For example there's only so many ways that "put tokens in a vault and mint shares"
can be implemented, which is how standards like ERC4626 are possible and desirable.
There may be thousands of ways to throttle, access gate, reallocate, mint, burn,
shuffle, attribute, etc. the shares and assets but only a handful of reasonable
implementations that look like "a vault".

In Rain the focus is on identifying the archetype of some contract like "escrow",
"vault", "tournament", formalising the security and economic guarantees in
Solidity, but then handing the details off to the intepreter.

The details layer is where experimentation and evolution (death and rebirth) can
happen, e.g. via factories from rapidly scripted expressions.

Front-ends can be crafted to provide canned expressions for users to (re)deploy,
allowing a relatively stable set of underlying contracts to service many ideas,
events and ecosystems over a longer period of time.

Front-ends themselves are an example of this model, JavaScript is an interpreted
language like Rainlang that runs in a web browser. Many websites can share the
browser logic to achieve many different things, and over time frameworks for
certain types of websites evolve like "content management system", "ecommerce",
etc. Web frameworks and the browser are decoupled from and don't need to know
exactly what each website is doing, they often use [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control)
to hand control back to the domain for domain specific logic, and retain it for
general purpose logic and controls.

### Leaner and simpler code

Following from the reduction in the need to predict the future there's also less
complexity in the calling contract itself and generally a smaller code size overall.

A lot of branching conditional code and struct based configuration gives way to
simply handing control back to the expression for any signal of intent.

This is similar to how Open Zeppelin enables [contract extension via hooks](https://docs.openzeppelin.com/contracts/4.x/extending-contracts).

In the Open Zeppelin system the inheritence system is leveraged so that the parent
provides a sane default or noop logic at some decision point then allows the child
to define something more interesting/specific.

Intepreters can be used in a similar way, treating the `eval` interface similarly
to a hook, where an entrypoint to the expression is set aside for a specific
decision/calculation. The code that runs on the other side of the expression could
be dozens of kb were it to be compiled directly into the calling contract, but is
all reduced down to an external interface call and precompiled interpreter code.

## Lifecycle of an expression

The high level lifecycle of a rain expression from the perspective of a smart
contract is:

- Someone authors the expression, e.g. via Rainlang and/or Rain Studio
- Some externally owned account (EOA) deploys the expression as a real onchain
    contract, e.g. via [SSTORE2](https://github.com/0xsequence/sstore2)
- The expression is scanned by a trusted contract that can perform integrity
    checks such as detecting out of bounds stack reads, calculating the stack size
    for memory allocations, and other word-specific enforcements
- Assuming the scan is clean the expression will have entrypoints much like a
    `main` function in other programming languages. Each entrypoint can be used
    to calculate/enforce/track something on behalf of the expression deployer,
    decoupled from the calling contract.
- Anyone can review the expression "decompiled" to Rainlang much like verified
    contracts on etherscan to get an understanding of what it does. This allows
    users to trust an immutable Solidity container and just focus on understanding
    the relatively simple/focussed logic of a single expression.

