import { useState } from "react";

import { HaloGateway, execHaloCmdWeb } from "@arx-research/libhalo/api/web";
import { isMobile } from "react-device-detect";

import Text from "./Text";
import QRCode from "react-qr-code";
import ReactModal from "react-modal";

const Gate = new HaloGateway("wss://s1.halo-gateway.arx.org");
Gate.gatewayServerHttp = "https://s1.halo-gateway.arx.org/e";

const ArxLoginPage = () => {
  const [pairingLink, setPairingLink] = useState(null);
  return (
    <div className="pb-40 flex flex-col gap-4">
      <Text
        header={"Join the Transparency portal"}
        text={
          "Transparency enables university communities participation in the budgeting and funds spending to limit corruption and money-laundering."
        }
        hasIcon={true}
      />
      <ArxLoginButton setPairingLink={setPairingLink} />
      <ReactModal isOpen={pairingLink}>
        <QRCode value={pairingLink} />
      </ReactModal>
    </div>
  );
};

const ArxLoginButton = ({ setPairingLink }) => {
  const [statusText, setStatusText] = useState("Login with your student card");
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

    setPairingLink(null);

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
      let res = await Gate.execHaloCmd(command);
      console.log("Command completed. Result: " + JSON.stringify(res));
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
    <button onClick={loginClickHandler}>{statusText}</button>
    // {pairingLink && <QRCode value={pairingLink} />}
  );
};

export default ArxLoginPage;
