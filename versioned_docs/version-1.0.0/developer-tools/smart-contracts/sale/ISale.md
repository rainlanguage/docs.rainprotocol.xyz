





## Functions
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



