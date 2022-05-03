`Phased` is an abstract contract that defines up to `9` phases that
an implementing contract moves through.

Phase `0` is always the first phase and does not, and cannot, be set
expicitly. Effectively it is implied that phase `0` has been active
since block zero.

Each subsequent phase `1` through `8` must be scheduled sequentially and
explicitly at a block number.

Only the immediate next phase can be scheduled with `scheduleNextPhase`,
it is not possible to schedule multiple phases ahead.

Multiple phases can be scheduled in a single block if each scheduled phase
is scheduled for the current block.

Several utility functions and modifiers are provided.

One event `PhaseShiftScheduled` is emitted each time a phase shift is
scheduled (not when the scheduled phase is reached).



## Details
`Phased` contracts have a defined timeline with available
functionality grouped into phases.
Every `Phased` contract starts at `0` and moves sequentially
through phases `1` to `8`.
Every `Phase` other than `0` is optional, there is no requirement
that all 9 phases are implemented.
Phases can never be revisited, the inheriting contract always moves through
each achieved phase linearly.
This is enforced by only allowing `scheduleNextPhase` to be called once per
phase.
It is possible to call `scheduleNextPhase` several times in a single block
but the `block.number` for each phase must be reached each time to schedule
the next phase.
Importantly there are events and several modifiers and checks available to
ensure that functionality is limited to the current phase.
The full history of each phase shift block is recorded as a fixed size
array of `uint32`.

## Variables
### `uint32[8]` `phaseBlocks`


## Events
### `PhaseScheduled(address sender, uint256 newPhase, uint256 scheduledBlock)`

`PhaseScheduled` is emitted when the next phase is scheduled.




## Modifiers
### `onlyPhase(uint256 phase_)`

Modifies functions to only be callable in a specific phase.




### `onlyAtLeastPhase(uint256 phase_)`

Modifies functions to only be callable in a specific phase OR if the
specified phase has passed.





## Functions
### `initializePhased()` (internal)

Initialize the blocks at "never".
All phase blocks are initialized to `UNINITIALIZED`.
i.e. not fallback solidity value of `0`.



### `phaseAtBlockNumber(uint32[8] phaseBlocks_, uint256 blockNumber_) → uint256` (public)

Pure function to reduce an array of phase blocks and block number to a
specific `Phase`.
The phase will be the highest attained even if several phases have the
same block number.
If every phase block is after the block number then `0` is
returned.
If every phase block is before the block number then `MAX_PHASE` is
returned.




### `blockNumberForPhase(uint32[8] phaseBlocks_, uint256 phase_) → uint256` (public)

Pure function to reduce an array of phase blocks and phase to a
specific block number.
`Phase.ZERO` will always return block `0`.
Every other phase will map to a block number in `phaseBlocks_`.




### `currentPhase() → uint256` (public)

Impure read-only function to return the "current" phase from internal
contract state.
Simply wraps `phaseAtBlockNumber` for current values of `phaseBlocks`
and `block.number`.



### `schedulePhase(uint256 phase_, uint256 block_)` (internal)

Writes the block for the next phase.
Only uninitialized blocks can be written to.
Only the immediate next phase relative to `currentPhase` can be written
to. It is still required to specify the `phase_` so that it is explicit
and clear in the calling code which phase is being moved to.
Emits `PhaseShiftScheduled` with the phase block.




