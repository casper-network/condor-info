# Introducing Condor: Part One

## Introduction

Condor is the code name given to version 2.0 of the Casper platform, it represents a significant upgrade with a slew of new features accompanied by innumerable  optimisations & improvements.  This is the first article in an extended series that aims to provide a high to medium level insight into the extensive work has gone into the Condor release.  By the end of the series, the astute reader should have gained a fairly deep understanding of the Casper 2.0 platform.  Ideally they will be ready to take on the challenge of contributing to the platform as either an operator, a DApp developer and/or a core contributor.  

In this article we examine the node software from the operator's perspective.  I.E. what does an out of the box Casper 2.0 node setup look like in comparison to a Casper 1.X setup ?  Let's review changes to the set of running processes, the set of exposable ports, and the API surface as a whole.

## Binaries, Processes & Ports

In Condor the software has been factored out into three binaries, i.e. **casper-node**, **casper-node-launcher** and the new **casper-sidecar**.  Whilst the node  continues to be orchestrated by the node launcher, it's functionality has been stripped back to the bare minimum required to participate in the network and to act as a verifiable source of truth.  **All non-essential** work has been off-loaded to the sidecar, this includes the JSON-RPC API.  

By decoupling the processing of essential from non-essential work, an operator is granted a finer degree of control over their operational setup in terms of performance & security.  Furthermore the JSON-RPC API can evolve independently of the core protocol, with Casper 1.X a change in the JSON-RPC typically triggered a protocol upgrade - obviously a sub-optimal situation.  Lastly by stripping back the node's functionality to the essentials it should in principle be easier to build alternative protocol clients (e.g. Go, Carbon, Zig, C++ ...etc). 

Decoupling extends to the physical processes within which the binaries are executing, i.e. the node and sidecar binaries may be deployed to either a single machine or a pair of machines.  The decoupling is not absolute, in order to function the sidecar must bind to the node, i.e. it depends upon the node.  The dependency is one way, i.e. the node is oblivious to the sidecar, from it's perspective the sidecar is simply another software agent binding to an exposed port.  

With respect to ports, an operator now has the option to enable a port behind which runs the new **binary API server**.  This is a pure TCP/IP binary API that supports queries and transaction dispatch (live and speculative) - the sidecar is exclusively bound to this port.  With the exception of the node's protocol network port, an operator can opt out of running any of the services running behind exposed ports.  The following lists the set of services running behind the various ports exposed by both the node and the sidecar, note the node's new binary service.

- **Core**

    - **Network**
        - Protocol peer to peer network
        - Mandatory
        - Default Port = 34553

    - **REST**
        - Convenience API suitable for curl & browsers
        - Optional
        - Default Port = 8888

    - **Binary**
        - Rich API for dispatching transactions into the network and for querying the node and/or chain state
        - Optional
        - Default Port = 7777

    - **SSE (Server Side Events)**
        - Realtime API of events emitted by the node when processing blocks and/or transactions
        - Optional
        - Default Port = 9999

- **Sidecar**

    - **JSON-RPC**
        - Rich API for dispatching transactions into the network and for querying chain/node state
        - Optional
        - Default Port = 7777

    - **JSON-RPC (Speculative Execution)**
        - Specialized API for speculatively executing a transaction
        - Optional
        - Default Port = 7778

### API Surface

As may be observed the exposed API surface is now distributed over both the node and sidecar.  Whilst the node continues to serve protocol, SSE and REST requests, it can also now handle pure binary requests.  The JSON-RPC and speculative execution services have been moved to the sidecar.  The following is a high level insight to the set of methods exposed by each of the services.

- **Core**

    - **Network**
        - AcceptTransaction
        - SpeculativeExec
        - Default Port = 34553

    - **REST**
        - /status
        - /metrics
        - /validator-changes
        - /chainspec

    - **Binary**
        - 

    - **SSE (Server Side Events)**
        - Realtime API of events emitted by the node when processing blocks and/or transactions
        - Optional
        - Default Port = 9999

- **Sidecar**

    - **JSON-RPC**
        - Rich API for dispatching transactions into the network and for querying chain/node state
        - Optional
        - Default Port = 7777

    - **JSON-RPC (Speculative Execution)**
        - Specialized API for speculatively executing a transaction
        - Optional
        - Default Port = 7778


### Configuration

#### Chainspec

At the network level the chainspec.toml continues to be the primary configuration artefact.  Whilst it's high level structure remains braodly similar, there are new configuration sections and 

#### Node

The core node configuration file continues to be a toml file that the node operator is at perfectly liberty to edit as they see fit.  Typically an operator will make modifications such as:

- Enabling or disabling optional API servers.
- Specifying location on disk of node storage.
- Specifying location on disk of consensus traffic signing keys.

#### Sidecar
