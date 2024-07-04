# AddressableEntity in Casper 2.0

Casper 2.0 introduces significant changes in the representation and management of accounts and smart contracts, through the introduction of the `AddressableEntity` type. This new structure replaces the separate `AccountHash` and `ContractHash` used in Casper 1.x, bringing a unified approach to interact with entities on the network.

In this article, we'll dive into the details of `AddressableEntity`, exploring its structure and functionalities.

## Key Concepts

**AddressableEntity**

At its core, an `AddressableEntity` is a versatile data structure that represents both accounts and smart contracts within the Casper global state. It encapsulates all the necessary information for identifying and managing these entities. An `AddressableEntity` provides a unified interface for various operations, including authorization, access control, and execution of functions.

**EntityAddr**

An `EntityAddr` serves as the address for an `AddressableEntity`. It not only encodes the unique identifier (hash) of the entity but also its type. There are three distinct variants of `EntityAddr`:

1.  **System:** Used for built-in, native contracts crucial for the blockchain's operation.
2.  **Account:**  Represents a user's account.
3.  **SmartContract:** Represents a user-deployed smart contract.

**AddressableEntityHash**

The `AddressableEntityHash` is a newtype wrapper around a 32-byte hash (`HashAddr`). This hash functions as a unique identifier for the `AddressableEntity`, typically derived from either the account's public key or the smart contract's hash using hashing algorithm.

## The inner workings of AddressableEntity

Let's dive into the critical components within an `AddressableEntity`:

*   **`protocol_version` (ProtocolVersion):**  This field indicates the protocol version that the entity is compatible with. It ensures backward compatibility and allows for smooth upgrades as the Casper network evolves.
*   **`entity_kind` (EntityKind):** As mentioned earlier, this enum determines the type of entity – System, Account, or SmartContract.
*   **`associated_keys` (AssociatedKeys):** This data structure stores a map of public keys authorized to interact with the entity. Each key is associated with a weight that represents its voting power in decision-making processes within the entity.
*   **`action_thresholds` (ActionThresholds):** These thresholds define the minimum combined weight of associated keys required to authorize specific actions. The three main action types are `deployment`, `key_management`, and `upgrade_management`. Each action type has its own weight threshold, allowing for fine-grained control over permissions.
*   **`entry_points` (EntryPoints):** This component is relevant only for smart contracts. It defines the functions (entry points) that external actors can call on the contract, along with their parameters, return types, and access permissions.

## Obtaining and converting Keys

In Casper 2.0, developers will primarily work with `Key::AddressableEntity` when referring to accounts and smart contracts. Here's how you can create them and convert between different key formats:

### Creating AddressableEntity Keys

**From Account Hash:**

```rust
let addressable_entity_key = Key::AddressableEntity(EntityAddr::Account(account_hash)); 
```

**From Smart Contract Hash:**

```rust
let addressable_entity_key = Key::AddressableEntity(EntityAddr::SmartContract(contract_hash));
```

### Extracting AccountHash or ContractHash from a Key
You can extract the `AccountHash` or `ContractHash` from a `Key::AddressableEntity` using pattern matching:

```rust
//For Accounts
let account_hash = match addressable_entity_key {
    Key::AddressableEntity(EntityAddr::Account(hash)) => hash,
    _ => panic!("Not an account key"), 
};
//For Contracts
let contract_hash = match addressable_entity_key {
    Key::AddressableEntity(EntityAddr::SmartContract(hash)) => hash,
    _ => panic!("Not a contract key"), 
};
```

## The Address Merge in Condor

The "Address Merge" in the Condor upgrade of Casper is a foundational shift, impacting how accounts and smart contracts are identified and interacted with.  

**Global State Transformation:**

Post-Condor, all accounts and smart contract addresses residing within the global state will be automatically migrated to the `AddressableEntity` structure. This means the network itself will recognize and handle these entities using the new format.

**Smart Contract Responsibility:**

While the global state transitions is automatic, the internal mechanisms of your smart contracts might not be. If your contracts rely on identifying the caller (e.g., to enforce permissions) or store addresses in their own internal storage, you'll need to take action.

**Essential Steps for Contract Compatibility:**

1. **Internal Storage Migration:** Update any data stored within your contract that uses the old `AccountHash` or `ContractHash` format. This typically involves writing custom migration functions to convert these keys to the new `Key::AddressableEntity` structure. The CEP-18 contract provides excellent examples (`migrate_user_balance_keys`, `migrate_user_allowance_keys`) that can serve as templates for your own migration logic.

2. **Caller Identification:** If your contract's logic depends on distinguishing between accounts and contracts calling it, you'll need to update your code to work with the new `Key::AddressableEntity` format.

3. **External Contract Interactions:**  If your contract interacts with other contracts, verify that the parameters you pass when calling their entry points correspond to the new `Key::AddressableEntity` format.

**Important Note:**

* Failing to upgrade your contract could lead to unexpected behavior or errors, especially if your logic relies on the distinction between accounts and contracts. 