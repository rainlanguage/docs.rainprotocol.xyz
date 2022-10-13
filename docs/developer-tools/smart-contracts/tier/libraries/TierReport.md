`TierReport` implements several pure functions that can be
used to interface with reports.
- `tierAtBlockFromReport`: Returns the highest status achieved relative to
a block number and report. Statuses gained after that block are ignored.
- `tierBlock`: Returns the block that a given tier has been held
since according to a report.
- `truncateTiersAbove`: Resets all the tiers above the reference tier.
- `updateBlocksForTierRange`: Updates a report with a block
number for every tier in a range.
- `updateReportWithTierAtBlock`: Updates a report to a new tier.


## Details
Utilities to consistently read, write and manipulate tiers in reports.
The low-level bit shifting can be difficult to get right so this
factors that out.



## Modifiers
### `maxTier(uint256 tier_)`

Enforce upper limit on tiers so we can do unchecked math.





## Functions
### `tierAtBlockFromReport(uint256 report_, uint256 blockNumber_) → uint256` (internal)

Returns the highest tier achieved relative to a block number
and report.

Note that typically the report will be from the _current_ contract
state, i.e. `block.number` but not always. Tiers gained after the
reference block are ignored.

When the `report` comes from a later block than the `blockNumber` this
means the user must have held the tier continuously from `blockNumber`
_through_ to the report block.
I.e. NOT a snapshot.





### `tierBlock(uint256 report_, uint256 tier_) → uint256` (internal)

Returns the block that a given tier has been held since from a report.

The report MUST encode "never" as 0xFFFFFFFF. This ensures
compatibility with `tierAtBlockFromReport`.





### `truncateTiersAbove(uint256 report_, uint256 tier_) → uint256` (internal)

Resets all the tiers above the reference tier to 0xFFFFFFFF.





### `updateBlockAtTier(uint256 report_, uint256 tier_, uint256 blockNumber_) → uint256` (internal)

Updates a report with a block number for a given tier.
More gas efficient than `updateBlocksForTierRange` if only a single
tier is being modified.
The tier at/above the given tier is updated. E.g. tier `0` will update
the block for tier `1`.




### `updateBlocksForTierRange(uint256 report_, uint256 startTier_, uint256 endTier_, uint256 blockNumber_) → uint256` (internal)

Updates a report with a block number for every tier in a range.

Does nothing if the end status is equal or less than the start tier.




### `updateReportWithTierAtBlock(uint256 report_, uint256 startTier_, uint256 endTier_, uint256 blockNumber_) → uint256` (internal)

Updates a report to a new status.

Internally dispatches to `truncateTiersAbove` and
`updateBlocksForTierRange`.
The dispatch is based on whether the new tier is above or below the
current tier.
The `startTier_` MUST match the result of `tierAtBlockFromReport`.
It is expected the caller will know the current tier when
calling this function and need to do other things in the calling scope
with it.





