import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { createV1, mplCore } from '@metaplex-foundation/mpl-core';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { getData } from "./werate-api";
import { WalletContextState } from '@solana/wallet-adapter-react';

interface NftMetadataResponse {
	ipfs_hash: string;
	message?: string;
}

export const reviewMint = async (review_id: string, review_hash: string, wallet: WalletContextState) => {
	// Use the RPC endpoint.
	const umi = createUmi('https://api.devnet.solana.com', "finalized")
					.use(walletAdapterIdentity(wallet))
					.use(mplCore());

	// Send NFT metadata to backend
	const response = await getData<NftMetadataResponse>(`/api/v1/games/reviews/nftMetadata/${review_id}/${review_hash}`);
	if (response && response.ipfs_hash) {
		try {
			// Generate the asset Keypair
			const assetSigner = generateSigner(umi);
			// Generate the asset (mint NFT)
			const result = await createV1(umi, {
				asset: assetSigner,
				name: 'Werate NFT',
				uri: response.ipfs_hash,
			}).sendAndConfirm(umi);

			if (result) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			return false;
		}
	} else {
		return false;
	}	
};
