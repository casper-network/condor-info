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

---

### Deprecations


---

### **6. Known Issues**

---

### **7. Upcoming Features**
- Activation of the Contract/Account unification feature.

---
### Further Reading

**Official Documentation**  
For reference documentation on Casper including Condor/v2.0, please refer to the complete documentation available [here](http://docs.casper.network). Worth noting is that we have implemented documentation versioning, i.e. you may select the version of the documentation you wish to view from a drop-down in the top right of the navigation bar. This allows you to compare some topics with their former version to see what has changed. all Condor-related information is to be found in the v2.0.0 of the documentation.

**Blog Articles and long-form discussions **
We have created a Blog area which exists alongside our documentation portal. [Casper blog](http://docs.casper.network/blog). These articles are intended to serve as a technical resource for those getting started with the features of Casper, and Condor. As such, they take a more long-form, narrative approach to discussing technical issues. You can filter for Condor-related articles by specifying the "condor" tag. [https://docs.casper.network/blog/tags/condor/](https://docs.casper.network/blog/tags/condor/)

**Support Channels**

- Getting help  
  You can use any of our official channels to ask for more information or raise an issue. 
- Something missing/wrong?   
  To raise a request for an article or blog post, or to notify us of errata or omissions, use the Issues feature in the Casper Documentation site. [https://github.com/casper-network/docs-redux/issues](https://github.com/casper-network/docs-redux/issues)



| Description | Type | Link |
| ----- | ----- | ------ |
| Official Casper Support | Telegram |  |
| Condor-Specific Support | Telegram |  |
|  |  |  |

Thank you for using Casper v2.0 - Condor! We hope these new features and improvements enhance your experience. Please feel free to share feedback or report issues through our support channels.

Thank you,  
**Casper Development Team**

---
