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

Note also that these approaches are NOT mutually exclusive. Some team MAY choose
to use BOTH an admin-key based upgrade path in addition to interfacing with the
Rain interpreter. Using Rain is neither a guarantee nor a requirement that the
calling contract is immutable and trustless re: upgrade paths.

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

Calling the interpreter can also reduce the security sensitive surface area of
the calling contract. Any relevant concerns for the words supported by the
interpreter can be handled within the interpreter, such as overflows, nuances
of external interfaces, etc. And associated tooling can provide simulation,
documentation and explanations of the expressions for end users who are interested.

The primary concer of the calling contract is to enforce security and economic
constraints such as reentrancy prevention and defining trust relationships between
participants.

## When you DON'T need to implement calls to the interpreter interface

### Deploying expressions to existing contracts to build a product

If an existing contract exists that provides reasonable economic and security
guard rails around some expressions it is best to build a new front end rather
than a new smart contract.

Front ends can be targetted to a specific expression or family of expressions in
a permissionless way. If an existing contract can do the job it has the advantage
of being more battle tested in real world scenarios than a brand new contract, and
existing tooling can already render and display its expressions with associated
metadata.

For example the `Sale` contract can and has been used to build several token
launchpad frontends, each with their own specific needs and target audience. A
`Sale` can even be embedded in an existing website for a once-off launch, without
permission or fees being paid to other front ends pointing to the same underlying
contracts.

### Reading and tracking from existing smart contracts with a known interface

Currently the best way to _pull_ data from an existing contract is to implement
some opcodes that can read the interface and push the results onto the interpreter
stack.

A good example of this is the chainlink opcode that can read price data from any
chainlink price oracle using their standard `AggregatorV3Interface`. One opcode
covers handling stale price data, rescaling decimals and supports all compliant
external feed contracts across all networks that chainlink supports. All contracts
that use the interpreter containing this opcode automatically support expressions
that use it and benefit from the interpreter's internal chainlink handling.

As the expression itself can track state with `set`/`get` the existing contracts
don't need to do anything to allow users to track counts, averages, etc. over time
if they read from some external interface that has a supported opcode.

At the time of writing this involves opening a pull request or forking the Rain
repository to add an opcode to the interpreter directly.

In the future it should be possible to have "word packs" where an interpreter
can further delegate processing of individual opcodes to support extending what
can be read from external interfaces by the expression itself.

### If you want to inherit the interpreter code to make a new interpreter

This is the "old skool" way to interact with Rain and is probably less useful
as the external interfaces stabilise.

It is possible to inherit the interpreter and call `eval` internally rather than
call a standalone interpreter. The benefit is that your contract has full control
over the supported opcode logic, losing a lot of the decentralised upgradeability
in exchange for an immutable operating environment.

Realistically the same thing can be achieved by setting the external interpreter
as an immutable value on the calling contract itself.

There are also some minor gas benefits to calling `eval` locally rather than as
an external contract call. This is offset somewhat by the large code size implied
by compiling dozens of opcodes into the calling contract, which can lead to external
calls anyway due to splitting out logic elsewhere as the 24.5kb code size limit
is approached.

### If you want to integrate offchain data as a trigger/release for onchain actions

The integration point for offchain data is typically going to be "signed context"
rather than a new onchain contract (e.g. some new oracle or interpreter).

Signing context is a gas-free operation for the signer that gives the expression
caller a bearer proof of some data that is presumably relevant to the expression.

This can be used for all kinds of business flows:

- Unlocking escrows
- Reporting on outcomes of games/events
- Insurance style claims/proofs
- Time bound commitments to a price from an offchain market
- Etc.

In most of these cases, as the source of truth is already offchain and probably
centralised, it makes little sense to attempt to replicate offchain data in some
kind of oracle. If nothing else, the gas and infrastructure cost to maintain an
oracle 24/7 are prohibitive compared to maintaining a server that can provide
signatures ad-hoc upon request for key data.

What is more important and useful than trying to write a new contract is that
the expression defines who is allowed to sign and under what conditions,
e.g. can a single signature be used twice? is there an expiry time? etc.

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

### Authoring expressions

Expressions can be produced in several ways:

- Manually byte by byte, which sounds painful but isn't so bad once you know the
    basics. There are literally hundreds of unit tests doing this in the main Rain
    repository so examples abound for the control freaks out there ;)
- Using the Rainlang parser to convert a human friendly representation that is
    recognisable as "code" for an expression down to the equivalent bytes. This
    is the approach taken by Rain Studio as it allows the same expressivity as
    the per-byte approach, but with far less tedium.
- Using a dedicated front end that hides some or all the Rainy details away from
    the end user. As Rain smart contracts are still just regular EVM contracts there
    is no reason the end user will necessarily care to read all the implementation
    details if they trust some product. For example, who is reading the Aave contracts
    every time they call a function, and re-reading every time the Aave team launches
    a new update? We strongly recommend that the GUI provides some link to an
    interface that can display the expression, much like links to etherscan to
    read the verified code, but this can be an "advanced" feature most of the time.

In all cases the JavaScript SDK and interpreter/contract metadata is the recommended
way to ensure the integrity and intent of expressions are respected and make it
to the final destination intact.

### Deployment and trust relationships

The designer of the calling contract has to define the trust relationship
between the deployer and other callers of the deployed expression.

The simplest scenario is a factory where some EOA deploys a child and initializes
it with an immutable reference to an expression. All the entrypoints are deployed
together and cannot be changed after launch. Each child has its own expressions
and state and so cannot interfere with each other. Anyone else can read the
expressions as initialized and decide for themselves whether to use this child,
or move on to some other child, or deploy their own.

This simple scenario works best when the children are associated with some event,
such as a sale, or real world event, or where there are some natural bounds on
the process where it is reasonable to expect immutable expressions to be relevant
for the natural lifespan of the child contract.

More complex scenarios may be afforded and even required by some contracts. For
example, in the `Orderbook` contract in core, each order is its own expression
with its own interpreter. Traders can only give themselves a worse price if they
select a malfunctioning/malicious interpreter, so they are free to select for
themselves where/how their expressions run to calculate the price of their trades.

Even more complex scenarios may require full onchain governance apparatus such
as is commonly found in defi for a certain class of long lived protocols. The
advantage of DAO style governance via. expression is that the expressions can
be proposed and deployed directly by the onchain governance process, rather than
some offchain vote feeding into a lengthy/centralised/opaque Solidity development
process, to finally be onchain after some delays and potential misunderstandings.

### Integrity checks

Each `IInterpreterV1` interpreter has at least one associated `IExpressionDeployerV1`.

The deployer contract has 1 exposed `deployExpression` function that is
responsible for 2 things:

- "Dry run" the expression to calculate all the internal stack movements and
    reads from the calling context
- Provide an onchain address of the deployed expression in whatever format is
    compatible with the associated interpreter.

The `StateConfig` struct includes all the expression information as provided by
the end user and the `minOutputs` is the number of outputs the calling contract
expects for each of the entrypoints it defines. This split prevents the end user
from corrupting the expression by returning fewer results than the calling context
needs.

For example, if the 0th entrypoint to an expression requires at least 2 final
values on the stack then index 0 of the `minOutputs` array MUST be 2. The length
of the `minOutputs` array implicitly defines the number of entrypoints as all
entrypoints MUST be at the start of the expression sources of a given `StateConfig`.
The `StateConfig` MAY define more sources than there are entrypoints defined by
the calling contract, and these are internally callable by the `call` word. This
is similar to the distinction between internal vs. external functions in Solidity.

The calling contract SHOULD respect the end user's `StateConfig` as provided and
pass it directly to the deployer as-is without modification or interpretation.

If the integrity check fails the expression deployer MUST error and the calling
contract MUST respect this error, rolling back the deployment. A failed integrity
check can be a sign of out of bounds memory access and other security critical
undefined behaviours.

**As EITHER the deployer or interpreter could be malicious, buggy or simply mismatched
it is critical that end users only interact with expressions that are paired with
deployers and interpreters they trust.**

In practise the known pairings are matched at an offchain metadata level similar
to how [token lists](https://tokenlists.org/) provide curated lists of tokens to
mitigate phishing attempts in GUIs that support them. The offchain metadata is
fed into the subgraph indexer and made available and/or are filterable by any
honest front ends that want to protect end-users.

Of course, phishing/malicious front ends can also reference arbitrary
phishing/malicious smart contracts, which is always the case and deployer/interpreter
pairings are no different or less important than selecting the correct "USDC"
token address to send/receive.

**The calling contract MUST pin the deployer/interpreter pairing along with the
expressions it is willing to execute so that users cannot "bait and switch" the
logic of expressions by hotswapping the underlying execution environment.**

### Calling entrypoints

Once the expression is deployed the calling contract can use its entrypoints to
dispatch calls to the interpreter.

The `EncodedDispatch` in the `IInterpreterV1` interface combines the onchain
address of the expression, the index of the entrypoint to run and the maximum
number of outputs the calling contract can handle. The calling contract MUST
assume the interpreter is malicious and attempt to send more than the maximum
outputs, but an honest interpreter can often save gas by sending only one or two
values from the top of what could be a large stack internally built by the
expression. If the calling contract can handle arbitrarily many outputs it MAY
set the max outputs to `type(uint8).max`.

The `uint256[][]` context is a sparse matrix of values that the calling contract
can pass to the interpreter to make available to the expression as it runs. The
`context` word can reference the passed context much like a spreadsheet with
columns and rows. The 2D nature of context allows for dynamic length columns and
logical separation of domain specific concerns. For example, the `Flow` contract
has a column for "base context" that is the same for every call, then a column
for all the signatories of additional signed context, then a column for each array
of context that was signed. This allows for arbitrarily many signed proofs to be
provided to the `Flow` contract and it is up to the expression to vet signers and
decide what "slots" to read out of the context.

**One common and important item of context is to provide the `msg.sender` of the
calling contract. From the perspective of the interpreter the _calling contract_
is `msg.sender` and `address(this)` is the interpreter itself. If the calling
contract doesn't provide the `msg.sender` in its context then expression authors
WILL NOT have any way to reference the real caller of the expression.**

How the context is defined and presented is entirely up to the calling contract.
The expression deployer provides a list of context reads that it detects during
the dry run so that potentially expensive context data (e.g. storage reads) can
be skipped if the expression doesn't need them. The context read tracking is
represented as a 16x16 grid of bitflags represented as a single `uint256`.

**Extra care must be taken by the calling contract when passing context to the
expression that is provided by an external source. External data is typically
trivial to manipulate unless it is signed by a trusted signer or similar. The
calling contract is responsible for verifying signatures and any other authenticity
and integrity checks that might be needed for external context to be useful to
expressions. The benefit is that once these checks are defined, expression writers
may not need to be aware of them at all, or require much less technical knowledge
(e.g. allowing a known signer vs. knowing how to verify a signature onchain).**

The return value from the interpreter for every entrypoint is the same. Two lists
of values, presumably no longer than the max outputs requested by the dispatch.
The first list is the requested slice of the final stack after `eval` is complete
and the second list is all the state changes requested by the expression,
e.g. via the `set` word. The first list MUST be read from the end
(it is a stack after all) and there are some convenience methods in
`LibStackTop` to handle that efficiently. The second stack MAY be passed back to
the interpreter with the `stateChanges` function. If the calling contract is
running `eval` from a static context it MAY NOT call `stateChanges` as this would
be impossible anyway. Expression writers are expected to be aware that the contracts
they use MAY NOT support state changes some or all of the time.

**Again, the calling contract MUST assume a malicious interpreter when handling
the outputs. A bad interpreter can produce outputs that are arbitrarily garbage
up to the limit of what Solidity will consider a valid `uint256[]`. This means
that the garbage MUST ONLY negatively impact the expression definer, and/or the
interpreter used MUST be pinned to the expression and visible offchain, e.g. via
event logs, so front ends can index and filter out expressions/contracts
deployed under unknown/untrusted interpreters.**

**If the calling contract chooses to apply state changes it MUST assume the
interpreter is malicious and may attempt some kind of reentrancy attack. This is
no different to any other external call and MUST be treated with all due care.
As always, the simplest solution may be to wrap interpreter state changes in a
reentrancy guard such as the one that Open Zeppelin provides, but there are other
safe patterns that MAY be applied by the calling contract.

### Namespaces and state collisions

You may have noticed in the API documentation that `eval` and `stateChanges` come
with `withNamespace` variants. The namespace is used to further disambiguate
gets and sets _between expressions from the same calling contract_.

For a simple factory based deployment namespacing is typically NOT required as
all the expressions are deployed together by the same end user and are not changed
and cannot be impacted by other contracts.

For a more complex setup such as `Orderbook` there are many users deploying many
expressions under the same contract. In this case we cannot allow a `set` from
one user's expression to overwrite the same key as another user's expression. That
would be a critical security issue as users could attack each other's orders by
carefully constructing keys to collide.

In such cases the calling contract can define namespaces (`Orderbook` uses the
owner of the order as a namespace for all their orders) that sandbox state changes
beyond the default per-caller.

The default behaviour of the reference interpreter is to sandbox all state as
a mapping.

```
// state is several tiers of sandbox
// 0. address is msg.sender so that callers cannot attack each other
// 1. StateNamespace is caller-provided namespace so that expressions cannot attack each other
// 2. uint is expression-provided key
// 3. uint is expression-provided value
mapping(address => mapping(StateNamespace => mapping(uint => uint)))
    internal state;
```

This provides one tier of mapping for each onchain entity that could mount an
attack on another at the same level.

- Two calling contracts could try to attack each other by attempting to deploy
    expressions under the same namespace
- Two end-users/namespaces deploying expressions under a single contract could try
    to attack each other by crafting key collisions with their expressions
- Two interpreters could try to attack each other if they shared some storage contract
    other than their own interna storage mapping

Note that expressions from the same contract and namespace MAY collide if their
keys are the same. Expression authors MUST take care to ensure keys don't accidentally
collide across get/set calls within the same namespace. The simplest way to achieve
this is to use the `hash` word to build a compound key out of constant and dynamic
values at runtime.

The possibility of expression keys to collide is intentional as expression authors
MAY deploy a set of related expressions that all share some state even though they
eval independently. An example of this could be imposing global token mint/transfer
limits across several independent methods of minting/transferring.