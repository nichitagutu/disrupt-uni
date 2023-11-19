import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";

import "./index.css";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains'

const projectId = 'eb7b24286a4ca20fbcd75c3f30c3ea07'

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })


createWeb3Modal({ wagmiConfig, projectId, chains })


const root = createRoot(document.getElementById("root"));

root.render(
  <WagmiConfig config={wagmiConfig}>
    <Auth0Provider
      domain="dev-x3ipsc8ruitk13yk.us.auth0.com"
      clientId="qxezMhx8e7VlrkRsABRFzm1EWB47i0ad"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </WagmiConfig>
);
