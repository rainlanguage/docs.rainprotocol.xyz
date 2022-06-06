



## Events
### `Redeem(address sender, address treasuryAsset, uint256 redeemAmount, uint256 assetAmount)`

Anon has burned their tokens in exchange for some treasury assets.
Emitted once per redeemed asset.



### `TreasuryAsset(address sender, address asset)`

Anon can notify the world that they are adding treasury assets to the
contract. Indexers are strongly encouraged to ignore untrusted anons.





## Functions
### `newTreasuryAsset(address newTreasuryAsset_)` (public)

Anon can emit a `TreasuryAsset` event to notify token holders that
an asset could be redeemed by burning `RedeemableERC20` tokens.
As this is callable by anon the events should be filtered by the
indexer to those from trusted entities only.




### `_redeem(contract IERC20[] treasuryAssets_, uint256 redeemAmount_)` (internal)

Burn tokens for a prorata share of the current treasury.

The assets to be redeemed for must be specified as an array. This keeps
the redeem functionality:
- Gas efficient as we avoid tracking assets in storage
- Decentralised as any user can deposit any asset to be redeemed
- Error resistant as any individual asset reverting can be avoided by
  redeeming againt sans the problematic asset.
It is also a super sharp edge if someone burns their tokens prematurely
or with an incorrect asset list. Implementing contracts are strongly
encouraged to implement additional safety rails to prevent high value
mistakes.
Only "vanilla" erc20 token balances are supported as treasury assets.
I.e. if the balance is changing such as due to a rebasing token or
other mechanism then the WRONG token amounts will be redeemed. The
redemption calculation is very simple and naive in that it takes the
current balance of this contract of the assets being claimed via
redemption to calculate the "prorata" entitlement. If the contract's
balance of the claimed token is changing between redemptions (other
than due to the redemption itself) then each redemption will send
incorrect amounts.




