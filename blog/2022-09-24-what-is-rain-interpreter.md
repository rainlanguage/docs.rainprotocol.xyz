---
slug: what-is-rain-interpreter
title: "What is the Rain Interpreter"
authors: thedavidmeister
tags: [interpreter]
---

# What is the Rain Interpreter

I don't think it is immediately clear at all what it means or why it is good to have a "rain interpreter".

The EVM already has general purpose set of opcodes for smart contracts, why do we want to reinvent that wheel?

How is a Rain interpreter different to the myriad of languages like solidity, vyper, etc. that are high level, battle tested and compile to the EVM?

How can this possibly be gas efficient, useful, secure, etc.?

Everything that Rain can possibly do could be coded in Solidity (the Rain interpreter itself is Solidity) so what's the point?

<!--truncate-->

## Who is this for?

The Rain interpreter is for you. If it's not you, you're in a statistically negligible minority of humanity as an "elite dev", and you're already well served by the crypto ecosystem.

The promise and ethos of crypto, the reason this industry has any value at all is very simple. It is in the title of the [original Satoshi whitepaper](https://bitcoin.org/bitcoin.pdf).

![](https://i.imgur.com/ngCS3yr.png)

If crypto isn't peer to peer it is nothing.

The Ethereum Virtual Machine (EVM) took "cash" one (large) step further to "contracts" with the introduction of general purpose opcodes that could do things like math, reading/writing data from long term storage, manipulating memory and a stack, interacting with other contracts, etc.

EVM opcodes look like this.

![](https://i.imgur.com/TPj0Ny5.png)

Do you know what `PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10` does?

A typical defi contract contains 10s of thousands of these.

Would you put your family finances or a multi million dollar business deal on the line based on your level of understanding of the raw opcodes in any contract?

How many people do you think there are on the planet who know what these opcodes do?

If _any_ peer in a "peer to peer electronic contract system" doesn't understand what the terms of a contract they are signing are, how can the contracts possibly be used safely by anyone?

This is one of the arguments against Ethereum that led to it being anything more than a mere code upgrade to Bitcoin. Originally Ethereum was proposed as a set of opcodes for Bitcoin but was rejected due to complexity and high likilihood for exploits and hacks that simply can't exist in a purely transactional environment.

7 years in to Ethereum's life and we still see major hacks of smart contract platforms weekly (daily?) and the total value of exploits seems to only be getting larger as adoption increases while security remains elusive.

On the other hand, Rain expressions look like this.

```
if(greater-than(erc20-balance-of(token-address user-address) 50) 1000 2000)
```

Which means "If the user has more than 50 of some token, 1000 else 2000".

This is something about as difficult to understand as a spreadsheet, and there's about 1 billion active spreadsheet users worldwide (literally).

It's a fairly reasonable layman definition of "being hacked" to say "something unexpected happened with your money". After all, the contracts always do exactly as they were programmed to do, hackers never modify the code on the chain, they merely push it into behaviours that hackees did not want or expect.

With that definition, understanding what code does _is the same as security_.

## Why not use [your-language-here]?
    
The above is a well recognised problem and Rain is certainly not the first to present a higher level language as a solution. Here we can say "higher level language" is broadly "something you could understand with a little time and motivation to learn" rather than "something you have no hope of understanding unless it is your profession".
    
Smart contract languages generally fall into two camps:
    
- Native to the blockchain
- Compiled into something native

### Native blockchain languages

There are many attempts to lift the problem all the way to the blockchain itself. There are many ways this manifests. Perhaps the chain is targetting a specific industry so offers a Domain Specific Language (DSL). Maybe the chain is pushing for familiarity, such as implementing JavaScript. The chain may even implement a turing incomplete or logic or query based approach similar to SQL.

One problem with all these approaches is that they _trade_ expressivity and creativity from one audience in order to give to another. The overall effect is zero-sum-ish.

In order to make life easier for contract readers and writers, they remove some or all ability for language designers to design contract languages.

On EVM chains we see multiple languages like Solidity and Vyper. On WASM chains we see languages like Haskell and Rust that compile to WASM. This is great as it allows language designers to compete to create the best languages to read and write contracts in.

It's much easier to compile a higher level language down to a lower language than it is to move between high level languages. This is because low level languages focus on how physical machines work (memory, hard drives, networks, etc.) and high level languages focus on abstract ideas (tokens, vaults, transfers, etc.). Something abstract always needs to ultimately represent something physical or it can't function, but two different abstract concepts (e.g. happiness vs. taste) may not have any direct translation.

Another problem with overly abstract/specialized languages at the chain level is that they hurt composability and can even introduce a form of "vendor lockin".

Imagine you create "farm chain" and it has all kinds of great words in its language for barns, tractors, animals and crops. This will probably excite a certain agricultural crowd who will likely make a lot of progress in a short period of time expressing various farmy things onchain.

At some point though, someone will want to interface with farms. Maybe they want to create a defi protocol for speculating on barns. Maybe they want farmers to have exclusive access to an upcoming onchain game/event. Maybe something hasn't been invented yet that would be great for farms. The farm-specific language probably can't represent these non-farm ideas, so it pushes the composability out to bridges and/or oracles, which is largely an unsolved security problem. If the farmers don't like being stuck on their farm-chain island they can't even move/copy their code to another chain without rewriting it from the ground up in the non-farm language anyway. At this point, whatever early gains were made are lost and then some. Worse, all this is fairly obvious to most people, so the chains tend to be permaghost chains from launch.

### Compiled languages

Compiled languages like Solidity are very successful. There is a team of highly competent developers designing and implementing Solidity and a large ecosystem of contract writers who use Solidity to create deployable contracts. The feedback loop between real world contracts and Solidity allows it to evolve over time as the compiler can ship new versions without the underlying chain language changing. In fact, it's much better if the underlying EVM does NOT change, so that Solidity can build on top of that stability to hone security and performance over time.

Solidity allows contract writers to achieve generality, composability and portability. Many chains have realised that if they can guarantee EVM compatibility there will automatically be an audience with existing Solidity contracts that can immediately be deployed.

One problem is that compiled languages tend to be both write-only and monolithic. This means that some dev or team of devs, through heroic effort and many sleepless nights, construct the perfect Solidity code, compile it and then deploy it to the blockchain as a gigantic block of low level EVM bytecode. Most of the contracts deployed are malicious and/or flawed, so out of many thousands of deployments, the end result is perhaps 10-100 viable contracts operating globally at any one time, depending on your definition of viable.

The compilation of Solidity->EVM is a one way process, there's no way for an end user to inspect the compiled EVM bytecode and produce an accurate representation of what the authors were working with in Solidity. A partial solution exists in the form of platforms like [Sourcify](https://sourcify.dev/) and [Etherscan](https://etherscan.io/) that allow authors to "verify" their contract by uploading some Solidity code that produces the same bytes visible onchain. The authors may not upload the source, or they may upload it with missing or misleading documentation. Even if they upload everything, Solidity contracts are typically large and subtle, there are many places that something can go wrong.

Generally end users cannot read Solidity, and even if they can it's not at all obvious where a bug or exploit might be. Solidity may be 1000 times easier to read than EVM bytes, but still 1000 times beyond what would be needed for "mainstream" users to read it safely.

Further, languages like Solidity, being general purpose, are still focussed on machine and structural concerns more than abstract outcomes that a human might recognise. There's no "send tokens" function in Solidity, and while Open Zeppelin do an amazing job of providing libraries for this, it doesn't mean that contract writers or readers will identify correct usage of these libraries when visually inspecting verified contracts. Most Solidity contracts are 90%+ "packaging" rather than logic relevant to the desired outcome. A DEX that can be summarised as simply as `x*y=k` (1 line) has thousands of lines of ancillary code dedicated just to securely moving tokens around.

To make things worse, as "nobody" other than the authors and their auditors understand the code, "upgradeable contracts" have become completely normalized. This means that developers give themselves the ability to unilaterally change deployed code in its entirety at any moment using their private key. There's no real expectation that end users either fully understand any contract, or that their understanding of the contract today is relevant to the functionality tomorrow.

## How does the Rain interpreter help?

### What is the Rain interpreter?

The Rain interpreter is really a few different things depending on the context.

- An abstract [design pattern](https://en.wikipedia.org/wiki/Interpreter_pattern) applied in a blockchain context to respect gas, security, interfaces, etc.
- An interface that contracts can implement to declare themselves as something that can be used to run Rain expressions
- Implementations of the design pattern and interface in the Rain github repository used to nucleate the Rain ecosystem
- A core and necessary part of the Rain movement that enables extensible, accessible, secure [hyperstructures](https://jacob.energy/hyperstructures.html)

Generally interpreters have no storage of their own, or are limited to storage used to save/load expressions rather than to evaluate them. Interpreters simply take an expression written for them and run the relevant immutable compiled code for each word in the expression. Typically an interpreter is written in Solidity but it can be anything EVM compatible and Rain intepreters could even be written for other chain execution environments such as WASM.

Any contract may be an interpreter (e.g. via inheritence) or use a standalone interpreter (e.g. by interface) to provide extension points. In this way an immutable contract can provide a generic framework for custom behaviours defined by ad hoc expressions passed off to immutable interpreters.

Specific examples of expressions and extension points include:

- Calculating prices for a token sale
- Access gating exclusive events with complex rules
- Defining trades in an order book
- Establishing conditions under which tokens can move in/out of escrow
- Etc.

### Extensions vs. Upgrades

Ethereum.org lists [5 patterns for upgrading](https://ethereum.org/en/developers/docs/smart-contracts/upgrading/) smart contracts. Of these only 2 allow upgrades without unilateral admin keys. Of these two, only one (Strategy) pattern allows for decentralised upgrades. If you search for the word "you" in the upgrading article it's very clear what the implications for decentralisation and security are.

The [Hyperstructures](https://jacob.energy/hyperstructures.html) article from Zora goes further to outline an economic vision, "for public" vs. "for profit".

Every requirement of a hyperstructure is undermined by upgradeability:

- Unstoppable: An upgrade can stop a contract
- Free: An upgrade can introduce fees
- Valuable: An upgrade can drain value (rug pull)
- Expansive: An upgrade can divert fees away from participants
- Permissionless: An upgrade can gatekeep a contract
- Positive sum: The most profitable action is always to corrupt the admin
- Credibly neutral: The admin cannot be considered neutral

Even if a contract appears to act as a hyperstructure, and has never violated the above requirements, the potential for it to be modified at any moment disqualifies it from hyperstructure status.

By using the "Strategy" pattern we know of three (so far) ways to build a hyperstructure that is extensible but not upgradeable.

- Where a faulty extension can only or primarily harms the deployer (e.g. order book trades) allow the deployer to select "satellite contracts" ad hoc
- Where a faulty extension can harm many parties, build a factory hyperstructure that allows child deployments to select a "satellite contract" upon initialization, but enforce immutability after that point
- Where onchain governance is necessary and reasonable, allow the governance process to define extensions

The limitation of an "extensible public good" is that all the extensions are themselves contracts that need to be written and read. If we've accepted that Solidity is a professional tool that is powerful but out of reach for the average trader, how can we expect an extensible order book to work? or extensible sales for a creative project? etc.

Do we expect end-users of a hyperstructure factory to be writing and verifying contracts they reference when they deploy factory children?

Rain interpreted languages fill this gap by allowing end users to deploy very high level expressions as described above. Each word in the expression maps to some compiled Solidity code in an interpreter contract that is ideally immutable. A mutable (upgradeable) interpreter should be treated with a large amount of skepticism as there's no good reason for doing so, all existing expressions would change their meaning and new expressions can always be written for new interpreters.

A single Rain expression may even reference several interpreters. In this way it can leverage battle tested interpreters and opt in to newer more experimental extensions.

Any Rain-aware contract can be deployed with many expressions. A single contract could have expressions for "can transfer", "can mint", "calculate price", etc.

In this way the Rain interpreters allow end-users to take advantage of [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) defined by the original authors of some hyperstructure. The hyperstructure is then extended implicitly by every new interpreter that is deployed.

### Read-write vs. write-only

Unlike a compiled language, a Rain expression is 2-way writeable/readable. When an expression author deploys Rain bytecode to an interpreter that tooling understands, it can be read back from the bytecode into something for a reader that accurately represents what the author wrote. This requires no additional input/verification step from the author and is permissionless for the reader, the reader can even use tooling to perform additional analysis over the expression that the writer themselves did not consider.

This works because the opcodes of a Rain expression always map immutably 1:1 with some compiled Solidity code in some interpreter.

The round trip looks roughly like this.

```
Author 
-> Parser 
-> Rain expression
-> Deployed contract
-> Subgraph 
-> Rain expression 
-> Formatter 
-> Reader
```

This setup allows the author and reader to set their own preferences via tooling for how they'd like the Rain expression to be displayed.

For example, perhaps the author prefers infix notation like `(1 + 2 + 3)` and the reader prefers a more lispy `(+ 1 2 3)`. Both are unambiguous so are valid ways to read and write an expression to the same deployed bytes. The tooling can give both to the respective audience.

This mitigates certain obfuscation techniques where the author intentionally writes code to be misunderstood. The reader won't see the source, they will see the output of their formatter. The `NoticeBoard` contract allows writers and readers to annotate deployed contracts in formats that tooling may pull from the subgraph and understand to display additional context for the reader.

The security model for expressions relies on there being trustworthy (not merely trusted) interpreters on which tooling can be overlaid. For this we can lean on a model pioneered in the space by sites such as [Token Lists](https://tokenlists.org/) and [Chainlist](https://chainlist.org/). Essentially the end-user is always in control, but there are layers of curation and meta-curation, each focussed on a specific outcome and degree/model of decentralisation. If a user ever encounters an expression using an unknown interpreter, they can first cross-reference their trusted lists, then fallback to a decision for themselves on what basis they would trust or not trust an expression run on some mysterious interpreter. This decision making process extends to all participants, both human and bot on a per-expression basis.

