# Fee elimination with Casper 2.0

## Concepts

### Economics of on-chain compute

#### Gas

The general principle we must start with is that any finite resource on a publicly accessible computer network must be rate-limited, because a resource made available without limit is a denial of service attack vector. The finite resource we will discuss here is compute.

Public blockchain networks that support smart contracts generally quantify compute as "gas," which is consumed in finite quantities and used to meter and limit resource consumption by individual transactions. In such a model, a transaction's available gas limits their usage of compute, data storage (as is done in Casper), and possibly other chain-specific resources.

#### Choosing the rate-limiting strategy

The previous section suggests a security argument for rate limiting, but an argument for any particular form of rate limiting has to appeal to economics. The simplest economically-rationalizable means of rate limiting could be seen with Ethereum before adoption of EIP-1559. In that model, users bid on gas in what amounted to a first-price auction. Such an auction allocates gas to the users willing to pay the most and who, consequently, can be assumed to value the compute more. 

In practice, a public blockchain's designers may want to distinguish between different use cases and may value one use case over another, e.g., a blockchain could be designed specifically to ease integration with enterprise operations. The designers may also want to balance the interests of power users (such as DeFi dApps' customers) against those of users primarily interested in token transfers or staking. Such concerns suggests that using a simple auction for gas may be inadequate, as it tends to favor DeFi and crowd out other users due to congestion and price volatility.

The problem of choosing the best gas model suited to the long-term vision of any particular platform is complicated by malicious use (such as a blockstuffing attack running infinite loops on chain) being indistinguishable at the protocol level from legitimate use, due to opacity of the virtual machine bytecode. Casper does distinguish inherently "host side" native operations not involving the virtual machine. Additionally, we can and do use real mainnet use data to inform recommended platform settings based on identifiable clusters of deploys, which can be distinguished by byte size, gas use and whether they invoke a contract or run custom bytecode.

## Gas in Casper 2.0

### Gas in Casper 1.X

The public Casper Network and its testnet have used a simple fixed gas price (1:1 motes to gas units) model since genesis, although it did maintain a separate "lane" for native transfers. Deploys specified the amount of gas they would consume, up to the block gas limit. Depending on chainspec settings, some portion of unused gas could be refunded. Resource use was further rate limited by deploy and block byte size limits, as well as a limit on the total number of deploys in a block.

The 1.X design remained adequate as usage slowly ramped up, but it was always expected that it would be eventually replaced. In particular, the use profile of a public blockchain is heterogeneous and the old design did not take this into account, making it possible for small deploys to fill up all the general WASM deploy slots without consuming much compute.

Fees transferred to proposing validators were the amount of gas purchased (at the fixed 1:1 rate), minus any refunds due to the user.

### Design for Casper 2.0

In addition to the 1.X model, the `casper-node 2.0` reference implementation (i.e., Condor) has been augmented with additional options for handling payment, gas price, fee, and refund. This configurable capability allows public and private chains using the software to opt in to behaviors that suit their purpose, and also allows the exploration of alternative strategies such as not turning token spent on gas into fees, instead placing temporary holds on transactor balances. We call this *__fee elimination__*, and currently intend to roll Condor out to testnet and the public Casper Network with this strategy active.

The fee elimination strategy, in combination with other features expected to be active on mainnet, replaces fees with holds assessed at a variable ratio of gas units to motes (a dynamic price that depends on congestion and varies within a fixed range). The holds, depending on the chainspec settings, may be released at the end of a predefined timeframe, or on a linear schedule over said timeframe. 

Additionally, the general WASM transactions (note the change of terminology from "deploys") now have a number of lanes to choose from. There is also a lane for native auction interactions, as well as for transfers. With the set of features expected to be active on mainnet, use of the chain induces holds of a quantity of token given by the gas allotted to each slot in that lane, multiplied by the dynamic gas price.

The rationale for placing holds on token instead of taking token as fees is that replacing the nominal cost with opportunity costs (held token cannot be staked) simplifies certain highly desirable ecosystem-building use cases, particularly the operation of Blockchain as a Service providers.

### Implementation

#### Gas holds

#### Cost examples

#### Alternative chainspec parameter settings in Casper 2.0


The ultimate goal of any gas mechanism is to prevent exploitation of a network's resources. Aside from incentivizing validators, there is no fundamental reason to charge users for making transactions if their honesty can be guaranteed. By designing a system that disincentivizes wasteful transactions without charging a fee, resistance to exploitation can be maintained while allowing users to transact freely.

Condor proposes the novel method of placing a temporary hold upon the tokens that would otherwise be spent on gas. The duration of gas holds is defined [here](https://github.com/casper-network/casper-node/blob/feat-2.0/resources/production/chainspec.toml#L166) in the [casper-node](https://github.com/casper-network/casper-node) chainspec:

```toml
# If fee_handling is set to 'no_fee', the system places a balance hold on the payer
# equal to the value the fee would have been. Such balance holds expire after a time
# interval has elapsed. This setting controls how long that interval is. The available
# balance of a purse equals its total balance minus the held amount(s) of non-expired
# holds (see gas_hold_balance_handling setting for details of how that is calculated).
#
# For instance, if gas_hold_interval is 24 hours and 100 gas is used from a purse,
# a hold for 100 is placed on that purse and is considered when calculating total balance
# for 24 hours starting from the block_time when the hold was placed.
gas_hold_interval = '24 hours'
```

How gas holds are released is also configurable. Currently implemented are `accrued` and `amortized`, as described below, however any function `f(t)` can be implemented to unlock tokens on a different schedule for optimal performance:

* **Accrued**<sub>red</sub>: $f(t) = n, \text{ where } n = \text{100\% gas locked}$
* **Amortized**<sub>purple</sub>: $f(t) = n - t, \text{ where } n = \text{100\% gas locked}$
* **Logarithmic**<sub>blue</sub>: $f(t) = n - \frac{n}{\ln(n+1)} \ln(t+1), \text{ where } n = \text{100\% gas locked}$

![Gas locked over time](desmos-graph.png "Gas locked over time")

## Preventing Exploitation

It is intuitive to expect that a gas mechanism that doesn't charge users would be vulnerable to denial-of-service attacks. After all, provided a large enough bankroll, a user could deploy enough transactions to slow the network for the amount of time needed for his or her previous gas payments to unlock. In this way, one could simply deploy infinite transactions, cycling through their locked and unlocked balances. This is a well understood risk and must be avoided at all costs. Attacking the network in this way is a challenge of economic feasibility, much like many other aspects of blockchains. In proof-of-stake networks, owning enough of the total validator stake offers a similar malicious opportunity. To prevent an attack like this from taking place, it must be made to be prohibitively expensive, with little to no incentive to the attacker.

Casper's approach involves a long locking period combined with 8 second blocktimes (half the duration as in v1.5.6). The Casper 2.0 mainnet is slated to roll out with a 30 day locking period, but if increased, the cost to attack would scale linearly.

Considering a token locking period of 30 days and the **Accrued** unlocking schedule, purchasing just 1% of the total block space of each block would cost:

$\frac{T}{B} \cdot \frac{G}{100} = 10,692,000 \, \text{CSPR}$

Where:

* `T` = 30 day locking period
* `B` = 8 second blocktime
* `G` = 3300 CSPR block gas limit

If this proves to be too cheap, the locking period can be extended or the block gas limit increased. As the locking duration is increased, not only is the total cost to attack higher, the opportunity cost to keep tokens illiquid and unstaked increases as well. If those tokens were otherwise staked, they could generate sizable rewards.

## Incentivizing Validators

The Casper Network, like any truly decentralized blockchain, allows nodes to act in their greatest economic interest when it comes to validating transactions. The purpose of this is to incentivize validators as much as possible, encouraging more to come online. Part of the income a validator earns comes from fees paid by a deployer, which entices validators to pick up their transactions. When no fee is paid by the deployer at all, however, an incentive must be provided to the validators.

Casper's solution is quite simple, but requires understanding how validators are selected and compensated. On Casper Networks, 100 validators are weightily selected to validate all the blocks within the current "[era](https://docs.casper.network/concepts/glossary/E/#era)", which advances every 2 hours. At the end of each era, validator rewards are calculated, put into a pot, and distributed to validators based on the amount of token staked by each. In an effort to incentivize validators to propose populated blocks, a "validator credit" is added to those who do, proportional to the size of the blocks they propose. This validator credit is then applied to the payout scheme, awarding more of the pot to the hardest-working nodes. Additionally, the validator credit is considered as additional staking weight for the next era when the next [booking block](https://docs.casper.network/concepts/glossary/B/#booking-block) appears.

> TODO: Dylan, some explanation of gas hold records and balance calculations should probably be added to this doc, perhaps under an Implementation header. 
