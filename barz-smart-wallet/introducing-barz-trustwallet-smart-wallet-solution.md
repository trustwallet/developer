By [David Kim](https://twitter.com/0xDavidKim)


Special thanks to [Luis Ocegueda](https://twitter.com/luis_oce) and [Artem Goryunov](https://twitter.com/ArtemGoryunov) for their feedback and contributions.



This is the first of an article series on Barz. 

1. [Introducing Barz: Trust Wallet’s Smart Wallet Solution](/introducing-barz-trustwallet-smart-wallet-solution)
2. [Cutting Diamonds: How to make Accounts Awesome](/cutting-diamonds-how-to-make-accounts-awesome)
3. For Builders By Builders:  Introducing the Barz SDK
4. Multi-tier Module system. A secure foundation for open innovation

In February 2024, we successfully launched [Swift Wallet](https://trustwallet.com/swift), an Account Abstraction Wallet to offer our users a more secure, smarter wallet. Swift Wallet introduced innovative features including Passkeys, gas payment with 200+ tokens, 1 step swap & bridging.

Today, we are open sourcing our robust Smart Wallet solution “Barz”.

Let’s dive into the details of how we got here!

# Why we built Barz

Trust Wallet, empowers more than 122 million Web3 users worldwide, understands the common issues and inconveniences users face when using wallets.

Many users struggle with:

- Improper management of their Mnemonic Phrases
- Granting excessive privileges to a dApp for a single transaction.
- Ability to create multiple automated tasks, e.g. schedule payments.

While the issues and challenges with mnemonic seed phrases are well known, there are larger security and UX issues as more users are onboarded to Web3.

To provide a solution to these challenges and limitations and ultimately drive more adoption of Web3, we decided to develop a Smart Wallet through Account Abstraction, which offers a fundamental solution overcoming these limitations - **Barz**.

# Barz

[Barz](https://github.com/trustwallet/barz) is an [ERC 4337](https://eips.ethereum.org/EIPS/eip-4337) compatible Smart Contract Wallet focused on a secure and smarter experience for users through modular, upgradeable, and secure designs.

We aggregated the benefits from each wallet and pioneered new approaches to provide best-in-class service to users. Barz is also one of the first Passkeys based 4337 account that launched in production.

Barz, at its core is a proxy contract that utilizes the [Diamond Proxy Pattern(EIP 2535)](https://eips.ethereum.org/EIPS/eip-2535) for a scalable and secure addition of use cases with high security threshold.

Barz system currently has 12 fully built Facet implementations that can provide features of:

- Account Recovery
- Lock
- Signature Migration
- Guardian
- Restrictions (Custom Rules for Transactions)
- Diverse Validation Mechanisms
    - Secp256k1 - Default EVM Scheme (e.g., Mnemonic phrase)
    - Secp256r1 - Passkeys, Okta
    - Multi-sig

![Barz Architecture Diagram](/media/barz-diagram.png)

Let’s dive into Diamond Proxy pattern and how it works with ERC 4337. We’ll dive into the optimization points we made to Diamond for Barz in our next article.

## Diamond

Diamond is a modular smart contract system enabled by a multi-faceted proxy stated in EIP-2535.

A multi-faceted proxy is different from the conventional proxy pattern like [UUPS(Universal Upgradeable Proxy Standard)](https://eips.ethereum.org/EIPS/eip-1822) and TransparentUpgradeable where they have a single implementation to route the call to.

![Conventional Proxy Pattern e.g., UUPS](/media/conventional-proxy-pattern.png)

For example, a UUPS based proxy smart contract stores the single implementation contract address in the EIP-1967 based storage slot and performs upgrade by modifying the storage slot.

```solidity
 /**
  * @dev Storage slot with the address of the current implementation.
  * This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1.
  */
  // solhint-disable-next-line private-vars-leading-underscore
  bytes32 internal constant IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
```

```solidity
/**
 * @dev Stores a new address in the ERC-1967 implementation slot.
 */
function _setImplementation(address newImplementation) private {
    if (newImplementation.code.length == 0) {
        revert ERC1967InvalidImplementation(newImplementation);
    }
    StorageSlot.getAddressSlot(IMPLEMENTATION_SLOT).value = newImplementation;
}
```

The proxy would then delegate all calls to the implementation contract through a fallback function that makes a `delegatecall` for all calls that comes with `msg.data`.

```solidity
fallback() external payable virtual {
      assembly {
      // Copy msg.data. We take full control of memory in this inline assembly
      // block because it will not return to Solidity code. We overwrite the
      // Solidity scratch pad at memory position 0.
      calldatacopy(0, 0, calldatasize())

      // Call the implementation.
      // out and outsize are 0 because we don't know the size yet.
      let result := delegatecall(gas(), _implementation(), 0, calldatasize(), 0, 0)

      // Copy the returned data.
      returndatacopy(0, 0, returndatasize())

      switch result
      // delegatecall returns 0 on error.
      case 0 {
          revert(0, returndatasize())
      }
      default {
          return(0, returndatasize())
      }
   }
}
```

Unlike the UUPS pattern we saw above, Diamond Proxy has multiple “implementation” smart contracts, which are called Facets.

But Diamond not only includes how Proxy and Facets interact but proposes a comprehensive approach to manage the following components of a proxy contract:

- upgrade
- view
- storage

Let’s dive into the details of how Diamond works under the hood.

![Diamond Proxy Pattern](/media/diamond-proxy-pattern.png)

Considering Diamond has multiple implementation contracts called Facets, Diamond requires a routing logic to route the function call to the correct corresponding facet.

The core routing logic is implemented through a mapping of `bytes4` type which holds the function selector as the key and an `address` which holds the Facet contract address as value.

```solidity
mapping (bytes4 => address) public selectorTofacet;
```

When a function call is made to the contract and gets routed to the `fallback` function, the `fallback` function will fetch the function selector from the `calldata` through `msg.sig` and make a `delegatecall` to the facet if the corresponding facet exists and reverts otherwise.

```solidity
// Find facet for function that is called and execute the
// function if a facet is found and return any value.
fallback() external payable {
  // get facet from function selector
  address facet = selectorTofacet[msg.sig];
  require(facet != address(0));
  // Execute external function from facet using delegatecall and return any value.
  assembly {
    // copy function selector and any arguments
    calldatacopy(0, 0, calldatasize())
    // execute function call using the facet
    let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
    // get any return value
    returndatacopy(0, 0, returndatasize())
    // return any return value or error back to the caller
    switch result
      case 0 {revert(0, returndatasize())}
      default {return (0, returndatasize())}
  }
}
```

This multi-faceted proxy pattern provides a benefit of modular implementation designs by enabling each facet to be grouped into a specific domain of functionality.

For example, Account Facet could hold account related logic like `execute()`, `executeBatch()` while Token Receiver Facet could hold logic like `onERC721Received()`, `tokensReceived()`.

For a better separation of Facet logic and storage, the Diamond standard also provides an approach of `DiamondStorage` mainly for a specific Facet’s storage and `AppStorage` which is more suitable for shared storage between Facets.

`DiamondStorage` relies on a Solidity struct that contains set variables for the Facet and stores it in the designated namespace storage slot. It is particularly good for isolating or compartmenting state variables to specific facets or functionality.

```solidity
/* Example of Diamond Storage */
struct Secp256k1VerificationStorage {
    address signer;
}

bytes32 constant K1_STORAGE_POSITION =
    keccak256(
        "v0.trustwallet.diamond.storage.Secp256k1VerificationStorage"
    );

function k1Storage()
    internal
    pure
    returns (Secp256k1VerificationStorage storage ds)
{
    bytes32 storagePosition = K1_STORAGE_POSITION;
    assembly {
        ds.slot := storagePosition
    }
}
```

As the storage slot will be intentionally different to prevent storage collision, this provides a scalable approach of utilizing storage with Multiple Facets compared to the approach of using the default EVM Storage Slot.

This concept is also utilized in the Barz implementation to detach the storage between facets.

![Illustrated example of Barz storage per Facet](/media/barz-storage-management.png)

In contrast, `App Storage` is another type of storage pattern that is more suitable for storage variables that are shared among facets.

App Storage also uses the Struct to define the storage, however, uses the storage slot `0` unlike the Diamond Storage which used a custom storage slot.

For example, Barz stores the address of the `EntryPoint` contract and `signerMigration` flag which is shared across multiple facets.

```solidity
struct AppStorage {
    mapping(uint256 => InitializersStorage) initStorage;
    uint8 signerMigration;
    bytes4 validateOwnerSignatureSelector;
    IEntryPoint entryPoint;
    IFacetRegistry facetRegistry;
    mapping(uint256 => Lock) locks;
}

function appStorage() internal pure returns (AppStorage storage ds) {
    assembly {
        ds.slot := 0
    }
}
```

Let’s have a look on how Diamonds perform upgrades.

To register a new facet or remove/replace them from Diamond, the contract should comply with the standard interface of `diamondCut()`.

```solidity
interface IDiamondCut {

    enum FacetCutAction {Add, Replace, Remove}
    // Add=0, Replace=1, Remove=2

    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }
    
    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external;
    
}
```

`diamondCut()` normally performs 4 main steps

1. Ownership Check
    1. This is crucial considering that a malicious Diamond can overwrite storage or perform malicious activities
2. Facet Check
    1. Check if the Facet is indeed a contract, check if the selector is okay to be added.
    Diamond does not allow multiple facets from registering an identical function selector.
3. Add/Remove/Replace Facet’s function selector and its corresponding actions
4. Perform Diamond Init
    1. Diamond Init is an approach for one-time initialization for Diamonds similar to constructor.

Once the `diamondCut()` is called to the Diamond, the Diamond should store the mapping of `functionSelectors` and the `Facet address` to route the call from the `fallback` function.

Within the `diamondCut()` execution, Diamond also performs a process called `Diamond Init` for initializing/uninitializing state variables. This is useful during the installation and uninstallation of Facets to clean up storage.

This is enabled by making a `delegatecall` to the `_init` address with the provided `calldata` from `diamondCut()`.

For example, below is an implementation of Diamond Init contract to add ERC-165 based `supportedInterfaces()` check.

```solidity
// You can add parameters to this function in order to pass in 
// data to set your own state variables
function init() external {
    // adding ERC165 data
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    ds.supportedInterfaces[type(IERC165).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
    ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
    ds.supportedInterfaces[type(IERC173).interfaceId] = true;
}
```

Now as we’ve checked how storage and upgrade work for Diamonds, let’s check the approaches to view the status of the Diamond - `DiamondLoupe`.

`DiamondLoupe` is a standardized interface to look into Diamond. This allows external components and entities to check which Facet and Function Selectors are registered to the `Diamond`.

```solidity
// A loupe is a small magnifying glass used to look at diamonds.
// These functions look at diamonds
interface IDiamondLoupe {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    /// @notice Gets all facet addresses and their four byte function selectors.
    /// @return facets_ Facet
    function facets() external view returns (Facet[] memory facets_);

    /// @notice Gets all the function selectors supported by a specific facet.
    /// @param _facet The facet address.
    /// @return facetFunctionSelectors_
    function facetFunctionSelectors(address _facet) external view returns (bytes4[] memory facetFunctionSelectors_);

    /// @notice Get all the facet addresses used by a diamond.
    /// @return facetAddresses_
    function facetAddresses() external view returns (address[] memory facetAddresses_);

    /// @notice Gets the facet that supports the given selector.
    /// @dev If facet is not found return address(0).
    /// @param _functionSelector The function selector.
    /// @return facetAddress_ The facet address.
    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_);
}
```

The method `facets()` returns the whole information about its Facet mappings.

`facetFunctionSelectors()` returns the list of function selectors corresponding to the given facet.

`facetAddresses()` returns the list of all facets registered to the Diamond.

`facetAddress()` returns the facet address of the corresponding function selector.

By complying with this standard interface, Diamond can transparently show its state to external entities while being compatible with tools like [louper.dev](http://louper.dev).

For example, this is an overview of Barz seen from [louper.dev](http://louper.dev) tool:

[Overview of Barz from Louper - The Ethereum Diamond Inspector](https://louper.dev/diamond/0xbD741C9A6c3C197F863F0657A15D2E9070534BE3?network=polygon)

![Overview of Barz account from louper.dev](/media/louper-barz.png)

## ERC 4337 Account with Diamond

From an ERC 4337 account contract perspective, there are 2 main aspects to handle:

- Validation
- Execution

For Validation, the account should implement the `IAccount` interface specified in the ERC 4337 standard.

```solidity
interface IAccount {
  function validateUserOp
      (UserOperation calldata userOp, bytes32 userOpHash, address aggregator, uint256 missingAccountFunds)
      external returns (uint256 sigTimeRange);
}
```

For execution, it can implement its own execution methods like `execute()` and `executeBatch()` .

An example of Barz handling the 4337 logic in a modular approach through Diamond can be seen from the separation of Account Facet and Verification Facet during initialization and execution.

In the `BarzFactory` code below, users can create an account with any verification facet with their preferred signature scheme by providing the address in the `_verificationFacet` and the corresponding `_owner` for initialization.

```solidity
    /**
     * @notice Creates the Barz with a single call. It creates the Barz contract with the given verification facet
     * @param _verificationFacet Address of verification facet used for creating the barz account
     * @param _owner Public Key of the owner to initialize barz account
     * @param _salt Salt used for deploying barz with create2
     * @return barz Instance of Barz contract deployed with the given parameters
     */
    function createAccount(
        address _verificationFacet,
        bytes calldata _owner,
        uint256 _salt
    ) external override returns (Barz barz) {
        address addr = getAddress(_verificationFacet, _owner, _salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return Barz(payable(addr));
        }
        barz = new Barz{salt: bytes32(_salt)}(
            accountFacet,
            _verificationFacet,
            entryPoint,
            facetRegistry,
            defaultFallback,
            _owner
        );
        emit BarzDeployed(address(barz));
    }
```

Signer will be initialized using the `verificationFacet` provided in the `createAccount()` function.

This allows `BarzFactory` and `AccountFacet`, together with all the remaining Facets to be ***agnostic*** to the signature validation mechanism and focus on its core logic.

![Barz deploment and initalization flow](/media/barz-deployment-initialization-flow.png)

This can also be applied during the validation of UserOperation e.g., `validateUserOp()`.

With the separation of Account and Verification logic through modular designs, it enables the account to dynamically switch the signer and signature scheme depending on user’s needs and wants.

It also helps the codebase to be clean and focus on its domain logic which helps reduce potential code bugs and unwanted complexity coming from interdependencies between logic.

```solidity
    function _validateSignature(
        UserOperation calldata _userOp,
        bytes32 _userOpHash
    ) internal override returns (uint256 validationData) {
        // Get Facet with Function Selector
        address facet = LibLoupe.facetAddress(s.validateOwnerSignatureSelector);
        if (facet == address(0))
            revert AccountFacet__NonExistentVerificationFacet();

        // Make function call to VerificationFacet
        bytes memory validateCall = abi.encodeWithSelector(
            s.validateOwnerSignatureSelector,
            _userOp,
            _userOpHash
        );
        (bool success, bytes memory result) = facet.delegatecall(validateCall);
        if (!success) revert AccountFacet__CallNotSuccessful();
        validationData = uint256(bytes32(result));
        if (validationData == 0) emit VerificationSuccess(_userOpHash);
        else emit VerificationFailure(_userOpHash);
    }
```

`Account Facet` delegates the validation of UserOperation signature to the `Verification Facet` and only propagates the result from the `Verification Facet`.

![Barz UserOp Validation Flow](/media/barz-userop-validation-flow.png)

# Conclusion

The Barz Smart Wallet Architecture utilizing Diamond allows modular and flexible development of a wide array of use cases. It allows each Facets to focus on its specific business logic while providing the flexibility to easily switch each component and maintain interoperability.

In our next article, we’ll share the optimizations we did to make Diamonds much better for building smart wallets.

Stay tuned for our next article series and releases of powerful use cases of smart wallet built on [Barz](https://github.com/trustwallet/barz).

*If you have questions or want to use Trust Wallet’s AA SDK in your service or any ideas for collaboration, reach out in smartwallet channel in our [Trust Wallet Discord](https://discord.gg/trustwallet)*