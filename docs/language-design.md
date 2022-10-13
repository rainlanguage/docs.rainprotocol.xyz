---
sidebar_position: 1
---

# Rainlang language design

## Context

The primary goal of the rain language is to make smart contract development accessible for as many people as possible.

This is fundamentally grounded in our belief that accessibility is the difference between theoretical and practical decentralisation. There are many people who would like to participate in authoring and auditing crypto code but currently cannot. When someone wants/needs to do something but cannot, then they delegate to someone who can, this is by definition centralisation.

This document describes several decisions and affordances that aim to make Rainlang the most accessible smart contract language.

## Terms

The Rain language can simply be called "Rain" but it is recommended for technical articles to refer to it as Rainlang for googlability. We want people to be able to find information about the Rain language, so much as "go" is also "golang" we can say "rain" is also "rainlang".

When describing the functional units of a language we have to consider that every programming language is simultaneously doing at least three things:

- Representing concepts/abstractions as a human understands them
- Being a precise mathematical/logical framework suitable for finance, etc.
- Modelling hardware, shuffling 1's and 0's around the memory/storage/network

The [EVM opcodes](https://github.com/crytic/evm-opcodes) are very much ~80% the third item, and ~20% the second item, and 0% the first, and most languages with a reputation for being "low level" follow that.

Languages like Solidity ([algol-like](https://en.wikipedia.org/wiki/ALGOL)) focus more on syntax than opcodes. The structure of the code controls the execution code paths (functions, loops, etc.), and there's some keywords to move data between hardware locations such as storage and memory. There are some affordances such as overflow protection on math (version 0.8+) but Solidity is mostly _structural_ over the underlying EVM logic.

Rainlang is much closer to EVM in structure, but with a primary focus on human concepts, secondary on logic and trying to avoid hardware concerns everywhere.

With the focus on human concepts/language in mind rainlang calls:

- A unit of logic is a "word" NOT "opcode", "instruction" or "function", etc.
- Several words logically combined are an "expression" or "sentence", NOT "function", "script", "curve", or "equation", etc.
- Converting text to binary data that runs onchain is "parsing"
- Converting binary data that runs to text is "formatting"
- Writing Rainlang expressions is "writing" or "authoring"
- Reading Rainlang expressions is "reading", "reviewing" or "auditing"

## Rainlang is extensible/moddable

Rainlang is designed so that implementers can hot swap every aspect of the implementation down to _all_ opcodes and even the interpreter itself. As long as the interpreter implementer can provide metadata about their opcodes and interpreter then the bytecode can be parsed and formatted bidirectionally (see below). A malicious expression author or solidity dev cannot change the formatting of an honest interpreter+metadata combination, so end-users protect themselves by carefully selecting which interpreters to trust.

## Rainlang is read-write (in that order) not write-only

Most programming languages are designed to be write-only. The sole purpose of the language is to take the intent of the author(s) and execute it on a machine. Users are not expected to understand or even be aware of the code; it would be considered a serious design flaw in the language if they were.

Rainlang is designed to be read-write with a priority on reading. The bytecode can be directly formatted into a form that is both concise and difficult to misinterpret. Where there may be ambiguity or confusion about the calculation or provenance of some data, we err on the side of being as explicit/unambiguous as possible. The user may opt in to more concise forms that imply/elide more, but it's not the default/canonical representation of Rainlang.

Most programming languages are designed to scale into the 10k-10M+ of lines of code (e.g. Rust, Java, Solidity, etc.), relying heavily on compilers and other automation to prove correctness and introduce efficiencies over inefficient human bumblings.

Many programming paradigms (e.g. sophisticated type systems, macrology, compiler optimisations, async/await, etc.) follow a certain circular logic to justify their existence. They exist so that authors can write millions of lines of source code that are unrecognisable from the compiled output. The decoupling of input/output means that both reading and writing outputs directly by hand is beyond the realms of human understanding and skill. Writing source code is relatively easy for a human, reading/auditing someone else's source code (or your own after 6 months) is generally harder (wE jUsT nEeD mOrE dOcUmEnTaTiOn!?!?), and reading compiled code is a task best left to the underworld looking for a high effort, high reward, payout in million/billion dollar zero day exploits.

Rich hickey, [author of the highest paid programming language in the world (clojure)](https://survey.stackoverflow.co/2022/?utm_source=thenewstack&utm_medium=website&utm_content=inline-mention&utm_campaign=platform#section-top-paying-technologies-top-paying-technologies), [puts it like this](https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/SimpleMadeEasy.md):

> Okay. So how do we make things easy? Presumably, you know, the objective here is not to just bemoan their software crisis, right? So what can we do to make things easier? So we'll look at those parts, those aspects of being easy again. There's a location aspect. Making something at hand, putting it in our toolkit, that's relatively simple. Right? We just install it. Maybe it's a little bit harder because we have to get somebody to say it's okay to use it.
>
> Then there's the aspect of how do I make it familiar, right? I may not have ever seen this before. That's a learning exercise. I've got to go get a book, go take a tutorial, have somebody explain it to me. Maybe try it out. Right? Both these things we're driving. We're driving. We install. We learn. It's totally in our hands.
>
> Then we have this other part though, which is the mental capability part. And that's the part that's always hard to talk about, the mental capability part because, the fact is, we can learn more things. We actually can't get much smarter. We're not going to move; we're not going to move our brain closer to the complexity. We have to make things near by simplifying them.
>
> But the truth here is not that they're these super, bright people who can do these amazing things and everybody else is stuck because the juggling analogy is pretty close. Right? The average juggler can do three balls. The most amazing juggler in the world can do, like, 9 balls or 12 or something like that. They can't do 20 or 100. We're all very limited. Compared to the complexity we can create, we're all statistically at the same point in our ability to understand it, which is not very good. So we're going to have to bring things towards us.
>
> And because we can only juggle so many balls, you have to make a decision. How many of those balls do you want to be incidental complexity and how many do you want to be problem complexity? How many extra balls? Do you want to have somebody throwing you balls that you have to try to incorporate in here? Oh, use this tool. And you're like, whoa! You know, more stuff. Who wants to do that?

So if "code is law" and we have a decentralised/p2p permissionless network that is supposed to run on _compiled code_ (that "nobody" can read), how the hell does that work?

It's clear that if everyone is signing blank cheques, the devs will cash those cheques at the expense of their users every time. It's a broken system that nobody can use.

### Rainlang doesn't rely on verification for comprehension

Solidity has a super power. If you have an exact copy of the source code and compiler options as the author, you can compile the exact same output. This is unusual for compilers generally as they may apply different optimisations and outputs based on the machine they are compiling code on.

This allows the author to upload a copy of their source code to tooling that supports it (e.g. [https://etherscan.io/](https://etherscan.io/)), the tooling can check the source code compiles to what the author claims it does, then everyone else can read the source code.

ethereum.org has [this to say on the matter](https://ethereum.org/da/developers/docs/smart-contracts/verifying/) of verifying smart contracts:

> There are some parts of the source code that do not affect the compiled bytecode such as comments or variable names. That means two source codes with different variable names and different comments would both be able to verify the same contract. With that, a malicous actor can add deceiving comments or give misleading variable names inside the source code and get the contract verified with a source code different than the original source code.
>
> It is possible to avoid this by appending extra data to the bytecode to serve as a cryptographical guarantee for the exactness of the source code, and as a fingerprint of the compilation information. The necessary information is found in the Solidity's contract metadata, and the hash of this file is appended to the bytecode of a contract. You can see it in action in the metadata playground
>
> The metadata file contains information about the compilation of the contract including the source files and their hashes. Meaning, if any of the compilation settings or even a byte in one of the source files change, the metadata file changes. Consequently the hash of the metadata file, which is appended to the bytecode, also changes. That means if a contract's bytecode + the appended metadata hash match with the given source code and compilation settings, we can be sure this is exactly the same source code used in the original compilation, not even a single byte is different.
>
> This type of verification that leverages the metadata hash is referred to as "full verification)" (also "perfect verification"). If the metadata hashes do not match or are not considered in verification it would be a "partial match", which currently is the more common way to verify contracts. It is possible to insert malicious code that wouldn't be reflected in the verified source code without full verification. Most developers are not aware of the full verification and don't keep the metadata file of their compilation, hence partial verification has been the de facto method to verify contracts so far.

It's definitely worth reading [samczsun's article](https://samczsun.com/hiding-in-plain-sight/) on abusing etherscan's tooling through carefully constructed source code. For as long as full verification isn't the norm, users will continue to be exploited by malicious code authors who upload deceptive source code for the verification process.

Rainlang by comparison has words that represent arbitrary high level logic (e.g. fetching token balances) despite being a stack language (ususally associated with very low level logic). In this way it resembles forth, which has always focussed on achieving high level features through a fractal relationship between words (high level words are defined by combining low level words).

Rainlang words merely _reference_ precompiled functions in an intepreter that is shared across many deployments. Each time someone authors a rainlang expression they can only reference compiled logic, they cannot provide newly compiled logic (unless they reference an entirely new interpreter). This means that interpreters and words can be accruing [lindy value](https://en.wikipedia.org/wiki/Lindy_effect) independent of the individual expression deployments. It also means that a rainlang expression can be formatted directly by a reader into a something (almost) equally comprehensible as the originally authored source code _without further input/cooperation/honesty from the author_. This is because ~90%+ of the logic of the expression is provided by the shared interpreter and only arranged/composed by the author. Very long/complex/obfuscated rain expressions should automatically be treated with suspicion by a reader as the language should typically be extended by writing new words in the shared interpreter space rather than including complex logic within individual deployments.

We can compare this to tooling that decompiles Solidity code. This works by analysing the deployed bytecode directly and reverse engineering some believable pseudo-code that allows for understanding.

As [ethervm.io's decompiler states](https://ethervm.io/decompile):

> There are many contracts deployed on the Ethereum network with no source or ABI publicly available.
> This makes verifying their security and understanding their behaviour a difficult task without the right tools, such as a decompiler.
> This tool decompiles Ethereum contract bytecode into more readable Solidity-like code, allowing for better understanding of such contracts.

But consider the following excerpt of the `mixGenes` function from a [cryptokitties decompilation](https://ethervm.io/decompile/0xf97e0a5b616dffc913e72455fde9ea8bbe946a2b).

original:

```solidity
```solidity
    /// @dev the function as defined in the breeding contract - as defined in CK bible
    function mixGenes(uint256 _genes1, uint256 _genes2, uint256 _targetBlock) public returns (uint256) {
        require(block.number > _targetBlock);

        // Try to grab the hash of the "target block". This should be available the vast
        // majority of the time (it will only fail if no-one calls giveBirth() within 256
        // blocks of the target block, which is about 40 minutes. Since anyone can call
        // giveBirth() and they are rewarded with ether if it succeeds, this is quite unlikely.)
        uint256 randomN = uint256(block.blockhash(_targetBlock));

        if (randomN == 0) {
            // We don't want to completely bail if the target block is no-longer available,
            // nor do we want to just use the current block's hash (since it could allow a
            // caller to game the random result). Compute the most recent block that has the
            // the same value modulo 256 as the target block. The hash for this block will
            // still be available, and – while it can still change as time passes – it will
            // only change every 40 minutes. Again, someone is very likely to jump in with
            // the giveBirth() call before it can cycle too many times.
            _targetBlock = (block.number & maskFirst248Bits) + (_targetBlock & maskLast8Bits);

            // The computation above could result in a block LARGER than the current block,
            // if so, subtract 256.
            if (_targetBlock >= block.number) _targetBlock -= 256;

            randomN = uint256(block.blockhash(_targetBlock));

            // DEBUG ONLY
            // assert(block.number != _targetBlock);
            // assert((block.number - _targetBlock) <= 256);
            // assert(randomN != 0);
        }

        // generate 256 bits of random, using as much entropy as we can from
        // sources that can't change between calls.
        randomN = uint256(keccak256(randomN, _genes1, _genes2, _targetBlock));
        uint256 randomIndex = 0;

        uint8[] memory genes1Array = decode(_genes1);
        uint8[] memory genes2Array = decode(_genes2);
        // All traits that will belong to baby
        uint8[] memory babyArray = new uint8[](48);
        // A pointer to the trait we are dealing with currently
        uint256 traitPos;
        // Trait swap value holder
        uint8 swap;
        // iterate all 12 characteristics
        for(uint256 i = 0; i < 12; i++) {
            // pick 4 traits for characteristic i
            uint256 j;
            // store the current random value
            uint256 rand;
            for(j = 3; j >= 1; j--) {
                traitPos = (i * 4) + j;

                rand = _sliceNumber(randomN, 2, randomIndex); // 0~3
                randomIndex += 2;

                // 1/4 of a chance of gene swapping forward towards expressing.
                if (rand == 0) {
                    // do it for parent 1
                    swap = genes1Array[traitPos];
                    genes1Array[traitPos] = genes1Array[traitPos - 1];
                    genes1Array[traitPos - 1] = swap;

                }

                rand = _sliceNumber(randomN, 2, randomIndex); // 0~3
                randomIndex += 2;

                if (rand == 0) {
                    // do it for parent 2
                    swap = genes2Array[traitPos];
                    genes2Array[traitPos] = genes2Array[traitPos - 1];
                    genes2Array[traitPos - 1] = swap;
                }
            }

        }

        // DEBUG ONLY - We should have used 72 2-bit slices above for the swapping
        // which will have consumed 144 bits.
        // assert(randomIndex == 144);

        // We have 256 - 144 = 112 bits of randomness left at this point. We will use up to
        // four bits for the first slot of each trait (three for the possible ascension, one
        // to pick between mom and dad if the ascension fails, for a total of 48 bits. The other
        // traits use one bit to pick between parents (36 gene pairs, 36 genes), leaving us
        // well within our entropy budget.

        // done shuffling parent genes, now let's decide on choosing trait and if ascending.
        // NOTE: Ascensions ONLY happen in the "top slot" of each characteristic. This saves
        //  gas and also ensures ascensions only happen when they're visible.
        for(traitPos = 0; traitPos < 48; traitPos++) {

            // See if this trait pair should ascend
            uint8 ascendedTrait = 0;

            // There are two checks here. The first is straightforward, only the trait
            // in the first slot can ascend. The first slot is zero mod 4.
            //
            // The second check is more subtle: Only values that are one apart can ascend,
            // which is what we check inside the _ascend method. However, this simple mask
            // and compare is very cheap (9 gas) and will filter out about half of the
            // non-ascending pairs without a function call.
            //
            // The comparison itself just checks that one value is even, and the other
            // is odd.
            if ((traitPos % 4 == 0) && (genes1Array[traitPos] & 1) != (genes2Array[traitPos] & 1)) {
                rand = _sliceNumber(randomN, 3, randomIndex);
                randomIndex += 3;

                ascendedTrait = _ascend(genes1Array[traitPos], genes2Array[traitPos], rand);
            }

            if (ascendedTrait > 0) {
                babyArray[traitPos] = uint8(ascendedTrait);
            } else {
                // did not ascend, pick one of the parent's traits for the baby
                // We use the top bit of rand for this (the bottom three bits were used
                // to check for the ascension itself).
                rand = _sliceNumber(randomN, 1, randomIndex);
                randomIndex += 1;

                if (rand == 0) {
                    babyArray[traitPos] = uint8(genes1Array[traitPos]);
                } else {
                    babyArray[traitPos] = uint8(genes2Array[traitPos]);
                }
            }
        }

        return encode(babyArray);
    }
```

Decompiled:

```solidity
    function mixGenes(var arg0, var arg1, var arg2) returns (var r0) {
        var var0 = 0x00;
        var var1 = var0;
        var var2 = 0x00;
        var var3 = 0x01da;
        var3 = func_0709();
        var var4 = 0x01e2;
        var4 = func_0709();
        var var5 = 0x01ea;
        var5 = func_0709();
        var var6 = 0x00;
        var var7 = var6;
        var var8 = var7;
        var var9 = var8;
        var var10 = var9;
        var var11 = var10;
    
        if (block.number <= arg2) { revert(memory[0x00:0x00]); }
    
        var1 = block.blockHash(arg2);
    
        if (var1) {
        label_022B:
            var temp0 = memory[0x40:0x60];
            memory[temp0:temp0 + 0x20] = var1;
            var temp1 = temp0 + 0x20;
            memory[temp1:temp1 + 0x20] = arg0;
            var temp2 = temp1 + 0x20;
            memory[temp2:temp2 + 0x20] = arg1;
            var temp3 = temp2 + 0x20;
            memory[temp3:temp3 + 0x20] = arg2;
            var temp4 = memory[0x40:0x60];
            var1 = keccak256(memory[temp4:temp4 + (temp3 + 0x20) - temp4]);
            var2 = 0x00;
            var var12 = 0x0269;
            var var13 = arg0;
            var12 = decode(var13);
            var3 = var12;
            var12 = 0x0274;
            var13 = arg1;
            var12 = decode(var13);
            var4 = var12;
            var12 = 0x30;
            var13 = memory[0x40:0x60];
        
            if (MSIZE() < var13) {
                var temp5 = var13;
                var temp6 = var12;
                memory[temp5:temp5 + 0x20] = temp6;
                memory[0x40:0x60] = temp5 + temp6 * 0x20 + 0x20;
                var5 = temp5;
                var8 = 0x00;
            
                if (var8 >= 0x0c) {
                label_03EE:
                    var6 = 0x00;
                
                    if (var6 >= 0x30) {
                    label_053E:
                        var12 = 0x0547;
                        var13 = var5;
                        return encode(var13);
                    } else {
                    label_03FD:
                        var11 = 0x00;
                        var12 = !(var6 % 0x04);
                    
                        if (!var12) {
                        label_0440:
                        
                            if (!var12) {
                            label_0491:
                            
                                if (var11 & 0xff <= 0x00) {
                                    var12 = 0x04cc;
                                    var13 = var1;
                                    var var14 = 0x01;
                                    var var15 = var2;
                                    var12 = func_0668(var13, var14, var15);
                                    var10 = var12;
                                    var2 = var2 + 0x01;
                                
                                    if (var10 != 0x00) {
                                        var12 = var4;
                                        var13 = var6;
                                    
                                        if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                                    
                                        var12 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                                        var13 = var5;
                                        var14 = var6;
                                    
                                        if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                                    
                                        memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                                    
                                    label_0533:
                                        var11 = var11;
                                        var6 = var6 + 0x01;
                                    
                                        if (var6 >= 0x30) { goto label_053E; }
                                        else { goto label_03FD; }
                                    } else {
                                        var12 = var3;
                                        var13 = var6;
                                    
                                        if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                                    
                                        var12 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                                        var13 = var5;
                                        var14 = var6;
                                    
                                        if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                                    
                                    label_04AA:
                                        memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                                        goto label_0533;
                                    }
                                } else {
                                    var12 = var11;
                                    var13 = var5;
                                    var14 = var6;
                                
                                    if (var14 < memory[var13:var13 + 0x20]) { goto label_04AA; }
                                    else { assert(); }
                                }
                            } else {
                                var12 = 0x0451;
                                var13 = var1;
                                var14 = 0x03;
                                var15 = var2;
                                var12 = func_0668(var13, var14, var15);
                                var10 = var12;
                                var2 = var2 + 0x03;
                                var12 = 0x048e;
                                var13 = var3;
                                var14 = var6;
                            
                                if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                            
                                var12 = func_0468(var4, var6, var10, var13, var14);
                                var11 = var12;
                                goto label_0491;
                            }
                        } else {
                            var12 = var4;
                            var13 = var6;
                        
                            if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                        
                            var12 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20] & 0x01;
                            var13 = var3;
                            var14 = var6;
                        
                            if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                        
                            var12 = memory[var14 * 0x20 + var13 + 0x20:var14 * 0x20 + var13 + 0x20 + 0x20] & 0x01 != var12;
                            goto label_0440;
                        }
                    }
                } else {
                label_02A7:
                    var9 = 0x03;
                
                    if (var9 < 0x01) {
                    label_03E3:
                        var11 = var11;
                        var8 = var8 + 0x01;
                    
                        if (var8 >= 0x0c) { goto label_03EE; }
                        else { goto label_02A7; }
                    } else {
                    label_02B4:
                        var6 = var8 * 0x04 + var9;
                        var12 = 0x02c7;
                        var13 = var1;
                        var14 = 0x02;
                        var15 = var2;
                        var12 = func_0668(var13, var14, var15);
                        var10 = var12;
                        var2 = var2 + 0x02;
                    
                        if (var10 != 0x00) {
                        label_0349:
                            var12 = 0x0355;
                            var13 = var1;
                            var14 = 0x02;
                            var15 = var2;
                            var12 = func_0668(var13, var14, var15);
                            var10 = var12;
                            var2 = var2 + 0x02;
                        
                            if (var10 != 0x00) {
                            label_03D7:
                                var11 = var11;
                                var9 = var9 + ~0x00;
                            
                                if (var9 < 0x01) { goto label_03E3; }
                                else { goto label_02B4; }
                            } else {
                                var12 = var4;
                                var13 = var6;
                            
                                if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                            
                                var7 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                                var12 = var4;
                                var13 = var6 - 0x01;
                            
                                if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                            
                                var12 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                                var13 = var4;
                                var14 = var6;
                            
                                if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                            
                                memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                                var12 = var7;
                                var13 = var4;
                                var14 = var6 + ~0x00;
                            
                                if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                            
                                memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                                goto label_03D7;
                            }
                        } else {
                            var12 = var3;
                            var13 = var6;
                        
                            if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                        
                            var7 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                            var12 = var3;
                            var13 = var6 - 0x01;
                        
                            if (var13 >= memory[var12:var12 + 0x20]) { assert(); }
                        
                            var12 = memory[var13 * 0x20 + var12 + 0x20:var13 * 0x20 + var12 + 0x20 + 0x20];
                            var13 = var3;
                            var14 = var6;
                        
                            if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                        
                            memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                            var12 = var7;
                            var13 = var3;
                            var14 = var6 + ~0x00;
                        
                            if (var14 >= memory[var13:var13 + 0x20]) { assert(); }
                        
                            memory[var13 + var14 * 0x20 + 0x20:var13 + var14 * 0x20 + 0x20 + 0x20] = var12 & 0xff;
                            goto label_0349;
                        }
                    }
                }
            } else {
                var temp7 = MSIZE();
                var temp8 = var12;
                memory[temp7:temp7 + 0x20] = temp8;
                memory[0x40:0x60] = temp7 + temp8 * 0x20 + 0x20;
                var5 = temp7;
                var8 = 0x00;
            
                if (var8 >= 0x0c) { goto label_03EE; }
                else { goto label_02A7; }
            }
        } else {
            var temp9 = (block.number & ~0xff) + (arg2 & 0xff);
            arg2 = temp9;
        
            if (arg2 < block.number) {
                var1 = block.blockHash(arg2);
                goto label_022B;
            } else {
                var temp10 = arg2 - 0x0100;
                arg2 = temp10;
                var1 = block.blockHash(arg2);
                goto label_022B;
            }
        }
    }
```

We already see several legibility problems here from skim reading a single function:

- Tons of goto style jumping around the code, considered a [strong antipattern for comprehension](https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf) since the late 60s
- A lot of logic that does nothing but create temporary variables to juggle data between the memory and stack (hardware modelling, not cryptokitty modelling)
- It's clearly far longer and more verbose
- Concepts like "list of values" are missing, all we have is direct memory handling
- All the comments are missing
- Almost all names of things are autogenerated garbage like `temp7` or `label_022B`

If a single function from a 2017 experiment looks like this imagine a complete modern defi product. The skill level and time required to know whether a single onchain transaction is safe to sign, based on reading decompiled Solidity, is clearly beyond every human other than professional security researchers.

## Syntax/structure

Following from the extensible/moddable/bidirectional nature, we avoid syntax/structures in the formatted representation of bytecode that cannot be directly derived from the bytecode or trivially inferred with minimal additional metadata _that could be produced independently from the auditor_.

This is a similar (but different) problem to the implementation (or lack) of macros in languages. A macro is code that creates or modifies other code. The more syntax and lexical structure that exists in some language, the more difficult macros become. We can see this by comparing the process of writing macros in e.g. [Rust](https://doc.rust-lang.org/reference/procedural-macros.html) vs. [Clojure](https://clojure.org/reference/macros).

I don't expect the reader of this document to have significant experience writing macros across (m)any languages. The summary is that the more regular (simpler) the structure of a language, the fewer edge cases that need to be handled when writing code _about_ code, so the easier and less buggy it is to manipulate the code.

For that (and other) reason(s) we adopt a [forth-y](https://en.wikipedia.org/wiki/Forth_(programming_language)) slash [lisp-y](https://en.wikipedia.org/wiki/Lisp_(programming_language)) slash [spreadsheet-y](https://en.wikipedia.org/wiki/OpenFormula) syntax for Rainlang.

## Rainlang is interpreted onchain

Rainlang is an onchain language to be _interpreted_ by smart contracts. It can still be [deployed as binary contract data](https://github.com/0xsequence/sstore2) but won't execute as e.g. EVM opcodes.

Rainlang words and binary opcodes and operands map 1:1.

Rainlang has its own opcodes which may mimic low level opcodes such as addition/subtraction but may also be complex and high level such as fetching token balances or more complex math functions.

Smart contracts that intepret Rainlang loop over the binary opcodes and may read/write to a [stack of values](https://en.wikipedia.org/wiki/Stack-oriented_programming) in memory. Implementations of interpreters are strongly encouraged to implement an O(1) dispatch for opcodes if possible, e.g. mapping Rainlang words to function pointers in Solidity.

## Rainlang stack movements are predictable

Static analysis of any valid expression allows us to know the pushes and pops of data on the stack ahead of time. This means certain opcodes (e.g. arbitrary looping) are impossible.

This allows:

- Offchain tooling to visualise stack height at any point in execution accurately
- Memory to be preallocated for the runtime stack
- Contracts to know that they will have a minimum/specific stack height to pull from at runtime
- Out of bounds reads/writes to be caught at deploy time rather than runtime

Overall we sacrifice some generality for the ability to guarantee/calculate certain things ahead of time in tooling and contracts, which gives us a better legibility/security posture and can save gas for whoever runs the contract.

## Rainlang has wiki-style metadata

While an explicit goal of Rainlang is to be as comprehensible as possible _without the author_, there are times when an honest author may be able to provide beneficial additional context that cannot be represented by words in the expression alone.

The metadata format for expressions is designed to be compatible with onchain logging to allow a social "immune system" that does not rely on centralised tooling such as etherscan. For example it should be possible for a skilled reader of rainlang to provide alternative metadata to the author, perhaps to correct a malicious/incorrect comment that doesn't accurately describe the behaviour of the script.

Rainlang rejects the idea that there is "one true metadata" for some contract, that only the author knows, and is gated behind signatures from the deployment key on etherscan. 

Audits of honest code frequently pick up typos and stale documentation. Vulnerabilities are often discovered after the fact. The ability for peers to post metadata about rainlang expressions on equal footing with the authors allows deception to be uncovered in a decentralised way.

## Rainlang has comments

Comments in Rainlang are denoted by `/* */` much like many other languages.

Other comment forms are not supported. Having a single form for comments is the simplest possible option. The form chosen is the one that supports inline comments.

Specifically we want this to be valid:

```
(foo 1 2 /* comment */ 3)
```

And this:

```
/* comment */
(foo 1 2 3)
```

Comments are made available as metadata.

## Rainlang words can have multiple inputs and outputs

Much like [WASM](https://hacks.mozilla.org/2019/11/multi-value-all-the-wasm/) we have the challenge of multi value returns to support.

This seems unavoidable to support use cases such as:

- ERC1155 balanceOfBatch function
- looping N times, adding outputs to the stack on each iteration

As a stack language it is trivial to implement multiple values, we simply add more than one value to the stack. The challenge comes from a visual/text representation that explicitly and bidirectionally embodies the structure of the stack. One saving grace here is that we always know how many inputs/outputs on the stack a word has (see above) without needing to run it.

There are two forms that multiple outputs can appear in, external and inline. External outputs sit to the left of `:` and can be named and referenced in subsequent arguments to words, or may be anonymous denoted with `_`. Inline outputs may be the inputs to nested logic and can be disambiguated with `'` but must be anonymous (e.g. `_'foo`) as they are consumed by their nesting and so are unavailable to be referenced later.

External outputs MAY cover multiple expressions.

The referencing logic relies on the existence of a word that copies previous values from the stack to the top of the stack. Such a word is provided by the reference interpreter implementation.

Inline outputs MAY be elided and ambiguated but external outputs MUST be provided for every position, much as destructuring/pattern matching in other languages such as [haskell](https://www.haskell.org/tutorial/patterns.html), [clojure](https://clojure.org/guides/destructuring), and [javascript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).

External outputs that sit behind `:` MUST always be the first expressions to build a stack. The final expressions MAY elide the external outputs if the author/reader is comfortable mentally tracking their arity.

Overall this allows for both multiple outputs in a nested context and a direct textual/visual representation of the structure of the stack behind `:`.

### External outputs examples

Consider a word `foo` that has 0 inputs and 3 outputs and `bar` that takes 1 input and has 1 output.

The simplest example of external outputs is to destructure the outputs anonymously.

```lisp
_ _ _: (foo)
```

Results in a stack of the 3 anonymous `_ _ _` outputs of `foo`.

```lisp
a b _: (foo)
_: (bar a)
```

Results in a stack `a b _ _` where the first 3 values are from `foo` and the final anonymous output is from `bar`.

Note that where `a` is used as an input to `bar` this is shorthand for:

```lisp
_ _ _: (foo)
_: (bar (stack 0))
```

Where `stack` is a word that copies an existing stack item to the stack top so that it can be read by subsequent words (`bar` in this case).

The final expression MAY elide the external outputs if the author/reader is comfortable to do so. Default formatting for readers is to display all outputs.

This is the most concise valid form of the above but requires the reader to know the number of outputs of `bar` to visualise the full stack in their mind.

```lisp
a _ _: (foo)
(bar a)
```

Multiple final expressions without external outputs are also valid.

```lisp
a _ c: (foo)
(bar a)
(bar c)
```

Yields a stack of `a _ c _ _` where the final two values are from the final two bars respectively.

## Rainlang is chain agnostic, bound to interpreters not networks

@todo

## Rainlang has a native .rain file format

@todo

## Rainlang has a spectrum of representations from concise->explicit

@todo

## Rainlang is -fix agnostic and operatorless

Many languages define "operators" and "functions" differently. Generally calling
a function is an operation and the idea of an operator is something more fundamental.

The syntax for operators may not be regular and require rote learning including
[precedence and associativity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#precedence_and_associativity) rules.

Rainlang has only function calls, which has several benefits:

- There are no associativity rules to learn (and potentially get wrong)
- There is no ambiguity over which inputs are for what function calls
- Every interpreter is free to reimplement/include/exclude any/all possible words

This is achieved by making parens `()` mandatory for all calls.

Once we have parens, we no longer care about the -fix. Prefix, infix, suffix are all
valid function calls, even a combination of.

These are all equivalent expressions.

```
(1 + 2 + 3)
(1 + 2 3)
(1 2 + 3)
+(1 2 3)
(+ 1 2 3)
(1 2 3 +)
(1 2 3)+
+++(1 2 3)+++
```

This works because Rainlang can distinguish between literals, functions and parens
directly without relying on their position within the text.

The author may attempt to obfuscate their code through creative syntax but the reader
doesn't rely on the author's representation of the source code (see above). All
Rainlang expressions can be trivially canonicalized to whatever -fix notation the
reader prefers.