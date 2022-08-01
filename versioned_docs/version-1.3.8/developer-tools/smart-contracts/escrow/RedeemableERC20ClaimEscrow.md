Escrow contract for ERC20 tokens to be deposited and withdrawn against
redeemableERC20 tokens from a specific `Sale`.

When some token is deposited the running total of that token against the
trust is incremented by the deposited amount. When some `redeemableERC20`
token holder calls `withdraw` they are sent the full balance they have not
previously claimed, multiplied by their fraction of the redeemable token
supply that they currently hold. As redeemable tokens are frozen after
distribution there are no issues with holders manipulating withdrawals by
transferring tokens to claim multiple times.

As redeemable tokens can be burned it is possible for the total supply to
decrease over time, which naively would result in claims being larger
retroactively (prorata increases beyond what can be paid).

For example:
- Alice and Bob hold 50 rTKN each, 100 total supply
- 100 TKN is deposited
- Alice withdraws 50% of 100 TKN => alice holds 50 TKN escrow holds 50 TKN
- Alice burns her 50 rTKN
- Bob attempts to withdraw his 50 rTKN which is now 100% of supply
- Escrow tries to pay 100% of 100 TKN deposited and fails as the escrow
  only holds 50 TKN (alice + bob = 150%).

To avoid the escrow allowing more withdrawals than deposits we include the
total rTKN supply in the key of each deposit mapping, and include it in the
emmitted event. Alice and Bob must read the events offchain and make a
withdrawal relative to the rTKN supply as it was at deposit time. Many
deposits can be made under a single rTKN supply and will all combine to a
single withdrawal but deposits made across different supplies will require
multiple withdrawals.

Alice or Bob could burn their tokens before withdrawing and would simply
withdraw zero or only some of the deposited TKN. This hurts them
individually, so they SHOULD check their indexer for claimable assets in
the escrow before considering a burn. But neither of them can cause the
other to be able to withdraw more or less relative to the supply as it was
at the time of TKN being deposited, or to trick the escrow into overpaying
more TKN than was deposited under a given `Sale`.

A griefer could attempt to flood the escrow with many dust deposits under
many different supplies in an attempt to confuse alice/bob. They are free
to filter out events in their indexer that come from an unknown depositor
or fall below some dust value threshold.

Tokens may also exit the escrow as an `undeposit` call where the depositor
receives back the tokens they deposited. As above the depositor must
provide the rTKN supply from `deposit` time in order to `undeposit`.

As `withdraw` and `undeposit` both represent claims on the same tokens they
are mutually exclusive outcomes, hence the need for an escrow. The escrow
will process `withdraw` only if the `Sale` is reporting a complete and
successful raise. Similarly `undeposit` will only return tokens after the
`Sale` completes and reports failure. While the `Sale` is in active
distribution neither `withdraw` or `undeposit` will move tokens. This is
necessary in part because it is only safe to calculate entitlements once
the redeemable tokens are fully distributed and frozen.

Because much of the redeemable token supply will never be sold, and then
burned, `depositPending` MUST be called rather than `deposit` while the
raise is active. When the raise completes anon can call `sweepPending`
which will calculate and emit a `Deposit` event for a useful `supply`.

Any supported ERC20 token can be deposited at any time BUT ONLY under a
`Sale` contract that is the child of the `TrustFactory` that the escrow
is deployed for. `TrustEscrow` is used to prevent a `Sale` from changing
the pass/fail outcome once it is known due to a bug/attempt to double
spend escrow funds.

This mechanism is very similar to the native burn mechanism on
`redeemableERC20` itself under `redeem` but without requiring any tokens to
be burned in the process. Users can claim the same token many times safely,
simply receiving 0 tokens if there is nothing left to claim.

This does NOT support rebase/elastic token _balance_ mechanisms on the
escrowed token as the escrow has no way to track deposits/withdrawals other
than 1:1 conservation of input/output. For example, if 100 tokens are
deposited under two different trusts and then that token rebases all
balances to half, there will be 50 tokens in the escrow but the escrow will
attempt transfers up to 100 tokens between the two trusts. Essentially the
first 50 tokens will send and the next 50 tokens will fail because the
trust literally doesn't have 100 tokens at that point.

Elastic _supply_ tokens are supported as every token to be withdrawn must
be first deposited, with the caveat that if some mechanism can
mint/burn/transfer tokens out from under the escrow contract directly, this
will break internal accounting much like the rebase situation.

Using a real-world example, stETH from LIDO would be NOT be supported as
the balance changes every day to reflect incoming ETH from validators, but
wstETH IS supported as balances remain static while the underlying assets
per unit of wstETH increase each day. This is of course exactly why wstETH
was created in the first place.

Every escrowed token has a separate space in the deposited/withdrawn
mappings so that some broken/malicious/hacked token that leads to incorrect
token movement in/out of the escrow cannot impact other tokens, even for
the same trust and redeemable.


## Variables
### `mapping(address => mapping(address => mapping(uint256 => mapping(address => uint256))))` `withdrawals`

### `mapping(address => mapping(address => mapping(address => uint256)))` `pendingDeposits`

### `mapping(address => mapping(address => mapping(address => mapping(uint256 => uint256))))` `deposits`

### `mapping(address => mapping(address => mapping(uint256 => uint256)))` `totalDeposits`

### `mapping(address => mapping(address => mapping(uint256 => uint256)))` `remainingDeposits`


## Events
### `PendingDeposit(address sender, address sale, address redeemable, address token, uint256 amount)`

Emitted for every successful pending deposit.




### `Sweep(address sender, address depositor, address sale, address redeemable, address token, uint256 amount)`

Emitted every time a pending deposit is swept to a full deposit.




### `Deposit(address sender, address depositor, address sale, address redeemable, address token, uint256 supply, uint256 amount)`

Emitted for every successful deposit.




### `Undeposit(address sender, address sale, address redeemable, address token, uint256 supply, uint256 amount)`

Emitted for every successful undeposit.




### `Withdraw(address withdrawer, address sale, address redeemable, address token, uint256 supply, uint256 amount)`

Emitted for every successful withdrawal.






## Functions
### `depositPending(address sale_, address token_, uint256 amount_)` (external)

Depositor can set aside tokens during pending raise status to be swept
into a real deposit later.
The problem with doing a normal deposit while the raise is still active
is that the `Sale` will burn all unsold tokens when the raise ends. If
we captured the token supply mid-raise then many deposited TKN would
be allocated to unsold rTKN. Instead we set aside TKN so that raise
participants can be sure that they will be claimable upon raise success
but they remain unbound to any rTKN supply until `sweepPending` is
called.
`depositPending` is a one-way function, there is no way to `undeposit`
until after the raise fails. Strongly recommended that depositors do
NOT call `depositPending` until raise starts, so they know it will also
end.




### `sweepPending(address sale_, address token_, address depositor_)` (external)

Anon can convert any existing pending deposit to a deposit with known
rTKN supply once the escrow has moved out of pending status.
As `sweepPending` is anon callable, raise participants know that the
depositor cannot later prevent a sweep, and depositor knows that raise
participants cannot prevent a sweep. As per normal deposits, the output
of swept tokens depends on success/fail state allowing `undeposit` or
`withdraw` to be called subsequently.
Partial sweeps are NOT supported, to avoid griefers splitting a deposit
across many different `supply_` values.




### `deposit(address sale_, address token_, uint256 amount_)` (external)

Any address can deposit any amount of its own `IERC20` under a `Sale`.
The `Sale` MUST be a child of the trusted factory.
The deposit will be accounted for under both the depositor individually
and the trust in aggregate. The aggregate value is used by `withdraw`
and the individual value by `undeposit`.
The depositor is responsible for approving the token for this contract.
`deposit` is still enabled after the distribution ends; `undeposit` is
always allowed in case of a fail and disabled on success. Multiple
`deposit` calls before and after a success result are supported. If a
depositor deposits when a raise has failed they will need to undeposit
it again manually.
Delegated `deposit` is not supported. Every depositor is directly
responsible for every `deposit`.
WARNING: As `undeposit` can only be called when the `Sale` reports
failure, `deposit` should only be called when the caller is sure the
`Sale` will reach a clear success/fail status. For example, when a
`Sale` has not yet been seeded it may never even start the raise so
depositing at this point is dangerous. If the `Sale` never starts the
raise it will never fail the raise either.




### `undeposit(address sale_, address token_, uint256 supply_, uint256 amount_)` (external)

The inverse of `deposit`.
In the case of a failed distribution the depositors can claim back any
tokens they deposited in the escrow.
Ideally the distribution is a success and this does not need to be
called but it is important that we can walk back deposits and try again
for some future raise if needed.
Delegated `undeposit` is not supported, only the depositor can wind
back their original deposit.
`amount_` must be non-zero.
If several tokens have been deposited against a given trust for the
depositor then each token must be individually undeposited. There is
no onchain tracking or bulk processing for the depositor, they are
expected to know what they have previously deposited and if/when to
process an `undeposit`.




### `withdraw(address sale_, address token_, uint256 supply_)` (external)

The successful handover of a `deposit` to a recipient.
When a redeemable token distribution is successful the redeemable token
holders are automatically and immediately eligible to `withdraw` any
and all tokens previously deposited against the relevant `Sale`.
The `withdraw` can only happen if/when the relevant `Sale` reaches the
success distribution status.
Delegated `withdraw` is NOT supported. Every redeemable token holder is
directly responsible for being aware of and calling `withdraw`.
If a redeemable token holder calls `redeem` they also burn their claim
on any tokens held in escrow so they MUST first call `withdraw` THEN
`redeem`.
It is expected that the redeemable token holder knows about the tokens
that they will be withdrawing. This information is NOT tracked onchain
or exposed for bulk processing.
Partial `withdraw` is not supported, all tokens allocated to the caller
are withdrawn`. 0 amount withdrawal is an error, if the prorata share
of the token being claimed is small enough to round down to 0 then the
withdraw will revert.
Multiple withdrawals across multiple deposits is supported and is
equivalent to a single withdraw after all relevant deposits.




