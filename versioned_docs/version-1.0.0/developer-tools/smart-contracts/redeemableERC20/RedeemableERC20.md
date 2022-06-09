This is the ERC20 token that is minted and distributed.

During `Phase.ZERO` the token can be traded and so compatible with the
Balancer pool mechanics.

During `Phase.ONE` the token is frozen and no longer able to be traded on
any AMM or transferred directly.

The token can be redeemed during `Phase.ONE` which burns the token in
exchange for pro-rata erc20 tokens held by the `RedeemableERC20` contract
itself.

The token balances can be used indirectly for other claims, promotions and
events as a proof of participation in the original distribution by token
holders.

The token can optionally be restricted by the `ITier` contract to only
allow receipients with a specified membership status.



## Details
`RedeemableERC20` is an ERC20 with 2 phases.

`Phase.ZERO` is the distribution phase where the token can be freely
transfered but not redeemed.
`Phase.ONE` is the redemption phase where the token can be redeemed but no
longer transferred.

Redeeming some amount of `RedeemableERC20` burns the token in exchange for
some other tokens held by the contract. For example, if the
`RedeemableERC20` token contract holds 100 000 USDC then a holder of the
redeemable token can burn some of their tokens to receive a % of that USDC.
If they redeemed (burned) an amount equal to 10% of the redeemable token
supply then they would receive 10 000 USDC.

To make the treasury assets discoverable anyone can call `newTreasuryAsset`
to emit an event containing the treasury asset address. As malicious and/or
spam users can emit many treasury events there is a need for sensible
indexing and filtering of asset events to only trusted users. This contract
is agnostic to how that trust relationship is defined for each user.

Users must specify all the treasury assets they wish to redeem to the
`redeem` function. After `redeem` is called the redeemed tokens are burned
so all treasury assets must be specified and claimed in a batch atomically.
Note: The same amount of `RedeemableERC20` is burned, regardless of which
treasury assets were specified. Specifying fewer assets will NOT increase
the proportion of each that is returned.

`RedeemableERC20` has several owner administrative functions:
- Owner can add senders and receivers that can send/receive tokens even
  during `Phase.ONE`
- Owner can end `Phase.ONE` during `Phase.ZERO` by specifying the address
  of a distributor, which will have any undistributed tokens burned.
The owner should be a `Trust` not an EOA.

The redeem functions MUST be used to redeem and burn RedeemableERC20s
(NOT regular transfers).

`redeem` will simply revert if called outside `Phase.ONE`.
A `Redeem` event is emitted on every redemption (per treasury asset) as
`(redeemer, asset, redeemAmount)`.

## Variables
### `contract ITier` `tier`

### `uint256` `minimumTier`


## Events
### `Initialize(address sender, struct RedeemableERC20Config config)`

Results of initializing.




### `Sender(address sender, address grantedSender)`

A new token sender has been added.




### `Receiver(address sender, address grantedReceiver)`

A new token receiver has been added.





## Modifiers
### `onlyAdmin()`

Require a function is only admin callable.




## Functions
### `initialize(struct RedeemableERC20Config config_)` (external)

Mint the full ERC20 token supply and configure basic transfer
restrictions. Initializes all base contracts.




### `isReceiver(address maybeReceiver_) → bool` (public)

Check that an address is a receiver.
A sender is also a receiver.




### `grantReceiver(address newReceiver_)` (external)

Admin can grant an address receiver rights.




### `isSender(address maybeSender_) → bool` (public)

Check that an address is a sender.




### `grantSender(address newSender_)` (external)

Admin can grant an addres sender rights.




### `endDistribution(address distributor_)` (external)

The admin can forward or burn all tokens of a single address to end
`PHASE_DISTRIBUTING`.
The intent is that during `PHASE_DISTRIBUTING` there is some contract
responsible for distributing the tokens.
The admin specifies the distributor to end `PHASE_DISTRIBUTING` and the
forwarding address set during initialization is used. If the forwarding
address is `0` the rTKN will be burned, otherwise the entire balance of
the distributor is forwarded to the nominated address. In practical
terms the forwarding allows for escrow depositors to receive a prorata
claim on unsold rTKN if they forward it to themselves, otherwise raise
participants will receive a greater share of the final escrowed tokens
due to the burn reducing the total supply.
The distributor is NOT set during the constructor because it may not
exist at that point. For example, Balancer needs the paired erc20
tokens to exist before the trading pool can be built.




### `redeem(contract IERC20[] treasuryAssets_, uint256 redeemAmount_)` (external)

Wraps `_redeem` from `ERC20Redeem`.
Very thin wrapper so be careful when calling!



### `_beforeTokenTransfer(address sender_, address receiver_, uint256 amount_)` (internal)

Apply phase sensitive transfer restrictions.
During `Phase.ZERO` only tier requirements apply.
During `Phase.ONE` all transfers except burns are prevented.
If a transfer involves either a sender or receiver with the SENDER
or RECEIVER role, respectively, it will bypass these restrictions.


Hook that is called before any transfer of tokens. This includes
minting and burning.
Calling conditions:
- when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
will be transferred to `to`.
- when `from` is zero, `amount` tokens will be minted for `to`.
- when `to` is zero, `amount` of ``from``'s tokens will be burned.
- `from` and `to` are never both zero.
To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].

