---
slug: standalone-interpreter-merged
title: "Standalone interpreter merged"
authors: thedavidmeister
tags: [words, interpreter, chainlink, flow, sale, ensure, security, interface]
---

Today we merged the standalone version of the interpreter which ships as a mere
interface from the perspective of the calling contract. New words added and
significant changes to `Flow` usage and security model.

There are two interfaces now, the interpreter itself and the deployer which
handles all the integrity checks. The interpreter and deployer MAY be a single
contract but they MAY also be two different contracts. This allows for various
potential tradeoffs such as ease of implementation, state/storage, gas, code size,
etc. Key is that expressions are now always expected to be deployed as contracts
onchain, the SSTORE2 strategy (but not necessarily specific implementation) is
lifted to be a first class concept in the interface. Said another way, Rain
interpreters treat the expressions they run exactly as the EVM treats other
contracts, every expression is expected to have its own address.

What this means is that the security model binds all three of the expression,
interpreter and deployer into a single unit to be considered by the end user.
This was always the case but the interpreter and operating contract were the same
thing by inheritance, so it was implied. Now it is an explicit consideration. All
downstream tooling needs to be aware of and respect this setup. For example, word
`00050005` could mean "add 5 numbers" in interpreter A and "multiply 5 numbers"
in interpreter B. The downside of this is obviously that we have a phishing opportunity
at the interpreter/deployer level, which will require thoughtful curation and
discernment. The benefit of this is that given thoughtful curation and discernment
we open the possibility of user-specified version pinning of their own expressions.

So far `Flow` and `Sale` contracts have been modified to support the standalone
interpreter which operates as a thin inheritance of the standard interpreter.
`Flow` no longer supports dynamic reads of "last flow time" against an ID, the
flow time will always be read for the current flowing ID. `Sale` has all the data
that was previously available via. storage opcodes exposed under `ISaleV2`. The
`ISaleV2` interface is newly invented specifically to expose this information.

One important thing to note for expression writers is that the meaning of the 
`msg.sender` word is no longer the caller of `Flow` or `Sale`. It is now the
`Flow` or `Sale` contract itself, because `msg.sender` is from the perspective of
the interpreter. Both contracts now have an additional item in context that is the
`msg.sender` from the perspective of each contract.

In addition to new words for `ISaleV2` we also added an opcode to read a price
from any Chainlink oracle and have it returned in 18 decimal fixed point, and
enforce a "stale" timeout to guard against paused/delayed oracles. Please note when
reading from Chainlink that all oracles are upgradeable proxies so pausing and
changes to frequency/sensitivity of price updates is subject to multisig changes
at any time. If this is a problem for you, reach out and we can discuss pinning
oracle versions in addition to stale timeout checks.

There's also a new `ensure` word in the interpreter that works just like `require`
in solidity, but has a different name in case it needs to work differently in the
future without losing its identity. `Flow` has been modified to remove the "can sign"
and "can flow" entrypoints as every round trip to an external contract costs
additional gas. It's much better to simply `ensure` the same logic inline with a
single expression. Previously "can sign" ran on a loop over each signer, now every
signer is provided in the second context column and can be matched pairwise with
the subsequent columns in context that they have signed. ALWAYS `ensure` the signer
for any signed context in every flow, on pain of critical security issues. The
`Flow` contract will check the signature is valid, but can't know _who_ is allowed
to sign some context unless you write it into the expression.