---
slug: experiments-in-flow-and-adminless-upgrades
title: "Experiments in flow and adminless upgrades"
authors: thedavidmeister
tags: [interpreter, upgrades, flow, gas, security, code-size]
---

# Experiments in flow and adminless upgrades

This week I spent some time on a general purpose struct that defines token movements. In the [near future](https://github.com/beehive-innovation/rain-protocol/pull/452) this struct and associated logic will replace the `EmissionsERC20` contract.

This is all a leadup to "adminless upgrades" for interpreters (previously known as VMs) that I'll try to get working "soon".

In short, this is the crux of the flow code in Solidity from this week.

```rust
struct ERC20IO {
    address token;
    uint256 amount;
}

struct ERC721IO {
    address token;
    uint256 id;
}

struct ERC1155IO {
    address token;
    uint256 id;
    uint256 amount;
}

struct FlowIO {
    uint256 inputNative;
    uint256 outputNative;
    ERC20IO[] inputs20;
    ERC20IO[] outputs20;
    ERC721IO[] inputs721;
    ERC721IO[] outputs721;
    ERC1155IO[] inputs1155;
    ERC1155IO[] outputs1155;
}
```

I don't usually lead an explanation with a raw chunk of code, but hopefully this is easy enough to follow. `IO` means "input/output".

The `FlowIO` struct has an associated library `LibFlowIO` with 2 functions, `flow` and `stackToFlow`. Both will be discussed below.

_N.B. As we're working with unsigned integers here we only have positive numbers which makes the struct and associated logic a bit verbose. If we had signed integers we could do something like "positive = send, negative = receive". Seems pretty likely I'll end up refactoring that in the future, watch out for `FlowIO2` ;)_

**Something (a contract) is going to send and receive 0 or more of native, erc20, erc721 and erc1155 tokens.**

All standard questions apply. Why? How? What? When? Who?

## Start with why

__Apparently it is impossible to upgrade smart contract functionality without a multisig/admin key.__

Even if you have a DAO. Even if you have a crazy simple stateless contract. Even if the change is realllly tiny. Even if your best friend is named Vitalik. There's just no way to upgrade a smart contract without an admin key.

"Everybody knows" this (Ok, probably a lot of devs could think of ways around it, but culturally many of us clearly do not make a habit of alternatives).

I'd like to show how, for a certain _more limited but still (perhaps more) useful_ definition of "upgrade" it is possible that a DAO or even _individual users_ could upgrade contract functionality for themselves over time.

### The normal defintion of "upgrade"

Something like [Open Zeppelin Proxy/Logic contracts](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies).

- There is an eternal "proxy" contract that has:
    - __An owner that can change the logic contract__
    - All the storage
    - A reference to the logic contract
    - Zero logic except what is required to use the logic contract
- There is a temporary "logic" contract that has:
    - All the logic
    - Zero storage
    - __The ability to arbitrarily modify the proxy storage__

Whenever an upgrade happens the proxy is updated to point to a new logic contract. The old and new logic contracts still both exist forever, it's just that the old one is no longer used any more by the proxy.

The dot points above that I did not highlight are boring implementation details. The items in bold are really important to understanding why we "need" admin keys.

Here are the two main ways that a contract is rekt due to an upgrade:

- A bad proxy owner upgrades to a bad logic contract suddenly and unilaterally without consent of any other users (even impacts in-flight transactions in the mempool)
- A bad logic contract does bad things to storage (e.g. deleting token balances)

Note I say bad rather than malicious because it could be entirely unintentional due to a bug or fat fingered transaction.

The bold points are a direct result of use of `delegatecall` which is baked in to Ethereum. Even more complex schemes like the [Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535) rely on `delegatecall` so have the same basic ownership/trust issues.

__Any upgrade definition underpinned by `delegatecall` will need a _trust model_ to explain how proxy data is not immediately corrupted by logic contracts.__

Delegating to an untrustworthy logic contract _even once can permanently destroy_ a contract's storage for everyone. Therefore, we need the trustworthy admin(s) to protect us from the untrustworthy logic. And who writes the trustworthy logic? the trustworthy devs of course! And who reads the trustworthy logic to ensure it does what it was written to do? the trustworthy devs!

:thinking_face: Seems complicated/redundant. Maybe the devs should just be the admins too. :thinking_face: 

:thinking_face: Seems risky/illegal. Maybe a DAO should vote so devs aren't responsible if money disappears. :thinking_face: 

### A rainy definition of "upgrade"

A hub/spoke model that prioritises lindy and self-auditability of cause/effect:

- Many eternal storage spokes as "hosts" for compute
    - Can be deployed en masse by factories
    - Storage logic is NOT upgradeable
    - Compute placeholders reference hubs (e.g. [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control))
- Many eternal compute hubs
    - Can be a rain interpreter but doesn't _need_ to be, only needs to implement the interface
    - Compute is read-only from the perspective of the storage spoke
    - Need to service the compute interface with no knowledge of what the storage spoke is trying to achieve so that it can service many different, arbitrary spokes
- Ad-hoc references between the two based on p2p relationships rather than a global overseer

We have several examples of what could be a storage spoke already in the Rain codebase:

- Tokens with a compute for minting rules
- A crowdfunding closed-ended sale with compute for price curve
- An order book where _every order_ has dedicated compute
- An 8-tier membership system where each tier can be combined with compute
- A KYC/Verify callback where compute acts as an onchain auto-approval bot

Currently all of these _inherit_ the interpreter/VM contract which, code size aside, means that the set of words/functions that they can express is frozen on the day they deploy. None of the Rain contracts have admin keys for upgrades.

Instead, all of these could _reference_ the interpreter/VM which would immediately fix most of the code size issues in return for some gas, but more importantly it would support our definition of "upgrade".

The order book is the most extreme and therefore illustrative example of how this is drastically different to the `delegatecall` upgrade path.

In the order book _every order is a expression_. Unlike a standard order book where every order has a fixed price and amount, every order dynamically calculates the price and amount when it is cleared. This completely avoids the issue with onchain orderbooks relying on a bot or similar repeatedly sending transactions to update the order.

Now, imagine we deploy order book today with some set of opcodes then tomorrow a new price oracle is announced that immediately sets the zeitgest on fire. We don't have any admin keys so there's no way for us to roll out the new oracle interface to our existing traders, right? uh oh, fade to irrelevance and protocol death... :skull: 

Well in the rain upgrade model, we can allow traders to select their own compute hub. Traders can upgrade (or downgrade) for themselves to any compute hub they are comfortable with on a per-order basis. As the compute hub can't modify the vault balances of the order book, or influence how it transfers tokens, or any other storage related task, the only users who can benefit/suffer from the upgrade are:

- User who places the trade needs to trust the compute they select to represent their trade accurately
- User who takes the other side of the trade needs to trust _their_ compute to represent _their_ trade
- User that clears matching trades needs to be able to preempt the outcome during offchain matchmaking so they don't lose gas or miss out on a better bounty

Note that the selection of the compute can _only negatively impact the selector_ not their counterparty, not the shared contract storage, not other traders uninvolved in their trade, not other users of the compute for other non-orderbook contracts.

In this way, the order book could even support users hiring (or being) their own dev, writing a custom compute and using it permissionlessly. As long as someone calls `clear` on their orders (could be their own bot), it will all function safely.

This all works because instead of `delegatecall` we rely on read-only calls, much like calling `balanceOf` on some unknown, even malicious token cannot damage our contract storage, even if it gives some funky rebasing results sometimes. This is all very boring stuff when it comes to `balanceOf` being read only, because we're very used to treating read only calls like a query to a database, but we're less used to the same technique being used to represent user intent and drive behaviours.

In a less extreme example, we can consider a DAO managing a token minting schedule. As the DAO has entered a new regulatory regime they need to retroactively add KYC to their token based on a new ERC standard. Unfortunately they have no Solidity devs, their existing Rain interpreter doesn't support the new interface, but no problem. The DAO can vote to adopt a new interpreter with the relevant support they need and update their minting expression to require the new KYC checks. This new interpreter may be shared by dozens or hundreds of projects, so even non-technical DAO members have a pretty good grasp on the [Lindy](https://en.wikipedia.org/wiki/Lindy_effect) (value protected x time) effect. Even if the new expression/compute turns out to be buggy it cannot directly access/damage their token balances, so a safer rollback is more likely to be possible.

__We give up our ability to change how our contracts imperatively write to storage in exchange for decentralized upgrades of reads and declaratively defined behaviours.__

## Back to flow... as a stack not an interface

I did NOT implement all the above this week (although I will "soon").

First I set myself the challenge of seeing how much of each of the Open Zeppelin ERC20/721/1155 contracts could be prepared to support the above model. So far I've added:

- Rebasing where applicable
- Ability to restrict transfers (auth)
- Ability to "flow"
- Ability to restrict flows (auth)

I haven't added any governance yet, but there could be a fun future in "light governance", expressions gating the ability to modify expressions.

The basic idea of a flow is that an expression can specify any combination and amount of third party native/20/721/1155 tokens to take/send from/to the `msg.sender`. This was easy enough with the structs I pasted earlier. Where it got a bit interesting is asking the host token to mint or burn _itself_ based on the flow and compute.

For example, a basic `FlowERC721` deployment should be able to mint itself in response to receiving some ETH. A `FlowERC20` deployment should be able to mint itself in response to receiving some ETH. A `FlowERC1155` deployment should be able to mint itself in response to receiving some ETH. A `MyCustomPaywallContract` should be able to set a value to `true` in response to receiving some ETH. Etc. Etc.

### The problem with imperative interfaces for shared compute

If you're at all familiar with how standards are generally defined in [ERCs](https://eips.ethereum.org/erc) you'll know that the smart contract standards care a lot about [imperative](https://en.wikipedia.org/wiki/Imperative_programming) interfaces. The ERCs care a lot less about [declarative](https://en.wikipedia.org/wiki/Declarative_programming) data structures (and I'm not talking about type systems), at least if you go by the relative volume of text describing and defining the two.

In some sense this makes sense. The primary way that contracts interact with each other onchain is by calling functions on each other. If you call some function you want to know what it _does_, right? If the function doesn't do what the interface says then we know who to _blame_, right?

In some other sense an interface implicitly defines everything that is _not_ possible. I'm not just talking about the all caps MUST NOT sprinkled around in the verbiage, but all the features left out today that can never be added in tomorrow. Interfaces are meta-unupgradeable and unextensible.

We don't have to look far for a concrete example.

ERC20 has a `balanceOf` function. Simple enough. Pass an address and get back a balance.

Now consider Open Zeppelin introduces [snapshot](https://docs.openzeppelin.com/contracts/3.x/api/token/erc20#ERC20Snapshot) functionality. That's a great feature, but comes with a concept of time and so a new `balanceOfAt` function is born that needs both an address and time to give back a balance. There's a few issues here.

- Onchain times can be either blocks or seconds, regardless which one `balanceOfAt` uses we immediately beg the `balanceOfAtSeconds` or `balanceOfAtBlock` complementary option
- No existing code can start using it without some kind of upgrade path, unupgradeable interfaces beg for upgradeable contracts to putty the gaps
- No new code can assume that arbitrary unknown third contracts implement `balanceOfAt`, so it has to [tentatively probe the interface with gas](https://eips.ethereum.org/EIPS/eip-165) and fallback gracefully to use it
- `balanceOfAt` is a concept that applies equally well to ERC1155, just as both ERC20 and ERC1155 have a `balanceOf`, but there's no consistent port for this part of the non-standard interface, in general cross-interface concepts simply don't exist

I won't touch the first point for fear of a debate about type systems.

We discussed upgrades already for the compute, so that's fine we can adapt to ad-hoc interfaces in the compute by simply adopting a new compute contract or external calls.

The last two points are still relevant. The shared compute can't know the interface that it is supposed to be matching with return values. Just like `balanceOf` and `balanceOfAt` have problems cross-contract and cross-interface with their inputs, the compute has no way of knowing what its outputs should be. One of the requirements of the compute for decentralised upgrades is that it can service many arbitrary contracts so that it can build lindy, rather than having an endless stream of single purpose disposable logic contracts that each proxy cycles over.

The best we can do for compute is define a single generic interface like "takes inputs and returns outputs" and perhaps enforce that the outputs are a list like `uint[]` instead of a single value, or some more complex type.

### Declarative stacks

Back to the `FlowIO` struct.

```rust
struct FlowIO {
    uint256 inputNative;
    uint256 outputNative;
    ERC20IO[] inputs20;
    ERC20IO[] outputs20;
    ERC721IO[] inputs721;
    ERC721IO[] outputs721;
    ERC1155IO[] inputs1155;
    ERC1155IO[] outputs1155;
}
```

There's only two things our standard `LibFlow` library can do (so far).

- Given a stack (list of numbers) build a `FlowIO`, sort of a simplified `abi.decode`
- Given a `FlowIO`, scan all the inputs and outputs and process the transfers

If a stack can't cleanly decode to a `FlowIO` it will error, and if any transfers fail it will error. The code that wraps the library takes responsibility for preventing reentrancy due to the transfers, etc.

Now we have a standard (in the library) way to process reading a stack and converting it from a declarative structure to an imperative list of instructions.

This gives us two major benefits.

- Stacks can be arbitrarily long, so we can support extending third party token flows with self-mint and self-burn and many other things in the host contract without needing a new compute interface
- We can "hot swap", upgrade and reuse expressions or partial expressions across different flow-aware contracts and share the same compute contract or move to a new compute
- If we do manage to get the token transfer logic in the library correct up-front, there's no way that anyone can screw it up later with subsequent "upgrades", sadly regressions and new vulnerabilities are just as common in new versions of software as older ones, nothing about an "upgrade" guarantees that it will be better or safer

But of course we have to discuss the tradeoffs.

- We cannot upgrade the host to have new processing logic, imagine if some new token ERC2468 standard is released tomorrow, we could upgrade our expressions to _read_ that token interface and even define what to move but the host won't know how to send/receive those tokens (requires writes)
- There is some code size and development overhead with all this declarative processing as we have to define all the things we might want to do today instead of being lazy and waiting to upgrade to support them tomorrow (note that this could probably be largely addressed by the diamond standard as it already supports unlimited code size via `delegatecall` and restricted upgrade paths, a hybrid trad-upgrade and rain-upgrade system is possible)

### Differences from abi encode/decode

Building a `FlowIO` struct from stack values is similar to but different from encoding and decoding structs for the ABI, a well established data format with mature tooling for contract input and and output.

The main reason for NOT using the ABI spec is that it simply seems impossible to expect non-developer-humans to read and write logic to build a stack that is valid ABI data. [Read the ABI formal specification](https://docs.soliditylang.org/en/v0.8.0/abi-spec.html#formal-specification-of-the-encoding) yourself and imagine someone trying to manually build valid dynamic arrays with type-specific lengths, let alone handling "head" and "tail" correctly.

Instead, I've adopted a simplified approach based on [sentinel values](https://en.wikipedia.org/wiki/Sentinel_value). Essentially we don't expect the encoder (expression writer) to handle _anything_ about types or lengths or data structures other than to produce some appropriate lists of values. The host contract will scan the stack it receives and look for sentinels and count for itself the length of the array, as it knows how many values per item it expects. The sentinel is placed so that it can be directly overwritten by a valid length and the consumer/host can use the stack directly as a valid struct without any allocations or copying data in memory. As we have 256 bits to play with, we have infinite collision resistant sentinels (UUIDs are "only" 128 bit!) that can all be recognised by domain specific decoding logic without leaning on any central registry approving/defining domains.

Hopefully this results in a good balance between simple expression writing, data integrity and overall efficiency (gas).

## Things you can do

At the time of writing there's a [PR](https://github.com/beehive-innovation/rain-protocol/pull/452) up containing new contracts for:

- Untokenized `Flow.sol` simply allows tokens to flow through itself
- Tokenized `FlowERC20.sol` allows token flows through itself and ERC20 mint/burn
- Tokenized `FlowERC721.sol` allows token flows through itself and ERC721 mint/burn
- Tokenized `FlowERC1155.sol` allows token flows through itself and ERC1155 mint/burn

Note that the tokenized versions of flow currently exceed the 24kb contract size limit if you have a high runs value on the compiler.

You can still test the contracts, develop POCs etc. or even deploy them if you want (although be wary of QA being incomplete currently) by reducing the runs value.

There's a lot of options available to reduce the code size issues that I've already explained, so I don't see it being a long term issue. It's just something to work through over subsequent PRs.