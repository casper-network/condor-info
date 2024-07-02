# Fee Elimination on Casper 2.0

Public distributed smart contract blockchain networks have historically required the use of a "gas" economy where transactors pay for the computation of their request. This is accepted as a de facto requirement to prevent malicious actors from halting a network via attack vectors such as issuing phony transaction requests or wasting resources. The Casper Network is subject to the same denial-of-service attacks, and so must also employ a mechanism to disincentivize the usage of block-space.

Casper's "Condor" network upgrade proposes an alternative solution to a traditional spot gas market, one where network users don't pay a penny in fees. This new design aims to make transactions free on the Casper mainnet.

In Casper's new model, in contrast to paying for gas, the gas payment is locked in the paying account for a period of time before being made available again. At no point is the CSPR actually removed from the account of the user. Once the holding period is up, the tokens are unlocked ("returned") to the user's spendable balance. Like the pending and available balances of a bank account, the locked and liquid balances of a transacting Casper account are maintained in the blockchain's state. When attempting to perform a transaction, the pending and available account balances will be calculated to ensure sufficient funds.

## Design

The ultimate goal of any gas mechanism is to prevent exploitation of a network's resources. Aside from incentivizing validators, there is no fundamental reason to charge users for making transactions if their honesty can be guaranteed. By designing a system that disincentivizes wasteful transactions without charging a fee, resistance to exploitation can be maintained while allowing users to transact freely.

Casper 2.0 proposes the novel method of locking the tokens that would otherwise be spent on gas in the payers account for a specified duration. The duration of the locking period is defined [here](https://github.com/casper-network/casper-node/blob/feat-2.0/resources/production/chainspec.toml#L166) in the [casper-node](https://github.com/casper-network/casper-node) chainspec:

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

How the tokens are unlocked is also configurable. Currently implemented are `accrued` and `amortized`, as described below, however any function `f(t)` can be implemented to unlock tokens on a different schedule for optimal performance:

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

## Incentivizing Validators

The Casper Network, like any true decentralized blockchain, allows miners to act in their greatest economic interest when it comes to validating transactions. The purpose of this is to incentivize validators as much as possible, as this encourages more to come online. Part of the income a validator earns comes from fees paid by a deployer, which entices validators to pick up their transactions. When no fee is paid by the deployer, however, an incentive must be provided to the validators.

Casper's solution is to make the validators whole, minting the tokens to them that they otherwise would have been paid.

