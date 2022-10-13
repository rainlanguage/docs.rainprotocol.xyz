Implements `ReadOnlyTier` over RainVM. Allows combining the reports
from any other `ITier` contracts referenced in the `ImmutableSource` set at
construction.
The value at the top of the stack after executing the rain script will be
used as the return of `report`.


## Variables
### `uint256` `LOCAL_OPS_LENGTH`




## Functions
### `initialize(struct StateConfig config_)` (external)





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




### `report(address account_) → uint256` (external)

A tier report is a `uint256` that contains each of the block
numbers each tier has been held continously since as a `uint32`.
There are 9 possible tier, starting with tier 0 for `0` offset or
"never held any tier" then working up through 8x 4 byte offsets to the
full 256 bits.

Low bits = Lower tier.

In hexadecimal every 8 characters = one tier, starting at tier 8
from high bits and working down to tier 1.

`uint32` should be plenty for any blockchain that measures block times
in seconds, but reconsider if deploying to an environment with
significantly sub-second block times.

~135 years of 1 second blocks fit into `uint32`.

`2^8 / (365 * 24 * 60 * 60)`

When a user INCREASES their tier they keep all the block numbers they
already had, and get new block times for each increased tiers they have
earned.

When a user DECREASES their tier they return to `0xFFFFFFFF` (never)
for every tier level they remove, but keep their block numbers for the
remaining tiers.

GUIs are encouraged to make this dynamic very clear for users as
round-tripping to a lower status and back is a DESTRUCTIVE operation
for block times.

The intent is that downstream code can provide additional benefits for
members who have maintained a certain tier for/since a long time.
These benefits can be provided by inspecting the report, and by
on-chain contracts directly,
rather than needing to work with snapshots etc.


Returns the earliest block the account has held each tier for
continuously.
This is encoded as a uint256 with blocks represented as 8x
concatenated uint32.
I.e. Each 4 bytes of the uint256 represents a u32 tier start time.
The low bits represent low tiers and high bits the high tiers.
Implementing contracts should return 0xFFFFFFFF for lost and
never-held tiers.



