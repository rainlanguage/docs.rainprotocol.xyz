---
slug: rainlang-decimal-by-default
title: "Rainlang is now decimal by default"
authors: thedavidmeister
tags: [raindex, rainlang]
---
Decimals are now the default type of number in Rainlang.

What does this mean?

Until now there was no default type of number. We were totally agnostic to
whether some number was an integer or a decimal.

We put the responsibility of deciding and tracking when to use what in their code
back on rainlang authors.

As you might expect, this was easier to implement in the language, and made
writing Rainlang more difficult.

Philosophically, that's the opposite of what we want in a language that is
supposed to be easy to understand and use. So now Rainlang is opinionated and
treats everything as a decimal by default.

## What does this look like?

All Rainlang in the wild that contains math will include some combination of math
functions like:

`decimal18-mul(2e18 5e17)` => translates to `2 * 0.5` as decimal values
`int-mul(2 5)` => translates to `2 * 5` as integer values

This is confusing and error prone for several reasons:

- Most people don't know the difference between integer and decimal math, so it's
  a mandatory learning curve before someone can even consider writing Rainlang
- Decimal values are more useful by far than integer values, but require mental
  rescaling to 18 decimals, which is easy to get wrong
- Several key words like `block-timestamp()` provide integer values, but you'll
  most likely want to do decimal math with them in practise
- There are no safety guards that check whether you've lined up your decimals and
  integers across multiple words, which makes the conversions not only mandatory
  but fragile

In the latest version of Rainlang, almost all math words look like:

`mul(2 0.5)` => equivalent to the old `decimal18-mul(2e18 5e17)`.

For anyone who really wants the old integer math behaviour, there are some words
available as `uint256-*` such as `uint256-mul` but their use is discouraged
generally. Where you would have previously raised something 18 decimals to work
with decimal math, you now scale something by -18 decimals to work with integer
math.

For example:

`uint256-mul(2e-18 5e-18)` => equivalent to the old `int-mul(2 5)`.

## What has changed?

To achieve the above there are 3 key changes that all compatible language
contracts need to respect:

- Number literals like `1` and `1.5` are scaled by 18 orders of magnitude to
  their internal representation in the EVM. E.g. `1` literal is `1e18` onchain.
- All `decimal18-*` prefixed words no longer have any prefix and so are treated
  as the default way to handle all numeric values.
- Words that previously returned integer values, such as `block-timestamp()` and
  `chain-id()` are now scaled up 18 orders of magnitude to return compatible
  decimal values.

The overall impact is that beginner and intermediate Rainlang authors will
probably never even be aware of the mismatch between high level Rainlang decimals
and low level EVM integers.

These changes also need to extend to the context grid, such as the one provided
by Raindex. Older versions of Raindex will continue to be compatible with the
current version of Rainlang, but for the smoothest experience all vault balances
will be pre-scaled to decimal values in the near future, with some opinionated
rounding behaviours.

## What even are decimal and integer values?

If you want to understand why there are decimal and integer values in the first
place, you need to understand what a number is onchain.

The EVM (Ethereum Virtual Machine) almost exclusively deals with data in 32 byte
chunks. When you save, load, multiply, add, etc. any data, it's usually 32 bytes
at a time. This makes gas calculations much simpler, there can be a flat cost
for each thing you might want to do, per 32 bytes.

So every number is 32 bytes, which is 256 individual 1's and 0's in binary.

The default of the EVM for all the native blockchain words, is to treat these
numbers as _unsigned integers_. This means no negative numbers, and no decimal
numbers.

If you wanted to get the current block number for block `1` it would give you
`0x0000000000000000000000000000000000000000000000000000000000000001`.

Very early on in Ethereum's history developers realised this is not good enough
for things like tokens.

Say you had $1 and you wanted to send $0.5 to someone. Well this is impossible
if `1` is `0x0000000000000000000000000000000000000000000000000000000000000001`.
There is simply nowhere to put a number smaller than `1` in this representation.
In practise what happens is that all math rounds down to the closest integer, so
sending $0.5 would send $0, which is not a satisfying outcome.

To make matters worse, everything onchain costs gas, so if some more complex
approach was going to be proposed then it would literally cost more gas the more
complex the idea. Complex math is not very popular when the network is highly
congested and people are spending $10-100+ per transaction.

The _most common_ solution is to simply treat `1e18` (that is, 1 with 18 zeros)
as "one" _by convention_ and then create onchain math libraries that figure out
all the implications of that. Rainlang uses the [prb-math](https://github.com/PaulRBerg/prb-math)
library under the hood for this.

This means that if you want to send 0.5 DAI to someone, you are sending them
`5e17` DAI. This costs a bit more gas to do the more complex decimal calculations
but means that people can send $0.5, so overall it's worth it.

But now we have a social layer problem. This 18 decimal fixed point
representation of numbers is only a convention. It isn't even a convention that
tokens follow consistently. The ERC20 specification allows for _any_ fixed point
representation of a token, for example Tether treats `1e6` as "one" instead of
`1e18`. The specification also explicitly states that it is optional for tokens
to even self report what their own convention is, making it impossible to
implement a reliable generalized onchain conversion.

> decimals
> Returns the number of decimals the token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation.
> OPTIONAL - This method can be used to improve usability, but interfaces and other contracts MUST NOT expect these values to be present.
- https://eips.ethereum.org/EIPS/eip-20

So the summary is that Rainlang is forced to exist in a world where beginners
will write in `1` into a text editor and expect it to equally mean "one second",
"one DAI" or "one USDT", while the reality is all three things are totally
different onchain. That's the problem that we're attempting to solve here.

## How do we upgrade?

As with all Rainlang versions, there are no admin keys or DAOs, so everyone has
to upgrade for themselves if/when they want to.

Pragmatically in the Raindex app this means configuring a new deployer in their
settings.

At the time of writing we haven't yet fully deployed the changes to every network
and sub parser, but it will be rolled out and announced in all the usual channels
as we go.