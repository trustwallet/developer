import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: 'Get Started',
    },
    {
      type: 'category',
      label: 'Developing for Trust Wallet platform',
      link: {
        type: 'doc',
        id: 'develop-for-trust/develop-for-trust',
      },
      items: [
        {
          type: 'category',
          label: 'Browser Extension',
          link: {
            type: 'doc',
            id: 'develop-for-trust/browser-extension/browser-extension',
          },
          items: [
            'develop-for-trust/browser-extension/evm',
          ],
        },
        'develop-for-trust/mobile/mobile',
        'develop-for-trust/deeplinking/deeplinking',
      ],
    },
    {
      type: 'category',
      label: 'Listing new dApps',
      link: {
        type: 'doc',
        id: 'dapps/listing-guide',
      },
      items: [
        'dapps/listing-guide',
        'dapps/mobile-optimize',
        'dapps/debugging',
      ],
    },
    {
      type: 'category',
      label: 'Listing new assets',
      link: {
        type: 'doc',
        id: 'assets/new-asset',
      },
      items: [
        'assets/new-asset',
        'assets/requirements',
        'assets/pr-fee',
        'assets/faq',
        'assets/repository_details',
        'assets/universal_asset_id',
      ],
    },
    {
      type: 'category',
      label: 'Wallet Core',
      link: {
        type: 'doc',
        id: 'wallet-core/wallet-core',
      },
      items: [
        {
          type: 'category',
          label: 'New Blockchain Support',
          link: {
            type: 'doc',
            id: 'wallet-core/newblockchain',
          },
          items: [
            'wallet-core/rpc-requirements',
            'wallet-core/newevmchain',
          ],
        },
        {
          type: 'category',
          label: 'Developing the Library',
          items: [
            'wallet-core/contributing',
            'wallet-core/building',
            'wallet-core/walletconsole',
            'wallet-core/coverage',
            'wallet-core/releasing',
          ],
        },
        {
          type: 'category',
          label: 'Integration Guide',
          link: {
            type: 'doc',
            id: 'wallet-core/integration-guide',
          },
          items: [
            'wallet-core/wallet-core-usage',
            'wallet-core/ios-guide',
            'wallet-core/android-guide',
            'wallet-core/server-side',
          ],
        },
        'wallet-core/faq',
      ],
    },
    {
      type: 'category',
      label: 'Barz - Smart Wallet',
      link: {
        type: 'doc',
        id: 'barz-smart-wallet/barz-smart-wallet',
      },
      items: [
        'barz-smart-wallet/introducing-barz-trustwallet-smart-wallet-solution',
        'barz-smart-wallet/cutting-diamonds-how-to-make-accounts-awesome',
        'barz-smart-wallet/build-with-trust-wallet-and-barz-aa-sdk',
      ],
    },
  ],
};

export default sidebars;
