---
slug: writing-a-game-economy-because-it-is-fun
title: "Writing a complete onchain game economy because it's great fun"
authors: dcatki
tags: [economy, game, expression]
---

# Writing a complete onchain game economy because it’s great fun

## Introduction

Josh has been working on a brainscan v0.0 where we we show an expression, written into a simple contract, in this case ERC20 emissions which is powered by the [Rain interpreter](https://docs.rainprotocol.xyz/blog/what-is-rain-interpreter).

The expression is written in Rain script, a spreadsheet like expression writer. A simulation runs real time to tell you the rules for the wallet connected to the site and the expression is deployable using the Deploy Emissions ERC20 button when ready.

If you aren’t feeling that creative (me) then you can look at recent expressions others have written.

![](https://i.imgur.com/utDlSJ5.jpg)

A big motivator behind Rain has been to make decentralized economies work for everybody, and game economies are a huge part of that. Some of the activities in a game economy we want to track are:

* Overall game currency design: overall supply, distribution by category, distribution phases
* Game energy currency: how much can a player ‘mint’, how much can a player ‘buy’, how much can the game ‘mint’
* Event credits: event currencies that can only be earned in a specific event
* Experience: how much experience the player has in the game
* Level: level within the game the player is currently at
* Assets: the assets in the game and how to get hold of them
* Forging / respeccing / adjusting: rules for letting go of some assets to get hold of others
* Lootboxes: randomised rewards we access through winning

In this screen we are focussed on overall game currency design. That means we want to define supply, distribution curves, categories of distribution and phases. That’s a lot to fit in to one contract, time for some hyper specialised solidity?

Well actually, using Rain script we can code all of this. And best of all we can share our work with others and borrow from the best plus deploy via the website so we’ve taken game currency design from a very long expensive process into something engaging, cheap, experimental and without smart contract developer effort. 

You can either jump on to the [Rain Toy Token](https://toy-token.on.fleek.co/) site and start playing around writing new expressions or using other people's expressions. Or you can follow the thread of the currencies I build.