## account_put_transaction
The [account_put_transaction](./rpc-2.0/account_put_transaction.json) method replaces the pre-existing [account_put_deploy](./rpc-1.5/account_put_deploy.json) method. To some extent, it simply mirrors the pre-existing method. However, the new Transaction datatype is used instead of the legacy Deploy.

- Parameters
  - Accepts a [Transaction](./rpc-2.0/components/Transaction.json) instead of a [Deploy](./rpc-1.5/components/Deploy.json)   
- Results
  - Returns a [TransactionHash](./rpc-2.0/components/TransactionHash.json) instead of a [DeployHash](./rpc-1.5/components/DeployHash.json)