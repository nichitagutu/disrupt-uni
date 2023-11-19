import React, { useEffect, useState } from "react";
import { HaloGateway } from "@arx-research/libhalo/halo/gateway/requestor";
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import QRCode from "react-qr-code";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import MainPage from "./pages/MainPage";
import { useAccount } from "wagmi";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import ArxLoginPage from "./components/ArxLoginPage";
import WorldIdLoginPage from "./components/WorldIdLoginPage";
import MinaLoginPage from "./components/NoWalletPage";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const EASSchemaUID =
  "0x8d27497483b403775138b1d1830ad3914f7654db9ec22badd1944abcdbbb6911";

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = ethers.providers.getDefaultProvider("sepolia");

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
eas.connect(provider);

function App() {
  const getStage = () => {
    return localStorage.getItem("currentStage");
  };
  const { address, isConnecting, isDisconnected } = useAccount();
  const [arxWallet, setArxWallet] = useState(null);
  const [worldIdAuthenticated, setWorldIdAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState(address);
  const savedStage = getStage();
  const [currentStage, setCurrentStage] = useState(
    savedStage ? savedStage : "arx"
  );

  const saveStage = (stage) => {
    localStorage.setItem("currentStage", stage);
  };

  useEffect(() => {
    if (address) {
      saveStage("main");
      setCurrentStage("main");
    }
  }, [address]);

  console.log("currentStage ", currentStage);

  console.log("arxWallet", arxWallet);

  return (
    <div className="container-fluid h-full flex flex-col items-center justify-center">
      {currentStage !== "mina" && currentStage !== "main" && (
        <StageCounter currentStage={currentStage} />
      )}

      {currentStage === "arx" && (
        <ArxLoginPage
          setCurrentStage={setCurrentStage}
          setArxWallet={setArxWallet}
        />
      )}
      {currentStage === "worldid" && (
        <WorldIdLoginPage
          setCurrentStage={setCurrentStage}
          setIsAuthenticated={setWorldIdAuthenticated}
        />
      )}
      {currentStage === "walletconnect" && (
        <MinaLoginPage setCurrentStage={setCurrentStage} />
      )}
      {currentStage === "main" && <MainPage />}
      <ToastContainer />
    </div>
  );
}

const StageCounter = ({ currentStage }) => {
  return (
    <div className="text-md text-gray-500 select-none font-lightw">
      Step {currentStage === "arx" ? "1/2" : "2/2"}
    </div>
  );
};

export default App;
