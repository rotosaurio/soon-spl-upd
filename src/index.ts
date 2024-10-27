import {
  percentAmount,
  generateSigner,
  some,
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
  Cluster,
  Umi,
} from "@metaplex-foundation/umi";
import { createFungible, fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { Keypair } from "@solana/web3.js";
import { base58 } from "@metaplex-foundation/umi/serializers";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Function to switch to SOON Devnet and register required programs
export async function umiSwitchToSoonDevnet(umi: Umi) {
  // Register Token Metadata Program
  umi.programs.add(
    {
      name: "mplTokenMetadata",
      publicKey: publicKey("6C4GR9AtMGF25sjXKtdB7A6NVQUudEQWw97kG61pGuA1"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  // Register Candy Machine Core Program
  umi.programs.add(
    {
      name: "mplCandyMachineCore",
      publicKey: publicKey("GFmqavo1M8wEL3a4uouSCaDX5CJapcYWXTcZ4TK6L9ad"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  // Register Candy Machine Program
  umi.programs.add(
    {
      name: "mplCandyMachine",
      publicKey: publicKey("GFmqavo1M8wEL3a4uouSCaDX5CJapcYWXTcZ4TK6L9ad"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
    },
    true
  );

  (umi.programs as any).add(
    {
      name: "mplCandyGuard",
      publicKey: publicKey("3g5Pe9ZoDmhA4k1ooFhxgtMWNesTYRdrSAKWMfjr2YxH"),
      getErrorFromCode: (code: number, cause?: Error) => null,
      getErrorFromName: (name: string, cause?: Error) => null,
      isOnCluster: (cluster: Cluster) => true,
      // ignore errors
      availableGuards: [
        "botTax",
        "solPayment",
        "tokenPayment",
        "startDate",
        "thirdPartySigner",
        "tokenGate",
        "gatekeeper",
        "endDate",
        "allowList",
        "mintLimit",
        "nftPayment",
        "redeemedAmount",
        "addressGate",
        "nftGate",
        "nftBurn",
        "tokenBurn",
        "freezeSolPayment",
        "freezeTokenPayment",
        "programGate",
        "allocation",
        "token2022Payment",
      ],
    },
    true
  );
}
// Set up the Umi instance
const umi = createUmi("https://rpc.devnet.soo.network/rpc").use(
  mplTokenMetadata()
);

// Get payer's private key from environment variables
const payerSecretKey = new Uint8Array(process.env.PAYER_SECRET_KEY!.split(',').map(Number));

// Create keypair and signer
let keypair = umi.eddsa.createKeypairFromSecretKey(payerSecretKey);
const payer = Keypair.fromSecretKey(payerSecretKey);
console.log("Payer Public Key:", payer.publicKey.toBase58());

const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// Create a mint signer
const mint = generateSigner(umi);

// Main function to create a fungible token
async function main() {
  // Switch Umi instance to SOON Devnet by adding necessary programs
  await umiSwitchToSoonDevnet(umi);

  // Create the fungible token
  const txResponse = await createFungible(umi, {
    mint,
    name: "NovaToken",
    uri: "https://maroon-blank-perch-273.mypinata.cloud/ipfs/QmWMBSaNtF6oxQHrAP3cgwVkLxHsH8vGnSNbgd1cmPuEjG",
    sellerFeeBasisPoints: percentAmount(5.5),
    decimals: some(7),
  }).sendAndConfirm(umi);

  console.log("Token Mint Address:", mint.publicKey);
  
  // Fetch and display the token's metadata
  const asset = await fetchDigitalAsset(umi, mint.publicKey);
  
  console.log("\nToken Metadata:");
  console.log("-------------");
  console.log("Name:", asset.metadata.name);
  console.log("Symbol:", asset.metadata.symbol);
  console.log("URI:", asset.metadata.uri);
  
  // Fetch and display the JSON metadata from the URI
  try {
    const response = await fetch(asset.metadata.uri);
    const jsonMetadata = await response.json();
    console.log("\nJSON Metadata from URI:");
    console.log("-------------");
    console.log(JSON.stringify(jsonMetadata, null, 2));
  } catch (error) {
    console.log("Error fetching URI metadata:", error);
  }
}
main().catch(console.error);

