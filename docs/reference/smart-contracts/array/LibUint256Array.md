Things we want to do carefully and efficiently with uint256 arrays
that Solidity doesn't give us native tools for.





## Functions
### `arrayFrom(uint256 a_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_, uint256 c_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_, uint256 c_, uint256 d_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_, uint256 c_, uint256 d_, uint256 e_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_, uint256 c_, uint256 d_, uint256 e_, uint256 f_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256[] tail_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `arrayFrom(uint256 a_, uint256 b_, uint256[] tail_) → uint256[]` (internal)

Building arrays from literal components is a common task that introduces
boilerplate that is either inefficient or error prone.




### `matrixFrom(uint256[] a_) → uint256[][]` (internal)

2-dimensional analogue of `arrayFrom`. Takes a 1-dimensional array and
coerces it to a 2-dimensional matrix where the first and only item in the
matrix is the 1-dimensional array.




### `truncate(uint256[] array_, uint256 newLength_)` (internal)

Solidity provides no way to change the length of in-memory arrays but
it also does not deallocate memory ever. It is always safe to shrink an
array that has already been allocated, with the caveat that the
truncated items will effectively become inaccessible regions of memory.
That is to say, we deliberately "leak" the truncated items, but that is
no worse than Solidity's native behaviour of leaking everything always.
The array is MUTATED in place so there is no return value and there is
no new allocation or copying of data either.




### `extend(uint256[] base_, uint256[] extend_)` (internal)

Extends `base_` with `extend_` by allocating additional `extend_.length`
uints onto `base_`. Reverts if some other memory has been allocated
after `base_` already, in which case it is NOT safe to copy inline.
If `base_` is large this MAY be significantly more efficient than
allocating `base_.length + extend_.length` for an entirely new array and
copying both `base_` and `extend_` into the new array one item at a
time in Solidity.
The Solidity compiler MAY rearrange sibling statements in a code block
EVEN IF THE OPTIMIZER IS DISABLED such that it becomes unsafe to use
`extend` for memory allocated in different code blocks. It is ONLY safe
to `extend` arrays that were allocated in the same lexical scope and you
WILL see subtle errors that revert transactions otherwise.
i.e. the `new` keyword MUST appear in the same code block as `extend`.




### `unsafeCopyValuesTo(uint256[] inputs_, uint256 outputCursor_)` (internal)

Copies `inputs_` to `outputCursor_` with NO attempt to check that this
is safe to do so. The caller MUST ensure that there exists allocated
memory at `outputCursor_` in which it is safe and appropriate to copy
ALL `inputs_` to. Anything that was already written to memory at
`[outputCursor_:outputCursor_+(inputs_.length * 32 bytes)]` will be
overwritten. The length of `inputs_` is NOT copied to the output
location, ONLY the `uint256` values of the `inputs_` array are copied.
There is no return value as memory is modified directly.




### `copyToNewUint256Array(uint256 inputCursor_, uint256 length_) → uint256[]` (internal)

Copies `length_` 32 byte words from `inputCursor_` to a newly allocated
uint256[] array with NO attempt to check that the inputs are sane.
This function is safe in that the outputs are guaranteed to be copied
to newly allocated memory so no existing data will be overwritten.
This function is subtle in that the `inputCursor_` is NOT validated in
any way so the caller MUST ensure it points to a sensible memory
location to read (e.g. to exclude the length from input arrays etc.).




### `unsafeCopyValuesTo(uint256 inputCursor_, uint256 outputCursor_, uint256 length_)` (internal)

Copies `length_` uint256 values starting from `inputsCursor_` to
`outputCursor_` with NO attempt to check that this is safe to do so.
The caller MUST ensure that there exists allocated memory at
`outputCursor_` in which it is safe and appropriate to copy
`length_ * 32` bytes to. Anything that was already written to memory at
`[outputCursor_:outputCursor_+(length_ * 32 bytes)]` will be
overwritten.
There is no return value as memory is modified directly.




