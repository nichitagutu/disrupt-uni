import React, { useEffect, useState } from "react";
import { HaloGateway } from "@arx-research/libhalo/halo/gateway/requestor";
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import QRCode from "react-qr-code";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import MainPage from "./pages/MainPage";
import { useAccount } from 'wagmi'
import { ethers } from "ethers";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";

import ArxLoginPage from "./components/ArxLoginPage";
import WorldIdLoginPage from "./components/WorldIdLoginPage";
import MinaLoginPage from "./components/NoWalletPage";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const EASSchemaUID =
  "0x8d27497483b403775138b1d1830ad3914f7654db9ec22badd1944abcdbbb6911";

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


  // Initialize the sdk with the address of the EAS Schema contract address
  const eas = new EAS(EASContractAddress);

  // Gets a default provider (in production use something else like infura/alchemy)
  const provider = ethers.providers.getDefaultProvider("sepolia");

  const schemaUID = "0x6617f6a4e3955732222c70725c0a460e43220557e94faf1188e6ef6249407ece";
  // Signer must be an ethers-like signer.
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("address wallet_address,string worldId");


  async function attest() {
    const encodedData = schemaEncoder.encodeData([
      { name: "wallet_address", value: address, type: "address" },
      { name: "worldId", value: "worldid...", type: "string" }
    ]);
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: address,
        expirationTime: 0,
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });
    const newAttestationUID = await tx.wait();


    console.log("New attestation UID:", newAttestationUID);
  }

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
