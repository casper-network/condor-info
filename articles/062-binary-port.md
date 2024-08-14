# Binary Port in Casper 2.0

Casper 2.0 introduces a significant upgrade to its node communication: the binary port. This new RPC interface replaces the traditional JSON-RPC with a binary protocol. The result is faster, more efficient communication between the nodes and the applications within the network.

## Advantages

The adoption of a binary RPC protocol brings several benefits to the Casper network:

* **Reduced Network Congestion**: The compact nature of binary encoding leads to smaller message sizes, decreasing bandwidth consumption and network strain. This is particularly valuable in scenarios with high transaction volumes or limited bandwidth. This is particulary important for communication between the nodes themselves.
* **Improved Node Responsiveness**: While the node still needs to process requests, binary data is often faster to handle than JSON. This can lead to quicker response times from the node, enhancing overall network performance
* **Scalability**: The efficiency gains from binary communication contribute to the network ability to scale and handle increased transaction loads without sacrificing performance.

## Binary RPC and the Sidecar

In Casper 2.0, the newly introduced Sidecar plays a crucial role. It acts as a bridge between external clients using JSON-RPC and the node's binary port. This setup ensures compatibility with existing tools while leveraging the performance benefits of the binary protocol.

The sidecar translates JSON-RPC requests into binary requests for the node and converts binary responses back into JSON for the client.

## Direct Binary Communication

Future Casper SDKs will allow clients to communicate directly with the node's binary port, bypassing the sidecar. This approach offers several potential advantages:

* **Enhanced Performance**: Eliminating the sidecar's translation step can further reduce latency and improve overall communication speed.
* **Simplified Architecture**: Direct communication reduces complexity, leading to a more streamlined and maintainable system.
* **Greater Control**: Developers gain more granular control over their interactions with the node, opening doors for optimization and customization.

## TODO: more info about how the nodes comunicate with each other?

## Example: Seding a Transaction

Lets illustrate the workflow of using the binary port with a simplified example of sending a native transfer transaction.

### Flow with Sidecar:

1. **Construct JSON Request:** The client constructs a JSON-RPC request containing the transaction details.
2. **Send to Sidecar:** The request is sent to the sidecar over HTTP.
3. **Sidecar to Node (Binary)**: The sidecar translates the JSON request into a binary request and sends it to the node's binary port.
4. **Node Processing:** The node processes the binary request, executes the transaction, and constructs a binary response.
5. **Back to Sidecar (Binary):** The binary response is sent back to the sidecar.
6. **Sidecar to Client (JSON):** The sidecar translates the binary response into a JSON response and sends it back to the client.

### Flow with Direct Binary Communication:

1. **Construct Binary Request:** The client directly constructs a binary request containing the transaction details using the appropriate SDK.
2. **Send to Node (Binary)**: The request is sent directly to the node's binary port over TCP.
3. **Node Processing:** The node processes the binary request, executes the transaction, and constructs a binary response.
4. **Back to Client (Binary):** The binary response is sent directly back to the client.

By enabling direct communication, the flow eliminates the translation steps, potentially leading to even faster and more efficient interactions.

## Summary

The introduction of the binary port in Casper 2.0, alongside the new sidecar, represents a significant step towards a more efficient, scalable, and developer-friendly Casper network. While the sidecar currently provides a bridge for JSON-RPC compatibility, the future holds the promise of even greater performance and control through direct binary communication
