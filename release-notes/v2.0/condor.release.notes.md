# **Casper v2.0 - Release Notes**

**Release Date:** October/November 2024

We are excited to announce the release of **Casper v2.0 - formerly know as Condor**, which introduces a wide range of new features, improvements, and performance optimizations aimed at enhancing user experience and system efficiency. 


**Condor** was the code name given to the pre-release versions of the Casper platform v2.0. Casper 2.0 represents a significant upgrade with a slew of new features as well as optimizations & improvements to existing features. 

---

## Major Changes at a glance

### Architectural Changes

Casper v2.0 introduces a number of improvements aimed at removing some limitations of the Casper platform and dealing with technical debt. Some of the limitations in Casper 1.X were due to architectural decisions that impeded efforts to introduce new features without breaking existing systems. 

#### Casper Sidecar
In Casper 2.0, the existing RPC service has been moved outside of the node software itself. In Casper 1.X, the RPC service existed as an HTTP server which was built into the node software itself. This meant that the RPC server was tightly coupled to the node software, could not be updated without updating the node software, and executed in the same process space as the node. The result of this was that any extension of the RPC surface necessitated a full network upgrade to deliver. 

In Casper 2.0, the JSON RPC has been moved to a separate process, known as the [Sidecar](https://docs.casper.network/operators/setup/casper-sidecar/). This step brings a few improvements: 
 - It allows for better process isolation and makes it easier to run and debug node processes.
 - The Sidecar provides a way to surface Contract Level Events, which opens up some interesting possibilities for node interactions.
 - The separation of the Sidecar into a new codebase means that enhancements to the RPC API can now be accomplished without changing the node binary, necessitating a network upgrade. 

#### Expanded API Integration Options
Casper 2.0 introduces some extensions to the ways in which you can interact with the Casper Network.

#### Binary Port
We have added a brand new RPC option at the binary level, the [Binary Port API](https://github.com/casper-network/condor-info/blob/main/articles/062-binary-port.md). This allows you to communicate with the node without the need for JSON serialization, with improvements in performance. The adoption of a binary RPC protocol brings several benefits to the Casper network:

-- Reduced Network Congestion: The compact nature of binary encoding leads to smaller message sizes, decreasing bandwidth consumption and network strain. This is particularly valuable in scenarios with high transaction volumes or limited bandwidth.
-- Improved Node Responsiveness: While the node still needs to process requests, binary data is often faster to handle than JSON. This can lead to quicker response times from the node, enhancing overall network performance
-- Scalability: The efficiency gains from binary communication contribute to the network ability to scale and handle increased transaction loads without sacrificing performance.
-- Efficient Data Retrieval: The binary port allows querying raw data directly from the database. This means the node can provide raw bytes from storage without the overhead of deserialization, further contributing to performance improvements, especially for large data requests.

Interacting with the Casper Node using the Binary Port option is not the same as using the RPC. The Binary Port allows you to interact with the node on a much lower level, which allows for performance improvements and greater scalability. To avail of these advantages, a smaller, more focused API is exposed. To ease adoption of this interface, the [Casper Binary Port Client](https://github.com/casper-ecosystem/casper-binary-port-client) has been created. This library contains code which serves both as a repository of examples and demonstrations of how to connect to the Binary Port, and also serves as a client library to allow downstream applications to connect to the Binary Port and build functionality on top of it.  
 
#### Native Events
In Casper 1.X, there was no native option for emitting contract-level events in the node software. The best option available to developers looking to use this kind of functionality was the  [Casper Event Standard (CES)](https://github.com/make-software/casper-event-standard) created by Make Software. In Casper 2.0, We have added contract level events as a native citizen of the Casper node infrastructure. This brings some improvements and provides an alternative to the existing Casper Event Standard, which will remain available in the ecosystem. 

CES works by writing events to global state, and having clients consistently poll for new event data as it is emitted. While this approach *does* provide the full functionality of events, it is far from optimal. CES suffers from the following inherent limitations:

* <u>Higher gas payments</u>: Gas must be spent to store event data in global state.
* <u>Reduced security</u>: It is possible in some cases for a malicious actor to overwrite events on the blockchain, leading to uncertainty about an event's reliability when queried off-chain.
* <u>Permanence</u>: Since with CES events are written directly to global state, they are permanently queryable. Even if the data is deleted or overwritten, the data can be read by providing the [state root hash](https://docs.casper.network/concepts/global-state/) at the block of event emission.
* <u>Resource intensity</u>: Under the CES, events being written to the blockchain causes the global state to increase in size over time. Additionally, more computation is required to write data to the network than to broadcast it, leading to more expensive transactions.

In Casper 2.0, native contract-level events have been implemented under [CEP-88](https://github.com/casper-network/ceps/blob/master/text/0088-contract-level-messages.md). CEP-88 establishes a secure, one-way messaging channel between contracts and entities listening to a node's event stream. This standardized method of emitting contract-level events is built into the existing Casper Event Stream, requiring no additional features to Casper's SDKs.

Messages are passed by the execution engine to the node that sends them out on the event stream after execution is complete and committed. The messages sent out on the event stream contain the identity of the entity that emitted the message, the topic on which the message was emitted, the index of the message within the topic and the actual message payload. The contents of the event itself are *not* stored on-chain, but proofs are stored to allow for verification of events.

Events can be consumed client-side by listening to the event stream of an active node. Casper's SDKs include functions that make it easy to subscribe to an event stream and consume its inbound data. 

### Zug Consensus Protocol 
Casper 2.0 introduces a new consensus model known as Zug ([Whitepaper](https://arxiv.org/abs/2205.06314)). The Highway protocol is effective and secure, but resource-heavy. Zug is simpler and leaner than the Highway protocol upon which Casper was originally conceived, and as such allows for improvements in network efficiency and cohesion. This in turn facilitates eventual extension of the validator list, and finer-grained control over block times. 

#### Zug in brief 
In every round, the designated leader can sign a proposal message to suggest a block. The proposal also points to an earlier round in which the parent block was proposed.

Each validator then signs an echo message with the proposal's hash. Correct validators only sign one echo per round, so at most one proposal can get echo messages signed by a quorum. A quorum is a set of validators whose total weight is greater than (n + f) / 2, where n is the total weight of all validators and f is the maximum allowed total weight of faulty validators. Thus, any two quorums always have a correct validator in common. As long as n > 3f, the correct validators will constitute a quorum since (n + f) / 2 < n - f.

In cases where the network cannot reach consensus, for example, during a partition or failure, the round is skipped without penalizing the network’s performance. In other words, skippable rounds prevent the network from stalling.

A detailed discussion of the Zug consensus may be found both in the [Casper documentation](http://docs.casper.network/) and in the [Condor Blog](http://docs.casper.network/blog). For a detailed description of the protocol, please refer to the [Zug Whitepaper](https://arxiv.org/abs/2205.06314)

### New Transaction Model
Casper 2.0 introduces the concept of a [Transaction](https://docs.casper.network/transactions-and-transaction-lifecycle/#execution-semantics-transactions), which replaces the existing Deploy concept. Transactions are a new structure that allows several ways for users to make changes to global state. They allow for a variety of Wasm-less interactions with the blockchain. These new interactions are more efficient than Deploys and provide a level of convenience that was not previously available. More more details, see the list of available [Transaction Types](https://docs.casper.network/transactions/#transaction-types).

The existing Deploy model is deprecated as of Condor, and support will be removed entirely in a future major release. However, Condor will continue to accept valid Deploys and will attempt to execute them. Most existing deploys that function today will continue to do so. However, deploys that depend on a data type or FFI function that has been altered or removed will fail to execute.

#### Account/Contract unification 
> 
> N.B. This feature is not activated yet. See below for details

Casper 2.0 introduces significant changes in the representation and management of accounts and smart contracts, through the introduction of the `AddressableEntity` type. This new structure replaces the separate `AccountHash` and `ContractHash` used in Casper 1.x, bringing a unified approach to interaction with entities on the network. Contracts can now hold and manage funds directly through associated purses, similar to user accounts. They can also manage their own keys, enabling more sophisticated access control.

There are three fundamental types of Addressable Entity: 
- System Contracts
- User Accounts
- Deployed Smart Contracts

##### Account Unification upgrade path
This feature is a fundamental change to the way that smart contracts interact with the network and each other. Moving to this feature requires that applications using smart contracts must analyse, rework and retest their code in order to ensure that their applications will work as intended. Therefore, the initial release of Condor will not turn this feature on. At some point in the future, once agreed by the people participating in the network, an update to the network will be issued which activates this feature. This step will not be reversible. 

### Fee Elimination

Scheduled along with the release of Caper 2.0 is a change in the configuration of the Casper Network to use a model known as **Fee Elimination** for gas payments. 

> __Fee Elimination is the strategy of placing temporary holds on transactor balances corresponding to their incurred gas costs, instead of taking those costs from their on-chain balances__.

Under 1.x, transactors must pay for gas directly from their purse balances. With Fee Elimination on Casper 2.0, a hold is placed on the calculated **Gas Cost** for a configurable period of time known as the **Hold Period**. Fees are therefore not forfeited by transactors, and funds are not spent to execute transactions. The scheduled release of funds placed under a hold in this way is governed by the configuration of the chainspec. There are two options:

#### Accrued
100% of the hold is held until the hold expires. At any given point in the duration of the hold, the effective amount of the hold is 100%. At expiry, all of the funds are again made available to the transactor.

#### Amortized
The effective amount of the hold is reduced linearly over the course of the hold duration. At any point in the duration of the hold, the effective hold *amount* is proportional to the percentage of the hold *duration* that remains before expiry. 

### Virtual Machine 2.0

In Casper 2.0, we are introducing a change to the execution engine which allows transactors to specify which of many possible VMs they wish to target with their transaction. The current Casper VM will remain, and for the initial 2.0 release the new VM will not be enabled. We expect to enable VM 2.0 in a subsequent release cycle.  
‍
Among the improvements in VM 2.0 are: 

- Removal of URefs. URefs are complicated, hard to track, and ultimately unnecessary for most contracts.
- An improved Smart Contract programming model with an emphasis on high-level logic in place of low-level implementation details, leading to improved maintainability and more concise code.
- Backwards compatibility: VM2.0 contracts can call VM 1.X contracts, allowing the two systems to coexist during the transition period. 
- Transferable entry points, which allow sending tokens directly to contract entry points without needing a custom session code.
- VM2.0 code will all be valid Rust code, which allows it to execute without a complex system of test infrastructure and improves testability.
- Imeplemntation of some features which are familiar from other chains such as the `payable` keyword
- Schema generation from smart contracts, paving the way for improvements in tooling, discoverability and maintainability.
- Improved Smart Contract upgrade process.

### FFI Enhancements
Casper 2.0 FFI introduces access to some additional hashing algorithms, as well as providing access to information about the block info, including hash and parent block hash. 

### Userland CSPR Burning
In Casper 2.0 user contracts can burn CSPR token. This represents a significant change to the tokenomics of Casper 1.X
>TODO: More details on this (talk to Ed)

---

## Bug Fixes

Here you can find a [list](./bug-fixes.md) of the bug fixes included in Casper v2.0.

---

### Deprecations
The get_state_item RPC endpoint, while not yet deprecated, will be deprecated in a future release cycle uin favour of the more flexible get_global_state endpoint. This endpoint was initially deprecated, but was left in to the v2.0 release to maintain backwards compatibility while downstream development teams upgrade their code to reflect this change. For more details please see [here](https://github.com/casper-network/condor-info/discussions/2).

---

### Upcoming Features/updates
- Activation of the Contract/Account unification feature.
- Activation of Virtual Machine 2.0.
- Deprecation of the get_state_item endpoint.

---
### Further Reading

#### Official Documentation
For reference documentation on Casper including Condor/v2.0, please refer to the complete documentation available [here](http://docs.casper.network). Worth noting is that we have implemented documentation versioning, i.e. you may select the version of the documentation you wish to view from a drop-down in the top right of the navigation bar. This allows you to compare some topics with their former version to see what has changed. all Condor-related information is to be found in the v2.0.0 of the documentation.

#### Blog Articles and long-form discussions 
We have created a Blog area which exists alongside our documentation portal. [Casper blog](http://docs.casper.network/blog). These articles are intended to serve as a technical resource for those getting started with the features of Casper, and Condor. As such, they take a more long-form, narrative approach to discussing technical issues. You can filter for Condor-related articles by specifying the "condor" tag. [https://docs.casper.network/blog/tags/condor/](https://docs.casper.network/blog/tags/condor/)

#### Support Channels

To raise a request for an article or blog post, or to notify us of errata or omissions, use the Issues feature in the Casper Documentation site. [https://github.com/casper-network/docs-redux/issues](https://github.com/casper-network/docs-redux/issues)

You can use any of our official channels to ask for more information or raise an issue. 

| Description | Type | Link |
| ----- | ----- | ------ |
| Official Casper Support | Telegram | https://t.me/casperblockchainsupport |
| Condor-Specific Support | Telegram | https://t.me/CSPRCondor |
|  |  |  |

Thank you for using Casper v2.0 - Condor! We hope these new features and improvements enhance your experience. Please feel free to share feedback or report issues through our support channels.

Thank you,  
**Casper Development Team**

---


### Exhaustive list of PRs in this release:

Click [here for a list](./all-prs-md) of all the PRs contained in this release.


