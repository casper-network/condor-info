# Native Events on Casper 2.0

Contract level messages are a facility that enable a smart contract to emit a message while executing which eventually gets sent on the event stream and is visible from outside the network.

## Motivation

Under certain conditions, a contract may want to emit a message that an off-chain application wants to listen for and react to. Contract-level events are not natively supported in Casper 1.x, so a workaround known as the [Casper Event Standard (CES)](https://github.com/make-software/casper-event-standard) was devised to provide support for events. The CES works by writing events to global state, and having clients consistently poll for new event data as it comes in. While this approach *does* provide the full functionality of events, it is far from optimal due to the following drawbacks:

* <u>Higher gas payments</u>: Gas must be spent to store event data in global state.
* <u>Reduced security</u>: It is possible in some cases for a malicious actor to overwrite events on the blockchain, leading to uncertainty about an event's reliability when queried off-chain.
* <u>Permanence</u>: Since with CES events are written directly to global state, they are permanently queryable. Even if the data is deleted or overwritten, the data can be read by providing the [state root hash](https://docs.casper.network/concepts/global-state/) at the block of event emission.
* <u>Resource intensity</u>: Under the CES, events being written to the blockchain causes the global state to increase in size over time. Additionally, more computation is required to write data to the network than to broadcast it, leading to more expensive transactions.

In Casper 2.0, native contract-level events have been implemented under [CEP-88](https://github.com/casper-network/ceps/blob/master/text/0088-contract-level-messages.md). CEP-88 establishes a secure, one-way messaging channel between contracts and entities listening to a node's event stream. This standardized method of emitting contract-level events is built into the existing Casper Event Stream, requiring no additional features to Casper's SDKs.

## Emitting Events

### FFIs

From a contract point of view, the execution engine exposes new special purpose [FFIs](https://en.wikipedia.org/wiki/Foreign_function_interface) that allow for emitting messages. Two new FFIs are introduced to enable this feature:

- `casper_manage_message_topic`

  * A **topic** is an event categorization data structure. Events can be emitted and observed under their respective topics.
  * Topics are useful for situations where a contract wants to send out messages where progression is important (e.g. a token needs to be minted before it can be transferred) but also wants to send other unrelated messages on a different channel (e.g. changing settings or administrative tasks).

  - The number of topics a contract can register is limited by a [chainspec value](https://github.com/casper-network/casper-node/blob/feat-2.0/resources/local/chainspec.toml.in#L323).

- `casper_emit_message`

  * New messages are emitted under a pre-registered topic only.

  - The message emitted will be of a pre-defined message type which is an enum that will initially support sending out human readable strings but can be extended in the future to support other types.

> [!NOTE]
> These FFIs are accessible through abstractions in libraries like Casper's contract development library [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/) and [Odra](https://odra.dev/); it is not necessary to invoke the FFI manually.

When a new topic is registered, a checksum is written to global state as opposed to the entirity of the message, saving space and allowing for event verification. Events are identified serially per category per block, for example:

| Block # | Topic      | Event Emitted | Event ID |
| ------- | ---------- | ------------- | -------- |
| 123     | ItemSold   | AppleSold     | 1        |
| 123     | ItemSold   | AppleSold     | 2        |
| 123     | ItemBought | TomatoBought  | 1        |
