# Casper v2.0 RC4 :: Release Notes

## Summary



---
## List of PRs
### Node

* [4817](https://github.com/casper-network/casper-node/pull/4817)	Add an error code for purse not found for balance requests  
    
* [4816](https://github.com/casper-network/casper-node/pull/4816)	Return the switch block hash with rewards response  
    Adds a new field to enable users to retrieve the block at which rewards were distributed

* [4750](https://github.com/casper-network/casper-node/pull/4750)	Add a decode subcommand to global-state-update-gen  
    This adds a new subcommand to global-state-update-gen that aids in debugging, to be called with:
    `global-state-update-gen decode global_state.toml`. The command reads the generated global_state.toml, deserializes the entries and prints them out in the Debug format. This makes the contents of the file more human-readable, helping in analyzing it.

* [4760](https://github.com/casper-network/casper-node/pull/4760)	Keep minimum/maximum delegation amounts when updating bids  
    Currently, the global-state-update-gen tool would reset the minimum/maximum delegation amount of any updated bid to 0 and u64::MAX, respectively. This PR changes it so that the limits remain unchanged. We should also consider whether we want to be able to specify new limits in an update (currently not possible).

* [4761](https://github.com/casper-network/casper-node/pull/4761)	Provide more visibility into error codes in binary port  
    This PR improves the error reporting in binary port. Instead of returning generic `BinaryPortErrorCode::MissingOrIncorrectParameters` we now return a specific variant.

* [4764](https://github.com/casper-network/casper-node/pull/4764)	Derive Serialize for some of the types  
   This PR will enable some additional types in the types crate to be serde-serialized. It'll allow presenting these types in an user-friendly form, for example a Json representation for RewardResponse:
    ```json
    {
    "amount": "8446000000000002",
    "era_id": 1
    }
    ```
* [4759](https://github.com/casper-network/casper-node/pull/4759)	BUGFIX: include validator credit in snapshot  
  In NoFee mode, the validator credit amount is supposed to be used for both determining a validator's weight and also be included in that era's staked amount. However, the logic was only doing the former. This PR corrects to apply the credit in both places.

* [4757](https://github.com/casper-network/casper-node/pull/4757)	Add tracing to the binary port component  
  Added a lot of debug and some warn logging for various error scenarios that cannot easily be inferred from the response.
Also adjusted some code to return RootNotFound rather than an empty response when we fail to resolve a state root hash.
* [4758](https://github.com/casper-network/casper-node/pull/4758)	Fix an issue where a switch block was executing very slowly (minutes)  
  During switch block execution, the rewards distribution was taking a lot of time when a switch block was executing.
This PR introduces several fixes that improve performance:

  - Use a Trie in the Scratch cache to allow looking up keys by prefix more quickly
  - Change the way we check if a purse exists by checking if we can read the key, rather than actually calculating the balance.
  - Remove duplicate operations when checking balances.  

  In testing these changes reduce the rewards distribution calculation from 220-250s to 6-7s
* [4755](https://github.com/casper-network/casper-node/pull/4755)	Use protocol version from the requested block in reward request  
  We should request the `SeigniorageRecipientsRequest` with protocol version from the same block as the state root hash, because the underlying logic will issue a legacy contract request only when major version is 1. Right now this causes an issue when requesting a V1 block from V2 node. Note: we still don't support V1 rewards but this returns the correct error message.
* [4754](https://github.com/casper-network/casper-node/pull/4754)	Update handling of binary port errors  
  This PR adds:
  - missing variants for `TryFrom<u16>` for `ErrorCode`
test to ensure that all variants are covered in the future (uses strum as dev-dependency)
* [4756](https://github.com/casper-network/casper-node/pull/4756)	Update RUSTSEC issues  
  - Add ignore for `RUSTSEC-2024-0344` until issues with `curve25519-dalek` is fixed
  - Bump h2 to dodge `RUSTSEC-2024-0332`

* [4785](https://github.com/casper-network/casper-node/pull/4785)	__Fix the "No such contract" error__  
  This PR fixes the "no such contract at hash" error when trying to invoke an entrypoint of a contract.

  Contract could not be not found because the system attempted to access it via `Key::Hash` which does not exist if the contract is newly installed on the contrary to the contract being migrated from 1.x.

  The fix solves this by trying to access the contract via the `Key::AddressableEntity`, falling back to the indirection via `Key::Hash` upon getting the `ValueNotFound` error.

  It also provides a test contract used in the regression test available here: https://github.com/casper-network/casper-nctl/pull/9

  Fixes [Issue #4771](https://github.com/casper-network/casper-node/issues/4771)

* [4787](https://github.com/casper-network/casper-node/pull/4787)	Expose protocol version in NodeStatus  
  Exposing the protocol version will simplify some checks, for example checks whether an upgrade was successful

* [4770](https://github.com/casper-network/casper-node/pull/4770)	Expose delegation rate in reward responses	

* [4746](https://github.com/casper-network/casper-node/pull/4746)	Including new rewards in the changelog 	

* [4795](https://github.com/casper-network/casper-node/pull/4795)	Drop effects if WASM module execution caused a revert and also add a test for this

* [4796](https://github.com/casper-network/casper-node/pull/4796)	Add a version information request

* [4798](https://github.com/casper-network/casper-node/pull/4798)	Migration version bug fix  
  - Removed a redundant insertion of entity versions during the migration of legacy contracts
  - Added a check in tests to ensure that versions are correctly carried forward

* [4802](https://github.com/casper-network/casper-node/pull/4802)	Fix unbonding failing if accounts weren't migrated  
  If the network is set to a lazy migration of accounts instead of a one-time migration at upgrade, unbonds are failing because they attempt to read accounts in the migrated format, while they are still stored in the old format. This PR adds a lazy migration step when unbonds are processed.

  The PR also brings forced unbonds (due to delegated amounts being outside the min/max boundaries set by the validator) to behave more in line with regular unbonds, ie. the delegators' bids aren't being removed immediately, they are only pruned when the unbonds are actually processed.

  Closes [#4801](https://github.com/casper-network/casper-node/issues/4801)

* [4789](https://github.com/casper-network/casper-node/pull/4789)	Fix a bug in rewards calculation and add a test  
  This fixes a bug which caused the signature collection reward to be applied to the era of signature creation instead of the era of collection. Because of that, if a validator joined the network and proposed a block citing a signature from a previous era, the auction contract would fail to distribute the rewards.

  The PR also adds a test exercising a scenario in which that would happen (it should be roughly equivalent to the NCTL test `itst13`).


* [4786](https://github.com/casper-network/casper-node/pull/4786)	Remove revert on deser in try_get_named_arg introduced 
in  
  Remove revert in `try_get_named_arg` introduced in [#4569](https://github.com/casper-network/casper-node/pull/4569#discussion_r1662435826)
  method unused yet in contracts

* [4805](https://github.com/casper-network/casper-node/pull/4805)	Fix issue with multiple balance holds in the same block	
  When multiple transactions from the same initiator are included in the same block, balance holds created for gas should accumulate for all the transactions in that block.
  We were previously overwriting the gas hold record in global state with the hold for the last transaction executed in the block for the corresponding purse.
  We now add the hold amount to the record if it exists or create a new record with the hold if it doesn't.

  Fixes: [#4803](https://github.com/casper-network/casper-node/issues/4803)  
  Adresses: [casper-network/condor-info#52](casper-network/condor-info#52)

* [4814](https://github.com/casper-network/casper-node/pull/4814)	Reject transactions with gas price tolerance lower than minimum chain threshold
  When a transaction is sent to the network with "gas price tolerance" set to a value lower than `[vacancy] min_gas_price` chainspec setting, it'll be rejected.

  It'll be reflected in the logs like so:
  ```
  rejected transaction; error=invalid transaction: received a transaction with gas price tolerance 3 but this chain will only go as low as 5
  ```

* [4809](https://github.com/casper-network/casper-node/pull/4809)	BUGFIX: Fix miswire of min max delegations amount  
  - Fixed an issue where the min and max delegations amounts were inverted
  - Added a test and check to ensure that max delegation amount can never be strictly less than the min
  - Removed the pruning of legacy contract hash and wash hash key during the migration of contract packages

* [4813](https://github.com/casper-network/casper-node/pull/4813)	Fix removing unbonds in global-state-update tool  
  `global-state-update-gen` wasn't removing delegators' unbonds when validators were being rotated with slashing enabled. This later caused the auction to process old unbonds while the bonding purses were empty (after slashing), causing the network to crash.

  With this PR, the unbonds of delegators of slashed validators should be correctly removed.

  Fixes [#4812](https://github.com/casper-network/casper-node/issues/4812)


### Sidecar
* [335](https://github.com/casper-network/casper-sidecar/pull/335)  Bump dependencies for binary port and types   
This PR bumps the "binary port" and "types" dependencies so that the sidecar can understand the recently added binary port error codes.
* [336](https://github.com/casper-network/casper-sidecar/pull/336)   Return the switch block hash with rewards response  
Sidecar side of [#4816](https://github.com/casper-network/casper-node/pull/4816)
