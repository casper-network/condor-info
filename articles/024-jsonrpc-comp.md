# A comparison of the node JSON-RPC from Casper 1.x to Casper 2.0 (Condor)

## Introduction

This article is intended for developers consuming the Casper 2.0 (AKA Condor) JSON RPC, such as dApp developers, SDK developers, or others relying on the JSON-RPC API. In this article we examine the JSON-RPC  and break down the [differences between v1.5.6 and v2.0.0](#differences-between-v15-and-v20).

Since the network's inception, the Casper node has exposed an API over HTTP, using JSON, which is known as the JSON-RPC. This API allows client software such as dApps and SDKs to communicate and interact with the node, giving access to query node state, chain state, balance details and other information, as well as write information to the chain by submitting transactions.  

## Changes for v2.0

### The Casper Sidecar
One of the major changes in the Condor upgrade is the Casper Sidecar. The Sidecar is a separate process which runs on the same machine as the takes responsibility for running the RPC server and exposing the RPC endpoints to the Internet. 
The Sidecar is basically a companion to the node, which exposes the node JSON RPC while running in a separate process. What this means is, the node software itself no longer exposes a JSON RPC API to the consumer. This job is done by the Sidecar. 

In practice, we expect that most people will see very little change in how they think about and consume RPC functionality, if that is their primary objective. Most node operators will operate a sidecar process on the same machine, and the dApp developer will see no difference in how they call it. However, any discussion of the JSON RPC changes for Condor would be remiss not to mention this development. That said, the existence of the sidecar has practically no relevance to those interested only in *consuming* the RPC's features, and who have no interest in the Binary Port. It does, however, have relevance for those running a Casper Node, or who wish to avail of the fine-grained control particular to the binary port. 

### The Binary Port
Condor exposes a Binary Port interface, which allows connection over TCP/IP and pure binary serialization for your remote procedure calls. Depending on your use case, you may be interested in considering this option for interacting with Casper Condor. In general, the binary port offers better performance and features compared to the JSON RPC.  A detailed discussion of the Binary Port will be contained in a future article. 

#### Differences in the JSON-RPC 
The biggest immediately obvious change in the RPC is the change in name from deploy to transaction. casper 1.5 used the name "deploy" for a unit of work submitted to the blockchain. Condor renames this metaphor to "Transaction". 


### Casper 1.x JSON-RPC Schema definition. 
The full schema definition of the Casper 1.x node JSON-RPC may be found [here](./024-jsonrpc-comp/rpc-1.5/schema.json)


### Casper 2.0 (Condor) JSON-RPC Schema Definition
The full schema definition for the Condor JSON-RPC is [here](./024-jsonrpc-comp/rpc-2.0/schema.json)

## Differences between v1.5 and v2.0

| Function in v1.5                      | Function in v2.0                      |Remarks|
| ---                                   | ---                                   | --- |
| [account_put_deploy](./024-jsonrpc-comp/rpc-1.5/account_put_deploy.json)                                      | [account_put_transaction](./024-jsonrpc-comp/rpc-2.0/account_put_transaction.json)                            | [Renamed](./024-jsonrpc-comp/account_put_transaction.md)     |  
| [chain_get_block_transfers](./024-jsonrpc-comp/rpc-1.5/chain_get_block_transfers.json)                        | [chain_get_block_transfers](./024-jsonrpc-comp/rpc-2.0/chain_get_block_transfers.json)                        | Unchanged     |
| [chain_get_block](./024-jsonrpc-comp/rpc-1.5/chain_get_block.json)                                            | [chain_get_block](./024-jsonrpc-comp/rpc-2.0/chain_get_block.json)                                            | Now returns Block with Signatures         |
| [chain_get_era_info_by_switch_block](./024-jsonrpc-comp/rpc-1.5/chain_get_era_info_by_switch_block.json)      | [chain_get_era_info_by_switch_block](./024-jsonrpc-comp/rpc-2.0/chain_get_era_info_by_switch_block.json)      | Unchanged     |
| [chain_get_era_summary](./024-jsonrpc-comp/rpc-1.5/chain_get_era_summary.json)                                | [chain_get_era_summary](./024-jsonrpc-comp/rpc-2.0/chain_get_era_summary.json)                                | Unchanged     |
| [chain_get_state_root_hash](./024-jsonrpc-comp/rpc-1.5/chain_get_state_root_hash.json)                        | [chain_get_state_root_hash](./024-jsonrpc-comp/rpc-2.0/chain_get_state_root_hash.json)                        | Unchanged     |
| [info_get_chainspec](./024-jsonrpc-comp/rpc-1.5/info_get_chainspec.json)                                      | [info_get_chainspec](./024-jsonrpc-comp/rpc-2.0/info_get_chainspec.json)                                      | Unchanged     |
| [info_get_deploy](./024-jsonrpc-comp/rpc-1.5/info_get_deploy.json)                                            | [info_get_transaction](./024-jsonrpc-comp/rpc-2.0/info_get_transaction.json)                                  | [Renamed](./024-jsonrpc-comp/info_get_transaction.md)    |
| [info_get_peers](./024-jsonrpc-comp/rpc-1.5/info_get_peers.json)                                              | [info_get_peers](./024-jsonrpc-comp/rpc-2.0/info_get_peers.json)                                              | Unchanged     |
| [info_get_status](./024-jsonrpc-comp/rpc-1.5/info_get_status.json)                                            | [info_get_status](./024-jsonrpc-comp/rpc-2.0/info_get_status.json)                                            | Latest switch block hash included in result     |
| [info_get_validator_changes](./024-jsonrpc-comp/rpc-1.5/info_get_validator_changes.json)                      | [info_get_validator_changes](./024-jsonrpc-comp/rpc-2.0/info_get_validator_changes.json)                      | Unchanged     |
| [query_balance](./024-jsonrpc-comp/rpc-1.5/query_balance.json)                                                | [query_balance](./024-jsonrpc-comp/rpc-2.0/query_balance.json)                                                | Unchanged     |
|                                                                                                               | [query_balance_details](./024-jsonrpc-comp/rpc-2.0/query_balance_details.json)                                | Added         |
| [query_global_state](./024-jsonrpc-comp/rpc-1.5/query_global_state.json)                                      | [query_global_state](./024-jsonrpc-comp/rpc-2.0/query_global_state.json)                                      | Unchanged     |
| [state_get_account_info](./024-jsonrpc-comp/rpc-1.5/state_get_account_info.json)                              | [state_get_account_info](./024-jsonrpc-comp/rpc-2.0/state_get_account_info.json)                              | Unchanged     |
| [state_get_auction_info](./024-jsonrpc-comp/rpc-1.5/state_get_auction_info.json)                              | [state_get_auction_info](./024-jsonrpc-comp/rpc-2.0/state_get_auction_info.json)                              | Unchanged     |
| [state_get_balance](./024-jsonrpc-comp/rpc-1.5/state_get_balance.json)                                        | [state_get_balance](./024-jsonrpc-comp/rpc-2.0/state_get_balance.json)                                        | Balance now reflects all active holds     |
| [state_get_dictionary_item](./024-jsonrpc-comp/rpc-1.5/state_get_dictionary_item.json)                        | [state_get_dictionary_item](./024-jsonrpc-comp/rpc-2.0/state_get_dictionary_item.json)                        | Unchanged     |
| [state_get_item](./024-jsonrpc-comp/rpc-1.5/state_get_item.json)                                              | [state_get_entity](./024-jsonrpc-comp/rpc-2.0/state_get_entity.json)                                          | Renamed    |


