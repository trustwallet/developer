# TrustWallet Staking Platform

In order to make TrustWallet the  #1 staking platform in the world, we provide 
a set of open source libraries and documentation to help blockchain developers to
integrate their staking solution. With TrustWallet, you'll have access to millions of
users to help you grow and secure your network.

![](/media/staking-steps.png)

The image above describes all steps necessary to integration your staking solution 
to TrustWallet. You need to follow different steps depending on how staking was developed
in your blockchain: if is on chain, you should start with `Step 1`, if not, `Step 2`.

## Step 1: Define the staking protobuf messages
  - Define a all protobuf messages required to `stake`, `unstake` and `withdraw rewards`.
  You can find and example of how Cosmos did it [here](https://github.com/trustwallet/wallet-core/blob/master/src/proto/Cosmos.proto).
  - Integrate your blockchain signer to [AnySigner](https://github.com/trustwallet/wallet-core/blob/master/src/Any/Signer.cpp) 
  if not included. `AnySigner` is used to expose wallet-core signing features to dApps.
  - After you finish the implementation, you have to open a pull request to [wallet-core](https://github.com/trustwallet/wallet-core) project.

## Step 2: Describe the staking smart contract
  - If you staking implementation uses another blockchain like Ethereum, your have to specify the blockchain you're using, the 
  smart contract address and all inputs necessary to `stake`, `unstake` and `withdraw rewards`. 
  - Open a pull request to [trust platform](https://github.com/trustwallet/platform) with all necessary information
  to implement the actions above. 
 
## Step 3: Define RPC endpoints for blockatlas
  - You have to define RPC endpoints to fetch the following data:
    - Validators list
    - Staking pool (if applicable)
    - Current annual APR
  - After finishing the implementation, open a pull request to [blockatlas](https://github.com/trustwallet/blockatlas) project.
  You can find an example for Cosmos [here](https://github.com/trustwallet/blockatlas/tree/master/platform/cosmos)

## Step 4: Define Validators Information
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

## Step 5: Define RPC Endpoints for Platform
  - If Staking is on chain, please provide all RPC methods that are needed for a Dapp and add them to [web-core](https://github.com/trustwallet/web-core)
  project.
  - You have to create a TypeScript RPC class to communicate with your blockchain following methods:
    - `broadcastTransaction(transaction: string)`
    - `getAccount(address:string)`
    - `listDelegations(address:string)`
  - You have to define all methods returned by those methods.
  - You can find a sample implementation [here](https://github.com/trustwallet/web-core/tree/master/packages/rpc/src/cosmos).
  - After`you finish your implementation, open a pull request to [web-core](https://github.com/trustwallet/web-core) project.

After you finish your all 5 steps, please open an issue on [trust platform](https://github.com/trustwallet/platform) describing
all steps and their respective pull requests. Happy coding!
