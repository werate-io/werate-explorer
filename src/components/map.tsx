// Map.tsx
"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect } from "react";
import { decodeUTF8 } from "tweetnacl-util";
import { postData } from "../services/werate-api"
import bs58 from 'bs58';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import SolanaWallet from "./solana-wallet";

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults = {
  zoom: 7,
  posix: { lat: 50.85, lng: 4.348 }
};

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom, posix = defaults.posix } = Map;

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <SolanaWallet />

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
