Development tools not intended for production usage.



## Events
### `DebugEvent(uint256 value)`





### `DebugEvent(uint256[] values)`





### `DebugEvent(bytes value)`







## Functions
### `dumpMemory()` (internal)

Outputs the entire allocated memory in the opinion of Solidity to an
event. Avoids allocating new memory in the process of emitting the event.
If memory has been written past the Solidity free memory pointer at 0x40
then it will NOT be included in the dump.



### `logFreeMemoryPointer()` (internal)

Logs the current position of the Solidity free memory pointer at 0x40.



### `emitEvent(uint256 value_)` (internal)





### `emitEvent(uint256[] values_)` (internal)





### `emitEvent(bytes value_)` (internal)





