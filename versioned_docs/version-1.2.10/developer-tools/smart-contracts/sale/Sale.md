


## Variables
### `uint256` `LOCAL_OPS_LENGTH`


## Events
### `Construct(address sender, struct SaleConstructorConfig config)`

Contract is constructing.




### `Initialize(address sender, struct SaleConfig config, address token)`

Contract is initializing (being cloned by factory).




### `Start(address sender)`

Sale is started (moved to active sale state).




### `End(address sender, enum SaleStatus saleStatus)`

Sale has ended (moved to success/fail sale state).




### `Timeout(address sender)`

Sale has failed due to a timeout (failed to even start/end).




### `Buy(address sender, struct BuyConfig config, struct Receipt receipt)`

rTKN being bought.
Importantly includes the receipt that sender can use to apply for a
refund later if they wish.




### `Refund(address sender, struct Receipt receipt)`

rTKN being refunded.
Includes the receipt used to justify the refund.





## Functions
### `constructor(struct SaleConstructorConfig config_)` (public)





### `initialize(struct SaleConfig config_, struct SaleRedeemableERC20Config saleRedeemableERC20Config_)` (external)





### `token() → address` (external)

Returns the address of the token being sold in the sale.
MUST NOT change during the lifecycle of the sale contract.



### `reserve() → address` (external)

Returns the address of the token that sale prices are denominated in.
MUST NOT change during the lifecycle of the sale contract.



### `saleStatus() → enum SaleStatus` (external)

Returns the current `SaleStatus` of the sale.
Represents a linear progression of the sale through its major lifecycle
events.



### `canStart() → bool` (public)

Can the sale start?
Evals `canStartStatePointer` to a boolean that determines whether the
sale can start (move from pending to active). Buying from and ending
the sale will both always fail if the sale never started.
The sale can ONLY start if it is currently in pending status.



### `canEnd() → bool` (public)

Can the sale end?
Evals `canEndStatePointer` to a boolean that determines whether the
sale can end (move from active to success/fail). Buying will fail if
the sale has ended.
If the sale is out of rTKN stock it can ALWAYS end and in this case
will NOT eval the "can end" script.
The sale can ONLY end if it is currently in active status.



### `calculatePrice(uint256 units_) → uint256` (public)

Calculates the current reserve price quoted for 1 unit of rTKN.
Used internally to process `buy`.




### `start()` (external)

Start the sale (move from pending to active).
`canStart` MUST return true.



### `end()` (public)

End the sale (move from active to success or fail).
`canEnd` MUST return true.



### `timeout()` (external)

Timeout the sale (move from pending or active to fail).
The ONLY condition for a timeout is that the `saleTimeout` block set
during initialize is in the past. This means that regardless of what
happens re: starting, ending, buying, etc. if the sale does NOT manage
to unambiguously end by the timeout block then it can timeout to a fail
state. This means that any downstream escrows or similar can always
expect that eventually they will see a pass/fail state and so are safe
to lock funds while a Sale is active.



### `buy(struct BuyConfig config_)` (external)

Main entrypoint to the sale. Sells rTKN in exchange for reserve token.
The price curve is eval'd to produce a reserve price quote. Each 1 unit
of rTKN costs `price` reserve token where BOTH the rTKN units and price
are treated as 18 decimal fixed point values. If the reserve token has
more or less precision by its own conventions (e.g. "decimals" method
on ERC20 tokens) then the price will need to scale accordingly.
The receipt is _logged_ rather than returned as it cannot be used in
same block for a refund anyway due to cooldowns.




### `refund(struct Receipt receipt_)` (external)

Rollback a buy given its receipt.
Ignoring gas (which cannot be refunded) the refund process rolls back
all state changes caused by a buy, other than the receipt id increment.
Refunds are limited by the global cooldown to mitigate rapid buy/refund
cycling that could cause volatile price curves or other unwanted side
effects for other sale participants. Cooldowns are bypassed if the sale
ends and is a failure.




### `claimFees(address recipient_)` (external)

After a sale ends in success all fees collected for a recipient can be
cleared. If the raise is active or fails then fees cannot be claimed as
they are set aside in case of refund. A failed raise implies that all
buyers should immediately refund and zero fees claimed.




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




