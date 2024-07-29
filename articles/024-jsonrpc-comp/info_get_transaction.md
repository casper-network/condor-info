## info_get_transaction
The [info_get_transaction](./rpc-2.0/info_get_transaction.json) method replaces the pre-existing [info_get_deploy](./rpc-1.5/info_get_deploy.json) method. to some extent, it simply mirrors the pre-existing method. 

- Parameters
  - Accepts a [TransactionHash](./rpc-2.0/components/TransactionHash.json) instead of a [DeployHash](./rpc-1.5/components/DeployHash.json)   
- Results
  - Returns a [Transaction](./rpc-2.0/components/Transaction.json) instead of a [Deploy](./rpc-1.5/components/Deploy.json)
  - Returns an [ExecutionInfo](./rpc-2.0/components/ExecutionInfo.json) instead of [ExecutionResult](./rpc-1.5/components/JsonExecutionResult.json)  