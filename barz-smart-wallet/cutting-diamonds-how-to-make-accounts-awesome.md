By [David Kim](https://x.com/0xDavidKim)

Special thanks to [Luis Ocegueda](https://x.com/luis_oce), [Artem Goryunov](https://x.com/ArtemGoryunov) and Dami Odufuwa for their feedback and contributions.


This is the second of an article series on Barz. 

1. [Introducing Barz: Trust Wallet’s Smart Wallet Solution](/introducing-barz-trustwallet-smart-wallet-solution)
2. [Cutting Diamonds: How to make Accounts Awesome](/cutting-diamonds-how-to-make-accounts-awesome)
3. For Builders By Builders:  Introducing the Barz SDK
4. Multi-tier Module system. A secure foundation for open innovation

TL;DR: 

In this article, we’ll share the optimizations we did to Diamond to make Barz a more efficient and secure Smart Wallet system. We’ll also dive into the components we added outside of Diamond to enhance its security.



In our [first article](/introducing-barz-trustwallet-smart-wallet-solution), we introduced the [Barz Smart Wallet System](https://github.com/trustwallet/barz/tree/main), and we’ve also shared about the overall structure of [Barz](https://github.com/trustwallet/barz/tree/main) and how [Diamond Proxy Pattern(EIP-2535)](https://eips.ethereum.org/EIPS/eip-2535) works under the hood.

In this article, we’ll dive into the details of how we optimized Diamond and added smart contract-level infrastructural components to provide better security to our users.

But before we discuss the key points of the optimizations, let me explain how `diamondCut()` works in detail to help provide context to get us to the main point. 

## How `diamondCut()` works

[EIP 2535](https://eips.ethereum.org/EIPS/eip-2535) which proposes the Diamond pattern defines the `diamondCut()` function as a standard interface to be compatible with the Diamond standard.

`diamondCut()` is an important component in a Diamond that is used to cut them, which is referred to as *upgrading* the Diamond by adding/removing/replacing `Facets`.

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

For example, let’s assume that a Barz Smart Wallet wants to install a new Facet called `AccountRecoveryFacet` to add a recovery feature.

This could be performed by adding `AccountRecoveryFacet` with `diamondCut()`.

![Adding AccountRecoveryFacet with diamondCut()](/media/add-recovery-facet.png)

- Explanation about the existing Facets
    - ***AccountFacet***: For general account logic. e.g., `execute()`, `executeBatch()`
    - ***VerificationFacet***: For verifying the signature for the ownership check e.g., `validateOwnerSignature()`, `isValidSignature()`
    - ***TokenReceiverFacet***: For fallbacks for receiving tokens. e.g., `onERC721Received()`
    - ***DiamondCutFacet***: For upgrading Diamond. e.g., `diamondCut()`
    - ***DiamondLoupeFacet***: For checking facet state of Diamond. e.g., `facets()`, `facetFromSelectors()`

Here’s an [example of performing DiamondCut](https://github.com/trustwallet/barz/blob/d509e53196512f6730a3f9bafbf40445beaf68bb/test/foundry/AccountRecoveryFacet.t.sol#L60):

```solidity
/** ### Prepare diamondCut() with AccountRecovery Facet ### */
IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);

cut[0] = IDiamondCut.FacetCut({
   facetAddress: accountRecoveryFacet,
   action: IDiamondCut.FacetCutAction.Add,
   functionSelectors: Constants.accountRecoveryFacetSelectors()
});

address diamondInitAddress = address(0);
bytes memory initCalldata = new bytes(0x00);

bytes memory cutData = abi.encodeWithSignature(
    "diamondCut((address,uint8,bytes4[])[],address,bytes)", cut, diamondInitAddress, initCalldata
);

/** ### Perform the actual call through UserOperation ### */
bytes memory callData = encodeExecuteCall(_barz, 0, cutData);
UserOperation[] memory userOp = new UserOperation[](1);
uint256[] memory signingKey = new uint256[](1);

userOp[0] = this.prepareUserOp(address(_barz), nonce[address(_barz)]++, callData);
signingKey[0] = _ownerKey;

userOp = signUserOperation(userOp, signingKey);

entryPoint.handleOps(userOp, payable(_barz));
```

Let’s walkthrough the above code one by one.

First, we declare a `FacetCut` typed variable cut.

`FacetCut` is a custom struct declared in the [EIP 2535 standard](https://eips.ethereum.org/EIPS/eip-2535)

```solidity
enum FacetCutAction {Add, Replace, Remove}
// Add=0, Replace=1, Remove=2

struct FacetCut {
    address facetAddress;
    FacetCutAction action;
    bytes4[] functionSelectors;
}
```

The struct specifies the following:

1. Address of Facet
2. Add/Replace/Remove action
3. List of function selectors to be added

To add the `AccountRecoveryFacet`, it would be the following data that we should provide as the parameter for the `diamondCut()` function call.

```solidity
1. FacetCut that specifies the action for cutting Diamond

FacetCut {
		facetAddress: AccountRecoveryFacetAddress,
		action: FacetCutAction.Add,
		functionSelectors: [approveRecovery.selector, executeRecovery.selector, hardstopRecovery.selector...]
}

2. Address of contract that performs DiamondInit

3. Calldata to initialize/uninitialize in DiamondInit
```

Second, we’ll encode the function call into the `execute()` function format so that the account can execute and sign the `UserOperation`.

```jsx
/** ### Perform the actual call through UserOperation ### */
bytes memory callData = encodeExecuteCall(_barz, 0, cutData);
UserOperation[] memory userOp = new UserOperation[](1);
uint256[] memory signingKey = new uint256[](1);

userOp[0] = this.prepareUserOp(address(_barz), nonce[address(_barz)]++, callData);
signingKey[0] = _ownerKey;

userOp = signUserOperation(userOp, signingKey);
```

Finally, we send this to the `EntryPoint` contract to coordinate the validation and execution of `UserOperation`.

This is the step when `diamondCut()` actually gets executed.

```jsx
entryPoint.handleOps(userOp, payable(_barz));
```

We’ve just added a new Recovery feature into your Barz Smart Wallet :)

# Conditional Diamond Cut

Considering that our Diamond is an Account, a Smart Wallet, that can support diverse access control mechanisms and state, it is important to note that there are circumstances where we should not permit `diamondCut()`.  When these sensitive operations occur, the account should not be able to conduct upgrades as it could potentially result in a bypass of security checks or authorization.

For instance, it is unexpected or abnormal to perform `diamondCut()` during the Account Recovery phase where the owner’s key is suspected to be lost or during the phase when the Account is migrating its signature scheme.

For the conditional flow of `diamondCut()`, we imposed a structured pattern to the `diamondCut()` function through the `onlyWhenUnlocked` modifier.

```solidity
function diamondCut(
    FacetCut[] calldata _diamondCut,
    address _init,
    bytes calldata
) external override onlyWhenUnlocked {
    LibDiamond.enforceIsSelf();
    /** *** Code continues *** */
}
```

Below is an example of `AccountRecoveryFacet` locking the account.

```jsx
function _executeRecovery(bytes memory _recoveryPublicKey) internal {
		/** ### Simplified code showing the lock-related logic ### */
    uint64 executeAfter = uint64(block.timestamp + _getRecoveryPeriod());
    LibAppStorage.setLock(
        block.timestamp + _getLockPeriod(),
        AccountRecoveryFacet.executeRecovery.selector
    );
    emit RecoveryExecuted(_recoveryPublicKey, executeAfter);
}
```

Through this modifier, we only allow the `diamondCut()` to happen in normal state, when sensitive operations (e.g., requiring approvals of guardians) are not taking place.

---

As we’ve read through the first half of this article, we now know how to add `Facets` to Barz and how to seamlessly increase the functionality of the account while preventing these upgrades in sensitive phases through conditional `diamondCut()`.

However, if we take a moment and think from a security perspective, we may wonder:

- What if we add a malicious `Facet` into my Account?
- If Facet is an important component, can we have a registry of Facets that we can trust and use?

Let’s tackle the exact question in the **Facet Registry** section.

# Facet Registry

Diamond is a multi-faceted proxy contract where a single proxy contract has multiple implementations called `Facet` and during the execution, the Diamond makes `delegatecall` to the Facet contract.

Through the `delegatecall` triggered from the fallback function within the Diamond, it executes the logic of `Facet` contract in the context of the Diamond which will update the state of the Diamond itself.

This architecture, utilizing `Facets`, provides an extensible and modular approach for expanding the functionality of the Diamond. Each `Facet` can focus on its logic and functional domain while interacting with other Facets by calling other `Facet’s` functions within the context of the Diamond.

But similar to any other module systems, the security of the Diamond relies on the least secure `Facet` implementation, which means that adding a Facet should be performed after rigorous security checks.

It could cause a critical security risk if a malicious Facet is added to the Diamond.

*(This does not imply Diamond possess more risk compared to Monolithic pattern, it actually helps reduce bug by separating each domain logic. It’s just a trait of Diamond because each facet comprises the Diamond, Facets merging into a single full Diamond.)*

![Diamond Proxy Pattern](/media/diamond-proxy-pattern.png)

It is evident that users need to be careful when adding a new `Facet` to their wallet, but it is also very demanding and nearly infeasible to expect normal users to assess the security and correctness of a `Facet` implementation by reading the code.

To help reduce the burden on users during Facet addition and reduce the chance of users adding a malicious or vulnerable Facet, we have developed a **Facet Registry** system.

**Facet Registry** is a registry of Facets that users can trust and add to their Smart Wallet.

All the `Facets` registered to the **Facet Registry** will go through extensive security audit and validation process at Trust Wallet to ensure it only includes Facets with very high security thresholds.

Also, further checks are conducted to confirm that each Facet’s storage or logic does not collide with one other before being registered to the registry.

![FacetRegistry forbidding malicious Facets from being added](/media/facet-registry.png)

Through **Facet Registry**, users will be able to add `Facets` and frictionlessly make upgrades with much less security burdens to them.

Let’s see an example of how **Facet Registry** works with `Barz` .

```solidity
function diamondCut(
    FacetCut[] calldata _diamondCut,
    address _init,
    bytes calldata
) external override onlyWhenUnlocked {
    LibDiamond.enforceIsSelf();

		/** ### Check if Facets getting added is registered to FacetRegistry ### */
    _checkFacetCutValidity(_diamondCut);
    // require approval from guardian if guardian exists
    if (0 != LibGuardian.guardianCount())
        revert DiamondCutFacet__InvalidRouteWithGuardian();
    if (address(0) != _init) revert DiamondCutFacet__InvalidInitAddress();

    unchecked {
        ++LibFacetStorage.diamondCutStorage().nonce;
    }
    LibDiamond.diamondCut(_diamondCut, address(0), "");
}
```

In Barz’s `DiamondCutFacet`, there is the `diamondCut()` which handles the logic related to Diamond upgrades.

Within the `diamondCut()`, there is a `_checkFacetCutValidity()` which checks the validity of the Facet being added.

`_checkFacetCutValidity()` will make calls to the **Facet Registry** to confirm if it is safe to add this `Facet`.

```solidity
function _checkFacetCutValidity(
    IDiamondCut.FacetCut[] memory _diamondCut
) internal view {
    uint256 diamondCutLength = _diamondCut.length;
    for (uint256 i; i < diamondCutLength; ) {
        if (
            _diamondCut[i].action == IDiamondCut.FacetCutAction.Add ||
            _diamondCut[i].action == IDiamondCut.FacetCutAction.Replace
        ) {
        /** ### Query the FacetRegistry if it is okay to add this Facet ### */
            if (
                !s.facetRegistry.areFacetFunctionSelectorsRegistered(
                   _diamondCut[i].facetAddress,
                   _diamondCut[i].functionSelectors
                )
            ) revert UnregisteredFacetAndSelectors();
        }
        unchecked {
           ++i;
        }
    }
}
```

**Facet Registry** will go through its internal logic to check if the facet is registered when it’s queried through `areFacetFunctionSelectorsRegistered()` . The rest of the flow within `diamondCut()` will continue if the `Facets` are registered to the **Facet Registry** and revert otherwise.

*IMPORTANT NOTE: Facet Registry is only an additional layer of security provided by Trust Wallet. It does not have any right against user’s assets. Also, if the Facet is already added to user’s Smart Wallet, it does not have any right to perform removal or upgrades for user’s account. Facet Registry cannot trigger any type of state changes that changes the state of user’s account or balance. The code is fully open sourced.*

# Diamond Init

One important part to note during the `diamondCut()` execution is the send and third parameter (`_init`, `_calldata`) that enables an initialization mechanism called `DiamondInit` which makes a one-time call to the initializer for the new facet.

It is enabled by making a `delegatecall` to the given contract with the provided `calldata`.

Let’s see the internal implementation of `DiamondInit` to check how it is enabled:

```solidity
function diamondCut(
    IDiamondCut.FacetCut[] memory _diamondCut,
    address _init,
    bytes memory _calldata
) internal {
    DiamondStorage storage ds = diamondStorage();
    // ************ Diamond Cut Logic ************ //
    // NOTE: This is assuming the `Add` operation of DiamondCut
	  // 1-1. Check if Facet address has contract code(to check it's a smart contract)
		// 1-2. Loop through each functionSelectors variable in the _diamondCut array
		// 1-3. Checks if there is no existing facet registered to the function selector
		// 1-4. Register the Function Selector and it's corresponding facet data into it's corresponding storage
		// 1-5. Emit DiamondCut event as below
    emit DiamondCut(_diamondCut, _init, _calldata);
        
    // ************ Diamond Init Logic ************ //
    // 2-1. Check if the Contract to perform Diamond Init is a zero address. Return if it is zero.
    if (_init == address(0)) {
        return;
    }
    // 2-2. Check if the Contrct to perform Diamond Init has contract code. 
    //    This is to check if the given contract is a smart contract(CA not EOA).
    enforceHasContractCode(
        _init,
        "LibDiamondCut: _init address has no code"
    );
    // 2-3. Makes the delegatecall and revert if it fails.
    (bool success, bytes memory error) = _init.delegatecall(_calldata);
    if (!success) {
        if (error.length > 0) {
            // bubble up error
            /// @solidity memory-safe-assembly
            assembly {
                let returndata_size := mload(error)
                revert(add(32, error), returndata_size)
            }
        } else {
            revert InitializationFunctionReverted(_init, _calldata);
        }
    }
}
```

This approach also synchronizes the upgradeability and state initialization into the same transaction, which helps ensure the Diamond to maintain a consistent state.

As shared in the above code, Diamond Init provides a good way to initialize the storage right after the Diamond Cut operation.

An example of using Diamond Init could be during the setup of ERC165 settings for a newly added `Facet`.

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

The above code will allow Diamond to set it’s ERC165 storage to reflect the newly added `Facet`.

# Remove Diamond Init From `diamondCut()` for Security

Even though Diamond Init is very useful and is a novel approach to initialize state, it may not be the best for every scenario, especially for Accounts.

For instance, an attacker may request a malicious payload to add Valid `Facet` but with a malicious Diamond Init address and calldata to the user for approval - frauding the user as if it was a valid, secure operation.

Upon user’s approval, regardless of the `Facet` being added is valid or not valid, as the Diamond Init address and calldata is malicious, it will be able to override ownership or perform unintended asset transfer.

Let’s see the below example for a better understanding of the scenario:

1. Assume an account is using `Secp256k1VerificationFacet` for ownership validation and signature validation.
    
    Storage of `Secp256K1VerificationFacet`: 
    
    ```solidity
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
    
2. Malicious entity may request for an addition of valid/secure `AccountRecoveryFacet`, but with the malicious Diamond Init code.
    
    Below is the malicious implementation of Diamond Init contract targetting the users using `Secp256K1VerificationFacet`
    
    ```solidity
    function init() external {
    		/** ### Perform valid action ### */
    		LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.supportedInterfaces[type(IAccountRecoveryFacet).interfaceId] = true;
        
        /** ### Perform overwrite of ownership ### */
        k1Storage().signer = maliciousAddress;
    }
    ```
    

We considered the following aspects

1. Performing a `delegatecall` to an unknown address is risky, even if the owner may approve it.
2. Adding/Replacing/Removing Facets could be a relatively frequently process as more features and functionalities are added for the users.
3. Initialization/Uninitialization during the setup of Diamond is a common and useful pattern.

*We have decided to disallow DiamondInit logic in Barz and use the approach of imposing an initializer within the Facet that allows a one-time call to setup storage.*

This provides the benefit of:

1. Higher security by disallowing `delegatecall` to arbitrary contract.
2. More structured approach for initializing storage within the `Facet` itself.

Let’s see how an example of how this `initialize()` is implemented in the `AccountFacet` contract:

```solidity
function initialize(
    address _verificationFacet,
    address _anEntryPoint,
    address _facetRegistry,
    address _defaultFallBackHandler,
    bytes calldata _ownerPublicKey
) public override returns (uint256 initSuccess) {
    LibAppStorage.enforceAccountInitialize();
    s.entryPoint = IEntryPoint(_anEntryPoint);
    s.facetRegistry = IFacetRegistry(_facetRegistry);
    LibDiamond.diamondStorage().defaultFallbackHandler = IDiamondLoupe(
        _defaultFallBackHandler
    );

    _cutDiamondAccountFacet(_verificationFacet);

    bytes memory initCall = abi.encodeWithSignature(
        "initializeSigner(bytes)",
        _ownerPublicKey
    );
    // Every Verification Facet should comply with initializeSigner(bytes)
    // to be compatible with the Barz contract(for initialization)
    (bool success, bytes memory result) = _verificationFacet.delegatecall(
        initCall
    );
    if (!success || uint256(bytes32(result)) != 1) {
        revert AccountFacet__InitializationFailure();
    }

    initSuccess = 1;
    emit AccountInitialized(s.entryPoint, _ownerPublicKey);
}

```

Barz approach of forbidding a delegatecall to an arbitrary address and substituting it with an initializer with the Facet eliminates the risk or an attacker of overwriting storage or making unintended asset transfers.

This change increases the security threshold by removing this attack vector coming from DiamondInit and by only enabling initialization through initializers within Facets that are registered to Facet Registry.

---

Congratulations, you have reached the final section on learning to build a cutting-edge account with Diamond.

You may have understood the flexibility and modularity Bars is able to provide with tailored security architecture for Accounts.

But one important aspect remains to incorporate all these pieces into a powerful product for users, GAS.

Let’s dive into the details in the next section to see how Trust Wallet managed to decrease more than `50%` of gas during account creation.

# Default Fallback Handler

In smart contract engineering, other existing software engineering principles like modularity, abstraction, encapsulation, simpleness, and more also exists but the one other important principle that requires much attention is it’s efficiency during execution, in simpler terms, gas efficiency.

Diamond pattern excels in providing modular upgradeability, but compared to other monolithic proxy patterns, it does include more advanced computations and checks to perform upgrades.

In this section, we’ll dive into the `DefaultFallbackHandler` component that Trust Wallet developed to reduce about 55% of deployment gas fee.

The default `diamondCut()` for adding the below facets during account deployment cost about `1 million gas units` (23 functions in total).

[Barz in louper.dev](https://louper.dev/diamond/0xbD741C9A6c3C197F863F0657A15D2E9070534BE3?network=polygon)

![Barz account in louper.dev](/media/diamond-louper-dev.png)

The part where it cost the most gas is the execution of updating storage for each function selector’s corresponding facet address.

```solidity
if (_action == IDiamondCut.FacetCutAction.Add) {
    enforceHasContractCode(
        _newFacetAddress,
        "LibDiamondCut: Add facet has no code"
    );
    for (uint256 selectorIndex; selectorIndex < _selectors.length; ) {
        bytes4 selector = _selectors[selectorIndex];
        bytes32 oldFacet = ds.facets[selector];
        require(
            address(bytes20(oldFacet)) == address(0),
            "LibDiamondCut: Can't add function that already exists"
        );
        // add facet for selector
        ds.facets[selector] =
            bytes20(_newFacetAddress) |
            bytes32(_selectorCount);
        // "_selectorCount & 7" is a gas efficient modulo by eight "_selectorCount % 8"
        // " << 5 is the same as multiplying by 32 ( * 32)
        uint256 selectorInSlotPosition = (_selectorCount & 7) << 5;
        // clear selector position in slot and add selector
        _selectorSlot =
            (_selectorSlot &
                ~(CLEAR_SELECTOR_MASK >> selectorInSlotPosition)) |
            (bytes32(selector) >> selectorInSlotPosition);
        // if slot is full then write it to storage
        if (selectorInSlotPosition == 224) {
            // "_selectorSlot >> 3" is a gas efficient division by 8 "_selectorSlot / 8"
            ds.selectorSlots[_selectorCount >> 3] = _selectorSlot;
            _selectorSlot = 0;
        }
        _selectorCount++;

        unchecked {
            selectorIndex++;
        }
    }
}
```

Although we understood that this was the default behavior of Diamonds which is updating each function selector’s mapping to facet address value, we tried to look for ways tailored to the Account to reduce the gas consumption as much as possible.

During this time, [Nick(Author of EIP-2535 Diamonds)](https://x.com/mudgen) and I had a discussion on how we could further optimize the gas consumption during the `diamondCut()` for default facets, and we came up with an interesting idea of having a pre-existing entity that holds the values for the Diamond’s functionSelector <> Facet mapping.

After having this interesting idea, our team started the implementation of a standalone contract that provides the default mapping value of the diamond, and named it `DefaultFallbackHandler`.

We designed the `DefaultFallbackHandler` to include the default Facets for the accounts like `AccountFacet`, `DiamondCutFacet`, `DiamondLoupeFacet` and `TokenReceiverFacet`.

While we saw the significant decrease in gas during the `diamondCut()` at this stage, it was very important that `DefaultFallbackHandler` does not introduce any security vulnerability or get us handcuffed to the initial value set by the `DefaultFallbackHandler`.

Considering the above aspects and the importance of this contract globally impacting the whole Barz system on chain, we had `2 key principles` when we designed this system:

1. No one should be able to upgrade or modify it → permissionless & non-upgradeable
(Upgrading it means, it is allowing the upgrader to add a functionality to the user’s account without user’s consent)
2. Even if the default function-set is added by `DefaultFallbackHandler` in the initial state, the owner of the account should always be able to override it.

With these key principles in mind, we have designed the `DefaultFallbackHandler`.

Let’s see the actual codebase to see how these principles are reflected at the code level.

1. No one should be able to upgrade or modify it → Permissionless & non-upgradeable
    
    [Link to the actual code - DefaultFallbackHandler](https://github.com/trustwallet/barz/blob/main/contracts/infrastructure/DefaultFallbackHandler.sol)
    
    ```solidity
    contract DefaultFallbackHandler is IDiamondLoupe {
        /**
         * @notice Sets the middleware diamond for Barz wallet as a fallback handler
         * @dev This contract is also a diamond that holds the default facets to reduce gas cost for wallet activation.
         *      Within the constructor this conducts diamond cut to initially setup the diamond. This is a non-upgradeable contract
         * @param _diamondCutFacet Address if diamond cut facet
         * @param _accountFacet Address account facet
         * @param _tokenReceiverFacet Address of token receiver facet
         * @param _diamondLoupeFacet Address of diamond loupe facet
         */
        constructor(
            address _diamondCutFacet,
            address _accountFacet,
            address _tokenReceiverFacet,
            address _diamondLoupeFacet
        ) payable {
            IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](4);
            bytes4[] memory functionSelectors = new bytes4[](1);
            functionSelectors[0] = IDiamondCut.diamondCut.selector;
    
            bytes4[] memory accountFunctionSelectors = new bytes4[](5);
            accountFunctionSelectors[0] = IAccountFacet.execute.selector;
            accountFunctionSelectors[1] = IAccountFacet.executeBatch.selector;
            /** *** the code follows *** */
        }
    }
    ```
    
    As shared in the above codebase, the `DefaultFallbackHandler` is a `non-Ownable` and `non-Upgradeable` smart contract. Once the value is set to the smart contract during the deployment process through the constructor, the `DefaultFallbackHandler` will be a non-modifiable smart contract that only provides view-only functions to allow `Barz` accounts to read the contract storage for routing the coming calls to the corresponding Facets.
    
2. Even if the default function-set is added by `DefaultFallbackHandler` in the initial state, the owner of the account should always be able to override it.
    
    [Link to the actual code - Barz](https://github.com/trustwallet/barz/blob/main/contracts/Barz.sol#L63)
    
    ```solidity
    /**
     * @notice Fallback function for Barz complying with Diamond Standard with customization of adding Default Fallback Handler
     * @dev Find facet for function that is called and execute the function if a facet is found and return any value.
     */
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = address(bytes20(ds.facets[msg.sig]));
        if (facet == address(0))
            facet = ds.defaultFallbackHandler.facetAddress(msg.sig);
        require(facet != address(0), "Barz: Function does not exist");
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
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
    ```
    
    In the above code, we query the value from the `DefaultFallbackHandler` only when Barz does not have the corresponding facet registered.
    
    This fallback architecture allows the user to override its value by adding the Facet directly to the account, which helps the account to adhere to the 2nd principle.
    

Through the `DefaultFallbackHandler`, we were able to reduce the deployment fee by around `55%` (approximately from `1,000,000` → `431,000` gas units) while adhering to strong security guarantees and self-sovereignty/control of the account.

# Conclusion

Barz Smart Wallet utilizes the Diamond proxy pattern that provides a very flexible management of functionality through Facets but also made optimizations and enhancements to the Diamond, tailored for it’s use case while retaining high security and self-sovereignty of the account.

In our next article, we’ll dive into the details of Trust Wallet’s Barz SDK.

Stay tuned for our next article in this series and releases on the powerful use cases of smart wallets built on Barz.

*If you have questions or want to use Trust Wallet’s AA SDK in your service or any ideas for collaboration, reach out in the smartwallet channel in our [Discord](https://discord.gg/trustwallet)*
