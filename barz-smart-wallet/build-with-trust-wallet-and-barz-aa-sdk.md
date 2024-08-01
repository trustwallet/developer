# Build with Trust Wallet and Barz, A Comprehensive Guide to Integrating Barz with AA SDK

By [Moncif Loukili](https://x.com/monciflo)

## Introduction

In this article, we will explore how to seamlessly integrate [Trust Wallet’s Smart Accounts](https://trustwallet.com/swift) with the [permissionless.js](https://docs.pimlico.io/permissionless) framework, a library managed by [Pimlico](https://www.pimlico.io/) to deploy and manage Smart Accounts based on the ERC-4337 standard. Using our [SDK](https://docs.pimlico.io/permissionless/how-to/accounts/use-trustwallet-account), you can create Trust Smart Accounts for your users and enhance your dApp with features such as gasless and batched transactions and much more.

## Benefits of a Trust Smart Account

- Batch transactions
- Sponsored Transactions via Paymaster
- Passkey support

## Prerequisites

Before you begin, ensure you have the following prerequisites:

- Node.js and npm installed on your development environment.
- An active account with Pimlico for API access.
  - Create your Pimlico account [here](https://dashboard.pimlico.io/sign-up?after_sign_up_url=https%3A%2F%2Fdashboard.pimlico.io%2Fonboarding&after_sign_in_url=https%3A%2F%2Fdashboard.pimlico.io%2F)

## Get Started

Simplify the user journey and onboard easily while leveraging the advantages of ERC-4337.

Here is how to add smart accounts creation and usage in your dApp in very few steps.

In this article, we’ll walk you through the development of the below demo together:

[Try the live Demo](https://monceeef.github.io/TrustSmartAccDemo/)

The full codebase is available here: https://github.com/trustwallet/trustsmartaccdemo

![Demo](/media/tw-aa-sdk.png)

## For New Projects

If you're creating a new project, follow these steps:

### Step 1: Setup Your Project

First, set up a new React project.

```bash
pnpm create wagmi
pnpm install && pnpm run dev
cd [PROJECT NAME]
```

### Step 2: Install Dependencies

Install the necessary dependencies:

```bash
pnpm add permissionless
```

### Step 3: Configure Tailwind CSS

Set up Tailwind CSS for styling your application.

Install Tailwind CSS:

```bash
pnpm add tailwindcss
npx tailwindcss init
```

Update `tailwind.config.js`:

```jsx
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add your colors
        primary: "...",
      },
    },
  },
  plugins: [],
};
```

Add Tailwind directives to your CSS file:

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## For Existing Projects

If you're integrating Trust Smart Accounts into an existing React project, start from the following steps:

### Step 4: Install Dependencies

Navigate to your project directory and install the necessary dependencies:

```bash
pnpm add wagmi permissionless viem
```

### Step 5: Connect Your Wallet

Create a component to connect your wallet using the `wagmi` library.

```tsx
import React from "react";
import { Connector } from "wagmi";

interface SignerConnectProps {
  connectors: readonly Connector[];
  connect: (params: { connector: Connector }) => void;
}

const SignerConnect: React.FC<SignerConnectProps> = ({
  connectors,
  connect,
}) => {
  return (
    <div className="space-y-4 mt-4 flex justify-center items-center flex-col">
      {connectors.map((connector, key) => (
        <div
          key={key}
          className="p-4 w-96 space-x-4 flex flex-row bg-white rounded-xl border-[1px] cursor-pointer text-black items-center justify-center"
          onClick={() => connect({ connector })}
        >
          <img src={connector.icon} className="w-8 h-8" />
          <button key={connector.uid} type="button">
            {connector.name}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SignerConnect;
```

### Step 6: Create Trust Smart Accounts

Create a component to handle the creation of Trust Smart Accounts.

```tsx
import React from "react";
import { useAccount, useWalletClient } from "wagmi";
import { createSmartAcc } from "../utils/helpers";

interface SmartAccountCreateProps {
  smartAccount: any;
  setSmartAccount: (smartAccount: any) => void;
}

const SmartAccountCreate: React.FC<SmartAccountCreateProps> = ({
  smartAccount,
  setSmartAccount,
}) => {
  const { data: walletClient } = useWalletClient();
  const account = useAccount();

  const handleCreateSmartAccount = async () => {
    if (walletClient) {
      const smartAcc = await createSmartAcc(walletClient);
      setSmartAccount(smartAcc);
    }
  };

  if (!account.isConnected) return null;

  return (
    <div className="flex justify-center space-x-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center">
          {!smartAccount && (
            <button
              type="button"
              onClick={handleCreateSmartAccount}
              className="inline-block rounded-full bg-primary px-5 py-3 text-center font-bold text-white transition hover:border-black hover:bg-white hover:text-black"
            >
              Create Smart Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartAccountCreate;
```

### Step 7: Mint A Gasless NFT

Create a component to mint an NFT without gas fees.

```tsx
import React, { useState } from "react";
import { Hash } from "viem";
import { mintNFT } from "../utils/mintNFT";

interface NFTMintProps {
  smartAccount: any;
  setMintTx: (txHash: Hash) => void;
}

const NFTMint: React.FC<NFTMintProps> = ({ smartAccount, setMintTx }) => {
  const [minting, setMinting] = useState(false);

  const handleMintNFT = async () => {
    setMinting(true);
    try {
      const txHash = await mintNFT(smartAccount);
      setMintTx(txHash);
    } catch (error) {
      console.error("Minting error:", error);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="flex justify-center space-x-4 pb-4">
      {minting ? (
        <button
          type="button"
          className="inline-block rounded-full bg-primary px-5 py-3 text-center font-bold text-white transition hover:border-black hover:bg-white hover:text-black"
          disabled
        >
          Minting...
        </button>
      ) : (
        <button
          type="button"
          onClick={handleMintNFT}
          className="inline-block rounded-full bg-primary px-5 py-3 text-center font-bold text-white transition hover:border-black hover:bg-white hover:text-black"
        >
          Mint Free NFT
        </button>
      )}
    </div>
  );
};

export default NFTMint;
```

### Step 8: Integrate Components In Your App

Combine the components in your main `App` component.

```tsx
import { useEffect, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { Hash } from "viem";
import Card from "./components/Card";
import SignerConnect from "./components/SignerConnect";
import SmartAccountCreate from "./components/SmartAccountCreate";
import NFTMint from "./components/NFTMint";
import Logo from "./assets/logo.svg";

const App: React.FC = () => {
  const { connectors, connect } = useConnect();
  const { address } = useAccount();
  const [smartAccount, setSmartAccount] = useState<any>();
  const [step, setStep] = useState<number>(0);
  const [mintTx, setMintTx] = useState<Hash | undefined>();

  useEffect(() => {
    setStep(smartAccount ? 2 : address ? 1 : 0);
  }, [address, smartAccount]);

  useEffect(() => {
    if (mintTx) {
      setStep(3);
    }
  }, [mintTx]);

  return (
    <div className="p-12">
      <div className="max-w-md mx-auto items-center flex">
        <a href="#" className="mx-auto">
          <img src={Logo} alt="Trust Wallet" className="inline-block w-48" />
        </a>
      </div>
      <div className="mt-8 space-y-4 shadow-lg rounded-lg overflow-hidden max-w-md mx-auto bg-white">
        <div className="p-8 flex flex-col justify-center items-center">
          <h1 className="mt-4 text-2xl font-semibold text-center">
            Trust Smart Account Demo
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Follow these steps to mint a free gasless NFT leveraging the power
            of Trust Smart Accounts
          </p>
        </div>
        <Card
          step={step}
          index={1}
          title="Connect your wallet"
          description={address ? `Signer ${address} is connected!` : ""}
        />
        {step === 0 && (
          <SignerConnect connectors={connectors} connect={connect} />
        )}
        <Card
          step={step}
          index={2}
          title="Create or retrieve your Smart account"
          description={
            smartAccount
              ? `Your Trust Smart Account ${smartAccount.account.address} is Ready!`
              : ""
          }
        />
        {step === 1 && (
          <SmartAccountCreate
            smartAccount={smartAccount}
            setSmartAccount={setSmartAccount}
          />
        )}
        <Card
          step={step}
          index={3}
          title="Mint NFT"
          description="NFT is Gasless"
        />
        {step === 2 && (
          <NFTMint smartAccount={smartAccount} setMintTx={setMintTx} />
        )}

        {mintTx && (
          <div className="p-8 text-center">
            <a
              href={`https://sepolia.etherscan.io/tx/${mintTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-center"
            >
              Your NFT was successfully Minted without any gas fees. Follow the
              Tx here.
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
```

## Conclusion

By following this guide, you have successfully integrated Trust Smart Accounts into your project and enabled the creation of gasless NFTs. This setup leverages the power of account abstraction, giving a better experience to your users in order to interact with your dApps.

## Frequently Asked Questions (FAQs)

Which networks are supported?

- Ethereum
- Arbitrum
- Optimism
- BNB
- Polygon
- Avalanche
- opBNB
- Base

Testnets:

- Sepolia

Are there any costs associated to using Smart Accounts?

- No. Only costs are related to paymaster.

### Security Information

- **Audits:** Our smart contracts have undergone thorough audits by high-profile security firms, ensuring robust protection against vulnerabilities.
  - Certik https://github.com/trustwallet/barz-dev/blob/main/audit/Certik_Trustwallet-barz-Audit.pdf
  - Halborn https://github.com/trustwallet/barz-dev/blob/main/audit/Halborn_Trustwallet-barz-Audit.pdf
- **Open Source:** Barz, our smart contract wallet solution, is open-sourced, promoting transparency and allowing the community to review and contribute to its development. https://trustwallet.com/blog/introducing-barz-smart-contract-wallet-solution
- **Passkeys Support:** Trust Smart Accounts support passkeys for an additional layer of security, providing a more secure and user-friendly authentication mechanism.
- **On-chain security monitoring service**: All Trust Wallet smart accounts are automatically monitored by our security monitoring infrastructure for free. All users will be able to maintain a highly secure state and could get immediately notified when a hack occurs. For detailed explanation, please reference this [doc](https://docs.pimlico.io/permissionless/how-to/accounts/use-trustwallet-account).

### Resources

- [How to create and use a Trust smart account with permissionless.js](https://docs.pimlico.io/permissionless/how-to/accounts/use-trustwallet-account)
- [Pimlico](https://www.pimlico.io/)
- [Barz](https://github.com/trustwallet/barz-dev)
- [Security Liability Statement](https://github.com/trustwallet/developer/blob/master/barz-smart-wallet/security-monitoring-system-liability-statement.md)
