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
### `Initialize(address sender, bool allowDelegatedClaims)`

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

Reports from the claim contract function differently to most tier
contracts. When the report is uninitialized it is `0` NOT `0xFF..`. The
intent is that the claim report is compatible with an "every" selectLte
against tiers that might be gating claims. It's important that we use
every for this check as the underlying tier doing the gating MUST be
respected on every claim even for users that have previously claimed as
they could have lost tiers since their last claim.
The standard "uninitialized is 0xFF.." logic can be simulated in a rain
script as `REPORT(this, account) IF(ISZERO(DUP(0)), never, DUP(0))` if
desired by the deployer (adjusting the DUP index to taste).


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




