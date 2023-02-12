





## Functions
### `with(Seed seed_, uint256 val_) → Seed` (internal)

Generates a new unpredictable, cryptographic strength seed by hashing
an existing seed with some value. All values used to build the new seed
are equally valid due to hashing guarantees but of course same seed and
value will give the same output. That is to say, `with` is entirely
deterministic for any given inputs. In this context "unpredictable"
means, "unpredictable provided you don't know both seed and val".




