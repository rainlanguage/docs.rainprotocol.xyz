---
layout: single
title:  "Rain Protocol: Domain Specific Language Opcodes"
date:   2022-01-21 13:00:23 +0000
categories: various
---

## Intro

One of the core goals of the Rain Protocol, is to provide tooling for businesses which also minimises security concerns, and removes (or reduces) the need for overly lengthy and expensive auditing.

Imagine a young child for whom a play-pen is created which will protect them from unforeseen harm so that they can focus on what is right in front of them without having to worry about danger.

'Domain Specific Language' is one of the ways we are working to solve this issue, a bit like how Excel has its own language for coding up spreadsheets.

In the case of Excel (as with Rain), if a user really wants to create more complex functionality, they can use 'macros' to do so, but they will not introduce vulnerabilities by using DSL functions like `=sum()`.

On a more technical level, the way we are forming this ease-of-use high-security system, is by having coded up our own Virtual Machine capable of processing Rain-Domain-Specific-Language opcodes.

Our long term goal is to create a '[Blockly][blockly]' interface, with which users can create programs in a highly user-friendly way, by dragging and dropping different blocks which are translated to code.

Our next article will look more specifically at setting up and writing a few code examples using this Domain Specific Language.

[blockly]: https://developers.google.com/blockly