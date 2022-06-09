



## Events
### `NewNotice(address sender, struct Notice notice)`

Anyone can emit a `Notice`.
This is open ended content related to the subject.
Some examples:
- Raise descriptions/promises
- Reviews/comments from token holders
- Simple onchain voting/signalling
GUIs/tooling/indexers reading this data are expected to know how to
interpret it in context because the `NoticeBoard` contract does not.






## Functions
### `createNotices(struct Notice[] notices_)` (external)

Anyone can create notices about some subject.
The notice is opaque bytes. The indexer/GUI is expected to understand
the context to decode/interpret it. The indexer/GUI is strongly
recommended to filter out untrusted content.




