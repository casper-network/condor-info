## info_get_transaction
This method replaces the pre-existing [info_get_deploy](./rpc-1.5/info_get_deploy.json) method. to some extent, it simply mirrors the pre-existing method. The main differences are

- Parameters
   - Instead of a DeployHash, it accepts a TransactionHash
- Results
   - Instead of a Deploy, it returns a Transaction
   - It also returns an ExecutionResults instead of ExecutionInfo. ExecutionResults is now always returned. 