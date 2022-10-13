





## Functions
### `creationCodeFor(bytes _code) → bytes` (internal)

Generate a creation code that results on a contract with `_code` as
    bytecode
    @param _code The returning value of the resulting `creationCode`
    @return creationCode (constructor) for new contract



### `codeSize(address _addr) → uint256 size` (internal)

Returns the size of the code on a given address
    @param _addr Address that may or may not contain code
    @return size of the code on the given `_addr`



### `codeAt(address _addr, uint256 _start, uint256 _end) → bytes oCode` (internal)

Returns the code of a given address
    @dev It will fail if `_end < _start`
    @param _addr Address that may or may not contain code
    @param _start number of bytes of code to skip on read
    @param _end index before which to end extraction
    @return oCode read from `_addr` deployed bytecode

    Forked: https://gist.github.com/KardanovIR/fe98661df9338c842b4a30306d507fbd



