Targeting Ethereum and EVM-compatible chains is the most popular option among developers, especially L2 chains like [Binance Smart Chain](https://www.bnbchain.org/en) and [Polygon](https://polygon.technology/), which offer near-zero transaction fees. Other advantages of choosing such networks are their accessibility and ease of development through [Solidity](https://docs.soliditylang.org/), a high-level language for implementing smart contracts. Those, combined with the ease of integrating browser extension wallets into websites, add to the development experience.

But why EVM-compatible browser extension wallets are so popular, and what does it mean for you as a developer? Let's see a high-level overview of those wallets' architecture to answer this question.

The most crucial aspect is that the web extension injects a script into each browser tab. That script defines an **Injected Provider** global object, allowing the websites to communicate with the browser extension. The communication method is a standardized protocol known as [JSON-RPC](https://www.jsonrpc.org/specification). We will get to that shortly, but remember that each wallet injects its own provider instance. Also, Note that wallets use JSON-RPC to communicate with various blockchains.

# Accessing the Injected Provider

The Injected Provider is a global object that implements all the methods of the [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) specification and is available as `window.ethereum`.

> [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) defines events implemented by all wallets and allows clients to communicate with them in a standardized manner. It also specifies how each wallet should handle custom events. In the official standard, the term "Injected Provider" is referred as "the Provider". However, using the official term, even if it is strictly defined with a clear purpose, can lead to misunderstandings for new users. For that reason, we refer to "the Provider" for browser extension wallets as the Injected Provider.

We already mentioned in the previous section that each wallet injects its provider, so the question that naturally arises is: What is the value of `window.ethereum` when multiple injected providers exist, ie users have multiple wallets installed?

There are times when users might have multiple wallets installed in their browsers which can cause one wallet Injected Provider to override another. [EIP-5749](https://eips.ethereum.org/EIPS/eip-5749) tries to fix that, but until it gets approved and adopted, there is no standardized way of solving this issue. Some wallets, such as Trust Wallet, define `window.ethereum.providers` array to save other Injected Providers from overriding. The value of `window.ethereum` when multiple wallets are installed, is non-deterministic, but usually, the last Injected Provider wins. Most wallets define their flag in their respective providers to distinguish them from other wallet providers. For instance, TW defines `isTrust` flag. Developers can read the presence of those flags to determine which wallet the corresponding provider refers to. Trust Wallet also offers its provider under `window.trustwallet`.

To sum up, there are three places where we can check the existence of the TW injected provider: in `window.ethereum` by checking `isTrust` flag, `window.ethereum.providers` by checking each array element for the presence of `isTrust` flag, and last `window.trustwallet`.

Let's implement a function `getTrustWalletFromWindow` that will allow us to retrieve the TW provider.

```jsx
function getTrustWalletFromWindow() {
  const isTrustWallet = (ethereum) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust;

    return trustWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  if (!injectedProviderExist) {
    return null;
  }

  if (isTrustWallet(window.ethereum)) {
    return window.ethereum;
  }

  if (window.ethereum?.providers)
    return window.ethereum.providers.find(isTrustWallet) ?? null;
  }

  return window["trustwallet"] ?? null;
}
```

`getTrustWalletFromWindow` will return either the Trust Waller Injected Provider or `null` if it cannot be found. We can assume that if the function returns `null`, TW is not installed in the user's browser. But wait, there is a catch!

An [issue affects web extensions that utilize manifest V3](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ib-hi7hPdW8/m/34mFf8rrGQAJ?pli=1) and causes the injected provider to be initialized after the website loads. In that case, we must wait for the `trustwallet#initialize` event.

```jsx
async function listenForTrustWalletInitialized(
  { timeout } = { timeout: 2000 }
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getTrustWalletFromWindow());
    };

    window.addEventListener("trustwallet#initialized", handleInitialization, {
      once: true,
    });

    setTimeout(() => {
      window.removeEventListener(
        "trustwallet#initialized",
        handleInitialization,
        { once: true }
      );
      resolve(null);
    }, timeout);
  });
}
```

`listenForTrustWalletInitialized` registers a listener for the `trustwallet#initialization` event that resolves to the Trust Wallet Injected Provider or `null` if it cannot be retrieved after a specific timeout. The default timeout value is set to 2 seconds, which is more than enough.

We can now combine these two functions. This ensures that we handle all edge cases that might occur.

```jsx
export async function getTrustWalletInjectedProvider(
  { timeout } = { timeout: 3000 }
) {
  const provider = getTrustWalletFromWindow();

  if (provider) {
    return provider;
  }

  return listenForTrustWalletInitialized({ timeout });
}

async function listenForTrustWalletInitialized(
  { timeout } = { timeout: 3000 }
) {
  return new Promise((resolve) => {
    const handleInitialization = () => {
      resolve(getTrustWalletFromWindow());
    };

    window.addEventListener("trustwallet#initialized", handleInitialization, {
      once: true,
    });

    setTimeout(() => {
      window.removeEventListener(
        "trustwallet#initialized",
        handleInitialization,
        { once: true }
      );
      resolve(null);
    }, timeout);
  });
}

function getTrustWalletFromWindow() {
  const isTrustWallet = (ethereum) => {
    // Identify if Trust Wallet injected provider is present.
    const trustWallet = !!ethereum.isTrust;

    return trustWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  // No injected providers exist.
  if (!injectedProviderExist) {
    return null;
  }

  // Trust Wallet was injected into window.ethereum.
  if (isTrustWallet(window.ethereum)) {
    return window.ethereum;
  }

  // Trust Wallet provider might be replaced by another
  // injected provider, check the providers array.
  if (window.ethereum?.providers) {
    // ethereum.providers array is a non-standard way to
    // preserve multiple injected providers. Eventually, EIP-5749
    // will become a living standard and we will have to update this.
    return window.ethereum.providers.find(isTrustWallet) ?? null;
  }

  // Trust Wallet injected provider is available in the global scope.
  // There are cases that some cases injected providers can replace window.ethereum
  // without updating the ethereum.providers array. To prevent issues where
  // the TW connector does not recognize the provider when TW extension is installed,
  // we begin our checks by relying on TW's global object.
  return window["trustwallet"] ?? null;
}
```

Now that we have `getTrustWalletInjectedProvider` let's see some common functionalities you want to implement to your application. For all the below examples, we will assume that `injectedProvider` is the Injected Provider of the Trust Wallet browser extension and implements the methods defined in [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193).

```jsx
const injectedProvider = await getTrustWalletInjectedProvider();
```

## Connecting to Trust Wallet

Connecting to Trust Wallet means accessing the user's selected account. This is different than what you may be used to when developing authenticating logic in web2 apps. Connection to web3 wallets is stateless and serves more like a "pairing" mechanism. There is no concept of "logging/authenticating into wallet". Once you request access to the wallet, this access is kept until the users choose to disconnect/unpair the wallet from your website.

Requesting access to a user's account can be achieved through the `eth_requestAccounts` method.

```jsx
try {
  const account = await injectedProvider.request({
    method: "eth_requestAccounts",
  });

  console.log(account); // => ['0x...']
} catch (e) {
  if (e.code === 4001) {
    console.error("User denied connection.");
  }
}
```

If a connection were established beforehand, the returning result would be an array with only one element: the selected account.

Otherwise, a notification will appear to users if a previous connection was not established, prompting them to initialize a new connection. If the user decides to reject this request, the promise will be rejected with a status code of `4001` . You can read more about various error status codes [here](https://eips.ethereum.org/EIPS/eip-1193#provider-errors).

## Get selected account

You can access the selected account for a connected wallet at any point in time using the `eth_accounts` method. Like `eth_requestAccounts`, the returning value will be an array with only one element: the selected account. The distinction is that `eth_accounts` assumes a connection is already established. If this is not the case, the returned value will be an empty array. No connect notification will be sent to the user.

```jsx
const accounts = await injectedProvider.request({
  method: "eth_accounts",
});
```

## Listening for accounts change & disconnect events

Users are allowed to change their connected accounts from within their wallets, as well as to disconnect entirely. You will have to update your website state to accommodate the new account state change when this happens. This can be achieved by listening to the `accountsChanged` event. The callback offers one parameter `accounts` which is an array that will contain one element, the new selected account, or zero elements when users disconnect their wallets. Most times you have to combine the accounts changed and disconnect logic into the same event listener.

```jsx
injectedProvider.addListener("accountsChanged", (accounts) => {
  if (accounts.length === 0) {
    console.log("User disconnected.");
  } else {
    const newConnectedAccount = accounts[0];
    console.log(newConnectedAccount); // => '0x...'
  }
});
```

## Listening for chain id change events

Changing the connected chain id is also another everyday use case for users. For instance, many decentralized exchanges support multiple networks and offer that functionality to their users.

As a developer, you can listen to `chainChanged` events. The callback will contain the new chain id in either hexadecimal or decimal format.

```jsx
injectedProvider.addListener("chainChanged", (id) => {
  console.log(id); // => '0x1'
});
```

> **Tip**: You can use `parseInt` without specifying the radix to convert it to number type.

Each blockchain has its chain id. You can use a website like [https://chainlist.org/](https://chainlist.org/) to find out which chain id pairs to what network.

## Request chain id change

You can also request a chain id change yourself. Most dApps are published to specific blockchains, so you want to ensure that users are connected to the correct chain. This can be achieved using `wallet_switchEthereumChain` method and passing the hexadecimal value of the desired chain.

```jsx
try {
  await injectedProvider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x1" }], // Ensure the selected network is Etheruem
  });
} catch (e) {
  if (e.code === 4001) {
    setError("User rejected switching chains.");
  }
}
```

A notification will appear if users are not connected to the desired network, prompting them to change their network. Users who reject this request will trigger an error with `4001` as the status code. If the desired network is selected, this request will resolve without any additional action required by the user.

## Get selected chain id

You can access the selected chain at any point in time using the `eth_chainId` method. You don't need an active connection to execute this method successfully.

```jsx
const chainId = await injectedProvider.request({ method: "eth_chainId" });
```

## A complete basic example

All the previous events are part of the basic building blocks for every website. You can combine them to create the desired flow for your app. Below, you will find a simple working example in React.

```jsx
import React from "react";

// This is the same implementation presented in the previous sections.
import { getTrustWalletInjectedProvider } from "./trustWallet";

const App = () => {
  const [initializing, setInitializing] = React.useState(true);
  const [injectedProvider, setInjectedProvider] = React.useState(null);
  const [initializationError, setInitializationError] = React.useState("");

  const [connected, setConnected] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState("");
  const [chainId, setChainId] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const initializeInjectedProvider = async () => {
      const trustWallet = await getTrustWalletInjectedProvider();

      if (!trustWallet) {
        setInitializationError("Trust Wallet is not installed.");
        setInitializing(false);
        return;
      }

      setInjectedProvider(trustWallet);
      setInitializing(false);
    };

    initializeInjectedProvider();
  }, []);

  const connect = async () => {
    try {
      setError("");

      const accounts = await injectedProvider.request({
        method: "eth_requestAccounts",
      });

      const chainId = await injectedProvider.request({ method: "eth_chainId" });

      setSelectedAccount(accounts[0]);
      setChainId(chainId);
      setConnected(true);

      injectedProvider.addListener("chainChanged", setChainId);

      injectedProvider.addListener("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          setConnected(false);
          setSelectedAccount("");
          setChainId("");
        } else {
          const connectedAccount = accounts[0];
          setSelectedAccount(connectedAccount);
        }
      });
    } catch (e) {
      console.error(e);
      if (e.code === 4001) {
        setError("User denied connection.");
      }
    }
  };

  const switchChain = async () => {
    try {
      await injectedProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
    } catch (e) {
      console.error(e);
      if (e.code === 4001) {
        setError("User rejected switching chains.");
      }
    }
  };

  if (initializing) {
    return <p>Waiting for provider...</p>;
  }

  if (initializationError) {
    return <p style={{ color: "red" }}>{initializationError}</p>;
  }

  if (connected) {
    return (
      <div>
        <p style={{ color: "red" }}>{error}</p>
        <p>Selected account: {selectedAccount}</p>
        <p>Selected chainId: {chainId}</p>
        {chainId !== "0x1" && (
          <button onClick={switchChain}>Switch to Ethereum</button>
        )}
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={connect}>Connect</button>
    </div>
  );
};

export default App;
```

# Interacting with smart contracts

Pairing a website with the Trust Wallet browser extension is only half the story. We often request access to the wallet to interact with a smart contract (dApp). We will dedicate the following examples to explain how to set up your environment for production use and discuss some common best practices.

## Introducing Ethers.js

Using the available methods of the Injected Provider will work for small applications. Still, as you scale into more complex projects requiring constant communication with the blockchain or more advanced functionalities like message signing and contract interaction, the best solution is to integrate a web3 library that will provide a higher level of abstraction. Meet [ethers.js](https://www.npmjs.com/package/ethers), a robust, popular, production-ready web3 library with millions of monthly downloads that will help you achieve your production requirements. Let's see how easy it is to get started.

First, you will have to install it into your project

```jsx
npm i ethers@5
```

Ethers library exposes the core module as a named export.

```jsx
import { ethers } from "ethers";
```

As we said, ethers provide an abstraction layer to common functionalities. To initialize it, you have to pass the Injected Provider, and you are ready to use it!

```jsx
const injectedProvider = await getTrustWalletInjectedProvider();
const ethersProvider = new ethers.providers.Web3Provider(injectedProvider);
```

You can learn more about ethers from their [official documentation](https://docs.ethers.org/v5/).

## Retrieving the account balance

To retrieve the account balance, you can call `getBalance`. The method accepts the public address in string format and returns a promise which will resolve into a [BigNumber](https://docs.ethers.org/v5/api/utils/bignumber/) object.

```jsx
const account = "0x...";
const accountBalance = await ethersProvider.getBalance(account);
```

You probably want to further process the return value into a primitive type like string or number. The BigNumber library offers many convenient methods like `toString` or `toNumber` .

## Calling a non-payable smart contract function

To interact with a smart contract, you will need the following two things:

- The deployed address
- The smart contract ABI

Most networks offer a blockchain explorer: Ethereumet has [Etherscan](https://etherscan.io/), BSC has [BscScan](https://bscscan.com/), and Polygon has [polygonscan](https://polygonscan.com/). DApp developers can verify their smart contracts and make their source code publicly available. Take, for instance, the [TWT token on BSC network](https://bscscan.com/address/0x4b0f1812e5df2a09796481ff14017e6005508003). We can search the token name and get all the information relating to that address, like its deployed address, the total transaction activity, etc.

![BscScan - Trust Wallet Token](/media/bsc-twt.png)

For TWT the deployed address is `0x4B0F1812e5Df2A09796481Ff14017e6005508003`, time to get the ABI. The [Application Binary Interface (ABI)](https://docs.soliditylang.org/en/latest/abi-spec.html) of a smart contract **gives a contract the ability to communicate and interact with external applications and other smart contracts.** This will allow ethers to construct the request object and call the required methods successfully. To access the ABI through BscScan go to "Contract" → "Code" and scroll down until the "Contract ABI" section". Then copy-paste it into a JSON file. For this example, we will create a file `twtABI.json` and paste the ABI there.

![BscScan - Trust Wallet Token ABI](/media/bsc-abi.gif)

To get the balance of TWT for an account, we use the `balanceOf`function. The function requires one parameter: the address to retrieve its TWT token balance.

Now that we've gather all pieces of the puzzle, it's time to write some code. First, we import the ethers library and the contract ABI.

```jsx
import { ethers } from "ethers";
import twtABI from "./twtABI.json";
```

Then we declare a constant variable `TWT_ADDRESS` for the smart contract address,

```jsx
const TWT_ADDRESS = "0x4B0F1812e5Df2A09796481Ff14017e6005508003";
```

and create a variable called `ethersProvider`.

```jsx
const account = "0x...";

const injectedProvider = await getTrustWalletInjectedProvider();
const ethersProvider = new ethers.providers.Web3Provider(injectedProvider);
```

`account` holds the public address of the desired wallet we want to check the TWT balance. The last step of this set up is to create a [`Contract`](https://docs.ethers.org/v5/api/contract/contract/) instance. This will allow us make requests to the blockchain for the specified smart contract.

```jsx
const contract = new ethers.Contract(TWT_ADDRESS, twtABI, ethersProvider);
```

The first parameter is the contract address. The second is the contract's interface, ie ABI, and the third is the ethers provider instance.

We can now access any defined function by calling it directly from the `contract` instance.

```jsx
const rawBalance = await contract.balanceOf(account);
```

Note that `balanceOf` will return the raw balance value. If we want to convert it to a decimal representation, we need to call `ethers.utils.formatUnits` and pass the `decimals` value as the second parameter.

```jsx
const decimals = await contract.decimals();
const rawBalance = await contract.balanceOf(account);

const accountBalance = ethers.utils.formatUnits(rawBalance, decimals);
```

Here is a complete example in React to retrieve the current TWT balance for the connected account.

```jsx
import React from "react";
import { ethers } from "ethers";
import twtABI from "./twtABI.json";

import { getTrustWalletInjectedProvider } from "./trustWallet";

const TWT_ADDRESS = "0x4B0F1812e5Df2A09796481Ff14017e6005508003";

const App = () => {
  const [initializing, setInitializing] = React.useState(true);
  const [injectedProvider, setInjectedProvider] = React.useState(null);
  const [initializationError, setInitializationError] = React.useState("");

  const [contract, setContract] = React.useState(null);

  const [connected, setConnected] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState("");
  const [error, setError] = React.useState("");

  const [balance, setBalance] = React.useState("");

  React.useEffect(() => {
    const initializeInjectedProvider = async () => {
      const trustWallet = await getTrustWalletInjectedProvider();

      if (!trustWallet) {
        setInitializationError("Trust Wallet is not installed.");
        setInitializing(false);
        return;
      }

      const ethersProvider = new ethers.providers.Web3Provider(trustWallet);
      setContract(new ethers.Contract(TWT_ADDRESS, twtABI, ethersProvider));

      setInjectedProvider(trustWallet);
      setInitializing(false);
    };

    initializeInjectedProvider();
  }, []);

  const connect = async () => {
    try {
      setError("");

      const accounts = await injectedProvider.request({
        method: "eth_requestAccounts",
      });

      const chainId = await injectedProvider.request({ method: "eth_chainId" });

      if (chainId !== "") {
        await injectedProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      }

      setSelectedAccount(accounts[0]);
      setConnected(true);
    } catch (e) {
      console.error(e);
      if (e.code === 4001) {
        setError("User denied connection.");
      }
    }
  };

  const getBalance = async (e) => {
    e.preventDefault();
    setBalance("");

    const decimals = await contract.decimals();
    const rawBalance = await contract.balanceOf(selectedAccount);

    const accountBalance = ethers.utils.formatUnits(rawBalance, decimals);
    setBalance(accountBalance);
  };

  if (initializing) {
    return <p>Waiting for provider...</p>;
  }

  if (initializationError) {
    return <p style={{ color: "red" }}>{initializationError}</p>;
  }

  if (connected) {
    return (
      <div>
        <button onClick={getBalance}>Get Balance</button>
        {balance && <p>Account balance: {balance} TWT</p>}
      </div>
    );
  }

  return (
    <div>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={connect}>Connect</button>
    </div>
  );
};

export default App;
```

## Calling a payable smart contract function

Payable functions require you to pay a certain amount in native currency to execute it. For instance, when you buy an NFT on [OpenSea](https://opensea.io/) you must pay a certain amount of native tokens to complete the transaction (value of the NFT + network fees).

For this example, we will assume a smart contract that offers a `buy` payable function. This smart contract will allow you to buy NFTs from a predefined list for 0.3 Ethers each. To successfully call `buy`, you will need to reference the NFT id.

Calling a payable function with ethers is more or less the same as we would do with any non-payable function. The only difference is that we have to pass an object as last argument that defines a property `value`. We can use `ethers.utils.parseEthers` to convert the string representation to `BigNumber` instance.

```jsx
await contract.buy(NFT_ID, {
  value: ethers.utils.parseEther("0.3"),
});
```

Executing this statement will create a confirmation prompt in user's wallet extension to approve (or reject) the transaction.

## Using Third-party providers

Apart from initializing ethers using the Injected Provider, you can also use HTTP providers, like [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/). What is great with that approach is having a dedicated endpoint for yourself, which offers higher rate limits, ie. requests throughput. While the Injected Provider won't cause any issues for most cases, it is considered best practice to use third-party providers for executing read calls to a smart contract. Please note, however that you cannot execute payable functions when using HTTP providers because you will need access to your wallet to sign the transactions, which is only available through the Injected Provider.

To get started with [Alchemy](https://www.alchemy.com/), you will need an API key. Then you can instantiate the provider by using [`ethers.providers.AlchemyProvider`](https://docs.ethers.org/v5/api-keys/#api-keys--alchemy).

```jsx
const ALCHEMY_API_KEY = "XXX";
const NETWORK = "0x1"; // Ethereum mainnet
const ethersProvider = new ethers.providers.AlchemyProvider(
  NETWORK,
  ALCHEMY_API_KEY
);
```

To get started with [Infura](https://www.infura.io/), you will also need an API key. Then you can instantiate the provider by using [`ethers.providers.InfuraProvider`](https://docs.ethers.org/v5/api-keys/#api-keys--infura).

```jsx
const INFURA_API_KEY = "XXX";
const NETWORK = "0x1"; // Ethereum mainnet
const ethersProvider = new ethers.providers.InfuraProvider(
  NETWORK,
  INFURA_API_KEY
);
```
