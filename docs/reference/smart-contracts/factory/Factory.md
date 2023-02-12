Base contract for deploying and registering child contracts.





## Functions
### `constructor()` (internal)





### `_createChild(bytes data_) → address` (internal)

Implements `IFactory`.

`_createChild` hook must be overridden to actually create child
contract.

Implementers may want to overload this function with a typed equivalent
to expose domain specific structs etc. to the compiled ABI consumed by
tooling and other scripts. To minimise gas costs for deployment it is
expected that the tooling will consume the typed ABI, then encode the
arguments and pass them to this function directly.





### `createChild(bytes data_) → address` (public)

Implements `IFactory`.

Calls the `_createChild` hook that inheriting contracts must override.
Registers child contract address such that `isChild` is `true`.
Emits `NewChild` event.





### `isChild(address maybeChild_) → bool` (external)

Implements `IFactory`.

Checks if address is registered as a child contract of this factory.





