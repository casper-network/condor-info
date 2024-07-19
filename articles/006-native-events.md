# Native Events on Casper 2.0

Contract level messages are a facility that enable a smart contract to emit a message while executing which eventually gets sent on the event stream and is visible from outside the network.

## Motivation

Under certain conditions, a contract may want to emit a message that an off-chain application wants to listen for and react to.

Contract-level events are not natively supported in Casper 1.x, so a workaround known as the [Casper Event Standard (CES)](https://github.com/make-software/casper-event-standard) was devised to provide support for events. The CES works by writing events to global state, and having clients consistently poll for new event data as it is emitted. While this approach *does* provide the full functionality of events, it is far from optimal due to the following drawbacks:

* <u>Higher gas payments</u>: Gas must be spent to store event data in global state.
* <u>Reduced security</u>: It is possible in some cases for a malicious actor to overwrite events on the blockchain, leading to uncertainty about an event's reliability when queried off-chain.
* <u>Permanence</u>: Since with CES events are written directly to global state, they are permanently queryable. Even if the data is deleted or overwritten, the data can be read by providing the [state root hash](https://docs.casper.network/concepts/global-state/) at the block of event emission.
* <u>Resource intensity</u>: Under the CES, events being written to the blockchain causes the global state to increase in size over time. Additionally, more computation is required to write data to the network than to broadcast it, leading to more expensive transactions.

In Casper 2.0, native contract-level events have been implemented under [CEP-88](https://github.com/casper-network/ceps/blob/master/text/0088-contract-level-messages.md). CEP-88 establishes a secure, one-way messaging channel between contracts and entities listening to a node's event stream. This standardized method of emitting contract-level events is built into the existing Casper Event Stream, requiring no additional features to Casper's SDKs.

## Design

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

### Records & Validation

When a new topic is registered, a unique identifier is composed from the address of the caller and the [blake2b](https://docs.casper.network/concepts/glossary/B/#blake2b) hash of the topic name. This key is saved to global state, and can be used to validate events emitted under the topic.

When an event is emitted during execution, a checksum is written to global state as opposed to the entirity of the message. This saves space, supports event validation and obscures the original message. Additionally, a value is incremented representing the order of that event's emission in its topic. Simply put, a `count` is recorded for every emission of an event of a given topic. For example:

| Topic    | Event Emitted | Event-Topic Index | Event-Topic Count |
| -------- | ------------- | ----------------- | ----------------- |
| ItemSold | AppleSold     | 0                 | 1                 |
| ItemSold | AppleSold     | 1                 | 2                 |
| ItemSold | BananaSold    | 0                 | 1                 |

*Note: Table signifies the order of transactions of a single block submitted by the proposer from earliest executing to latest.*

When an event is emitted and the **Event-Topic Index** is to be saved, the integer itself is combined with the timestamp of the block (block timestamp), the hash of the topic name, and the address of the contract to create a unique identifier for the event emission. This value is recorded and can be used later to validate an event and its time of emission.

### Transmission

Messages are passed by the execution engine to the node that sends them out on the event stream after execution is complete and committed. The messages sent out on the event stream contain the identity of the entity that emitted the message, the topic on which the message was emitted, the index of the message within the topic and the actual message payload.

## Emitting Events

Smart contracts on Casper are most commonly written using the [casper-contract](https://docs.rs/casper-contract/latest/casper_contract/) library or the [Odra](https://odra.dev/) framework, each of which has implemented higher-order functions for creating and emitting messages.

#### casper-contract

Creating a **topic**:

```rust
use casper_types::contract_messages::MessageTopicOperation;

let topic = "greetings";

runtime::manage_message_topic(topic, MessageTopicOperation.Add)
	.unwrap_or_revert();
```

Emitting an event:

```rust
runtime::emit_message(topic, &"Hello World!".to_string().into())
	.unwrap_or_revert();
```

You can explore the `manage_message_topic` and `emit_message` functions [here](https://github.com/casper-network/casper-node/blob/release-2.0.0-rc3/smart_contracts/contract/src/contract_api/runtime.rs#L489-L527).

## Observing Events

Events can be consumed client-side by listening to the event stream of an active node. Casper's SDKs include functions that make it easy to subscribe to an event stream and consume its inbound data. Listening for contract-level events will require subscribing to the *TransactionProcessed* channel:

```javascript
const { EventStream, EventName } = require("casper-js-sdk");
const CHANNEL = "TransactionProcessed";
const es = new EventStream("http://NODE_ADDRESS:9999/events/" + CHANNEL);
es.start();
es.subscribe(EventName.TRANSACTION_PROCESSED, eventHandler);

const eventHandler = (event) => {
    console.log(event);
};
```

Your event can then be discovered by checking for the topic name on the contract that emitted the event:

```javascript
const eventHandler = (event) => {
    if (event.body.TransactionProcessed.event) {
        // Perform an action
    }
};
```

## Final Thoughts

Before Casper 2.0, it was not possible to emit contract-level events directly through Casper's event stream. The Casper Event Standard was devised to provide a solution for event emission and observation, but it proved to be non-optimal when it came to security, privacy and cost. Casper 2.0 introduces native contract-level events, subverting the need for the CES and making it easy to send messages from the Casper Network to the outside world. Casper's SDKs also already have the functionality to handle incoming messages on the event stream, so refactoring your code to support native events is expected to be seamless.

By integrating Casper's native contract-level events into your application, your users' experience will be more fluid, protected, and less resourcefully expensive.
