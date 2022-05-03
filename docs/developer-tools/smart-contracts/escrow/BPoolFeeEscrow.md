Escrow contract for fees IN ADDITION TO BPool fees.
The goal is to set aside some revenue for curators, infrastructure, and
anyone else who can convince an end-user to part with some extra tokens and
gas for escrow internal accounting on top of the basic balancer swap. This
is Rain's "pay it forward" revenue model, rather than trying to capture and
pull funds back to the protocol somehow. The goal is to incentivise many
ecosystems that are nourished by Rain but are not themselves Rain.

Technically this might look like a website/front-end prefilling an address
the maintainers own and some nominal fee like 1% of each trade. The fee is
in absolute numbers on this contract but a GUI is free to calculate this
value in any way it deems appropriate. The assumption is that end-users of
a GUI will not manually alter the fee, because if they would do that it
makes more sense that they would simply call the balancer swap function
directly and avoid even paying the gas required by the escrow contract.

Balancer pool fees natively set aside prorata for LPs ONLY. Our `Trust`
requires that 100% of the LP tokens and token supply are held by the
managing pool contract that the `Trust` deploys. Naively we could set a
fee on the balancer pool and have the contract that owns the LP tokens
attempt to divvy the volume fees out to FEs from some registry. The issue
is that the Balancer contracts are all outside our control so we have no
way to prevent a malicious end-user or FE lying about how they interact
with the Balancer pool. The only way to ensure that every trade accurately
sets aside fees is to put a contract in between the buyer and the pool
that can execute the trade sans fees on the buyers's behalf.

Some important things to note about fee handling:
- Fees are NOT forwarded if the raise fails according to the Trust. Instead
  they are forwarded to the redeemable token so buyers can redeem a refund.
- Fees are ONLY collected when tokens are purchased, thus contributing to
  the success of a raise. When tokens are sold there are no additional fees
  set aside by this escrow. Repeatedly buying/selling does NOT allow for
  wash trading to claim additional fees as the user must pay the fee in
  full in addition to the token spot price for every round-trip.
- ANYONE can process a claim for a recipient and/or a refund for a trust.
- The information about which trusts to claim/refund is available offchain
  via the `Fee` event.

We cannot prevent FEs implementing their own smart contracts to take fees
outside the scope of the escrow, but we aren't encouraging or implementing
it for them either.


## Variables
### `mapping(address => mapping(address => uint256))` `fees`

### `mapping(address => uint256)` `totalFees`


## Events
### `ClaimFees(address sender, address recipient, address trust, address reserve, uint256 claimedFees)`

A claim has been processed for a recipient.
ONLY emitted if non-zero fees were claimed.



### `RefundFees(address sender, address trust, address reserve, address redeemable, uint256 refundedFees)`

A refund has been processed for a `Trust`.
ONLY emitted if non-zero fees were refunded.



### `Fee(address sender, address recipient, address trust, address reserve, address redeemable, uint256 fee)`

A fee has been set aside for a recipient.





## Functions
### `claimFees(address recipient_, address trust_) → uint256` (public)

Anon can pay the gas to send all claimable fees to any recipient.
Caller is expected to infer profitable trusts for the recipient by
parsing the event log for `Fee` events. Caller pays gas and there is no
benefit to not claiming fees, so anon can claim for any recipient.
Claims are processed on a per-trust basis.
Processing a claim before the trust distribution has reached either a
success/fail state is an error.
Processing a claim for a failed distribution simply deletes the record
of claimable fees for the recipient without sending tokens.
Processing a claim for a successful distribution transfers the accrued
fees to the recipient (and deletes the record for gas refund).
Partial claims are NOT supported, to avoid anon griefing claims by e.g.
claiming 95% of a recipient's value, leaving dust behind that isn't
worth the gas to claim, but meaningfully haircut's the recipients fees.
A 0 value claim is a noop rather than error, to make it possible to
write a batch claim wrapper that cannot be griefed. E.g. anon claims N
trusts and then another anon claims 1 of these trusts with higher gas,
causing the batch transaction to revert.




### `refundFees(address trust_) → uint256` (external)

Anon can pay the gas to refund fees for a `Trust`.
Refunding forwards the fees as `Trust` reserve to its redeemable token.
Refunding does NOT directly return fees to the sender nor directly to
the `Trust`.
The refund will forward all fees collected if and only if the raise
failed, according to the `Trust`.
This can be called many times but a failed raise will only have fees to
refund once. Subsequent calls will be a noop if there is `0` refundable
value remaining.





### `buyToken(address feeRecipient_, address trust_, uint256 fee_, uint256 reserveAmountIn_, uint256 minTokenAmountOut_, uint256 maxPrice_) → uint256 tokenAmountOut, uint256 spotPriceAfter` (external)

Unidirectional wrapper around `swapExactAmountIn` for 'buying tokens'.
In this context, buying tokens means swapping the reserve token IN to
the underlying balancer pool and withdrawing the minted token OUT.

The main goal is to establish a convention for front ends that drive
traffic to a raise to collect some fee from each token purchase. As
there could be many front ends for a single raise, and the fees are
based on volume, the safest thing to do is to set aside the fees at the
source in an escrow and allow each receipient to claim their fees when
ready. This avoids issues like wash trading to siphon fees etc.

The end-user 'chooses' (read: The FE sets the parameters for them) a
recipient (the FE) and fee to be _added_ to their trade.

Of course, the end-user can 'simply' bypass the `buyToken` function
call and interact with the pool themselves, but if a client front-end
presents this to a user it's most likely they will just use it.

This function does a lot of heavy lifting:
- Ensure the `Trust` is a child of the factory this escrow is bound to
- Internal accounting to track fees for the fee recipient
- Ensure the fee meets the minimum requirements of the receiver
- Taking enough reserve tokens to cover the trade and the fee
- Poking the weights on the underlying pool to ensure the best price
- Performing the trade and forwading the token back to the caller

Despite the additional "hop" with the escrow sitting between the user
and the pool this function is similar or even cheaper gas than the
user poking, trading and setting aside a fee as separate actions.





