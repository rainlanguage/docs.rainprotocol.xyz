


## Variables
### `bytes32` `APPROVER_ADMIN`

### `bytes32` `APPROVER`

### `bytes32` `REMOVER_ADMIN`

### `bytes32` `REMOVER`

### `bytes32` `BANNER_ADMIN`

### `bytes32` `BANNER`

### `contract IVerifyCallback` `callback`


## Events
### `Initialize(address sender, struct VerifyConfig config)`

Emitted when the `Verify` contract is initialized.



### `RequestApprove(address sender, struct Evidence evidence)`

Emitted when evidence is first submitted to approve an account.
The requestor is always the `msg.sender` of the user calling `add`.




### `Approve(address sender, struct Evidence evidence)`

Emitted when a previously added account is approved.




### `RequestBan(address sender, struct Evidence evidence)`

Currently approved accounts can request that any account be banned.
The requestor is expected to provide supporting data for the ban.
The requestor MAY themselves be banned if vexatious.




### `Ban(address sender, struct Evidence evidence)`

Emitted when an added or approved account is banned.




### `RequestRemove(address sender, struct Evidence evidence)`

Currently approved accounts can request that any account be removed.
The requestor is expected to provide supporting data for the removal.
The requestor MAY themselves be banned if vexatious.




### `Remove(address sender, struct Evidence evidence)`

Emitted when an account is scrubbed from blockchain state.
Historical logs still visible offchain of course.





## Modifiers
### `onlyApproved()`

Requires that `msg.sender` is approved as at the current block.




## Functions
### `initialize(struct VerifyConfig config_)` (external)

Initializes the `Verify` contract e.g. as cloned by a factory.




### `state(address account_) → struct State` (external)

Typed accessor into states.




### `statusAtBlock(struct State state_, uint256 blockNumber_) → uint256` (public)

Derives a single `Status` from a `State` and a reference block number.




### `add(bytes data_)` (external)

An account adds their own verification evidence.
Internally `msg.sender` is used; delegated `add` is not supported.




### `approve(struct Evidence[] evidences_)` (external)

An `APPROVER` can review added evidence and approve accounts.
Typically many approvals would be submitted in a single call which is
more convenient and gas efficient than sending individual transactions
for every approval. However, as there are many individual agents
acting concurrently and independently this requires that the approval
process be infallible so that no individual approval can rollback the
entire batch due to the actions of some other approver/banner. It is
possible to approve an already approved or banned account. The
`Approve` event will always emit but the approved block will only be
set if it was previously uninitialized. A banned account will always
be seen as banned when calling `statusAtBlock` regardless of the
approval block, even if the approval is more recent than the ban. The
only way to reset a ban is to remove and reapprove the account.




### `requestApprove(struct Evidence[] evidences_)` (external)

Any approved address can request some other address be approved.
Frivolous requestors SHOULD expect to find themselves banned.




### `ban(struct Evidence[] evidences_)` (external)

A `BANNER` can ban an added OR approved account.




### `requestBan(struct Evidence[] evidences_)` (external)

Any approved address can request some other address be banned.
Frivolous requestors SHOULD expect to find themselves banned.




### `remove(struct Evidence[] evidences_)` (external)

A `REMOVER` can scrub state mapping from an account.
A malicious account MUST be banned rather than removed.
Removal is useful to reset the whole process in case of some mistake.




### `requestRemove(struct Evidence[] evidences_)` (external)

Any approved address can request some other address be removed.
Frivolous requestors SHOULD expect to find themselves banned.




