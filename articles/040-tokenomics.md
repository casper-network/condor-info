# Condor Tokenomics

Decentralized blockchain networks like the Casper Network require an incentivization protocol for validators that entices them to stay online and continue proposing and validating blocks. The "reward" awarded to validators can be calculated and paid out in various ways and from various sources.

On the Casper Network, tokens are minted at the end of each [era](https://docs.casper.network/concepts/glossary/E/#era) and paid out to validators based on the work they put forward during the era. The rewards are designed to pay out a specific amount, following an intended inflation rate specified in the chainspec. Considering this, the reward for each validator must be derived from the total amount of the "pot" and each's total effort.

Additionally, gas fees paid by transactors are often given to validators in an effort to incentivize them to publish the largest blocks they can. This costs the validator more work in the form of computation, but it is compensated over the odds.

## Casper 1.x

On Casper 1.x, the method for computing rewards was simple. At the end of each era (2 hours worth of blocks), the total era payout is calculated based on the inflation rate and distributed to validators based on the amount of work they put in. Gas fees were also paid out directly to the proposers (validators) who performed the execution and gossiped the transaction.

## Casper 2.x

The Casper Network has recently implemented its *Condor* upgrade, migrating Casper to its 2.x variant. A lot has changed in the update, including the consensus algorithm's tokenomics agenda.

The most notable change that requires a reworking of the reward scheme is the new Fee Elimination feature, which makes it such that gas payments made by transactors are not withdrawn from their wallets, and not paid to validators. With no payment made from transactor to validator, there is no longer an incentive to populate blocks; it is cheaper for the proposer to simply offer up empty blocks. In order to once again make proposing full blocks economically attractive, Casper has devised the *Validator Credit*.

### Validator Credit

The validator credit is quite simple and works alongside the existing reward scheme to incentivize the population of blocks. In this new system, the gas that is "used" by a transactor is remembered by the consensus mechanism and is added as weight when it comes to calculating the work done by a validator. For example, if a certain validator proposes 10% more computation's worth of transactions than the others on average, it will receive a proportionally higher weight and therefore higher payout compared to the rest, who will have their payouts diminished to cover the cost.

Additionally, this weight will remain when looking ahead to [auction](https://docs.casper.network/concepts/glossary/A/#auction) the next validator set.

### Other Changes

> TODO
>
> Reduced volatility for smaller validators