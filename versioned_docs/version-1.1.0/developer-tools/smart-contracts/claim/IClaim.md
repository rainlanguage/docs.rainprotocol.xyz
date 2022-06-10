Embodies the idea of processing a claim for some kind of reward.



## Events
### `Claim(address sender, address claimant, bytes data)`

`Claim` is emitted whenever `claim` is called to signify that the claim
has been processed. Makes no assumptions about what is being claimed,
not even requiring an "amount" or similar. Instead there is a generic
`data` field where contextual information can be logged for offchain
processing.






## Functions
### `claim(address claimant, bytes data)` (external)

Process a claim for `claimant`.
It is up to the implementing contract to define what a "claim" is, but
broadly it is expected to be some kind of reward.
Implementing contracts MAY allow addresses other than `claimant` to
process a claim but be careful if doing so to avoid griefing!
Implementing contracts MAY allow `claim` to be called arbitrarily many
times, or restrict themselves to a single or several calls only.




