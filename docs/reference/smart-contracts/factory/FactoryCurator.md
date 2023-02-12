Various frontends and toolkits MAY want to charge a fee for the
service of providing a premium user exerience when deploying children from
factories. Users that can directly interact with factory contracts or who
are willing to use basic frontends can bypass the `FactoryCurator`. Any user
of a premium frontend will need to pay for the curation unless they tamper
with the transaction presented to them by the frontend at moment of deploy.
Most users of a premium frontend SHOULD be willing to pay the curation fee
or at least are not technical enough to modify transaction inputs manually.
The reliability of the curation fees MUST NOT be assumed to be 100%
guaranteed, much as other fees collected in Rain, e.g. sale fees.
Curators can also use tier contracts to gate access to curated child
deployments which may help build exclusivity features into their services
and to meet various geopolitical and regulatory requirements.

A single `FactoryCurator` instance is sufficient to service arbitrarily many
curators and factories. First curators (or their representative) registers
themselves and their terms against the `FactoryCurator`, this assigns an ID
to their configuration. Each user then provides the same terms and ID as
acceptance of the curation conditions, which then forwards tokens and
enforces tier restrictions.



## Events
### `RegisterCuration(address sender, uint256 id, struct CurationConfig config)`

Emitted when a curator registers their terms and conditions with the
`FactoryCurator` contract.






## Functions
### `registerConfig(struct CurationConfig config_) → uint256 id_` (external)

Anyone can register curation config that can later be referenced by a
user. The registrant MAY NOT be the curator because the curator is free
to ignore any registered config. Many registered configurations may
reference any given curator and the curator's preferred one will be
handed to the user when a curated child is deployed.




### `createChild(uint256 id_, struct CurationConfig config_, bytes createChild_) → address` (external)

Curated wrapper around IFactory.createChild.
If a user chooses to call this instead of the underlying factory and
they provide a config ID that references a curator, they MUST provide
matching configuration that was registered. This allows curators to be
confident that everyone using their config id has the same curation
rules applied to the deployment.
If the curation config matches then the user will have the fee forwarded
to the curator and the call will revert if the user does not hold the
minimum tier on the tier contract. The user MUST approve the fee before
the `FactoryCurator` can transfer it.




