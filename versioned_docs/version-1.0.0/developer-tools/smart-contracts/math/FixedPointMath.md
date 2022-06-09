Sometimes we want to do math with decimal values but all we have
are integers, typically uint256 integers. Floats are very complex so we
don't attempt to simulate them. Instead we provide a standard definition of
"one" as 10 ** 18 and scale everything up/down to this as fixed point math.
Overflows are errors as per Solidity.


## Variables
### `uint256` `DECIMALS`

### `uint256` `ONE`




## Functions
### `scale18(uint256 a_, uint256 aDecimals_) → uint256` (internal)

Scale a fixed point decimal of some scale factor to match `DECIMALS`.




### `scaleN(uint256 a_, uint256 targetDecimals_) → uint256` (internal)

Scale a fixed point decimals of `DECIMALS` to some other scale.




### `scaleBy(uint256 a_, int8 scaleBy_) → uint256` (internal)

Scale a fixed point up or down by `scaleBy_` orders of magnitude.
The caller MUST ensure the end result matches `DECIMALS` if other
functions in this library are to work correctly.
Notably `scaleBy` is a SIGNED integer so scaling down by negative OOMS
is supported.




### `fixedPointMul(uint256 a_, uint256 b_) → uint256` (internal)

Fixed point multiplication in native scale decimals.
Both `a_` and `b_` MUST be `DECIMALS` fixed point decimals.




### `fixedPointDiv(uint256 a_, uint256 b_) → uint256` (internal)

Fixed point division in native scale decimals.
Both `a_` and `b_` MUST be `DECIMALS` fixed point decimals.




