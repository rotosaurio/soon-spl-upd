# SOON Token Creator

This project allows you to create and mint fungible tokens on the **SOON** network using Metaplex and Solana libraries. The script facilitates both the creation of a new token and minting tokens to a specified wallet.

## Prerequisites

Before starting, make sure you have the following:

- **Node.js** (version 14 or higher)
- **npm** or **yarn** to manage dependencies
- A **wallet** on the SOON network

## Installation

1. Clone this repository or download the project files:

```bash
git clone https://github.com/your-username/soon-token-creator.git
cd soon-token-creator
```

2. Install the necessary dependencies:

```bash
npm install
```

or if you're using yarn:

```bash
yarn install
```

3. Create a `.env.local` file in the project's root directory. This file will store your private key, which is required to sign transactions on the SOON network.

Example of `.env.local` content:

```env
PAYER_SECRET_KEY=[241,5,10,229,121,178,74,95,219,41,113,235,63,254,180,106,30,83,140,185,54,33,30,177,190,86,238,89,134,212,197,201,137,113,180,142,149,88,80,63,91,182,107,125,168,236,51,194,58,247,68,110,105,131,139,98,31,124,94,84,211,165,219,192]
```

Replace the `PAYER_SECRET_KEY` value with your own private key in the format of an integer array.

## Features

### 1. Create a New Fungible Token
The script allows you to create a fungible token on the SOON network. You can customize the token's name, URI (link to token metadata), decimals, and other properties.

### 2. Mint Tokens to a Wallet
The minting function issues a specified amount of tokens to a designated wallet. The default script mints 10,000 tokens with 7 decimals and sends them to the wallet address specified in the configuration.

## How to Use

The project includes the following npm scripts for running the application:

- **start**: Creates a new fungible token on the SOON network.
```bash
npm run start
```

- **mint**: Mints tokens to a specific wallet.
```bash
npm run mint
```

- **test**: Currently, there is no testing implemented.
```bash
npm run test
```

## Customization

- You can change the token name and metadata URI by modifying the relevant fields in the script
- To change the number of tokens minted, adjust the minting amount
- Replace the wallet address in the configuration to send tokens to a different destination

## Additional Resources

- [Metaplex Token Metadata](https://docs.metaplex.com/)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
