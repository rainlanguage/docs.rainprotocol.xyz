---
sidebar_position: 1
---

# Rain Protocol

Build Your Economy

---

## Rain Stack

* [Smart Contract docs][smart-contracts]
* [Subgraph][subgraph], [Polygon Subgraph][polygon-subgraph] ([Mumbai Testnet Subgraph][mumbai-subgraph])
* [Github][github]

## Usage Notes

Always use the SDK when you are making calls which make changes to the state of the blockchain (e.g. redeeming your funds from an `Escrow`, or making a purchase in a `Sale`). For querying read only data, in nearly all cases it's better to use the [Subgraph][sugraph] ([Polygon Subgraph][polygon-subgraph]), especially as this can prevent cross-block inconsistencies when fetching multiple types of data.


## How to Install and Use the SDK

Simply run (if using npm):
`npm install rain-sdk`

Import In Javascript as follows; `import * as rainSDK from 'rain-sdk'`

The sdk can then be used as follows `rainSDK.Sale.deploy(..`

See our [Guides][guides] for examples of how to use.


## Community

Join our community here: [Discord][discord]


[smart-contracts]: https://docs.rainprotocol.xyz/smart-contracts/claim/EmissionsERC20

[//]: # (todo add this to environment variables)
[subgraph]: https://thegraph.com/hosted-service/subgraph/beehive-innovation/rain-protocol
[polygon-subgraph]: https://thegraph.com/hosted-service/subgraph/beehive-innovation/rain-protocol-v2-polygon
[mumbai-subgraph]: https://thegraph.com/hosted-service/subgraph/beehive-innovation/rain-protocol-v2-mumbai
[github]: https://github.com/beehive-innovation/rain-protocol
[guides]: https://docs.rainprotocol.xyz/guides/Frontend/using-the-sdk-to-deploy-your-first-rain-contract
[discord]: https://discord.gg/dzYS3JSwDP