# Learn rainlang in 30 minutes

Rainlang is a native onchain language for defi that aims to be understood by as many people as possible.

## What is rainlang?

Rainlang is a smart contract language that is a smart contract itself.

Because the language is a smart contract it has some neat properies:

- Permissionless creation of new words with "sub parsers"
- Onchain native verification of contract code
- Precompiled/deployed logic significantly reduces contract size (deploy gas)
- Read-only "sandboxed" runtime that cannot corrupt storage, cause reentrencies, etc.
- Different versions of the language have their own onchain address, allowing permissionless self upgrade/downgrade patterns for users (no dev admin keys, DAOs, etc.)
- Relatively easy to build tooling, as parsing, simulating, etc. can all be done simply by creating a local fork of the blockchain
- Self describing via metadata emitted by onchain events (e.g. word lists)

### Syntax

Rainlang syntax is very minimal, inspired by languages such as lisp and forth. The minimalism of syntax allows:

- Shorter learning curve for beginners
- Code that is easier to read and audit
- More powerful extensibility by sub parsers
- Simpler and more reliable metaprogramming in tooling
- Onchain parsing from source code to deployable bytecode

### Vocabulary

The rainlang vocabulary focusses on human concepts such as "math", "token balance", "counterparty", "sanctions", etc.

It avoids hardware level concerns endemic to the EVM (ethereum virtual machine) such as "memory", "storage", "calldata", etc. as much as possible.

The rainlang vocabulary is permissionlessly extensible via. onchain contracts.

For example, if some oracle provider wanted to create words that read from their oracles, they can do so without the Rainlang team even being aware of it.

### Programming style

Rainlang expressions are entirely stack based. They simply caculate a list of values, where later values can use earlier values in their calculations.

Internally an arbitrary number of substacks can be created for intermediate calculations, similar to function calls in other languages.

There is always a single final stack that the calling contract will use for its own purposes. For example, Raindex uses the final two values on the stack as the amount/price of the calcualted limit order.

Stack items can be explicitly named in the rainlang source code, which makes them immutable, debuggable, and overall improves the legibility of rainlang.

### Security model

Rainlang is read-only so it relies on another contract (such as raindex) to make changes. For example, raindex needs to update its own vault balances when a trade happens, and a tokenisation contract might mint itself according to the rainlang logic.

The calling contract is responsible for correctly designing and implementing security sensitive details such as reentrancy guards, overflow checks, etc. This way rainlang authors can safely ignore these details and focus only on their rainlang.

The model is similar to WASM (web assembly) in that the wasm "guest" is an isolated read only sandbox, relying on the "host" to provide all functionality that might have side effects.

### Gas efficiency

Rainlang is interpreted onchain, so it naturally will have some gas overhead looking up functions to run vs. simply running raw EVM opcodes directly. This overhead works out to about 250-300 gas per word in the original rainlang source. A typical production rainlang expression would be about 20-200 words, so we are looking at about 50k gas overhead for a fairly complex expression.

Additionally, rainlang needs to be called as an external contract and "boot" itself, which costs about 5-10k gas flat.

However, the execution model of Rainlang offers some gas savings too.

Because of the structure of Rainlang code, we can predict exactly how much memory we need at runtime. This allows us to perform a single allocation for all rainlang logic, and even deallocate temporary stack values. As memory allocation is one of the largest gas hogs after storage reads/writes, this gas saving can be significant.

As Rainlang contracts are only pointers to precompiled logic, they are typically much smaller than equivalent contracts that are compiled from scratch every time. Rainlang contracts typically cost about as much as a proxy to deploy, but are fully custom.

Overall we typically see about 10-30% runtime overhead vs. optimised solidity code, and about 10-100x _cheaper_ deploy costs. For example, on Raindex it only costs about 100k gas to deploy a long running strategy, whereas a typical solidity contract deployment would cost several millions in gas (e.g. uniswap v3 pools are about 4 million gas).

## Writing rainlang

### Structure of a rainlang file

Rainlang files look like this.

```
| interstitial |
| pragma |
| interstitial |
| source |
| interstitial |
| source |
| interstitial |
...etc.
```

#### Interstitial

Interstitial is optional whitespace (spaces, newlines, tabs, etc.) and comments.

`/* comments look like this and are completely ignored by the parser */`

```
/*
 * comments can be
 * split over multiple lines
 * they just need to end with
 * star followed by forwardslash
 * like:
 */
```

#### Pragma

"Pragma" tells the parser how to parse the rest of the file.

In rainlang that means defining the sub parsers that might provide additional words and literals.

This is done with `using-words-from` and listing the addresses of sub parsers separated by whitespace.

E.g.

```
using-words-from
  0xAfD94467d2eC43D9aD39f835BA758b61b2f41A0E
  0x87D1f842347b7802A29FD9010c464E760745a4d2
```

and

```
using-words-from 0x87D1f842347b7802A29FD9010c464E760745a4d2 0x87D1f842347b7802A29FD9010c464E760745a4d2
```

are both equivalent.

#### Sources

Sources are the meat and potatoes of rainlang. They define the logic that runs.

The structure of a source is

```
| interstitial |
| LHS | : | RHS | , |
| interstital |
| LHS | : | RHS | , |
| interstitial |
...etc.
| LHS | : | RHS | ; |
```

The LHS is "left hand side" and defines stack items.

The RHS is "right hand side" and defines the logic for each stack item.

For example, if we wanted to define:

- An item `a` equal to `1`
- An item `b` equal to `2`
- An item `c` equal to `a + b + 3`

It would look like:

```
a: 1,
b: 2,
c: int-add(a b 3);
```

Note:

- Lines end with `,`
- The final line of the source ends with `;`
- We use words like `int-add` by passing them inputs with `( )`
- Once we name something on the LHS it is available as an input on the RHS
- Everything is whitespace delimited (we DO NOT use `,` to delimit values)
- There are no "operators" (e.g. `+` is not a thing), _everything_ is either a word or literal (which makes subparsers much easier to implement)

#### LHS items

##### Named LHS items

LHS items can be named simply with any printable ASCII characters that don't look like an RHS literal (see below) or start with an underscore.

Named LHS items are available to be used as inputs on the RHS (see below).

Named LHS items must be unique per-source and must not collide with any words.

Named LHS items must be less than 32 characters long.

Typically kebab-case naming is preferred, to be consistent with word naming.

##### Unnamed LHS items

Unnamed LHS items start with an underscore. A lone underscore `_` is valid.

Unnamed LHS items ARE NOT available to the RHS, and do not need to be unique.

This is valid (although kind of useless, except for debugging maybe):

```
_: 1,
_: 2,
_a: 3,
_a: 4;
```

##### Source inputs

The first line(s) of a source can have LHS items without any RHS items.

This works similarly to function arguments in other languages. Basically the stack is expected to be prepopulated with these values before anything else runs. For example the `call` word does this (see below).

```
input-1 input-2:,
_: decimal18-div(input-1 input-2);
```

This is only valid on lines before any RHS calculations have run. It is an error to try and define inputs after other LHS/RHS pairs have been defined.

#### RHS items

##### Literals

Literals are RHS values that the parser can convert to EVM data _at parse time_.

Literals include:

- unsigned (i.e. non-negative) integers, as anything starting with a digit e.g.
    - `1`
    - `0`
    - `2`
    - `100`
    - `1e18`
    - `101e16`
- short strings (i.e. less then 32 characters), as anything bounded by `""` e.g.
    - `""`
    - `"a"`
    - `"foo"`
- sub parsed literals, as anything bounded by `[]` e.g.
    - `[uniswap-v3-fee-medium]`
    - `[decimal18 1.5]`

Sub parsed literals are handed off to the sub parsers defined in the pragma, in order, until a sub parser successfully handles the literal.

##### Words

Words reference logic that is calculated _at transaction time_ on the RHS.

A word is anything that does not start with a digit and is followed by `( )`.

Parse time inputs to the word are provided by `< >` (optional).

Transaction time inputs to the word are provided by `( )`.

For example, the word `decimal18-div` can either round values up or down. The rounding direction is a _parse time input_ and the values to divide are _transaction time inputs_. The default rounding direction is down, so we do not have to provide any parse time input if we're happy with that, but if we wanted to round up we would have to provide the parse time input `1`.

Decimal 18 division of `3/2`, rounding up:

`decimal18-div<1>(3e18 2e18)`

Transaction time inputs can be literals, LHS items, or other RHS calculations.

Parse time inputs can only be literals.

This would also be valid, assuming `[round-up]` and `a` were defined:

`decimal18-div<[round-up]>(a decimal18-add(1e18 1e18))`

In the same ways as sub parsed literals, if the parser finds a word that it does not know, it will hand off the word to each sub parser defined in the pragma, in order, until one of them successfully handles the word.

##### Multi-value LHS/RHS

It is possible to put multiple LHS items on the same line, as long as:

- There is a single RHS calculation with the same number of outputs as there are LHS items
- There are the same number of RHS calculations as LHS items, each returning one value

Examples

Valid because both RHS calculations return 1 value:

```
a b: block-timestamp() int-add(1 2);
```

Valid because the RHS calculation returns 2 values:

```
height width: height-and-width();
```

#### Special words

Some words open up so much functionality that they are worth calling out and discussing individually.

##### `ensure`

Often a rainlang author will want to prevent a transaction from completing if certain conditions are not met.

If `ensure` receives a `0` at transaction time, it will error the transaction with the provided error message.

E.g.

`:ensure(some-condition "Failed condition");`

As this is onchain, all state changes will be rolled back if the transaction is reverted this way.

##### `set` and `get`

Even though rainlang is read only, you will often want to store some value in a transaction to be read by a later transaction (or later within the same transaction).

Without going into the details of how this is possible, `set` and `get` are the words used to store and retrieve values respectively.

For example, if we `set` under some key during a transaction like:

```
/* note that set has no outputs so LHS is empty */
:set("some-key" 5);
```

Then we can `get` it later _in a different transaction_ like:

```
five: get("some-key");
```

Some important things to note:

- If the transaction errors anywhere, either in the rainlang or calling contract, all `set` calls will be rolled back as though they never happened. Blockchain transactions are "all or nothing" in nature.
- If you `get` a value that hasn't been previously `set` you will NOT error, instead you will get `0`.
    - This is a quirk of the blockchain itself, there is no way to tell the difference between "this was set to `0`" and "this was never set to anything"
    - If you need to know whether some value has been set or not, you can consider tracking another value like `:set("is-initialized" 1);`
    - You can easily provide a fallback in the case of `0` by using `any`, for example `any(get("my-value") my-default-value)`
- `get` will see previous `set` values to its key in the same transaction, so the order of gets and sets in your logic matters

##### `context`

The calling contract can provide additional data to the rainlang in a grid of values known as "context".

Generally the `context` word doesn't need to be used directly, as there are sub parsers that provide nice sugar for it, but it's worth understanding that it exists.

Context values can be provided by 3 potential sources:

- The calling contract e.g. vault balances in raindex
- The signer of the transaction itself
- Signed context which are lists of value that have been signed by some third party

##### `call`

Call allows sources to treat other sources in the same rainlang file as though they were words.

This gives rainlang functionality very similar to functions in other languages, while still maintaining the simple named stack coding style.

The parse time input to call is the index of the source to call into, starting at `0` for the first source in a file. The inputs to `call` are expected to be the same as the inputs to the source, and the number of LHS items matching the `call` defines the number of outputs to pull off the called source's stack.

For example:

```
/* this source is index 0 and is calling index 1 with 2 inputs */
five six: call<1>(1 2);

/* this source is index 1, it expects 2 inputs */
one two:,
three four: int-add(one two) 4,
five six: 5 int-add(three three);
```

It is an error to try to take more items off the called stack than exist in that stack.

It is valid to use inputs as outputs.

For example, this is valid:

```
one: call<1>(1);

one:;
```

## Data structures and execution

Rainlang currently only has individual values (no lists) and there are no negative numbers or decimal numbers.

### No negative numbers

This is largely due to needing to interface with standards like ERC20 and the EVM itself, but over time we will try to smooth over these details. For example, if we included negative numbers by default, and you got an "infinite approval" amount from ERC20 tokens, it would look like `-1` was approved :sweat_smile: .

At some point we will probably implement negative numbers with adapters to/from all the implemented external interfaces, with some logic to handle all the weird edge cases where a direct conversion is not possible.

One thing to note about this is that this makes subtracting below zero _an error_ unless the saturating math is used (which sets anything below 0 to 0).

For example, this will _revert_:

`_:int-sub(2 3);`

### No decimal numbers

This is probably easier to fix than the negative number situation. Basically, there are no decimal numbers in the EVM at all. What is really happening when you have 1.5 DAI, is that you have `15e17` DAI, and then the token treats `1e18` as "one".

If you're not familiar with `e` notation, basically it is the number of zeros to add after the digits. So `1e2` is `100` (2 zeros). `1e18` is a big number.

Treating `1e18` as "one" is also the convention adopted by ETH itself, as there are `1e18` wei in a single ETH, similar to how there are 100 million satoshis in a bitcoin.

As this is the closest thing to an "official" decimal implementation, we adopt it by convention with most math functions having both an `int-` (integer) and `decimal18-` (fixed point decimal 18) version.

Over time we will probably move away from `int-` style words altogether and normalize everything around `decimal18` logic.

### Only `0` is false

Every value other than `0` is considered "true" by the standard logic words.

Even `""` (empty string) is truthy on newer versions of rainlang (older versions of rainlang treated `""` as `0`).

Sub parsed literals are false/true depending on whether they parse to `0` or not according to the sub parser.

### Everything is eager

Rainlang doesn't have laziness. This means that if you use `if` then all three of the inputs are evaluated _before_ the `if` runs.

Usually you won't notice the difference between lazy/eager evaluation, but it can cause issues if one of the arms reverts.

For example, you may be tempted to avoid a negative number like this:

`_: if(greater-than(big small) int-sub(big small) small);`

But you'll find that `int-sub(big small)` _always_ runs, even if the `if` condition evaluates to false, and therefore still errors.

In this case there is a `int-max` word that does the same thing without triggering errors.