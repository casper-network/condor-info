# **Casper v2.0 - Condor Release Notes**

**Release Date:** October 2024

We are excited to announce the release of **Casper v2.0 - Condor**, which introduces a wide range of new features, improvements, and performance optimizations aimed at enhancing user experience and system efficiency. 


**Condor** is the code name given to version 2.0 of the Casper platform. Condor represents a significant upgrade with a slew of new features as well as optimisations & improvements to existing features. 

---

## Major Changes at a glance

### New Consensus model
Casper 2.0 introduces a new consensus model known as Zug. Zug is simpler and leaner than the Highway protocol upon which Casper was originally conceived, and as such allows for improvements in network efficiency and cohesion. This in turn facilitates eventual extension of the validator list, and finer-grained control over block times. 

A detailed discussion of the Zug consensus may be found both in the [Casper documentation](http://docs.casper.network/) and in the [Condor Blog](http://docs.casper.network/blog). 

### New Transaction Model
Casper 2.0 introduces the concept of a Transaction, which replaces the existing Deploy concept. 

### Intelligent Resource Allocation 
The new task scheduler optimizes resource allocation based on transaction size and type, ensuring efficient use of system resources.

### Expanded API Integration Options
Casper 2.0 introduces some changes to the ways in which you can interact with the Casper Network
#### Binary Port
We have added a brand new RPC option at the binary level. This allows you to communicate with the node without the need for JSON serialization, with improvements in performance. 
#### Native Events
We have added contract level events as a native citizen of the Casper node infrastructure. This brings some improvements and provides an alternative to the existing Casper Event Standard, which will remain in the ecosystem. 
#### Casper Sidecar
The existing JSON RPC is now moved to a separate process, known as the Sidecar. This step allows for better process isolation and makes is easier to run and debug node processes. The Sidecar also provides a way to surface Contract Level Events, which opens up some interesting possibilities for node interactions.

#### Account/Contract unification 

**N.B. This feature is not activated yet. See below for details**  
Casper 2.0 introduces significant changes in the representation and management of accounts and smart contracts, through the introduction of the `AddressableEntity` type. This new structure replaces the separate `AccountHash` and `ContractHash` used in Casper 1.x, bringing a unified approach to interaction with entities on the network. Contracts can now hold and manage funds directly through associated purses, similar to user accounts. They can also manage their own keys, enabling more sophisticated access control.

##### Account Unification upgrade path
This feature is a fundamental change to the way that smart contracts interact with the network and each other. Moving to this feature requires that applications using smart contracts must analyse, rework and retest their code in order to ensure that their applications will work as intended. Therefore, the initial release of Condor will not turn this feature on. At some point in the future, once agreed by the people participating in the network, an update to the network will be issued which activates this feature. This step will not be reversible. 

---

## Bug Fixes

| PR Number | URL | Title | Date Merged | 
| ----- | ----- | ------ | ------ |
| 4079	| https://github.com/casper-network/casper-node/pull/4079 |	Fix serialization issues |				2023-06-27 12:08:17+00:00 |
| 4371	| https://github.com/casper-network/casper-node/pull/4371	| Fix issue in `Key` and increase test coverage				| 2023-10-24 15:12:53+00:00 | 
| 4376	| https://github.com/casper-network/casper-node/pull/4376	| Fix addressable entity request				| 2023-10-30 17:25:32+00:00 | 
| 4447	| https://github.com/casper-network/casper-node/pull/4447	| Fix several JsonSchema impls and update the schema				2023-12-12 14:45:00+00:00
| 4616	| https://github.com/casper-network/casper-node/pull/4616	| Fix upgrade scenario 09 in 2.0				| 2024-03-22 14:13:03+00:00 | 
| 4617	| https://github.com/casper-network/casper-node/pull/4617	| Fix rewards distribution				| 2024-04-09 16:07:30+00:00 | 
| 4648	| https://github.com/casper-network/casper-node/pull/4648	| Fix for StoredValue::ContractPackage not json-deserializable				2024-04-09 13:12:24+00:00 | 
| 4650	| https://github.com/casper-network/casper-node/pull/4650	| Fix a bug in the BlockValidator				| 2024-04-10 15:38:05+00:00 | 
| 4657	| https://github.com/casper-network/casper-node/pull/4657	| Prevent stray `accounts.toml` files from breaking upgrades				| 2024-04-25 12:42:55+00:00 | 
| 4665	| https://github.com/casper-network/casper-node/pull/4665	| Fix issues with custom payment				| 2024-04-15 14:12:07+00:00 | 
| 4670	| https://github.com/casper-network/casper-node/pull/4670	| Changed the format used to deserialize StoredValue::ContractPackage variant because it broke backwards compatibility.				| 2024-04-25 16:23:11+00:00 | 
| 4684	| https://github.com/casper-network/casper-node/pull/4684	| BUGFIX: Custom Payment / No Fee / No Refund interaction				| 2024-04-30 15:23:38+00:00 | 
| 4704	| https://github.com/casper-network/casper-node/pull/4704	| Fix block vacancy bug				| 2024-05-10 19:24:01+00:00
| 4718	| https://github.com/casper-network/casper-node/pull/4718	| Fix bid addr key formatting/parsing				| 2024-05-17 18:17:44+00:00 | 
| 4722	| https://github.com/casper-network/casper-node/pull/4722	| BUG FIX: native auction uref extension				| 2024-05-22 14:28:43+00:00 | 
  

---

### Deprecations


---

### Known Issues

---

### Upcoming Features
- Activation of the Contract/Account unification feature.

---
### Further Reading

**Official Documentation**  
For reference documentation on Casper including Condor/v2.0, please refer to the complete documentation available [here](http://docs.casper.network). Worth noting is that we have implemented documentation versioning, i.e. you may select the version of the documentation you wish to view from a drop-down in the top right of the navigation bar. This allows you to compare some topics with their former version to see what has changed. all Condor-related information is to be found in the v2.0.0 of the documentation.

**Blog Articles and long-form discussions**  
We have created a Blog area which exists alongside our documentation portal. [Casper blog](http://docs.casper.network/blog). These articles are intended to serve as a technical resource for those getting started with the features of Casper, and Condor. As such, they take a more long-form, narrative approach to discussing technical issues. You can filter for Condor-related articles by specifying the "condor" tag. [https://docs.casper.network/blog/tags/condor/](https://docs.casper.network/blog/tags/condor/)

**Support Channels**

- Something missing/wrong?   
  To raise a request for an article or blog post, or to notify us of errata or omissions, use the Issues feature in the Casper Documentation site. [https://github.com/casper-network/docs-redux/issues](https://github.com/casper-network/docs-redux/issues)

- Getting help  
  You can use any of our official channels to ask for more information or raise an issue. 

| Description | Type | Link |
| ----- | ----- | ------ |
| Official Casper Support | Telegram | https://t.me/casperblockchainsupport |
| Condor-Specific Support | Telegram | https://t.me/CSPRCondor |
|  |  |  |

Thank you for using Casper v2.0 - Condor! We hope these new features and improvements enhance your experience. Please feel free to share feedback or report issues through our support channels.

Thank you,  
**Casper Development Team**

---
