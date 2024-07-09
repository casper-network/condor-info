# Fee Elimination on Casper 2.0

Public distributed blockchain networks that support smart contract generally include a notion commonly known as "gas", which is acquired in finite quantities and used to meter and limit resource consumption by individual transactors. In such a model, a transactor's available gas is consumed by their usage of computation, data storage, and possibly other chain-specific resources. 

The public Casper Network and its testnet have used such a gas model from their genesis. Per deploy, transactors specify an amount of token to convert into gas at a 1:1 ratio, to be used to execute that deploy. All gas consumed in each block is allotted to the proposer of that block in the form of transaction fees. Also included in the model are tables to calculate gas costs and support for some portion of unconsumed gas to be refunded to transactors. This can be abstracted as payment, gas price, fee, and refund. 

In addition to the 1.x model, the `casper-node 2.0` reference implementation (aka Condor) has been augmented with additional options for handling payment, gas price, fee, and refund. This configurable capability allows public and private chains using the software to opt in to behaviors that suit their purpose, and also allows the exploration of alternative strategies such as not turning token spent on gas into fees, instead placing temporary holds on transactor balances. We call this *__fee elimination__*, and currently intend to roll Condor out to testnet and mainnet with this strategy active.

## Design
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

If this proves to be too cheap, the locking period can be changed or the block gas limit increased.

> TODO: Opportunity cost

## Incentivizing Validators

The Casper Network, like any truly decentralized blockchain, allows miners to act in their greatest economic interest when it comes to validating transactions. The purpose of this is to incentivize validators as much as possible, encouraging more to come online. Part of the income a validator earns comes from fees paid by a deployer, which entices validators to pick up their transactions. When no fee is paid by the deployer at all, however, an incentive must be provided to the validators.

Casper's solution is quite simple, but requires understanding how validators are selected and compensated. On Casper Networks, 100 validators are weightily selected to validate all the blocks within the current "[era](https://docs.casper.network/concepts/glossary/E/#era)", which advances every 2 hours. At the end of each era, validator rewards are calculated, put into a pot, and distributed to validators based on the amount of token staked by each. In an effort to incentivize validators to propose populated blocks, a "validator credit" is added to those who do, proportional to the size of the blocks they propose. This validator credit is then applied to the payout scheme, awarding more of the pot to the hardest-working nodes. Additionally, the validator credit is considered as additional staking weight for the next era when the next [booking block](https://docs.casper.network/concepts/glossary/B/#booking-block) appears.

> Ed says: We *do not* mint more token for this, we place a validator credit instead. I described this in the recording, towards the end.
>
> TODO: Dylan, some explanation of gas hold records and balance calculations should probably be added to this doc, perhaps under an Implementation header. 
