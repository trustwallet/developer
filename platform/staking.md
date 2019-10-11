# TrustWallet Staking Platform

In order to make TrustWallet the  #1 staking platform in the world, we provide 
a set of open source libraries and documentation to help blockchain developers to
integrate their staking solution. With TrustWallet, you'll have access to millions of
users to help you grow and secure your network.

## Step 1: Talk about your implementation
Create an issue in [Trust Platform](https://github.com/trustwallet/web-core/tree/master/packages/rpc/src/cosmos) describing your poject. Please fill the following questions before proceding with your implementation:

1) Is your staking on or off-chain?
   > If it's offchain, please describe how it's implemented

2) If it's on chain, is it implemented natively or using a smart contract? 
   > Please describe all parameters required to build the message or call a smart contract.

3) What are the staking rules of your blockchain?
   > Minimum value, locktime, lockout, etc.

4) Do you have any required step before staking? If yes, describe it.
   > Describe any required sep like token swap or balance freezing

## Step 2: Return Staking Data
Trust Platform retrieve staking data from [blockatlas](https://github.com/trustwallet/blockatlas). Blockatlas is used as a common interface for querying data from different blockchains. To support staking you have to implement the following interfaces:

### [Models](https://github.com/trustwallet/blockatlas/blob/master/pkg/blockatlas/staking.go)

##### ValidatorPage
```go
type Amount string

type StakingReward struct {
  Annual float64 `json:"annual"`
}

type Validator struct {
  ID            string        `json:"id"`
  Status        bool          `json:"status"`
  Reward        StakingReward `json:"reward"`
  LockTime      int           `json:"locktime"`
  MinimumAmount Amount        `json:"minimum_amount"`
}

type ValidatorPage []Validator
```

##### DelegationsPage
```go
type DelegationStatus string

const (
  DelegationStatusActive  DelegationStatus = "active"
  DelegationStatusPending DelegationStatus = "pending"
)

type StakeValidatorInfo struct {
  Name        string `json:"name"`
  Description string `json:"description"`
  Image       string `json:"image"`
  Website     string `json:"website"`
}

type StakeValidator struct {
  ID            string             `json:"id"`
  Status        bool               `json:"status,omitempty"`
  Info          StakeValidatorInfo `json:"info,omitempty"`
  Reward        StakingReward      `json:"reward,omitempty"`
  LockTime      int                `json:"locktime,omitempty"`
  MinimumAmount Amount             `json:"minimum_amount,omitempty"`
}

type Delegation struct {
  Delegator StakeValidator `json:"delegator"`

  Value    string           `json:"value"`
  Status   DelegationStatus `json:"status"`
  Metadata interface{}      `json:"metadata,omitempty"`
}

type DelegationsPage []Delegation
```

### [Interface](https://github.com/trustwallet/blockatlas/blob/master/pkg/blockatlas/api.go)
```go
// StakingAPI provides staking information
type StakeAPI interface {
  Platform
  GetValidators() (ValidatorPage, error)
  GetDelegations(address string) (DelegationsPage, error)
}
```

To active Staking in your blockchain, imeplement the `StakeAPI` interface into your blockchain API. eg: `blockatlas/platform/:blockchain/api.go`. `GetValidators` method has to return the list of available validators (plese check Step 5) and `getDelegatios` should return the list of current delegations.

Please follow [tron](https://github.com/trustwallet/blockatlas/blob/master/platform/tron/api.go) and [cosmos](https://github.com/trustwallet/blockatlas/blob/master/platform/cosmos/api.go) implementations for more details.

## Step 3: Signing
If your blockchain implements staking natively, please describe all message types required to `delegate`, `withdraw funds` then open a pull request to [wallet-core](https://github.com/trustwallet/wallet-core) project. You have to include test cases with a correct message for each action. 

If you blockchain uses a smart contract call, please check if your implementation in wallet-core supports smart contract call. Please create a protobug message that encodes and simplifies the smart contract call. *Checkout [tron TRC20](https://github.com/trustwallet/wallet-core/blob/master/src/proto/Tron.proto) signing [implementation](https://github.com/trustwallet/wallet-core/blob/master/src/Tron/Signer.cpp) for example*. Include correct test cases for all call required to `delegate` and `withdraw funds`.

**Pull request without tests will be rejected.**

## Step 4: RPC Endpoints
Please implement all RPC methods required for staking in your blockchain and add them to [web-core rpc package](https://github.com/trustwallet/web-core):

Plese checkout [cosmos](https://github.com/trustwallet/web-core/tree/master/packages/rpc/src/cosmos) and [tron](https://github.com/trustwallet/web-core/tree/master/packages/rpc/src/tron) rpc implementations.
  

## Step 5: Validators List
- Open a pull request to [trust assets](https://github.com/trustwallet/assets) and add all validators
  that will be supported by TrustWallet.
    - Create a folder with the following format `/blockchains/<network_name>/validators` if one not yet not exist.
    - The folder should contain the following files and subfolders:
      ```
      .
      ├──blockchains/:blockchain:/validators
      |                           └──assets
      |                           |  └──<validator_address>
      |                           |      └──logo.png
      |                           |
      |                           └──list.json
      ```
    - Inside `assets` you have to add the logo for each supported validator, where `:validator:` is the 
    the validator address.
    - The file `list.json` show following the format below:
      ```
        [
            {
                "id": string,
                "name": string,
                "description": string,
                "website": string
            }
        ]
      ```
    - You can find a sample [here](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos).

    * Minimum 3 validators required to support staking on TrustWallet platform.

After you finish your all 5 steps, please comment the issue on [trust platform](https://github.com/trustwallet/platform) describing
all steps and their respective pull requests. Happy coding!
