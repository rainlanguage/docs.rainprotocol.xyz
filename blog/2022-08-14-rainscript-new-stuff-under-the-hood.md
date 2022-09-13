---
slug: rainscript-new-stuff-under-the-hood
title: RainScript, new stuff under the hood
authors: thedavidmeister
tags: [rainscript, gas, security, updates]
---

# RainScript, new stuff under the hood

__Disclaimer: This post is about unaudited code under active development. Implementation details, names, security features, gas costs, etc. may change significantly.__

Much of the recent work has been consolidation of the "VM" code to take it to where the Rain ecosystem needs it to be.

The v1.0 VM is everything you see in the latest audit.

https://omniscia.io/beehive-rain-protocol-round-2/

The v1.0 system works fine as far as we know, there's no urgent need to stop using it if you are, but it is showing early signs of running into limits on several fronts.

This is just a blog post so here's only a high level summary, not comprehensive. Highly encourage you to checkout the latest branches in github and look around if you're interested.

<!--truncate-->

## O(n) -> O(log n) -> O(1) gas costs for opcode dispatches

We noticed that adding more opcodes increased the cost of dispatching each opcode
by roughly O(log n) in v1.0.

This wasn't a problem when we had a dozen opcodes and the typical script was 1-5 opcodes long, but now we have around 50 opcodes and scripts may have dozens of dispatches in them.

The gas cost is caused by dispatch logic based on `if` checks for each opcode to decide what function is supposed to run. The EVM charges gas for every `if` so more opcodes means more things to check which means more gas.

That was causing us O(n) gas costs so we organised a rough tree structure on the dispatch, which helped a lot but didn't completely solve the issue.

Solidity itself suffers the same problem when dispatching function calls on contracts as it has to if/else its way down the functions it knows how to handle based on the input it receives.

__In v2.0 we achieved O(1) dispatch costs of ~200 gas per opcode.__

This was done by building an indexed registry of all the function pointers up-front then simply using the opcode as the index of the function to call. To achieve this we had to standardize the function signature of every opcode called including the "core" opcodes that in v1.0 had ad-hoc implementations.

Note that the mapping between opcodes and registered function pointers is done once at deploy time. The source we dispatch calls from at runtime includes the literal function pointers already, so there's zero runtime overhead.

The new function signature looks like this:

```solidity
    function myOpcode(
        VMState memory state_,
        Operand operand_,
        StackTop stackTop_
    ) internal view returns (StackTop stackTopAfter_) {
```

The `VMState` has a function pointer back to `eval` itself, which allows for recursive/looping/nested logic.

A side benefit of the standardization is that downstream opcode writers have full power to implement exactly as much as "core" does with its own opcodes. Including recursive evaluations and other state modifications. One community member is already scheming a "lazy if" implementation.

Importantly this approach avoids the need to be adding ever more `if` statements as we add more opcodes, so more opcodes no longer means more gas.

## Expensive runtime checks -> "Zero cost abstractions"

As someone with several years experience with programming in Rust, I really appreciate the "zero cost abstraction" mentality. It is often held up as a reason NOT to use Solidity vs. a Rust/WASM based smart contract.

The gist of how an abstraction can be "zero cost" is that if the compiler itself can prove something when the code is built then we don't have to check it again when the code is run.

Notably Rust has a unique set of rules and syntax around memory management that allows it to be as safe as a garbage collected language but with zero runtime overhead. That's pretty amazing if you think about it and one of the original selling points of Rust. Along with compiler guarantees for common concurrency concerns, etc. it has really forced its way into the programming zeitgeist.

Rain scripts *don't compile though, so how is this relevant?

> In computing, a compiler is a computer program that translates computer code written in one programming language (the source language) into another language (the target language). The name "compiler" is primarily used for programs that translate source code from a high-level programming language to a lower level language (e.g. assembly language, object code, or machine code) to create an executable program.

None of this happens in Rain, the exact opcodes deployed into a `Sale` etc. are
dispatched when run. Trying to compile things on-chain immediately raises big
questions like "GAS??". Solidity already does the compiling for us and there's nothing wrong with that, each script is just looping over pre-compiled functions and building a final result.

_*If you want to be generous, mapping opcodes to function pointers is "compiling"._

Note though that "compiling" something and "proving" something are two different things.

Rain does have a distinction between "deploy time" and "run time" for every script. Someone MUST define the script and pay the gas for it to be pushed to the blockchain before anyone else can read it and run it.

In v2.0 we do a "dry run" of every script as it is deployed to observe how it will handle potentially unsafe things, like reading past allocated memory or into storage slots that are not intended for VM consumption. The dry run doesn't actually calculate anything. If you `add` 5 numbers the dry run won't add anything, it will simply register that 5 things were taken from the stack and 1 thing was added to the stack (the result). Taking 5 things from a stack that is only 3 things tall will cause the dry run to fail and the deployment transaction will rollback.

___"But Dave!"_ I hear you say, _"Rain supports conditional logic, how can a single dry run account for all possible stack movements?"_ It's a good question and I'm glad you asked.__

In v2.0 we have a notable inclusion of a do/while style loop. If runtime logic decides how
many times a loop executes then a malicious actor can simply manipulate the runtime condition to loop more or less times than the dry run and then build a different stack than was analyzed (very bad).

So the new do/while loop has a restriction on it. The net stack movement MUST always be 0, and 0 times anything is still 0, so we no longer care how many times the loop runs. In general we simply flip the question around and only allow opcode logic that _can_ be demonstrated as safe or unsafe in a dry run. In some ways this makes Rain scripts more limited, but in other ways it provides a new path to move forward safely.

Third party opcode writers MUST ensure that their stack movements are either predictable at deploy time in all circumstances, or that they will revert at runtime if something disallowed happens. For example, the `context` opcode will error at runtime if it attempts to read past the context array bounds. Strong preference is deploy time checks as runtime errors not only cost end-users gas but are generally a bad UX. Sometimes runtime errors are unavoidable though, such as "divide by zero". The main "trick" to achieve deploy time guarantees is to encode as much dynamic information (e.g. array lengths, variadic IO, etc.) into the operand as possible.

The dry run can do more than just fail, it can also measure and observe to inform runtime behaviour. For example the new `OrderBook` contract knows to only write certain things to storage at runtime for orders that include opcodes that read from those storage slots. Most orders won't use the opcodes that read storage, so those traders never have to pay the gas for the storage writes that they don't need.

By forcing the deployer to submit their script to the dry run, we remove a lot of wiggle room for pshishing-esque attacks. The [latest audit from Omniscia](https://omniscia.io/beehive-rain-protocol-round-2/) flagged that a malicious entity could provide an invalid stack length to trick users into running corrupt code. While end-users (or rather, the GUI they use) COULD check the stack length themselves, it's a risk and responsibility we'd rather not place on users or front ends. The v1.0 fix was to put a relatively expensive runtime check on every dispatch to see whether it reads/writes outside the stack. In v2.0 none of this is necessary as the deployer MUST pay for a dry run for their script to even be accepted by the system.

## 16 bit -> 32 bit

We moved to 2-byte opcodes and 2-byte operands (32 bit total).

Strangely we observed this to have negligible additional gas cost, or even a net lower gas cost. This is likely because the additional cost of the extra script bytes are offset by simpler logic for key in-memory processing.

Short term this has only minor benefits, it allows more information to be encoded
into certain operands.

Notably it opens up the future possibility for "translation contracts" that could handle potentially hundreds of 16 bit dispatches under a single 32 bit dispatch.

For example, ERC20 balance and total supply are opcodes in the VM that add some code bloat for any VM contract. Each opcode adds ~200 bytes so ideally we'd take everything that already relies on external calls and push it out to another contract.

This would mean that lightweight and critical path things that are very commonly used like `add` remain internal and cheap. Heavier, less frequently used things would sit external to the VM and so don't bloat VM contract code. Many different VMs could use a single dispatcher/extension/translation contract as it has no state of its own and simply processes sub-stacks, much like the new `call` opcode does.

We haven't benchmarked the gas of this yet, but recall that the [EVM charges much less gas (~2600 vs ~100) for calling "touched" contracts](https://github.com/wolflo/evm-opcodes/blob/main/gas.md#aa-call-operations) vs. cold ones. We expect the overhead of 2-hop external calls vs. 1-hop external calls to be largely amortized for scripts complicated enough to care.

This would allow "unlimited" opcodes without bloating the VM contract itself at all. This is already how the dry run functionality works, as integrity checks are farmed out to a trusted integrity calculator contract, saving a full 7kb on the standard VM contract.

__Avoiding VM bloat is NOT just a luxury, there is a hard limit of ~24kb that contracts cannot exceed or they simply won't deploy onchain.__

Ultimately the goal is to support "every" externally readable interface, from oracles, to snapshots, vaults, price quotes, and things that haven't been invented yet. Hopefully the sheer potential of that is something worth paying nominal additional gas for.

For example, we implemented ERC4626 in the new staking contract but did NOT write associated opcodes for all the 4626 read functions. There's quite a few and nobody has said they need them, so it would bloat VMs by ~0.5-1kb to include them directly, for something used by less than 1% of scripts out there.

In the future we aim to use the new 32 bit system to facilitate implementing rarely used functions as external dispatches, with no fear of bricking any existing VM contracts that try to use them. The upgrade path for a VM factory would be to simply point to the new translation contract. Existing VMs on-chain would all continue to run as they were deployed, unimpacted by the existence of new opcodes, as all scripts written for them by definition never referenced the new logic.


## Complexity -> Simplicity

> So if we want to try to apply simple to the kinds of work that we do, we're 
> going to start with this concept of having one braid. And look at it in a few 
> different dimensions. I thought it was interesting in Eric's talk to talk 
> about dimensions because it's definitely a big part of doing design work. And 
> so if we want to look for simple things, we want to look for things that have 
> sort of one of something. They do, they have one role. They fulfill one task 
> or job. They're about accomplishing sort of one objective. They might be about 
> one concept like security.
>
> And sort of overlapping with that is they may be about a particular dimension 
> of the problem that you're trying to solve. The critical thing there, though, 
> is that when you're looking for something that's simple, you want to see it 
> have focus in these areas. You don't want to see it combining things.
>
> On the other hand, we can't get too fixated about one. In particular, simple 
> doesn't mean that there's only one of them. Right? It also doesn't mean an 
> interface that only has one operation. So it's important to distinguish 
> cardinality, right, counting things from actual interleaving. What matters for 
> simplicity is that there is no interleaving, not that there's only one thing, 
> and that's very important.
>
> Okay, the other critical thing about simple, as we've just described it, 
> right, is if something is interleaved or not, that's sort of an objective 
> thing. You can probably go and look and see. I don't see any connections. I 
> don't see anywhere where this twist was something else, so simple is actually 
> an objective notion. That's also very important in deciding the difference 
> between simple and easy.
>
> Rich Hickey - [Simple made easy](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md)

Complex code is bad for a lot of reasons. Superficially the v2.0 VM is a lot bigger than the v1.0 VM. There's more files and more libraries, right? Objectively the whole thing is much simpler though. Each file is tiny and once you know a few common abstractions it should be clear just by skim reading whether it works or not. That's very important for both security and maintainability.

v2.0 I'm hesitant to even call "Virtual Machine" because I feel that term comes with baggage of "conceptual bigness" like the EVM or JVM. People hear "VM" and think "wow, I could never hope to understand it", and I talk to them and they immediately project complexity into the system that doesn't exist. It is very hard to unwind that initial reaction. That kind of thing really hinders understanding and adoption.

__The focus in v2.0 has really been about putting emphasis on the core language loop, and away from things the EVM already gives us or mandates for us.__

You read english sentences one word at a time, left to right. So does Rain, but like a drunk caveman moonlighting as Spok, because Rain's brain processes at the speed of blockchain and can only think in ERCs.

If you were to say "Anyone with my NFT can buy event tickets in my Sale" then Rain would say something like "if user is 721ownerOf NFT.id then requestedAmount else 0". Rain only understands the second sentence, but you dear reader understand both. That's The Big Thing we're doing here. If everyone who reads this blog can read and write smart contracts then that's something. "A VM" is nothing, there's a million VMs, nobody cares.

> If you do not change direction, you may end up where you are heading.
> Lao Tzu

An embeddable, simple language loop, that supports "unlimited" opcodes for external ERC standards, and non-standard-but-popular things is where we are going.

We're going to make the things people say about economies and the way they talk about smart contracts one and the same thing.

When I talk about simplicity, I think it is best to "show don't tell". So here's the entirety of the `eval`  function in v2.0.

```solidity
function eval(
    VMState memory state_,
    SourceIndex sourceIndex_,
    StackTop stackTop_
) internal view returns (StackTop) {
    unchecked {
        uint256 cursor_;
        uint256 end_;
        assembly ("memory-safe") {
            cursor_ := mload(
                add(
                    mload(add(state_, 0x60)),
                    add(0x20, mul(0x20, sourceIndex_))
                )
            )
            end_ := add(cursor_, mload(cursor_))
        }

        // Loop until complete.
        while (cursor_ < end_) {
            function(VMState memory, Operand, StackTop)
                internal
                view
                returns (StackTop) fn_;
            Operand operand_;
            cursor_ += 4;
            {
                uint256 op_;
                assembly ("memory-safe") {
                    op_ := mload(cursor_)
                    operand_ := and(op_, 0xFFFF)
                    fn_ := and(shr(16, op_), 0xFFFF)
                }
            }
            stackTop_ = fn_(state_, operand_, stackTop_);
        }
        return stackTop_;
    }
}
```

It takes the rain script, it loops over it, runs the function for each opcode
then returns the final stack position when it is done so that the caller knows
what value to read from the stack.

And what do these opcode functions look like?

```solidity
/// @title OpERC20BalanceOf
/// @notice Opcode for ERC20 `balanceOf`.
library OpERC20BalanceOf {
    using LibStackTop for StackTop;
    using LibIntegrityState for IntegrityState;

    function _balanceOf(uint256 token_, uint256 account_)
        internal
        view
        returns (uint256)
    {
        return
            IERC20(address(uint160(token_))).balanceOf(
                address(uint160(account_))
            );
    }

    function integrity(
        IntegrityState memory integrityState_,
        Operand,
        StackTop stackTop_
    ) internal pure returns (StackTop) {
        return integrityState_.applyFn(stackTop_, _balanceOf);
    }

    /// Stack `balanceOf`.
    function balanceOf(
        VMState memory,
        Operand,
        StackTop stackTop_
    ) internal view returns (StackTop) {
        return stackTop_.applyFn(_balanceOf);
    }
}
```

This library defines how the VM can read the ERC20 balance for some account. Every opcode has its own dedicated library now, which sounds "complicated" but in reality is simpler overall, and more "linux-ey". Many small pieces that each do one thing well.

The `integrity` function is applied to the "dry run" on deploy and `balanceOf` 
applies `_balanceOf` to the stack at runtime. The latter simply does some native Solidity
type casting of integers on the stack to the `IERC20` interface and ships it off
to the token being queried.

We use the Solidity type system itself to calculate all the stack movements in
the dry run, all the stack reads and writes at runtime, we *can't get it wrong.

_*There's always a way to get something wrong_ 😅

There's a bit in the middle that translates the above to assembly, but it's "one size fits all". As long as it works for one opcode it works for all opcodes with the same signature.

If you're really curious, a 2 input, 1 output application of an opcode function to the stack looks like this. All the other function applications look exactly as you'd expect.

```solidity
function applyFn(
    StackTop stackTop_,
    function(uint256, uint256) internal view returns (uint256) fn_
) internal view returns (StackTop) {
    uint256 a_;
    uint256 b_;
    uint256 location_;
    assembly ("memory-safe") {
        stackTop_ := sub(stackTop_, 0x20)
        location_ := sub(stackTop_, 0x20)
        a_ := mload(location_)
        b_ := mload(stackTop_)
    }
    a_ = fn_(a_, b_);
    assembly ("memory-safe") {
        mstore(location_, a_)
    }
    return stackTop_;
}
```

All in all, the execution is looking very [FORTH-like](https://en.wikipedia.org/wiki/Forth_(programming_language)) which is probably a good thing.

Not sure what else to say about this, gone are the ad-hoc core functions, the
manual calculation of stack read/writes, complex "zipmap" behaviour, manual
calculation of opcode offsets in consumer contracts, manual stack height
calculations, runtime integrity checks, ad-hoc opcodes for access to storage and
context, etc.

We even removed the entire Balancer LBP codebase as the same thing (but better) 
can be achieved using `Sale` scripts and "virtual balances" over the standard
AMM constant product math!

There's as much to get excited about in what is NOT in v2.0 as in what has been 
added.

## zipmap -> scoped `call` opcode

The new `call` opcode introduces something like scope rules from typical languages. What this means is that the caller provides a certain number of inputs, and expects a certain number of outputs from the called source.

The called source _only sees the inputs_ on the stack and when it uses opcodes that read from the stack, they index from the first input, NOT the bottom of the stack in the reference frame of the caller.

This should drastically improve the experience of using the stack opcode as each source only needs to know how many values its stack will be initialized with. Previously the only way to know what a stack opcode index should be was to do a dry run offchain (shoutout to the JS simulator) and track the global state across all zipmap calls.

__`call` is also compatible with the new looping constructs, so loops can opt in to each iteration being built with a new stack scope.__

All the above is achieved by deploy time integrity checks, so there are no additional runtime allocations or other checks required, which makes it gas efficient. We simply calculate stack offsets relative to the temporary new stack bottom, and trigger an out of bounds error if anything in the called source reads below it as a standard deploy time integrity check.

Generally `call` should much cheaper to use than the old `zipmap`, despite the new scoping rules. This is partly because `eval` itself is cheaper and partly because `call` doesn't rely on copying arguments to a separate region of memory like `zipmap` did.

In the future `call` should support nested scripts. This means an N-tier factory can be setup, the first factory deploys some VM config that has `call` pointing at a dangling script index, then that factory deploys something that fills in the missing script. By the time we get to the leaves of our call-factory-tree we can run a single integrity check over the whole thing and know it runs safely.

This has implications and applications for a lot of things, but a nice simple example is a game tournament. Imagine a game developer deploys a rain script that explains how a tournament payout will be distributed according to an order book trade. Each tournament can have up to 8 winners, so the sub-call must be a script that returns 8 values on its internal stack. Players can then create their own tournament payout scripts (e.g. "if game is won within 5 minutes, winner takes all, else ...") that slot into the game developer's logic (which would include other things like collecting tournament fees, registering players, etc.), and ultimately make the game viable in a decentralised way.

## StandardVM

The primary audience for the RainVM is end users, but that doesn't mean we don't love Solidity devs too!

The 2.0 codebase includes a new `StandardVM` contract that can be inherited much like any Open Zeppelin base contract.

Simply include it, inherit it and make sure you trigger the integrity checks on deployments so you can safely `eval` scripts.

Something like this is enough for a minimal scriptable counter contract:

```solidity
contract MyCounter is StandardVM {
    /// We will read 1 value from the stack when we run the VM.
    uint private constant MIN_FINAL_STACK_INDEX = 1;
    /// We will run the 0th source provided in the config.
    SourceIndex private constant ENTRYPOINT = SourceIndex.wrap(0);
    /// Normal contract storage to write the result of eval to.
    uint public counter = 0;
    
    /// Construct the StandardVM by passing it the address of the integrity 
    /// check contract.
    constructor(address vmIntegrity_, StateConfig memory config_) 
        StandardVM(vmIntegrity_) 
    {
        // The config_ includes the script to be run.
        // _saveVMState runs the integrity check, calculates 
        // the stack size and deploys the script as a dedicated 
        // contract onchain using SSTORE2.
        _saveVMState(config_, MIN_FINAL_STACK_INDEX);
    }

    /// Anyone can call increment to increase the counter by whatever the script
    /// evaluates to.
    function increment() external {
        // Load the state without any context.
        VMState memory state_ = _loadVMState(new uint[](0));
        // Run the entrypoint script on our state and read the top of the stack.
        // Increment the counter by whatever the top of the stack evaluated to.
        counter += eval(state_, ENTRYPOINT, state_.stackBottom).peek();
    }

}
```

Over time I intend to expand the opcodes in the `StandardVM` to support things like Solidity `mapping` values in storage, and tracking data from context automatically if they are read from storage later, which should cover 90%+ of the known reasons to need custom opcodes right now. Ideally the need for custom opcodes becomes very rare as the `StandardVM` covers most requirements.

## Next steps

If you're an interested Solidity dev you should definitely try out the `StandardVM`. There's no replacement for actually trying it in a real world context.

Take some contract you already have with complex/rigid struct-based configuration, boil it down to 1 or 2 numbers that need calculating and replace the whole thing with a single `eval`. If you can't achieve more flexibility with comparable or less DIY configuration logic I'll buy you a :beer:.

For everyone else, congratulations on reading this far! it's been a tech-heavy post.

Get involved by joining our dev ecosystem chat on Telegram https://t.me/+wEISp4a48V5mOTJk

The more the merrier really, if you're getting stuck on some other platform, or just curious, come by and say hi!