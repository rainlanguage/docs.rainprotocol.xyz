Mints itself according to some predefined schedule. The schedule is
expressed as a rainVM script and the `claim` function is world-callable.
Intended behaviour is to avoid sybils infinitely minting by putting the
claim functionality behind a `ITier` contract. The emissions contract
itself implements `ReadOnlyTier` and every time a claim is processed it
logs the block number of the claim against every tier claimed. So the block
numbers in the tier report for `EmissionsERC20` are the last time that tier
was claimed against this contract. The simplest way to make use of this
information is to take the max block for the underlying tier and the last
claim and then diff it against the current block number.
See `test/Claim/EmissionsERC20.sol.ts` for examples, including providing
staggered rewards where more tokens are minted for higher tier accounts.


## Variables
### `uint256` `LOCAL_OPS_LENGTH`

### `bool` `allowDelegatedClaims`


## Events
### `Initialize(address sender, bool allowDelegatedClaims, uint256 constructionBlockNumber)`

Contract has initialized.





## Functions
### `constructor()` (public)

Constructs the emissions schedule source, opcodes and ERC20 to mint.



### `initialize(struct EmissionsERC20Config config_)` (external)





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




### `report(address account_) → uint256` (public)

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



### `calculateClaim(address claimant_) → uint256` (public)

Calculates the claim without processing it.
Read only method that may be useful downstream both onchain and
offchain if a claimant wants to check the claim amount before deciding
whether to process it.
As this is read only there are no checks against delegated claims. It
is possible to return a value from `calculateClaim` and to not be able
to process the claim with `claim` if `msg.sender` is not the
`claimant_`.




### `claim(address claimant_, bytes data_)` (external)

Processes the claim for `claimant_`.
- Enforces `allowDelegatedClaims` if it is `true` so that `msg.sender`
must also be `claimant_`.
- Takes the return from `calculateClaim` and mints for `claimant_`.
- Records the current block as the claim-tier for this contract.
- emits a `Claim` event as per `IClaim`.




