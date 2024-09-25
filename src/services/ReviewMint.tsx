import React, {useState} from 'react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { createV1, mplCore } from '@metaplex-foundation/mpl-core';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { postData } from "../services/werate-api";

export const MintButton = () => {
	const { signTransaction, publicKey } = useWallet();
	const [metadataUri, setMetadataUri] = useState("");
	const wallet = useWallet();
	if (!signTransaction || !publicKey || !wallet) {
		return;
	}

	const handleReviewMint = () => {
		reviewMint(5, "bb884942e73bec66b9e6e9954459d1e29dff5c6e4e9d76fa35df545683ac530a");
	};

	const reviewMint = async (review_id: number, review_hash: string) => {
		// Use the RPC endpoint.
		const umi = createUmi('https://api.devnet.solana.com', "finalized")
						.use(walletAdapterIdentity(wallet))
						.use(mplCore());

		// Nft metadata
		const data = JSON.stringify({
			review_id,
			review_hash
		});

		const response = await postData('/api/v1/review/...', data);  //Replace the backend api with the exact one
		if (response && response.data.metadata_uri) {
			setMetadataUri(response.data.metadata_uri);
		} else {
			alert(response?.data?.message || 'An error occurred');
		}

		try {
			// Generate the asset Keypair
			const assetSigner = generateSigner(umi);

			// Generate the asset (mint NFT)
			const result = await createV1(umi, {
				asset: assetSigner,
				name: 'Werate NFT',
				uri: metadataUri,
			}).sendAndConfirm(umi);
			console.log('tx result', result);

		} catch (error) {
			console.log("error occured", error);
		}
	};

	return (
		<button style={{ width: 100, height: 100 }} onClick={() => { handleReviewMint(); }}></button>
	);
};
