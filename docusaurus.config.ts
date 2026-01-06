import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Trust Wallet Developer Documentation',
  tagline: 'Build with Trust Wallet',
  favicon: 'trust-icon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://developer.trustwallet.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'trustwallet', // Usually your GitHub org/user name.
  projectName: 'developer-docs', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/trustwallet/developer-docs/edit/master/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Trust Wallet',
      logo: {
        alt: 'Trust Wallet Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://github.com/trustwallet/developer-docs',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://discord.gg/trustwallet',
          label: 'Discord',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/',
            },
            {
              label: 'Wallet Core',
              to: '/wallet-core',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/trustwallet',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/TrustWallet',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Trust Wallet',
              href: 'https://trustwallet.com',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/trustwallet',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Trust Wallet.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
