Enables a contract to pull (transfer to self) some `IERC20` token
from a sender. Both the sender and token must be known and trusted by the
implementing contract during initialization, and cannot be changed.

This enables the `sender` to merely approve the implementing contract then
anon can call `pullERC20` to have those tokens transferred. In some cases
(e.g. distributing the proceeds of a raise) it is safer to only approve
tokens than to transfer (e.g. if there is some bug reverting transfers).

The `sender` is singular and bound at construction to avoid the situation
where EOA accounts inadvertantly "infinite approve" and lose their tokens.
For this reason EOA accounts are NOT supported as the `sender`. Approvals
MUST expect the `ERC20Pull` contract to take any and all tokens up to the
allowance at any moment. EOA accounts typically are not security conscious
enough to be nominated as the `sender`.

The token is singular and bound at construction to avoid the situation
where anons can force the implementing contract to call an arbitrary
external contract.



## Events
### `ERC20PullInitialize(address sender, address tokenSender, address token)`

Emitted during initialization.





## Functions
### `initializeERC20Pull(struct ERC20PullConfig config_)` (internal)

Initialize the sender and token.




### `pullERC20(uint256 amount_)` (external)

Attempts to transfer `amount_` of `token` to this contract.
Relies on `token` having been approved for at least `amount_` by the
`sender`. Will revert if the transfer fails due to `safeTransferFrom`.
Also relies on `token` not being malicious.




