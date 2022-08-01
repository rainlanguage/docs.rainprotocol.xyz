Deploys everything required to build a fresh `State` for rainVM
execution as an evm contract onchain. Uses SSTORE2 to abi encode rain
script into evm bytecode, then stores an immutable pointer to the resulting
contract. Allows arbitrary length rain script source, constants and stack.
Gas scales for reads much better for longer data than attempting to put
all the source into storage.
See https://github.com/0xsequence/sstore2



## Events
### `Snapshot(address sender, address pointer, struct State state)`

A new shapshot has been deployed onchain.






## Functions
### `_newState(struct StateConfig config_) → struct State` (internal)

Builds a new `State` from `StateConfig`.
Empty stack and arguments with stack index 0.




### `_snapshot(struct State state_) → address` (internal)

Snapshot a RainVM state as an immutable onchain contract.
Usually `State` will be new as per `newState` but can be a snapshot of
an "in flight" execution state also.




### `_restore(address pointer_) → struct State` (internal)

Builds a fresh state for rainVM execution from all construction data.
This can be passed directly to `eval` for a `RainVM` contract.




