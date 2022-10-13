



## Events
### `NewChild(address sender, address child)`

Whenever a new child contract is deployed, a `NewChild` event
containing the new child contract address MUST be emitted.




### `Implementation(address sender, address implementation)`

Factories that clone a template contract MUST emit an event any time
they set the implementation being cloned. Factories that deploy new
contracts without cloning do NOT need to emit this.






## Functions
### `createChild(bytes data_) → address` (external)

Creates a new child contract.





### `isChild(address maybeChild_) → bool` (external)

Checks if address is registered as a child contract of this factory.

Addresses that were not deployed by `createChild` MUST NOT return
`true` from `isChild`. This is CRITICAL to the security guarantees for
any contract implementing `IFactory`.





