## Provider discovery with EIP-6963

Modern browsers often have multiple wallet extensions installed. [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) standardizes provider discovery through a well-defined event mechanism, allowing each wallet to announce itself without conflicts. This replaces the legacy `window.ethereum` pattern where wallets would overwrite each other.

Trust Wallet supports EIP-6963 to announce itself. You should always use this discovery mechanism to locate the Trust Wallet EIP-1193 provider.

```ts
/**
 * Represents the assets needed to display a wallet
 */
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

// EIP-6963 Provider Detail containing wallet info and provider instance
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
}

// Announce Event dispatched by a Wallet
interface EIP6963AnnounceProviderEvent extends CustomEvent {
  type: "eip6963:announceProvider";
  detail: EIP6963ProviderDetail;
}

// Request Event dispatched by a DApp
interface EIP6963RequestProviderEvent extends Event {
  type: "eip6963:requestProvider";
}

// Store all announced providers by their UUID identifier
const announcedProviders = new Map<string, EIP6963ProviderDetail>();

function initializeEIP6963() {
  const onAnnounce = (event: EIP6963AnnounceProviderEvent) => {
    const { info, provider } = event.detail;
    const key = info.uuid
    // Avoid duplicates
    if(announcedProviders.has(key)) return

    announcedProviders.set(key, { info, provider });
  };

  // Listen for wallet announcements
  window.addEventListener("eip6963:announceProvider", onAnnounce);

  // Request all wallets to announce themselves
  window.dispatchEvent(new Event("eip6963:requestProvider"));

  // Return cleanup function
  return () => {
    window.removeEventListener("eip6963:announceProvider", onAnnounce);
  };
}

// Start listening for wallet announcements
initializeEIP6963()
```

Initialize discovery by calling `initializeEIP6963()` early in your application lifecycle. This allows you to detect which wallet extensions are installed in the user's browser.

## Detecting Trust Wallet

Use the `getTrustWalletProvider()` function to check if Trust Wallet is installed by matching its reverse DNS identifier (`com.trustwallet.app`):

```ts
function getTrustWalletProvider(): EIP1193Provider | null {
  for (const entry of announcedProviders.values()) {
    if (entry.info?.rdns === 'com.trustwallet.app') {
      return entry.provider;
    }
  }
  return null;
}
```

If Trust Wallet is not installed, prompt users to download it:

```ts
const provider = getTrustWalletProvider();

if (!provider) {
  // Trust Wallet is not installed
  console.log("Please install Trust Wallet to connect");
  // Redirect users to download page
  window.open("https://trustwallet.com/download", "_blank");
} else {
  // Trust Wallet is installed, proceed with connection
  const accounts = await provider.request({ method: "eth_requestAccounts" });
}
```

## Connecting to Trust Wallet

Once you have the Trust Wallet provider, use its `provider.request()` method ([EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)) to make wallet RPC calls.

### Request user accounts (connect)

The `eth_requestAccounts` method ([EIP-1102](https://eips.ethereum.org/EIPS/eip-1102)) prompts the user to authorize your dApp and share their account addresses.

```jsx
try {
  const accounts = await provider.request({ method: "eth_requestAccounts" });
  console.log(accounts[0]); // => '0x...'
} catch (e) {
  if (e.code === 4001) console.error("User denied connection.");
}
```

### Check connected accounts

The `eth_accounts` method ([EIP-1474](https://eips.ethereum.org/EIPS/eip-1474)) returns currently connected accounts without triggering a user prompt.

```jsx
const accounts = await provider.request({ method: "eth_accounts" });
```

## Listening for account changes

The `accountsChanged` event ([EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)) fires when the user switches accounts or disconnects from your dApp.

```jsx
provider.on("accountsChanged", (accounts) => {
  if (accounts.length === 0) {
    console.log("User disconnected.");
  } else {
    console.log("Active account:", accounts[0]);
  }
});
```

## Working with networks

### Listen for network changes

The `chainChanged` event ([EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)) notifies your dApp when the user switches to a different network.

```jsx
provider.on("chainChanged", (chainId) => {
  console.log("New chain:", chainId); // hex string
});
```

### Get current network

The `eth_chainId` method ([EIP-695](https://eips.ethereum.org/EIPS/eip-695)) returns the currently active network's chain ID as a hexadecimal string.

```jsx
const chainId = await provider.request({ method: "eth_chainId" });
```

### Request network switch

The `wallet_switchEthereumChain` method ([EIP-3326](https://eips.ethereum.org/EIPS/eip-3326)) prompts the user to switch to a different network.

```jsx
try {
  await provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x1" }], // Ethereum mainnet
  });
} catch (e) {
  if (e.code === 4001) console.error("User rejected switching chains.");
}
```

### Add a new network

The `wallet_addEthereumChain` method ([EIP-3085](https://eips.ethereum.org/EIPS/eip-3085)) requests that the user add a custom network to Trust Wallet.

```jsx
try {
  await provider.request({
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x89", // Polygon Mainnet
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18
      },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"]
    }]
  });
} catch (e) {
  if (e.code === 4001) console.error("User rejected adding the network.");
}
```

## Signing messages

### Sign arbitrary messages

The `personal_sign` method ([EIP-1474](https://eips.ethereum.org/EIPS/eip-1474)) requests a signature for an arbitrary message. This is commonly used for authentication and proof of ownership.

```jsx
try {
  const signature = await provider.request({
    method: "personal_sign",
    params: [hexMessage, accountAddress]
  });
  console.log("Signature:", signature);
} catch (e) {
  if (e.code === 4001) console.error("User rejected signature.");
  else console.error("Signature error:", e);
}
```

### Sign typed data (EIP-712)

The `eth_signTypedData_v4` method ([EIP-712](https://eips.ethereum.org/EIPS/eip-712)) signs structured data, providing better UX and security than raw message signing.

```jsx
const typedData = {
  domain: {
    name: "My DApp",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC"
  },
  types: {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" }
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" }
    ]
  },
  primaryType: "Mail",
  message: {
    from: {
      name: "Alice",
      wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826"
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB"
    },
    contents: "Hello, Bob!"
  }
};

try {
  const signature = await provider.request({
    method: "eth_signTypedData_v4",
    params: [accountAddress, JSON.stringify(typedData)]
  });
  console.log("Typed signature:", signature);
} catch (e) {
  if (e.code === 4001) console.error("User rejected signature.");
  else console.error("Signature error:", e);
}
```

## Managing assets

### Add token to wallet

The `wallet_watchAsset` method ([EIP-747](https://eips.ethereum.org/EIPS/eip-747)) requests that the user track a token in Trust Wallet.

```jsx
try {
  const wasAdded = await provider.request({
    method: "wallet_watchAsset",
    params: {
      type: "ERC20",
      options: {
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI token
        symbol: "DAI",
        decimals: 18,
        image: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png"
      }
    }
  });

  if (wasAdded) {
    console.log("Token added to wallet");
  }
} catch (e) {
  console.error("Error adding token:", e);
}
```

## Interacting with smart contracts

### Send transactions to contracts

The `eth_sendTransaction` method ([EIP-1474](https://eips.ethereum.org/EIPS/eip-1474)) creates a transaction that modifies blockchain state. This requires user approval and gas fees.

```jsx
// Example: Transfer ERC20 tokens
try {
  const txHash = await provider.request({
    method: "eth_sendTransaction",
    params: [{
      from: accountAddress,
      to: "0x6B175474E89094C44Da98b954EedeAC495271d0F", // Contract address
      data: "0xa9059cbb...", // ABI-encoded function call
      value: "0x0" // Amount of ETH to send (0 for token transfers)
    }]
  });
  console.log("Transaction hash:", txHash);
} catch (e) {
  if (e.code === 4001) console.error("User rejected transaction.");
  else console.error("Transaction error:", e);
}
```

When interacting with smart contracts, you need to encode function calls into the `data` field of transactions. This encoding follows the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html).

### Understanding the `data` field

The `data` field contains:
1. **Function selector**: First 4 bytes (8 hex characters) - the keccak256 hash of the function signature
2. **Encoded parameters**: The function arguments encoded according to ABI rules

For example, calling `transfer(address recipient, uint256 amount)`:
- Function signature: `transfer(address,uint256)`
- Function selector: `0xa9059cbb` (first 4 bytes of keccak256 hash)
- Encoded parameters: recipient address (32 bytes) + amount (32 bytes)

To simplify this process you can use libraries like [Viem](https://viem.sh/), [Ethers.js](https://docs.ethers.org/), or [Voltaire](https://voltaire.tevm.sh/) to handle ABI encoding automatically. These libraries take care of the complex encoding process for you.

## High level abstractions

While the manual provider approach shown in this guide is useful for understanding the underlying protocol, production applications can use higher-level abstractions that handle the complexity for you.

### Wagmi

For React or Vue applications, we recommend [Wagmi](https://wagmi.sh/). Wagmi is a collection of React hooks that provides:

- **Automatic EIP-6963 discovery**: Detects and connects to Trust Wallet without manual setup
- **Type-safe hooks**: `useAccount`, `useConnect`, `useWriteContract`, `useReadContract`, and more
- **Built-in state management**: Handles connection state, caching, and automatic reconnection

Wagmi abstracts away the low-level RPC calls, providing a better developer experience and more reliable applications.

### Wagmi Core

For vanilla JavaScript, Svelte, Solid, or other non-React frameworks, you can use [Wagmi Core](https://wagmi.sh/core). A framework-agnostic version of Wagmi that provides:

- **EIP-6963 support**: Same automatic provider discovery as Wagmi
- **Framework-agnostic**: Works with any JavaScript framework or vanilla JS
- **TypeScript-first**: Full type safety without React dependencies
- **Action-based API**: Simple functions like `getAccount`, `connect`, `writeContract`, `readContract`

## Need help?

If you have questions or need assistance integrating Trust Wallet into your application, feel free to open a discussion on our [GitHub Discussions](https://github.com/trustwallet/developer/discussions).