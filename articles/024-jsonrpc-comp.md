# A comparison of the node JSON-RPC from Casper 1.x to Casper 2.0 (Condor)

## Introduction

This article is intended for developers consuming the Condor JSON RPC, such as dApp developers, SDK developers, or others relying on the JSON-RPC API. In this article we examine the JSON-RPC api and break down the changes between the node software version 1.x to 2.0. 

## A note on the Casper Sidecar
One of the major enhancements in the condor upgrade is the Casper Sidecar. The Sidecar is basically a companion to the node, which exposes the node JSON RPC while running in a spearate process. What this means is, the node software itself no longer exposes a JSON RPC API to the consumer. This job is done by the Sidecar. 

In practice, we expect that most people will see very little change in how they think about and consume RPC functionality, if that is their primary objective. Most node operators will operate a sidecar process on the same machine, and the dApp developer will see no difference in ow they call it. However, any discussion of the JSON RPC changes for Condor would be remiss not to mention this development. 

### Casper 1.x JSON-RPC Schema definition. 
For completeness, the full schema definition of the Casper 1.x node JSON-RPC may be found here: [https://github.com/casper-network/casper-node/blob/dev/resources/test/rest_schema_rpc_schema.json](https://github.com/casper-network/casper-node/blob/dev/resources/test/rest_schema_rpc_schema.json)

### Casper 2.0 (Condor) JSON-RPC Schema Definition
The Condor JSON-RPC definition can be seen in this Knowledge Base at the following link: 

[../resources/rpc-schema/rpc.discover.json](../resources/rpc-schema/rpc.discover.json)


| 1.x                                   | 2.0                                   |               |
| --------                              | -------                               | -------       |
| account_put_deploy                    | account_put_deploy                    | Deprecated    |
|                                       | account_put_transaction               | Added         |
| info_get_deploy                       | info_get_deploy                       | Deprecated    |
|                                       | info_get_transaction                  | Added         |
| state_get_account_info                | state_get_account_info                | Unchanged     |
| state_get_entity                      | state_get_entity                      | Deprecated    |
| state_get_dictionary_item             | state_get_dictionary_item             | Unchanged     |
| query_global_state                    | query_global_state                    | Unchanged     |
| query_balance                         | query_balance                         | Unchanged     |
| info_get_peers                        | info_get_peers                        | Unchanged     |
| info_get_status                       | info_get_status                       | Peers & latest switch block hash are now returned with the result     |
| info_get_validator_changes            | info_get_validator_changes            | Unchanged     |
| info_get_chainspec                    | info_get_chainspec                    | Unchanged     |
| chain_get_block                       | chain_get_block                       | Now returns Block with Signatures         |
| chain_get_block_transfers             | chain_get_block_transfers             | Unchanged     |
| state_get_balance                     | state_get_balance                     | Balance now reflects all active holds     |
| chain_get_era_info_by_switch_block    | chain_get_era_info_by_switch_block    | Unchanged     |
| state_get_auction_info                | state_get_auction_info                | Unchanged     |
| chain_get_era_summary                 | chain_get_era_summary                 | Unchanged     |



