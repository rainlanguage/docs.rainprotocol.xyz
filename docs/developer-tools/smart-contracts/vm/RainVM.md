micro VM for implementing and executing custom contract DSLs.
Libraries and contracts map opcodes to `view` functionality then RainVM
runs rain scripts using these opcodes. Rain scripts dispatch as pairs of
bytes. The first byte is an opcode to run and the second byte is a value
the opcode can use contextually to inform how to run. Typically opcodes
will read/write to the stack to produce some meaningful final state after
all opcodes have been dispatched.

The only thing required to run a rain script is a `State` struct to pass
to `eval`, and the index of the source to run. Additional context can
optionally be provided to be used by opcodes. For example, an `ITier`
contract can take the input of `report`, abi encode it as context, then
expose a local opcode that copies this account to the stack. The state will
be mutated by reference rather than returned by `eval`, this is to make it
very clear to implementers that the inline mutation is occurring.

Rain scripts run "top to bottom", i.e. "left to right".
See the tests for examples on how to construct rain script in JavaScript
then pass to `ImmutableSource` contracts deployed by a factory that then
run `eval` to produce a final value.

There are only 4 "core" opcodes for `RainVM`:
- `0`: Skip self and optionally additional opcodes, `0 0` is a noop.
  DEPRECATED! DON'T USE SKIP!
  See https://github.com/beehive-innovation/rain-protocol/issues/262
- `1`: Copy value from either `constants` or `arguments` at index `operand`
  to the top of the stack. High bit of `operand` is `0` for `constants` and
  `1` for `arguments`.
- `2`: Duplicates the value at stack index `operand_` to the top of the
  stack.
- `3`: Zipmap takes N values from the stack, interprets each as an array of
  configurable length, then zips them into `arguments` and maps a source
  from `sources` over these. See `zipmap` for more details.

To do anything useful the contract that inherits `RainVM` needs to provide
opcodes to build up an internal DSL. This may sound complex but it only
requires mapping opcode integers to functions to call, and reading/writing
values to the stack as input/output for these functions. Further, opcode
packs are provided in rain that any inheriting contract can use as a normal
solidity library. See `MathOps.sol` opcode pack and the
`CalculatorTest.sol` test contract for an example of how to dispatch
opcodes and handle the results in a wrapping contract.

RainVM natively has no concept of branching logic such as `if` or loops.
An opcode pack could implement these similar to the core zipmap by lazily
evaluating a source from `sources` based on some condition, etc. Instead
some simpler, eagerly evaluated selection tools such as `min` and `max` in
the `MathOps` opcode pack are provided. Future versions of `RainVM` MAY
implement lazy `if` and other similar patterns.

The `eval` function is `view` because rain scripts are expected to compute
results only without modifying any state. The contract wrapping the VM is
free to mutate as usual. This model encourages exposing only read-only
functionality to end-user deployers who provide scripts to a VM factory.
Removing all writes removes a lot of potential foot-guns for rain script
authors and allows VM contract authors to reason more clearly about the
input/output of the wrapping solidity code.

Internally `RainVM` makes heavy use of unchecked math and assembly logic
as the opcode dispatch logic runs on a tight loop and so gas costs can ramp
up very quickly. Implementing contracts and opcode packs SHOULD require
that opcodes they receive do not exceed the codes they are expecting.





## Functions
### `zipmap(bytes context_, struct State state_, uint256 operand_)` (internal)

Zipmap is rain script's native looping construct.
N values are taken from the stack as `uint256` then split into `uintX`
values where X is configurable by `operand_`. Each 1 increment in the
operand size config doubles the number of items in the implied arrays.
For example, size 0 is 1 `uint256` value, size 1 is
`2x `uint128` values, size 2 is 4x `uint64` values and so on.

The implied arrays are zipped and then copied into `arguments` and
mapped over with a source from `sources`. Each iteration of the mapping
copies values into `arguments` from index `0` but there is no attempt
to zero out any values that may already be in the `arguments` array.
It is the callers responsibility to ensure that the `arguments` array
is correctly sized and populated for the mapped source.

The `operand_` for the zipmap opcode is split into 3 components:
- 3 low bits: The index of the source to use from `sources`.
- 2 middle bits: The size of the loop, where 0 is 1 iteration
- 3 high bits: The number of vals to be zipped from the stack where 0
  is 1 value to be zipped.

This is a separate function to avoid blowing solidity compile stack.
In the future it may be moved inline to `eval` for gas efficiency.

See https://en.wikipedia.org/wiki/Zipping_(computer_science)
See https://en.wikipedia.org/wiki/Map_(higher-order_function)




### `eval(bytes context_, struct State state_, uint256 sourceIndex_)` (internal)

Evaluates a rain script.
The main workhorse of the rain VM, `eval` runs any core opcodes and
dispatches anything it is unaware of to the implementing contract.
For a script to be useful the implementing contract must override
`applyOp` and dispatch non-core opcodes to domain specific logic. This
could be mathematical operations for a calculator, tier reports for
a membership combinator, entitlements for a minting curve, etc.

Everything required to coordinate the execution of a rain script to
completion is contained in the `State`. The context and source index
are provided so the caller can provide additional data and kickoff the
opcode dispatch from the correct source in `sources`.



### `applyOp(bytes context_, struct State state_, uint256 opcode_, uint256 operand_)` (internal)

Every contract that implements `RainVM` should override `applyOp` so
that useful opcodes are available to script writers.
For an example of a simple and efficient `applyOp` implementation that
dispatches over several opcode packs see `CalculatorTest.sol`.
Implementing contracts are encouraged to handle the dispatch with
unchecked math as the dispatch is a critical performance path and
default solidity checked math can significantly increase gas cost for
each opcode dispatched. Consider that a single zipmap could loop over
dozens of opcode dispatches internally.
Stack is modified by reference NOT returned.




