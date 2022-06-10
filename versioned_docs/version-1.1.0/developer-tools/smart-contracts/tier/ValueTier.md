

## Details
A contract that is `ValueTier` expects to derive tiers from explicit
values. For example an address must send or hold an amount of something to
reach a given tier.
Anything with predefined values that map to tiers can be a `ValueTier`.

Note that `ValueTier` does NOT implement `ITier`.
`ValueTier` does include state however, to track the `tierValues` so is not
a library.


## Events
### `InitializeValueTier(address sender, address pointer)`

TODO: Typescript errors on uint256[8] so can't include tierValues here.






## Functions
### `initializeValueTier(uint256[8] tierValues_)` (internal)

Set the `tierValues` on construction to be referenced immutably.



### `tierValues() → uint256[8] tierValues_` (public)

Complements the default solidity accessor for `tierValues`.
Returns all the values in a list rather than requiring an index be
specified.




### `tierToValue(uint256[8] tierValues_, uint256 tier_) → uint256` (internal)

Converts a Tier to the minimum value it requires.
tier 0 is always value 0 as it is the fallback.




### `valueToTier(uint256[8] tierValues_, uint256 value_) → uint256` (internal)

Converts a value to the maximum Tier it qualifies for.




