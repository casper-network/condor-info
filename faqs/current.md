### What is condor?
Condor is the code name given to version 2.0 of the Casper platform, it represents a significant upgrade with a slew of new features accompanied by innumerable optimizations & improvements.

### What are the main components of Condor?
casper-node: The core node software.
casper-node-launcher: Manages node orchestration.
casper-sidecar: New component for handling non-essential tasks like the JSON-RPC API.

### What are the benefits of decoupling essential and non-essential tasks?
Enhanced control over performance and security.
Independent evolution of the JSON-RPC API.
Simplified development of alternative protocol clients.

### Is there any limit for storing values within a contract?
There is no physical limit on the total bytes written. However, the effective limit for storing data during a single contract call is determined by the gas limit. It currently costs 1,117,587 gas to write one byte to the global state, considering raw data only. Various weight multipliers and limits per operation, such as the maximum length of a dictionary item key, also apply. If you need more details, please let us know.

### How can I create accounts in a locally running NCTL network?
Within the assets folder, you will find a users subfolder. This folder contains 10 test user accounts, each prefunded via the genesis accounts.toml. These accounts can be used for testing purposes in your local NCTL network setup.

### Is there an interface for gas held?
You can use the query_balance_details interface to check the gas held for a specific account. The holds represent gas held for gas fees, which are placed in a "hold" for a configurable period (currently 24 hours). During this time, the gas remains in the entity's purse but is unavailable for transactions. Tracking the total gas held requires monitoring each account and the lifetime of each hold separately.

For more details, refer to the query_balance_details interface.

### What new services are available?
Node: Protocol Server, REST Server, Binary Server, SSE Server.
Sidecar: Main Server (JSON-RPC API), Speculative Execution Server.

### What changes have been made to the API?
Distributed across node and sidecar.
Introduction of the node binary API.
Rationalized SSE API.
New and renamed JSON-RPC API endpoints.

