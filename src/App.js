import React, { useState } from "react";
import { HaloGateway } from "@arx-research/libhalo/halo/gateway/requestor";
import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import QRCode from "react-qr-code";
import { isMobile } from "react-device-detect";

const Gate = new HaloGateway("wss://s1.halo-gateway.arx.org");
Gate.gatewayServerHttp = "https://s1.halo-gateway.arx.org/e";

function App() {
  const [statusText, setStatusText] = useState("Login with your student card");
  const [pairingLink, setPairingLink] = useState(null);

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

    await btnInitiateSessClicked();
  }

  async function btnInitiateSessClicked() {
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
    <div className="container-fluid">
      <article>
        <button onClick={loginClickHandler}>{statusText}</button>
        {pairingLink && <QRCode value={pairingLink} />}
      </article>
    </div>
  );
}

export default App;
