"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { decodeUTF8 } from "tweetnacl-util";
import { postData } from "../utils/CallBackendApi"
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import bs58 from 'bs58';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 7,
  posix: { lat: 50.85, lng: 4.348 },
};

const Map = (Map: MapProps) => {
	const { zoom = defaults.zoom, posix = defaults.posix } = Map;
	const { publicKey, connected, signMessage, disconnect } = useWallet();
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check if the user is authenticated
		const token = localStorage.getItem('token');
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	useEffect(() => {
		if(isAuthenticated){
			sign();
		}else{
			alert('Please login!');
		}
	}, [connected, publicKey, signMessage]);

	const sign = async () => {
		if (!connected || !publicKey || !signMessage) {
			alert('Please select a wallet!');
			return;
		}

		const message = 'WeRate';
		try {
			const signature = await signMessage(decodeUTF8(message));
			const data = JSON.stringify({
				message,
				signature: bs58.encode(signature),
				publicKey: publicKey.toString()
			});
	
			const response = await postData('/api/v1/wallets/link', data);
			
			if(response)
				if(response.data.success)
					{
						alert('Wallet is connected to your profile!');
					}
				else{
					alert(response.data.message);
				}

		} catch (error) {
			disconnect();
		}
  	}

  return (
    <MapContainer
		center={posix}
		zoom={zoom}
		scrollWheelZoom={false}
		style={{ height: "100%", width: "100%" }}
    >
		{isAuthenticated && 
			<div style={{ position: "absolute", top: 5, right: 5, zIndex: 1000 }}>
				<WalletMultiButton/>
			</div>
		}
      
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<Marker position={posix} draggable={false}>
			<Popup>Test</Popup>
		</Marker>
    </MapContainer>
  );
};

export default Map;
