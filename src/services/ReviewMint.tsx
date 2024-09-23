import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner, createSignerFromKeypair, createGenericFile, signerIdentity } from '@metaplex-foundation/umi';
import { createV1, transferV1, mplCore, fetchAssetV1 } from '@metaplex-foundation/mpl-core';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey, toWeb3JsKeypair, toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { readFileSync } from "fs";
import pkg from 'bs58';

export const MintButton = () => {
    const { connection } = useConnection();
    const { signTransaction, publicKey } = useWallet();
    if(!signTransaction || !publicKey)
    {
        return;
    }

    const transferSOL = async (recipient: string, amountInSOL: number) => {
        const recipientPublicKey = new PublicKey(recipient);
        const lamports = amountInSOL * 1_000_000_000; // 1 SOL = 1e9 lamports

        // Create a transaction to transfer SOL
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPublicKey,
                lamports,
            })
        );

        try {
            // Get the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // Sign the transaction using the wallet
            const signedTransaction = await signTransaction(transaction);

            // Send the signed transaction to the Solana network
            const signature = await connection.sendRawTransaction(signedTransaction.serialize());
            await connection.confirmTransaction(signature, 'confirmed');
            console.log('Transaction successful with signature:', signature);
        } catch (error) {
            console.error('Error sending SOL:', error);
        }
    };

    const reviewMint = async (review_id: number, review_hash: string ) => {
    
        transferSOL("AhLxJYWjbnrw9D1eYziUKZBybGtNb1SDf6Z2SeSJaCZV", 0.0036);
    
        const { decode } = pkg;

        // Use the RPC endpoint.
        const umi = createUmi('https://api.devnet.solana.com', "finalized").use(mplCore());
        umi.use(irysUploader());
    
        const decoded = decode("kTjbDmqvsCyqn2JdSYKvAf3Vjw2w4Mi5t2Nw5wghmgNPyo51uhWAp3mNiW7P7sUBzPwHdUY1cM1wGx8mxQvkMM1");
    
        let keypair = umi.eddsa.createKeypairFromSecretKey(decoded);
        const myKeypairSigner = createSignerFromKeypair(umi, keypair);
        umi.use(signerIdentity(myKeypairSigner));
        console.log("keypair", keypair);
        
    
        // Upload image and get its uri
        const image = await readFileSync('../public/nft.png');
        const nft_image = createGenericFile(image, "WerateNFT");
        const [imageUri] = await umi.uploader.upload([nft_image]);
        console.log(imageUri);
    
        console.log("id, hash--------", review_id, review_hash);
        // Compose NFT metadata using review id and hash value
        const nft_metadata = {
            name: 'Werate NFT',
            description: 'This is Werate NFT',
            image: imageUri,
            attributes: [
                {
                    trait_type: "review_id",
                    value: review_id
                },
                {
                    trait_type: "review_hash",
                    value: review_hash
                },
            ]
        };
    
        // Upload nft metadata and get its uri
        const json_uri = await umi.uploader.uploadJson(nft_metadata);
        console.log('json_uri', json_uri);
    
        // Generate the asset Keypair
        const assetSigner = generateSigner(umi);
        console.log("\nAsset Address: ", assetSigner.publicKey.toString());
    
        // Generate the asset (mint NFT)
        const result = await createV1(umi, {
          asset: assetSigner,
          name: 'Werate NFT',
          uri: json_uri,
        }).sendAndConfirm(umi);
        console.log('tx result', result);
    
        // Transfer the newly minted NFT to the user's wallet
        await transferV1(umi, {
            asset: assetSigner.publicKey,
            newOwner: fromWeb3JsPublicKey(publicKey),
        }).sendAndConfirm(umi);
    
        // Confirm if the NFT is transferred correctly
        const transferredAsset = await fetchAssetV1(umi, assetSigner.publicKey)
        if (transferredAsset.owner.toString() !== fromWeb3JsPublicKey(publicKey).toString()) {
            throw new Error('Transfer failed')
        } else {
            console.log("minted successfully");
        }
    };

    return (
        <button style={{width:100, height:100}} onClick={() => {reviewMint(5, "bb884942e73bec66b9e6e9954459d1e29dff5c6e4e9d76fa35df545683ac530a")}}></button>
    );
};
