---
layout: single
title:  "Rain Protocol: The Graph Overview"
date:   2022-01-28 14:00:23 +0000
categories: various
---

## The Graph and Subgraphs
[The Graph][the-graph] is a Web3.0 service which aims to solve the need for speedily answering questions about the 'state' of data stored on a blockchain. They describe themselves as an, “Indexing protocol for querying networks like Ethereum and IPFS”; as, “APIs for a vibrant decentralized future”; where, “Anyone can build and publish open APIs, called [Subgraphs][subgraph], making data easily accessible”.

As they say, the Graph makes it easy for anyone to build and host what are called ‘Subgraphs’, which are essentially open API endpoints to indexed data which is: “Stored and processed on open networks with verifiable integrity” (such as IPFS). There are plenty of Subgraphs with queryable endpoints already available for most well known Web3 services such as [ENS][ens] and [Uniswap][uniswap].


## Indexing in Web2.0
Making data retrievable in an instant, is essential when working with enormous sets of data (such as literally all the content on the Internet). When you ask a question using a search engine (such as Google or DuckDuckGo), every single web page (server) on the internet is not scanned there and then to deliver a result to your query - otherwise you would be waiting forever for that recipe!

What does happen when you make a search using a search engine, is that a constantly-updated-database (like an Index in a book) is instead queried so that results are delivered quickly. These Indexes are usually centrally owned by the search engine company, however with the Graph, the underlying infrastructure is built in a decentralised way.


## Indexing in Web3.0
Blockchain networks are no exception when it comes to needing some sort of indexing. These constantly-updated enormous ledgers of transactions processed by smart contracts, produce a lot of data and information, just like webpages, and therefore also need to be indexed in order to be able to answer important questions such as "How many NFTs do I have".

In order to answer some of these questions without an indexing service, a developer would have to make multiple queries about transactions relating to specific smart contracts from specific wallet address; and then the current ‘state’ of who owns what would then need to be deciphered. The Graph makes this easier by allowing systems to be built which record data separately in an ordered way.

## Rain Subgraph

The Rain Protocol is no exception regarding the need for indexing. We have built out our own Subgraph [available here][rain-subgraph] which can be used for answering questions such as: "Which raises have happened/are happening across every frontend?", "Which projects are nearly seeded and which have the highest seed fees?", and "Who are the biggest funders across the whole ecosystem?".

In future articles we will give some examples of how to create some of these queries if you are a developer, but if you are already familiar with writing graphql, then you can already use the tools available on [our Subgraph][rain-subgraph] in order to experiment with what is currently possible using our tooling. And as always, drop into our [Discord][discord] for dev chat about our tooling! Happy BUIDLING. 

[the-graph]: https://thegraph.com/en/
[subgraph]: https://thegraph.com/docs/en/developer/define-subgraph-hosted/
[ens]: https://thegraph.com/explorer/subgraph?id=0x06b3a0712f26c7e72dc379ca80915c67c24eff64-1&view=Overview
[uniswap]: https://thegraph.com/explorer/subgraph?id=0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2&view=Overview
[rain-subgraph]: https://thegraph.com/hosted-service/subgraph/beehive-innovation/rain-protocol
[discord]: https://discord.gg/dzYS3JSwDP
