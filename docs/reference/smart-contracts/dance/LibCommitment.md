





## Functions
### `eq(Commitment a_, Commitment b_) → bool` (internal)

Equality check for commitments.




### `fromSecret(Secret secret_) → Commitment` (internal)

Build the commitment for a secret.
Standard commitment build is by hashing the secret as bytes.
DO NOT EXPOSE THIS ONCHAIN. Replicate the functionality offchain so it
can and WILL be run locally to the secret generation process.
It is far too difficult to ensure that secrets will stay secret if
users are expected to be forwarding them around to RPCs etc. just to
find the value of their commitments.
DO NOT SEND SECRETS ANYWHERE, LEAVE THEM WHERE YOU MADE THEM.
DO NOT REUSE SECRETS, GENERATE A NEW ONE FOR EVERY COMMITMENT.
Of course, you MAY send a secret if and only if it is being revealed as
part of a dance.



### `nil() → Commitment` (internal)

The nil valued commitment.
No secret can match this commitment, or at least probably nobody knows
the secret that does match this commitment.




