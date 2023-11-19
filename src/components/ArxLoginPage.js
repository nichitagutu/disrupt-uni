import { useEffect, useState } from "react";

import { HaloGateway, execHaloCmdWeb } from "@arx-research/libhalo/api/web";
import { isMobile } from "react-device-detect";

import Text from "./Text";
import QRCode from "react-qr-code";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import LoginPage from "./LoginPage";

const Gate = new HaloGateway("wss://s1.halo-gateway.arx.org");
Gate.gatewayServerHttp = "https://s1.halo-gateway.arx.org/e";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#fff",
  boxShadow: 24,
  p: 4,
  borderRadius: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  padding: "2rem",
};

const ArxLoginPage = ({ setArxWallet, setCurrentStage }) => {
  const [pairingLink, setPairingLink] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setPairingLink("");
  };

  useEffect(() => {
    console.log("pairingLink", pairingLink);
    if (pairingLink !== "") {
      console.log("pairingLink", pairingLink);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [pairingLink]);

  return (
    <LoginPage>
      <Text
        header={"Join the Universe portal"}
        text={
          "Universe enables university communities participation in the budgeting and funds spending to limit corruption and money-laundering."
        }
        hasIcon={true}
      />
      <ArxLoginButton
        setCurrentStage={setCurrentStage}
        setPairingLink={setPairingLink}
        setArxWallet={setArxWallet}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <QRCode value={pairingLink} />
        </Box>
      </Modal>
    </LoginPage>
  );
};

const ArxLoginButton = ({ setPairingLink, setArxWallet, setCurrentStage }) => {
  const [statusText, setStatusText] = useState("Tap uni card");
  async function mobileConnect() {
    let command = {
      name: "sign",
      keyNo: 1,
      message: "010203",
    };

    let res;

    try {
      // --- request NFC command execution ---
      res = await execHaloCmdWeb(command);
      // the command has succeeded, display the result to the user
      setStatusText(JSON.stringify(res, null, 4));
    } catch (e) {
      // the command has failed, display error to the user
      setStatusText("Error: " + String(e));
    }
  }

  async function desktopConnect() {
    try {
      const pairInfo = await Gate.startPairing();
      console.log("URL in the QR code:", pairInfo.execURL);
      console.log(
        "Please scan the QR code presented below with your smartphone."
      );
      setPairingLink(pairInfo.execURL);
    } catch (e) {
      console.log("Failed to start pairing: " + e.stack);
    }

    try {
      await Gate.waitConnected();
    } catch (e) {
      console.log("Failed to connect to the gateway: " + e.stack);
      return;
    }

    setPairingLink("");

    await initiateSession();
  }

  async function initiateSession() {
    const command = {
      name: "sign",
      message: "hello world",
      keyNo: 1,
      format: "text",
    };

    console.log(
      "Requested to execute a command. Please click [Confirm] on your smartphone and tap your HaLo tag."
    );

    try {
      const result = await Gate.execHaloCmd(command);
      console.log("Command completed. Result: " + JSON.stringify(result));
      setArxWallet(result.etherAddress);
      const saveStage = (stage) => {
        localStorage.setItem("currentStage", stage);
      };
      saveStage("worldid");
      setCurrentStage("worldid");
    } catch (e) {
      console.log("Failed to request command execution: " + e.stack);
    }
  }

  function loginClickHandler() {
    if (isMobile) {
      mobileConnect();
    } else {
      desktopConnect();
    }
  }
  return (
    <button
      className="bg-[#F0C600] px-16 py-2 font-bold "
      onClick={loginClickHandler}
    >
      {statusText}
    </button>
  );
};

export default ArxLoginPage;
