# Upgrading Smart Contract to Casper 2.0: A Developer Guide

Casper 2.0 introduces changes that require adaptation of your existing Casper 1.x smart contracts. This guide outlines the crucial updates and provides a step-by-step approach for a seamless upgrade, using the CEP-18 contract as a reference.

## Key Changes in Casper 2.0 and Their Implications

1. **Key Representations:**
   - **`Key::AddressableEntity`:**
     - In Casper 2.0, `Key::AddressableEntity` is the unifed representation for system, account and contract keys. The `EntityKindTag`  specifies their type:

        ```rust
        pub enum EntityKindTag {
            /// `EntityKind::System` variant.
            System = 0,
            /// `EntityKind::Account` variant.
            Account = 1,
            /// `EntityKind::SmartContract` variant.
            SmartContract = 2,
        }
        ``` 
     - Ensure you update all key references in your contract to use this new format.

2. **Entry Point Declarations:**
    - **`EntryPointType`:**
        - **EntryPointType::Caller:** This is the main entry point type used in Casper 2.0. It signifies that the entry point will be executed using the calling entity's context (the account that initiated the transaction)
        - **EntryPointType::Called:** This type is used for entry points that are specifically designed to be called by other contracts. These entry points run in the context of the contract being called. This is functionally similar to the previous `Contract` type in Casper 1.x.
        - **EntryPointType::Factory:** This is a new entry point type in Casper 2.0. It's specifically designed for contracts that create new contracts (like factory contracts). These entry points also run in the context of the called contract.
        - The `StoredSession` entry point type is no longer available in Casper 2.0 (`EntryPointType::Caller` does not provide that functionality).

    - **`EntryPointPayment`:**
        - `EntryPointPayment::Caller`: The caller of the entry point pays for the execution cost.
        - `EntryPointPayment::SelfOnly`: The contract itself pays for its own execution but not for any subsequent contract calls.
        - `EntryPointPayment::SelfOnward`: The contract pays for its own execution and any subsequent contract calls it makes.

    Example (CEP-18 `symbol` Entry Point):

    ```rust
    pub fn symbol() -> EntryPoint {
        EntryPoint::new(
            String::from(SYMBOL_ENTRY_POINT_NAME),
            Vec::new(),
            String::cl_type(),
            EntryPointAccess::Public,
            EntryPointType::Called,  // NEW
            casper_types::EntryPointPayment::Caller, // NEW
        )
    }
    ```
   
3. **Event Handling:**
   - **Native Events and Message Topics:**
     - Casper 2.0 prioritizes native event emission through message topics, offering flexibility and better integration.
     - Utilize `runtime::emit_message` to send events on specific topics.
   - **CES (Casper Event Standard):**
     - CES is still supported for backward compatibility, but native events are now the recommended approach.

4. **Contract Installation and Upgrade:**
   - **`new_contract` and `add_contract_version`:**
     - These functions now accept an additional `BTreeMap` argument for specifying message topics when creating or upgrading a contract.
   - **Hash Types:**
     - `ContractPackageHash` is replaced with `PackageHash`, converting to `Key::Package` instead of `Key::Hash`.
     - `ContractHash` is replaced with `AddressableEntityHash`, corresponding to `AddressableEntity` in the global state.

## Essential Upgrade Steps

1. **Key Migration:**
   - Update all key references in your contract logic and storage to `Key::AddressableEntity`.
   - Write and execute migration functions to convert existing storage keys.
   
    Example Migration Function (CEP-18):

    ```rust
    #[no_mangle]
    pub fn migrate_user_balance_keys() {
        let event_on: bool = get_named_arg(EVENTS);
        let revert_on: bool = get_named_arg(REVERT);
        let mut success_map: Vec<(Key, Key)> = Vec::new();
        let mut failure_map: BTreeMap<Key, String> = BTreeMap::new();

        let keys: BTreeMap<Key, bool> = get_named_arg(USER_KEY_MAP);
        let balances_uref = get_balances_uref();
        for (old_key, is_account_flag) in keys {
            let migrated_key = match old_key {
                Key::Account(account_hash) => {
                    if !is_account_flag {
                        if event_on {
                            failure_map.insert(old_key, String::from("FlagMismatch"));
                        } else if revert_on {
                            revert(Cep18Error::KeyTypeMigrationMismatch)
                        }
                        continue;
                    }
                    Key::AddressableEntity(EntityAddr::Account(account_hash.value()))
                }
                Key::Hash(contract_package) => {
                    if is_account_flag {
                        if event_on {
                            failure_map.insert(old_key, String::from("FlagMismatch"));
                        } else if revert_on {
                            revert(Cep18Error::KeyTypeMigrationMismatch)
                        }
                        continue;
                    }
                    Key::AddressableEntity(EntityAddr::SmartContract(contract_package))
                }
                _ => {
                    if event_on {
                        failure_map.insert(old_key, String::from("WrongKeyType"));
                    } else if revert_on {
                        revert(Cep18Error::InvalidKeyType)
                    }
                    continue;
                }
            };
            let old_balance = read_balance_from(balances_uref, old_key);
            if old_balance > U256::zero() {
                let new_key_existing_balance = read_balance_from(balances_uref, migrated_key);
                write_balance_to(balances_uref, old_key, U256::zero());
                write_balance_to(
                    balances_uref,
                    migrated_key,
                    new_key_existing_balance + old_balance,
                )
            } else if event_on {
                failure_map.insert(old_key, String::from("NoOldKeyBal"));
            } else if revert_on {
                revert(Cep18Error::InsufficientBalance)
            }
            success_map.push((old_key, migrated_key));
        }

        if event_on {
            events::record_event_dictionary(Event::BalanceMigration(BalanceMigration {
                success_map,
                failure_map,
            }));
        }
    }

    ```

2. **Entry Point Updates:**
   - Adjust entry point declarations to include `EntryPointType`, `EntryPointPayment`.

3. **Event Handling:**
   - Update event emission and handling logic accordingly (use `runtime::emit_message` for native events).

4. **Installation and Upgrade:**
   - When installing or upgrading your contract, use the `new_contract` and `add_contract_version` functions with the additional `MessageTopics` argument if using native events.
   - Use `PackageHash` (converted to `Key::Package`) for contract installation.
   - Use `AddressableEntityHash` for interactions with deployed contracts.


    Upgrade Function Explained (CEP-18 Example)

    ```rust
    pub fn upgrade(name: &str) {
        let entry_points = generate_entry_points(); // Generate the updated entry points for the new contract version

        // 1. Retrieve and Convert Contract Package Hash
        let old_contract_package_hash = match runtime::get_key(&format!("{HASH_KEY_NAME_PREFIX}{name}")) // Get the hash stored in global state
            .unwrap_or_revert_with(Cep18Error::FailedToGetKey)
        {
            Key::Hash(contract_hash) => contract_hash, // Handle Key::Hash (old format)
            Key::AddressableEntity(EntityAddr::SmartContract(contract_hash)) => contract_hash, // Handle Key::AddressableEntity (new format)
            Key::Package(package_hash) => package_hash, // Handle Key::Package (new format from install_contract)
            _ => revert(Cep18Error::MissingPackageHashForUpgrade), // Revert if the hash is missing or of an invalid type
        };
        let contract_package_hash = PackageHash::new(old_contract_package_hash); // Create a PackageHash from the raw bytes

        // 2. Retrieve and Convert Previous Contract Hash
        let previous_contract_hash = match runtime::get_key(&format!("{CONTRACT_NAME_PREFIX}{name}")) // Get the contract hash from global state
            .unwrap_or_revert_with(Cep18Error::FailedToGetKey)
        {
            Key::Hash(contract_hash) => contract_hash, // Handle Key::Hash (old format)
            Key::AddressableEntity(EntityAddr::SmartContract(contract_hash)) => contract_hash, // Handle Key::AddressableEntity (new format)
            _ => revert(Cep18Error::MissingContractHashForUpgrade), // Revert if the hash is missing or of an invalid type
        };
        let converted_previous_contract_hash = AddressableEntityHash::new(previous_contract_hash); // Create an AddressableEntityHash

        // 3. Handle Events Mode Argument (Optional)
        let events_mode = utils::get_optional_named_arg_with_user_errors::<u8>(
            EVENTS_MODE,
            Cep18Error::InvalidEventsMode,
        ); // Get events mode if provided, otherwise None

        // 4. Prepare Message Topics for Native Events (If Applicable)
        let mut message_topics = BTreeMap::new(); 
        if let Some(mode) = events_mode {
            let events_mode: EventsMode = mode.try_into().unwrap_or_revert_with(Cep18Error::InvalidEventsMode); // Convert to EventsMode enum
            if [EventsMode::NativeNCES, EventsMode::Native].contains(&events_mode) { // If native events are enabled
                message_topics.insert(EVENTS.to_string(), MessageTopicOperation::Add); // Add "events" topic for native event emission
            }
        }

        // 5. Add New Contract Version
        let (contract_hash, contract_version) = storage::add_contract_version(
            contract_package_hash,
            entry_points,
            NamedKeys::new(),
            message_topics, // Provide message topics for native events
        ); // This creates a new contract version and returns the hash and version

        // 6. Disable Previous Contract Version
        storage::disable_contract_version(contract_package_hash, converted_previous_contract_hash)
            .unwrap_or_revert_with(Cep18Error::FailedToDisableContractVersion); // Disable the old contract version

        // 7. Call change_events_mode Entrypoint if events mode was provided
        if let Some(events_mode) = events_mode {
            call_contract::<()>(
                contract_hash,
                CHANGE_EVENTS_MODE_ENTRY_POINT_NAME,
                runtime_args! {
                    EVENTS_MODE => events_mode
                },
            ); // Call the new contract's change_events_mode entrypoint if it exists
        }

        // 8. Store Updated Contract Hashes in Global State
        runtime::put_key(
            &format!("{HASH_KEY_NAME_PREFIX}{name}"),
            contract_package_hash.into(), // Store package hash in global state
        ); 
        runtime::put_key(
            &format!("{CONTRACT_NAME_PREFIX}{name}"),
            Key::addressable_entity_key(EntityKindTag::SmartContract, contract_hash), // Store the new contract hash in global state
        );
        runtime::put_key(
            &format!("{CONTRACT_VERSION_PREFIX}{name}"),
            storage::new_uref(contract_version).into(), // Store the new contract version in global state
        );
    }
    ```

5. **Testing:**
   - Adapt your integration tests using `casper-engine-test-support` to reflect the new key types and storage format.


 For more details please refer to the CEP-18 Casper 2.0 compatible implementaiton: https://github.com/casper-ecosystem/cep18/tree/condor-rc3