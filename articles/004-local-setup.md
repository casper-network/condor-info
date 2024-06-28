# Setting Up a Local Casper Condor Network for Development

Casper Condor is a major upgrade to the Casper Network. This guide walks you through creating a local Condor environment for testing and development using Dockerized NCTL and the Rust Casper Client.

## Prerequisites

* Docker installed and running on your machine 

## Part 1: The Dockerized NCTL (Network Control Tool)

NCTL is your tool for managing the Casper network. We'll use a Dockerized version for easier setup.

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/make-software/casper-nctl-docker.git
   cd casper-nctl-docker
   ```

2. **Switch to the Condor Branch:**
   ```bash
   git checkout feat-2.0
   ```

3. **Clone the `casper-node` Repository:**
   ```bash
   git clone https://github.com/casper-network/casper-node.git
   cd casper-node
   git checkout feat-2.0
   ```
   Ensure you're in the `casper-nctl-docker` directory when running this command

4. **Build the Docker Image:**
   ```bash
   docker build -f casper-nctl-condor.Dockerfile -t casper-nctl:feat-2.0 .
   ```
   This may take a while

5. **Verify the Image:**
   ```bash
   docker image ls
   ```
   Look for the `casper-nctl:feat-2.0` image in the output
   ```
   REPOSITORY                 TAG        IMAGE ID       CREATED        SIZE
   casper-nctl                feat-2.0   9fd1e7b25d42   40 hours ago   433MB
   ```

6. **Start the NCTL Docker Container:**
   * **Docker Compose (Recommended):** If you're using the `docker-compose.yml` file, update the `image` line under the `mynctl` service to `casper-nctl:feat-2.0`. Then run `docker-compose up`.
   * **Manual Docker Command:** 
      ```bash
      docker run -d --name mynctl -p 11101:11101 casper-nctl:feat-2.0
      ```

      Once it is up and running you should see that there are 5 nodes and 5 sidecars running:
     ```
     mynctl  | validators-1:casper-net-1-node-1       RUNNING   pid 995, uptime 0:00:03
     mynctl  | validators-1:casper-net-1-node-2       RUNNING   pid 997, uptime 0:00:03
     mynctl  | validators-1:casper-net-1-node-3       RUNNING   pid 1007, uptime 0:00:03
     mynctl  | validators-1:casper-net-1-sidecar-1    RUNNING   pid 996, uptime 0:00:03
     mynctl  | validators-1:casper-net-1-sidecar-2    RUNNING   pid 1002, uptime 0:00:03
     mynctl  | validators-1:casper-net-1-sidecar-3    RUNNING   pid 1022, uptime 0:00:03
     mynctl  | validators-2:casper-net-1-node-4       RUNNING   pid 1081, uptime 0:00:02
     mynctl  | validators-2:casper-net-1-node-5       RUNNING   pid 1083, uptime 0:00:02
     mynctl  | validators-2:casper-net-1-sidecar-4    RUNNING   pid 1082, uptime 0:00:02
     mynctl  | validators-2:casper-net-1-sidecar-5    RUNNING   pid 1084, uptime 0:00:02
     ```

## Part 2: Casper Client (Rust)

To interact with your local Condor network, we'll use the Casper Client written in Rust. This is just one option. There are other supported SDKs that are also becoming compatible with Condor.

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/casper-ecosystem/casper-client-rs.git
   cd casper-client-rs
   ```

2. **Switch to the Condor-Compatible Branch:**
   ```bash
   git checkout feat-track-node-2.0
   ```

3. **Test Your Setup:**
   ```bash
   cargo run --release get-node-status --node-address http://127.0.0.1:11101
   ```
   This command should return the node status of your local network, indicating a successful setup. The output should look similar to this:
   ```
   {
     "jsonrpc": "2.0",
     "id": -1220974167166441457,
     "result": {
       "api_version": "2.0.0",
     ...
   }
   ```

## Using the Casper Client

* **Command Format:** `cargo run --release [command] --node-address http://127.0.0.1:11101`
* **Get Help:** `cargo run --release --help`

## Important Notes

* **Work in Progress:** Condor compatibility is still evolving. Some features may be unstable or incomplete.
* **Contract Deployment:** Producing a Condor-compatible Wasm file for contract deployment is currently not trivial.

## Additional Tips

* **Community Resources:** Join the Casper Telegram for help and discussion.
