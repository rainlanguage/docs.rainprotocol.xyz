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
  flare: https://subgraphs.h20liquidity.tech/subgraphs/name/flare-0xb06202aA
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