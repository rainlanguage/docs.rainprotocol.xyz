Things we want to do carefully and efficiently with `bytes` in memory
that Solidity doesn't give us native tools for.





## Functions
### `unsafeCopyBytesTo(uint256 inputCursor_, uint256 outputCursor_, uint256 remaining_)` (internal)

Copy an arbitrary number of bytes from one location in memory to another.
As we can only read/write bytes in 32 byte chunks we first have to loop
over 32 byte values to copy then handle any unaligned remaining data. The
remaining data will be appropriately masked with the existing data in the
final chunk so as to not write past the desired length. Note that the
final unaligned write will be more gas intensive than the prior aligned
writes. The writes are completely unsafe, the caller MUST ensure that
sufficient memory is allocated and reading/writing the requested number
of bytes from/to the requested locations WILL NOT corrupt memory in the
opinion of solidity or other subsequent read/write operations.




