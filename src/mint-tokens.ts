
import {
    percentAmount,
    createSignerFromKeypair,
    signerIdentity,
    publicKey,
    Umi,
    Cluster,
  } from "@metaplex-foundation/umi";
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
  import { mintV1, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
  import { Keypair } from "@solana/web3.js";
  import dotenv from 'dotenv';
  
  // Import function from index.ts
  import { umiSwitchToSoonDevnet } from './index.js';
  
  // Load environment variables
  dotenv.config({ path: '.env.local' });
  
  // Configure Umi instance
  const umi = createUmi("https://rpc.devnet.soo.network/rpc").use(
    mplTokenMetadata()
  );
  
  // Get payer's private key from environment variables
  const payerSecretKey = new Uint8Array(process.env.PAYER_SECRET_KEY!.split(',').map(Number));
  
  // Configure keypair and signer
  const keypair = umi.eddsa.createKeypairFromSecretKey(payerSecretKey);
  const myKeypairSigner = createSignerFromKeypair(umi, keypair);
  umi.use(signerIdentity(myKeypairSigner));
  
  // Created token address
  const TOKEN_ADDRESS = "BpWxLwed3v2AnqHbtqJzSVEawwnJrxuchRoyVcAXtm2C";
  // Destination wallet for tokens
  const DESTINATION_WALLET = "AFXR8tSVpC5TjQTCdzEdcWdmkxsy5MV6yB7Jvmyjh5yZ";
  
  async function mintTokens() {
    try {
      // Register required programs
      await umiSwitchToSoonDevnet(umi);
      
      console.log("Starting token minting...");
      
      // Amount to mint (10,000 tokens with 7 decimals)
      const amount = 10_000n * 10_000_000n;
  
      const tx = await mintV1(umi, {
        mint: publicKey(TOKEN_ADDRESS),
        authority: myKeypairSigner,
        amount,
        tokenOwner: publicKey(DESTINATION_WALLET),
        tokenStandard: TokenStandard.Fungible,
      }).sendAndConfirm(umi);
  
      console.log("Minting successful!");
      console.log("Tokens minted:", Number(amount) / 10_000_000);
      console.log("Transaction signature:", tx.signature);
      console.log("Recipient:", DESTINATION_WALLET);
  
    } catch (error) {
      console.error("Error minting tokens:", error);
    }
  }
  
  // Execute the function
  mintTokens();