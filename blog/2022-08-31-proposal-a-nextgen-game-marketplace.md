---
slug: proposal-a-nextgen-game-marketplace
title: Proposal&#58; A Rain-powered nextgen game marketplace
authors: dcatki
tags: [rain interpreter, games, marketplace, tokenomics]
---

# Proposal: A Rain-powered next gen game marketplace

_This post is synthesised from conversations with the Game7 DAO during their grants process._

## Describe the problem that your potential users are facing today.

Game economies are struggling to break the 1-2 token paradigm and so the ‘play-to-earn’ movement is being revisited with people not sure what will drive the next waves of adoption from web2 to web3 gaming.

Existing marketplaces have been focussed on monetisation and walled gardens rather than supporting the actual needs of game economies. Existing products don’t think through the user experience of actual games - they are investing all time and effort into auction and secondary market sales.

We have been focussing on the more complex and (we believe) exciting problem of how to use any currency or currencies to buy in-game assets like avatars, skins, land, vehicles, weapons; powered by any combination of rules to determine who can mint, how much they can mint and how much minting costs. 

This has been a bugbear of mine since [digging into web3 game economies in 2018](https://medium.com/embersword/announcement-david-atkinson-joins-the-ember-sword-team-d8e2caef25a2). After getting increasingly frustrated at the one or two token model, I started wondering whether there is a technical rather than conceptual limitation. Maybe if we related to smart contracts differently and could read and write them differently, the game economies we created would be more creative also.

## How does your work aim to address this problem? 

We are building an open source, clonable, unopinionated marketplace which allows game creators to create economies based on balancing supply of 1+ currencies and game assets, with asset and gameplay demand.

On the creator side this means being able to configure 1+ prices and infinite access rules for every game asset. Prices can be denominated in ERC20, 1155, or 721 and can include other in-game assets. Access rules can be anything that we can query relating to gamers’ wallets e.g. assets held, staked, or verified off-chain activity. Access rules are built by a UI rule builder to make it easy.

On the front end this means users can:
* See assets they are and aren’t eligible to mint
* See what they need to do to be able to earn the right to mint assets they aren’t already eligible for.
* See assets they can and can’t afford
* Mint an asset and pay with 1+ currencies

This turns a marketplace from a static asset purchase / sale engine into a dynamic reward / quest / exploration engine where the game can use new asset releases to incentivise players. It means that games can actually explore web3 release with web2 tokenonmics, and it’s all driven by simple expressions that anybody can read (see Rain purpose).

## How can someone start using your project once it’s available?

There will be an unopinionated Rain backend and frontend someone can use, or developers can use the contracts/subgraph/SDK to build their own. This will be a working alpha.

There are a series of advancements we have in mind that will take us from alpha > beta > production, which we can propose in future. But most importantly we’d also like to get feedback from the community and games during the alpha, which will help us push for upgrades driven by gamer demand.

The alpha marketplace focusses on game to user only; games can sell assets to players in many ways.
In a future scope for beta and v2 alpha is:
* Enhancements to alpha including shareable rules and addresses
* Secondary p2p market including transfer gating and pricing rules
* Scriptable price curves for primary and secondary market sales

Over the coming months, we look forward to working together to build the most feature-rich marketplace, which also happens to be open source and starts to power the most interesting titles out there.

## How is your work going to benefit the broader blockchain gaming space?

Game economics is one of the major barriers to web3 gaming adoption. This work and ongoing efforts of the Rain team to allow infinitely flexible game engines, which can be adopted and used by gamers, game creators, game studios and more.

Creating a world where assets can be deployed and sold by writing simple expressions, and where anyone can interpret the contract without needing the validation from an auditor ushers in a whole new realm of creativity for the web3 game industry.
