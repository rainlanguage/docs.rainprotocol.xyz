


## Variables
### `mapping(address => address)` `crps`




## Functions
### `crp(address trust_) → address` (internal)

Immutable wrapper around `Trust.crp`.
Once a `Trust` reports a crp address the `TrustEscrow` never asks
again. Prevents a malicious `Trust` from changing the pool at some
point to attack traders.




