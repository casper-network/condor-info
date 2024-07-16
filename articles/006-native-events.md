# Native Events on Casper 2.0

Contract level messages are a facility that enable a smart contract to emit a message while executing which eventually gets sent on the event stream and is visible from outside the network.

## Motivation

Under certain conditions, a contract may want to emit a message that an off-chain application may want to listen for and react to. Contract-level events are not natively supported in Casper 1.x, so a workaround, known as the [Casper Event Standard (CES)](https://github.com/make-software/casper-event-standard) was devised to provide support for event polling. While the CES works, it is far from optimal for the following reasons:

> OUTDATED
>
> Emitting smart contract level events is an important part of a blockchain's functionality. Events provide a way to notify off-chain applications of state-changes that take place on the blockchain. In Casper 1.x, contract-level events were not natively supported. A workaround, known as the [Casper Event Standard](https://github.com/make-software/casper-event-standard) (CES) was created. The CES worked by creating a standardized structure with which developers could register their own events. Under the hood, the CES simply stored the event data in specialized dictionaries that server-side event streams could listen to. This works, but can be insecure if external, foreign contract(s) are called by the original contract, as there is no way to guarantee that the external contract didn't emit a message of its own.
>
> In Casper 2.0, native contract-level events have been implemented under [CEP-88](https://github.com/casper-network/ceps/blob/master/text/0088-contract-level-messages.md). CEP-88 establishes a secure, one-way messaging channel between contracts and entities listening to a node's event stream. This standardized method of defining contract-level events is built right into the existing Casper event stream, making it automatically supported by Casper's SDKs.
