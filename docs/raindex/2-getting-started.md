---
sidebar_position: 2
title: Getting started
description: A guide to getting started with Raindex.
---

<div style={{ position: 'relative', paddingBottom: '64.63%', height: 0 }}>
    <iframe
      src="https://www.loom.com/embed/fca750f31f0a43258891cea0ddacb588?sid=60d203be-a4a0-4597-ab18-5ab43fc10516"
      frameborder="0"
      allowFullScreen
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    ></iframe>
  </div>

### Download the app

First, head to the [download page](./1-download.md) and get a copy of the app.

### Settings

When you open the app for the first time you won't see any orders or vaults. This is because there can be many Raindex orderbook contracts across many chains, so you'll need to set them up.

Head to the settings page (link in the sidebar of the app), paste in the settings below and click 'Apply settings'.

These are example settings for Raindex contracts currently deployed, but new versions are being deployed often so head over to the [Rainlang Telegram](https://t.me/+w4mJbCT6IfI2YTU0) to keep up with updates.

```
networks:
  polygon:
    rpc: https://rpc.ankr.com/polygon
    chain-id: 137
    network-id: 137
    currency: MATIC
  mainnet:
    rpc: https://1rpc.io/eth
    chain-id: 1
    network-id: 1
    currency: ETH
  arbitrum-one:
    rpc: https://1rpc.io/arb
    chain-id: 42161
    network-id: 42161
    currency: ETH
  flare:
    rpc: https://rpc.ankr.com/flare
    chain-id: 14
    network-id: 14
    currency: FLR
  bsc:
    rpc: https://1rpc.io/bnb
    chain-id: 56
    network-id: 56
    currency: BNB
  base:
    rpc: https://rpc.ankr.com/base
    chain-id: 8453
    network-id: 8453
    currency: ETH
  sepolia:
    rpc: https://rpc.ankr.com/eth_sepolia
    chain-id: 11155111
    currency: ETH

subgraphs:
  polygon: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-matic-0xc95A5f8e/1.0.0/gn
  mainnet: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-mainnet-0xf1224A48/1.0.0/gn
  arbitrum-one: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-arb-0x90CAF23e/1.0.0/gn
  flare: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-flare-0xb06202aA/1.0.0/gn
  bsc: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-bsc-0xb1d6D105/1.0.0/gn
  base: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-base-0x2AeE87D7/1.0.0/gn
  sepolia: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/ob-sepolia-0xfca89cD1/0.0.2/gn
  
metaboards:
  flare: http://subgraphs.h20liquidity.tech/subgraphs/name/flare-mb-0x59401C93
  sepolia: https://api.goldsky.com/api/public/project_clv14x04y9kzi01saerx7bxpg/subgraphs/test-mb-sepolia/0.0.1/gn

orderbooks:
  polygon:
    address: 0xc95A5f8eFe14d7a20BD2E5BAFEC4E71f8Ce0B9A6
    network: polygon
    subgraph: polygon
  mainnet:
    address: 0xf1224A483ad7F1E9aA46A8CE41229F32d7549A74
    network: mainnet
    subgraph: mainnet
  arbitrum-one:
    address: 0x90CAF23eA7E507BB722647B0674e50D8d6468234
    network: arbitrum-one
    subgraph: arbitrum-one
  flare:
    address: 0xb06202aA3Fe7d85171fB7aA5f17011d17E63f382
    network: flare
    subgraph: flare
  bsc:
    address: 0xb1d6D10561D4e1792A7c6B336b0529e4bFb5Ea8F
    network: bsc
    subgraph: bsc
  base:
    address: 0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76
    network: base
    subgraph: base
  sepolia:
    address: 0x5CeEe9F4F49C106D5Bc049C8D649C332E6d365ad
    network: sepolia
    subgraph: sepolia

deployers:
  polygon:
    address: 0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E
    network: polygon
  mainnet:
    address: 0x56Fa1748867fD547F3cc6C064B809ab84bc7e9B9
    network: mainnet
  arbitrum-one:
    address: 0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76
    network: arbitrum-one
  flare:
    address: 0xE8Fe3fa05Abd468105d659D42a679E0505E2Be9f
    network: flare
  bsc:
    address: 0x1eFd85E6C384fAD9B80C6D508E9098Eb91C4eD30
    network: bsc
  base:
    address: 0xfca89cD12Ba1346b1ac570ed988AB43b812733fe
    network: base
  sepolia:
    address: 0x017F5651eB8fa4048BBc17433149c6c035d391A6
    network: sepolia
```

### Deploying your first order

You should now see orders and vaults across multiple networks on the Orders and Vaults pages.

Try deploying your first order by following one of [the examples](./example-strats/1-examples.md).

### Contract addresses by networks for reference.OrderBook

| Network | Chain Id | OrderBook | RainterpreterExpressionDeployerNPE2 | RouteProcessorOrderBookV3ArbOrderTaker | OrderBookSubParser | UniswapWords | 
| ------- | -------- | --------- | ----------------------------------- | -------------------------------------- | ------------------ | ------------ |
| Arbitrum | 42161 | [0x90CAF23eA7E507BB722647B0674e50D8d6468234](https://arbiscan.io/address/0x90caf23ea7e507bb722647b0674e50d8d6468234#code) | [0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76](https://arbiscan.io/address/0x2aee87d75cd000583daec7a28db103b1c0c18b76#code) | [0xf382cbF44901cD26D14B247F4EA7260ee8041157](https://arbiscan.io/address/0xf382cbF44901cD26D14B247F4EA7260ee8041157#code) | [0x23F77e7Bc935503e437166498D7D72f2Ea290E1f](https://arbiscan.io/address/0x23f77e7bc935503e437166498d7d72f2ea290e1f) | [0x5Cf7d0a8c61c8dcC6b0ECB281dF1C17264C2A517](https://arbiscan.io/address/0x5cf7d0a8c61c8dcc6b0ecb281df1c17264c2a517) |
| Base | 8453 | [0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76](https://basescan.org/address/0x2aee87d75cd000583daec7a28db103b1c0c18b76#code) | [0xfca89cD12Ba1346b1ac570ed988AB43b812733fe](https://basescan.org/address/0xfca89cd12ba1346b1ac570ed988ab43b812733fe#code) | [0x199b22ce0c9fD88476cCaA2d2aB253Af38BAE3Ae](https://basescan.org/address/0x199b22ce0c9fD88476cCaA2d2aB253Af38BAE3Ae#code) | [0xee873E21F8a6A256cb9f53BE491E569eA6cdd63E](https://basescan.org/address/0xee873e21f8a6a256cb9f53be491e569ea6cdd63e#code) | [0x22410e2a46261a1B1e3899a072f303022801C764](https://basescan.org/address/0x22410e2a46261a1b1e3899a072f303022801c764#code) |
| Binance Smart Chain | 56 | [0xb1d6D10561D4e1792A7c6B336b0529e4bFb5Ea8F](https://bscscan.com/address/0xb1d6d10561d4e1792a7c6b336b0529e4bfb5ea8f) | [0x1eFd85E6C384fAD9B80C6D508E9098Eb91C4eD30](https://bscscan.com/address/0x1efd85e6c384fad9b80c6d508e9098eb91c4ed30#code) | [0xaCD99A1BE78926b05De19237E2C35B2eDa0292B8](https://bscscan.com/address/0xaCD99A1BE78926b05De19237E2C35B2eDa0292B8#code) | [0x90CAF23eA7E507BB722647B0674e50D8d6468234](https://bscscan.com/address/0x90caf23ea7e507bb722647b0674e50d8d6468234) | [0xee873E21F8a6A256cb9f53BE491E569eA6cdd63E](https://bscscan.com/address/0xee873e21f8a6a256cb9f53be491e569ea6cdd63e#code) |
| Ethereum | 1 | [0xf1224A483ad7F1E9aA46A8CE41229F32d7549A74](https://etherscan.io/address/0xf1224a483ad7f1e9aa46a8ce41229f32d7549a74#code) | [0x56Fa1748867fD547F3cc6C064B809ab84bc7e9B9](https://etherscan.io/address/0x56Fa1748867fD547F3cc6C064B809ab84bc7e9B9#code) | [0x96C3673Ee4B0d5303272193BaB0c565B7ce58D7A](https://etherscan.io/address/0x96C3673Ee4B0d5303272193BaB0c565B7ce58D7A#code) | [0xFCe5E9F48049f3D8850C2C5fd7AD792F10B36326](https://etherscan.io/address/0xFCe5E9F48049f3D8850C2C5fd7AD792F10B36326#code) | [0xF1F6cC9376e4A79794BCB7AC451D79425cB381b0](https://etherscan.io/address/0xF1F6cC9376e4A79794BCB7AC451D79425cB381b0#code) |
| Flare | 14 | [0xb06202aA3Fe7d85171fB7aA5f17011d17E63f382](https://flarescan.com/address/0xb06202aA3Fe7d85171fB7aA5f17011d17E63f382) | [0xE8Fe3fa05Abd468105d659D42a679E0505E2Be9f](https://flarescan.com/address/0xE8Fe3fa05Abd468105d659D42a679E0505E2Be9f) | [0x56394785a22b3BE25470a0e03eD9E0a939C47b9b](https://flarescan.com/address/0x56394785a22b3BE25470a0e03eD9E0a939C47b9b) | [0x77991674ca8887D4ee1b583DB7324B41d5f894c4](https://flarescan.com/address/0x77991674ca8887D4ee1b583DB7324B41d5f894c4) | FTSO words : [0x57c613381deadaE520eC33556C1d51c9Dcb0adb3](https://flarescan.com/address/0x57c613381deadaE520eC33556C1d51c9Dcb0adb3) |
| Polygon | 137 | [0xc95A5f8eFe14d7a20BD2E5BAFEC4E71f8Ce0B9A6](https://polygonscan.com/address/0xc95A5f8eFe14d7a20BD2E5BAFEC4E71f8Ce0B9A6#code) | [0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E](https://polygonscan.com/address/0xf77b3c3f61af5a3ce7f7ce3cffc117491104432e#code) | [0x9a8545FA798A7be7F8E1B8DaDD79c9206357C015](https://polygonscan.com/address/0x9a8545FA798A7be7F8E1B8DaDD79c9206357C015#code) | [0x1fA67aEe8BB29B3144ebAAECe51Fce06BF903929](https://polygonscan.com/address/0x1fA67aEe8BB29B3144ebAAECe51Fce06BF903929#code) | [0xb1d6D10561D4e1792A7c6B336b0529e4bFb5Ea8F](https://polygonscan.com/address/0xb1d6d10561d4e1792a7c6b336b0529e4bfb5ea8f) |
| Oasis Sapphire | 23294 | [0x446e97161A96F6D762e92e770D10359d15ba3d35](https://explorer.oasis.io/mainnet/sapphire/address/0x446e97161A96F6D762e92e770D10359d15ba3d35) | [0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E](https://explorer.oasis.io/mainnet/sapphire/address/0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E/code#code) | NA |[0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76](https://explorer.oasis.io/mainnet/sapphire/address/0x2AeE87D75CD000583DAEC7A28db103B1c0c18b76)
| Songbird | 19 | [0x8853D126bC23A45B9f807739B6EA0B38eF569005](https://songbird-explorer.flare.network/address/0x8853D126bC23A45B9f807739B6EA0B38eF569005) | [0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E](https://songbird-explorer.flare.network/address/0xF77b3c3f61af5a3cE7f7CE3cfFc117491104432E) | NA | [0xd19581a021f4704ad4eBfF68258e7A0a9DB1CD77](https://songbird-explorer.flare.network/address/0xd19581a021f4704ad4eBfF68258e7A0a9DB1CD77) | FTSO words : [0xe4064e894DB4bfB9F3A64882aECB2715DC34FaF4](https://songbird-explorer.flare.network/address/0xe4064e894DB4bfB9F3A64882aECB2715DC34FaF4) |



