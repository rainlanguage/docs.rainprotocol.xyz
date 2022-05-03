


## Variables
### `mapping(address => address)` `reserves`

### `mapping(address => address)` `tokens`

### `mapping(address => enum EscrowStatus)` `escrowStatuses`




## Functions
### `reserve(address sale_) → address` (internal)

Immutable wrapper around `ISale.reserve`.
Once a `Sale` reports a reserve address the `SaleEscrow` never asks
again. Prevents a malicious `Sale` from changing the reserve at some
point to break internal escrow accounting.




### `token(address sale_) → address` (internal)

Immutable wrapper around `ISale.token`.
Once a `Sale` reports a token address the `SaleEscrow` never asks
again. Prevents a malicious `Sale` from changing the token at some
point to divert escrow payments after assets have already been set
aside.




### `escrowStatus(address sale_) → enum EscrowStatus` (internal)

Read the one-way, one-time transition from pending to success/fail.
We never change our opinion of a success/fail outcome.
If a buggy/malicious `ISale` somehow changes success/fail state then
that is obviously bad as the escrow will release funds in the wrong
direction. But if we were to change our opinion that would be worse as
claims/refunds could potentially be "double spent" somehow.



