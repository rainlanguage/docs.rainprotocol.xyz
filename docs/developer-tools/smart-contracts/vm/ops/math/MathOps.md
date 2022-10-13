RainVM opcode pack to perform basic checked math operations.
Underflow and overflow will error as per default solidity behaviour.
SaturatingMath opcodes are provided as "core" math because the VM has no
ability to lazily execute code, which means that overflows cannot be
guarded with conditional logic. Saturation is a quick and dirty solution to
overflow that is valid in many situations.





## Functions
### `applyOp(struct State state_, uint256 opcode_, uint256 operand_)` (internal)





