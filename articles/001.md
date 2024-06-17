# Casper 2.0 Deep Dive I

## Introduction

Condor is the code name given to version 2.0 of the Casper platform, it represents a significant upgrade with a slew of new features accompanied by innumerable  optimisations & improvements.  This is the first article in an extended series that aims to provide a high to medium level insight into the extensive work that has gone into the Condor release.  By the end of the series, the astute reader should have gained a fairly deep understanding of the Casper 2.0 platform.  Ideally they will be ready to take on the challenge of contributing to the platform as either an operator, a DApp developer and/or a core contributor.  

In this article we examine the node software from the operator's perspective.  I.E. what does an out of the box Casper 2.0 node setup look like in comparison to a Casper 1.X setup ?  Let's begin by reviewing changes to the set of binaries, running processes, exposable ports, and API surface.

## Binaries, Processes, Ports & API's

In Condor the software has been factored out into three binaries, i.e. casper-node, casper-node-launcher and the new **casper-sidecar**.  Whilst the node process continues to be orchestrated by the node launcher, it's functionality has been stripped back to the bare minimum required to participate in the network and to act as a verifiable source of truth.  All **non-essential** work has been off-loaded to the sidecar- this includes the JSON-RPC API.

Decoupling the processing of essential from non-essential work has advantages.  Firstly an operator is granted a finer degree of control over their operational setup in terms of performance & security.  Secondly the JSON-RPC API can evolve independently of the core protocol, i.e. a change in the JSON-RPC will no longer trigger a protocol upgrade.  Lastly by stripping back the node's functionality to the essentials it is easier to build alternative protocol clients (e.g. Go, Carbon, Zig, C++ ...etc). 

Such decoupling extends to the physical processes within which the binaries are executing.  This allows the node and sidecar binaries to be deployed to either a single machine or a pair of machines. It should be noted that sidecar binds to a port expsoed by the node, thus the dependency is one way.  From the node's perspective the sidecar is simply another software agent binding to an exposed port.  

With respect to services an operator now has the option to enable the node's new **binary API service**.  This new service supports chain queries, node queries and transaction handling.  All data flowing in and out of this service is binary encoded.  This optimisation significantly reduces the cost of serialisation and deserialisation.    The sidecar is a consumer of this new service.

As before, with the exception of the node's protocol network port, an operator can opt out of running any of the services running behind exposed ports.  The following lists the set of services running upon the node and sidecar.

- **Node**

    - **Protocol**
        - Protocol peer to peer network
        - Mandatory
        - Default Port = 34553

    - **REST Server**
        - Convenience API suitable for curl & browsers
        - Optional
        - Default Port = 8888

    - **Binary Server**
        - Rich API for dispatching transactions into the network and for querying the node and/or chain state
        - Optional
        - Default Port = 7777

    - **SSE (Server Side Events) Server**
        - Realtime API of events emitted by the node when processing blocks and/or transactions
        - Optional
        - Default Port = 9999

- **Sidecar**

    - **JSON-RPC Server: Main**
        - Rich API for dispatching transactions into the network and for querying chain/node state
        - Optional
        - Default Port = 7777

    - **JSON-RPC Server: Speculative Execution**
        - Specialized API for speculatively executing a transaction
        - Optional
        - Default Port = 7778

### API Surface

Whilst changes to the API surface have been minimised, nevertheless there are several changes:

- API surface is now distributed over both the node and sidecar.

- API endpoint request/response data types have changed in some cases.

- Node binary API has been added.

- Node SSE API has been rationalised and now exposes a single event channel.

- JSON-RPC API has been moved to sidecar.  

- JSON-RPC API endpoints have been added and/or renamed.   

- Speculative Execution API has been moved to sidecar.  

The following summarises the new or renamed endpoints served by the various API servers at the time of writing.  We exclude the protocol endpoints as they are effectively internal to the system. 

- **Node**

    - **SSE (Server Side Events)**

        - Main.FinalitySignature
        - Main.Shutdown
        - Main.TransactionAccepted (rename)
        - Main.TransactionExpired (rename)
        - Main.TransactionProcessed (rename)

    - **Binary**

        - Get
            - Record
                - ApprovalsHashes
                - BlockHeader
                - BlockBody
                - BlockMetadata
                - ExecutionResult
                - FinalizedTransactionApprovals
                - Transaction
                - Transfer
            - Information
                - AvailableBlockRange
                - BlockHeader
                - BlockSynchronizerStatus
                - ChainspecRawBytes
                - ConsensusStatus 
                - ConsensusValidatorChanges
                - LastProgress
                - LatestSwitchBlockHeader
                - NetworkName
                - NextUpgrade
                - NodeStatus
                - Peers
                - ReactorState
                - SignedBlock
                - Transaction
                - Uptime
            - State
                - Balance
                - DictionaryItem
                - Item
                - ItemsByPrefix
                - AllItems
                - Trie
        - Try
            - AcceptTransaction
            - SpeculativeExec

- **Sidecar**

    - **JSON-RPC: Main**

        - account_put_transaction
        - info_get_transaction
        - query_balance_details
        - state_get_entity

    - **JSON-RPC: Speculative Execution**

        - speculative_exec_txn

## Summary

Condor is the code name given to version 2.0 of the Casper platform, it represents a significant upgrade with a slew of new features accompanied by innumerable  optimisations & improvements.  This was the first article in an extended series that aims to provide a high to medium level insight into the extensive work that has gone into the Condor release.  We examined the node software from the operator's perspective by reviewing changes to the set of binaries, running processes, exposable ports, and API surface.
 