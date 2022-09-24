---
slug: flow-dao-tournament
title: "Flow DAO Tournament"
authors: thedavidmeister
tags: [flow, dao, tournament]
---

# Flow DAO Tournament

As the Flow contracts progress through the QA process and test coverage improves, we can start to talk about things to do with Flow.

Yes there's all the marketplace, escrow, sale, mint type stuff you'd expect.

Maybe we can do something a little different and fun too?

## Flow DAO

Start with a normal DAO governance process.

Let's not go into specifics here, choose your favourite mechanism, anything that allows voting based on token ownership.

Once you have that contract, add an interpreter and flow stack handling.

Make sure that the outcome of the flow stack can also mint and burn the voting token itself.

## Flow governance

OK so here we are going to set a few rules.

0. There is some periodic unstoppable voting period, perhaps daily or weekly
1. Each period one flow expression may be added or removed from the list of flows

Feel free to put restrictions on who may propose expressions, or not, a total free for all is probably most interesting and inclusive. The goal is to get people enjoying and expressing themselves, not to pump and dump some token.

## Flow tournament

Deploy the flow contract with a starting flow expression that allows open access. Something like "every address can mint 1 token every day for themselves".

Send some widely accepted and valued token to the flow contract, e.g. 1 ETH. This will be the prize.

The game is to socially engineer all other token holders into accepting and voting in expressions that allow a governance attack, and claim the prize.

Rinse and repeat. The more rounds, and higher the stakes, hopefully the more creative and interesting the tournament becomes for people as more creative and sneaky expressions are invented.

Over time perhaps there are even integrations with verify to mitigate sybils, communication channels backed by NoticeBoard, etc.