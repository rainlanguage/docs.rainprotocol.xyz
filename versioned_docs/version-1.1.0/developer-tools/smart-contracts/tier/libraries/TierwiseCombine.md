


## Variables
### `uint256` `LOGIC_EVERY`

### `uint256` `LOGIC_ANY`

### `uint256` `MODE_MIN`

### `uint256` `MODE_MAX`

### `uint256` `MODE_FIRST`




## Functions
### `saturatingSub(uint256 newerReport_, uint256 olderReport_) → uint256` (internal)

Performs a tierwise saturating subtraction of two reports.
Intepret as "# of blocks older report was held before newer report".
If older report is in fact newer then `0` will be returned.
i.e. the diff cannot be negative, older report as simply spent 0 blocks
existing before newer report, if it is in truth the newer report.




### `selectLte(uint256[] reports_, uint256 blockNumber_, uint256 logic_, uint256 mode_) → uint256` (internal)

Given a list of reports, selects the best tier in a tierwise fashion.
The "best" criteria can be configured by `logic_` and `mode_`.
Logic can be "every" or "any", which means that the reports for a given
tier must either all or any be less than or equal to the reference
`blockNumber_`.
Mode can be "min", "max", "first" which selects between all the block
numbers for a given tier that meet the lte criteria.
IMPORTANT: If the output of `selectLte` is used to write to storage
care must be taken to ensure that "upcoming" tiers relative to the
`blockNumber_` are not overwritten inappropriately. Typically this
function should be used as a filter over reads only from an upstream
source of truth.




